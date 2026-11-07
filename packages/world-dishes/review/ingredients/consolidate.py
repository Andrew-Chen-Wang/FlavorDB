import os,re,json,collections,argparse,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[2]
parser=argparse.ArgumentParser(description='Merge archived ingredient readings and explicit model audit corrections')
parser.add_argument('--readings',type=pathlib.Path,default=ROOT/'.cache/ingredient-readings')
parser.add_argument('--output',type=pathlib.Path,default=ROOT/'data')
parser.add_argument('--corrections',type=pathlib.Path,default=ROOT/'review/ingredients/audit/corrections.jsonl')
args=parser.parse_args()
args.output=args.output.resolve();args.output.mkdir(parents=True,exist_ok=True)
args.corrections=args.corrections.resolve()
V=json.load(open(ROOT/'review/ingredients/vocabulary.json'))
vocab={v['id']:(v['name'],v['category']) for v in V}
auto={name.strip().lower():v['id'] for v in V for name in [v['name'],*v.get('aliases',[])]}
os.chdir(args.readings.resolve())
SYN={}
def syn(target,*xs):
    for x in xs: SYN[x]=target
syn('stock','broth','bouillon','consomme','white-stock')
syn('chicken-stock','chicken-broth','chicken-bouillon')
syn('beef-stock','beef-broth','meat-stock','meat-broth','brown-stock')
syn('vegetable-stock','vegetable-broth','vegetable-stock-powder')
syn('fish-stock','fish-broth')
syn('stock-cube','bouillon-cube','bouillon-powder')
syn('yogurt','yoghurt','plain-yoghurt','plain-yogurt')
syn('powdered-sugar','icing-sugar')
syn('cocoa-powder','cocoa')
syn('leek','leeks','common-leek','european-leek')
syn('green-chile','chile-pepper','chili-pepper','chili','chile','red-chile')
syn('olives','olive','black-olives','black-olive','green-olives')
syn('coriander-seed','coriander','ground-coriander','coriander-seeds')
syn('clove','cloves'); syn('anise','anise-seed'); syn('mustard-seed','mustard-seeds')
syn('sesame-seeds','sesame-seed','white-sesame'); syn('poppy-seeds','poppy-seed')
syn('pine-nuts','pine-nut'); syn('hazelnuts','hazelnut'); syn('walnuts','walnut'); syn('almonds','almond')
syn('pecans','pecan'); syn('cashews','cashew'); syn('pistachios','pistachio')
syn('strawberry','strawberries'); syn('raspberry','raspberries'); syn('blueberry','blueberries')
syn('cherry','cherries'); syn('sour-cherry','sour-cherries'); syn('fig','figs'); syn('plum','plums')
syn('peach','peaches'); syn('apricot','apricots'); syn('prunes','prune'); syn('currants','currant')
syn('grapes','grape'); syn('raisins','raisin'); syn('chestnuts','chestnut'); syn('snails','snail')
syn('mussels','mussel'); syn('sardines','sardine'); syn('anchovy','anchovies'); syn('marshmallow','marshmallows')
syn('tortilla','tortillas','flour-tortilla'); syn('phyllo-dough','phyllo','filo-pastry')
syn('lasagna-sheets','lasagne-sheets'); syn('breadcrumbs','bread-crumbs')
syn('vanilla','vanilla-extract','vanilla-bean'); syn('sun-dried-tomatoes','sun-dried-tomato')
syn('ground-meat','minced-meat'); syn('cooking-fat','fat'); syn('madeira','madeira-wine')
syn('apple-cider-vinegar','cider-vinegar'); syn('wine-vinegar','red-wine-vinegar','white-wine-vinegar')
syn('mixed-herbs','herbs','fresh-herbs'); syn('mixed-fruit','fruit'); syn('beans','dried-beans')
syn('kecap-manis','ketjap-manis'); syn('soybeans','soybean')
syn('quark','curd-cheese','farmer-cheese','fromage-blanc','fresh-cheese','white-cheese')
syn('biscuits','plain-biscuits','cookies'); syn('pork-rinds','pork-rind','pork-cracklings')
syn('milk-powder','powdered-milk'); syn('chili-flakes','red-pepper-flakes'); syn('shortening','vegetable-shortening')
syn('beetroot','beet'); syn('squash','winter-squash'); syn('cheese','hard-cheese')
syn('pandan-leaves','pandan-leaf'); syn('dried-apricots','dried-apricot')
# per-line fixes after rereading flagged lines
OVR={}
olive={'it-004':[25,242,279,375,490,498,512]+list(range(545,553))+list(range(557,567))+[572]+list(range(573,600)),'it-006':[99,100],'ja-000':[207]+list(range(229,256))+[512]}
for b,ns in olive.items():
    for n in ns: OVR[(b,n)]=('vegetable-oil','olive-oil')
for b,n in [('labels-001',289),('labels-001',394),('labels-001',395),('labels-002',553),('labels-002',554),('labels-003',572)]: OVR[(b,n)]=('spaghetti','pasta')
for b,n in [('zh-000',307),('zh-001',490)]: OVR[(b,n)]=('mozzarella','cheese')
for b in ['pl-001','pl-002','pl-003']:
    for l in open(f'out/{b}.tsv'):
        m=re.match(r'(\d+)\t?(.*)',l.rstrip('\n'))
        if m and 'cheddar' in m.group(2).split(',') and not (b=='pl-002' and m.group(1)=='410'): OVR[(b,int(m.group(1)))]=('cheddar','cheese')
cats=collections.defaultdict(collections.Counter); counts=collections.Counter()
imap=collections.defaultdict(dict)
for f in sorted(os.listdir('out')):
    b=f[:-4]; lang=b.split('-')[0]
    texts={int(l.split('\t',1)[0]):l.rstrip('\n').split('\t',1)[1] for l in open(f'batches/{b}.txt') if not l.startswith('#')}
    for l in open('out/'+f):
        m=re.match(r'(\d+)\t?(.*)',l.rstrip('\n'))
        if not m: continue
        n=int(m.group(1)); ids=[]
        for x in m.group(2).split(','):
            x=x.strip()
            if not x or x=='-': continue
            mm=re.match(r'\+?([a-z0-9][a-z0-9-]*)(?::([a-z]+))?',x)
            if not mm: continue
            i=mm.group(1)
            if (b,n) in OVR and i==OVR[(b,n)][0]: i=OVR[(b,n)][1]
            if i=='leek' and lang=='zh': i='garlic-leek'
            i=SYN.get(i,i)
            if mm.group(2): cats[i][mm.group(2)]+=1
            if i not in ids: ids.append(i)
        for i in ids: counts[i]+=1
        if n in texts: imap[lang][texts[n].strip().lower()]=ids
# Strings that matched the shared list exactly were never batched: add them back.
auto={k:('garlic-leek' if v=='leek' and k in ('garlic leek','蒜苗','chinese leek') else v) for k,v in auto.items()}
import glob
dishes={}
for f in sorted((ROOT/'data').glob('dishes-*.jsonl')):
    for l in open(f):
        d=json.loads(l)
        dishes[d['id']]=d
        for t in d['ingredients']:
            k=t.strip().lower()
            if k in auto and k not in imap['labels']: imap['labels'][k]=[auto[k]]; counts[auto[k]]+=1
        for r in d['recipes']:
            for it in r['ingredients']:
                k=it['item'].strip().lower()
                if k in auto and k not in imap[r['lang']]: imap[r['lang']][k]=[auto[k]]; counts[auto[k]]+=1
for lang,by_text in json.load(open(ROOT/'review/ingredients/exact-matches.json')).items():
    for text,ids in by_text.items():
        assert text not in imap[lang]
        imap[lang][text]=ids
if args.corrections.exists():
    for line in args.corrections.read_text().splitlines():
        correction=json.loads(line)
        lang=correction['lang'];text=correction['text'].strip().lower()
        assert text in imap[lang],f'Missing audited string: {lang}:{text}'
        assert correction['reason']
        assert imap[lang][text]==correction['before'],f'Audited input changed: {lang}:{text}'
        imap[lang][text]=correction['ids']
counts=collections.Counter(i for by_text in imap.values() for ids in by_text.values() for i in ids)
json.dump(imap,open(args.output/'ingredient-map.json','w'),ensure_ascii=False,sort_keys=True,indent=2)
context_file=ROOT/'review/ingredients/audit/context-corrections.jsonl'
context={}
if context_file.exists():
    for line in context_file.read_text().splitlines():
        correction=json.loads(line);dish=dishes[correction['dishId']]
        lang=correction['lang'];text=correction['text'].strip().lower()
        texts=dish['ingredients'] if lang=='labels' else [i['item'] for r in dish['recipes'] if r['lang']==lang for i in r['ingredients']]
        assert any(t.strip().lower()==text for t in texts),f'Missing context input: {dish["id"]}:{text}'
        assert correction['reason'] and correction['source']
        context.setdefault(dish['id'],{}).setdefault(lang,{})[text]=correction['ids']
json.dump(context,open(args.output/'ingredient-overrides.json','w'),ensure_ascii=False,sort_keys=True,indent=2)
print(len(imap),sum(len(v) for v in imap.values()),'strings;',len(counts),'mapped ingredient ids')
