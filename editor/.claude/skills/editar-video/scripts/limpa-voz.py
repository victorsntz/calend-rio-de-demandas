# Tira ruído e eco de fala gravada em lugar ruim (galpão, celular longe, caixa
# de som), com o DeepFilterNet 3, e passa o acabamento de voz por cima.
#
# uso: python3 -I limpa-voz.py <entrada> <saida.wav> <pasta-do-modelo> [atenuacao-db]
#
# A atenuação padrão é 12 dB, e não é chute. Na palestra do Novembro Azul medi
# cinco versões com duas réguas, a distância entre fala e ruído e a confiança
# de um transcritor palavra por palavra:
#
#   original        14 dB   confiança 0,905   97 palavras
#   limpeza 12 dB   19 dB   confiança 0,921   98 palavras   <- melhora as duas
#   limpeza 18 dB   24 dB   confiança 0,907   92 palavras
#   limpeza total   44 dB   confiança 0,801   83 palavras   "caminhada" virou "barrigada"
#
# Daí pra cima, cada dB a mais de silêncio come consoante. E só equalizar sem
# limpar piora: o compressor levanta o ruído do galpão entre as palavras.
#
# Dependências: torch e torchaudio (CPU), deepfilternet, safetensors, numpy.
# O peso do modelo mora no GitHub, que o proxy da sessão na nuvem barra; o mesmo
# modelo está no Hugging Face em fal/DeepFilterNet3, em safetensors. Pra montar
# a pasta que o df espera:
#   snapshot_download('fal/DeepFilterNet3', local_dir=PASTA)
#   torch.save(load_file(PASTA/model.safetensors), PASTA/checkpoints/model_120.ckpt.best)
# Conferir no log que não sai nenhum "Missing key": modelo carregado pela metade
# gera lixo em vez de erro.
import sys, types, wave, subprocess, tempfile, os
import numpy as np

# O df importa torchaudio.backend.common, que o torchaudio novo não tem mais.
# Ele só usa isso pra ler arquivo; a leitura aqui é por fora, então um calço basta.
calco = types.ModuleType("torchaudio.backend.common")
class AudioMetaData: pass
calco.AudioMetaData = AudioMetaData
sys.modules.setdefault("torchaudio.backend", types.ModuleType("torchaudio.backend"))
sys.modules["torchaudio.backend.common"] = calco
import torch
from df.enhance import enhance, init_df

# Acabamento: tira o grave de chão, desafoga o "caixote" do galpão em 280 Hz,
# dá presença em 3,2 kHz, segura o pico e nivela em -16 LUFS. -16 deixa espaço
# pra trilha entrar por baixo uns 20 dB.
ACABAMENTO = ("highpass=f=90,equalizer=f=280:t=q:w=1.2:g=-3.5,"
              "equalizer=f=3200:t=q:w=1.0:g=3,equalizer=f=9000:t=q:w=0.8:g=1.5,"
              "acompressor=threshold=-22dB:ratio=3:attack=8:release=120:makeup=2,"
              "loudnorm=I=-16:TP=-1.5:LRA=7,alimiter=limit=0.84:level=0")

entrada, saida, pasta = sys.argv[1], sys.argv[2], sys.argv[3]
atenua = float(sys.argv[4]) if len(sys.argv) > 4 else 12.0

modelo, estado, _ = init_df(model_base_dir=pasta, log_level="WARNING")
sr = estado.sr()
tmp = tempfile.mkdtemp()
bruto, limpo_wav = os.path.join(tmp, "bruto.wav"), os.path.join(tmp, "limpo.wav")
# mono: gravação de celular é mono de fato, e a rede trabalha em 48 kHz
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", entrada, "-vn", "-ac", "1", "-ar", str(sr), bruto], check=True)
with wave.open(bruto) as w:
    a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
limpo = enhance(modelo, estado, torch.from_numpy(a[None, :]), atten_lim_db=atenua)
x = (limpo.numpy()[0].clip(-1, 1) * 32767).astype(np.int16)
with wave.open(limpo_wav, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x.tobytes())
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", limpo_wav, "-af", ACABAMENTO, "-ar", str(sr), saida], check=True)
print(f"ok: {saida} (limpeza de {atenua:g} dB + acabamento)")
