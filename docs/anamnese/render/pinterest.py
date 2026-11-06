#!/usr/bin/env python3
"""Busca imagens no Pinterest (sem login) e baixa as maiores, com a origem anotada.
Uso: python3 docs/anamnese/render/pinterest.py "consulta" PASTA [quantas] [largura mínima]
Sai: PASTA/<hash>.jpg ... e PASTA/_fontes.json (url da imagem, link do pin, título).
Depois: python3 docs/anamnese/folha.py PASTA  (folha de contato pra escolher)."""
import requests,json,sys,os,hashlib
UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36','Accept-Language':'pt-BR,pt;q=0.9,en;q=0.8'}
def busca(q,n=25):
    s=requests.Session(); s.headers.update(UA)
    s.get('https://www.pinterest.com/',timeout=30)
    data={'options':{'query':q,'scope':'pins','page_size':n},'context':{}}
    r=s.get('https://www.pinterest.com/resource/BaseSearchResource/get/',params={'source_url':f'/search/pins/?q={q}','data':json.dumps(data)},
            headers={'Accept':'application/json','X-Requested-With':'XMLHttpRequest','X-Pinterest-PWS-Handler':'www/search/[scope].js'},timeout=30)
    r.raise_for_status()
    out=[]
    for p in r.json()['resource_response']['data']['results']:
        im=(p.get('images') or {}).get('orig') or {}
        if not im.get('url'): continue
        out.append({'url':im['url'],'w':im.get('width'),'h':im.get('height'),'pin':f"https://www.pinterest.com/pin/{p.get('id')}/",'titulo':(p.get('grid_title') or p.get('title') or '')[:120],'dominio':p.get('domain','')})
    return out
def baixa(q,pasta,n=8,minw=700):
    os.makedirs(pasta,exist_ok=True); ok=[]; bloqueado=0
    achados=busca(q,40)
    candidatos=[it for it in achados if (it['w'] or 0)>=minw]
    for it in candidatos:
        if len(ok)>=n: break
        try:
            r=requests.get(it['url'],headers=UA,timeout=30)
            if r.status_code!=200 or len(r.content)<30000: continue
            ext='.png' if it['url'].lower().endswith('.png') else '.jpg'
            nome=hashlib.md5(it['url'].encode()).hexdigest()[:8]+ext
            open(os.path.join(pasta,nome),'wb').write(r.content); it['arquivo']=nome; ok.append(it)
        except requests.exceptions.ProxyError:
            bloqueado+=1
        except Exception: continue
    json.dump({'consulta':q,'achados':len(achados),'candidatos':len(candidatos),'itens':ok},
              open(os.path.join(pasta,'_fontes.json'),'w'),ensure_ascii=False,indent=1)
    print(f'{q!r}: {len(achados)} achados, {len(candidatos)} acima de {minw}px, {len(ok)} baixados em {pasta}')
    if bloqueado and not ok:
        print('  A busca respondeu, mas a rede recusou o servidor de imagens do Pinterest')
        print('  (i.pinimg.com). Libere esse host em Network access pra concluir o download.')

if __name__=='__main__':
    baixa(sys.argv[1],sys.argv[2],int(sys.argv[3]) if len(sys.argv)>3 else 8,int(sys.argv[4]) if len(sys.argv)>4 else 700)
