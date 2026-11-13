// node missing.js file.html startMarker endMarker -> lists untranslated literals/templates in range
const fs=require('fs'),acorn=require('acorn'),walk=require('acorn-walk');
const [, , IN, A, B]=process.argv;const src=fs.readFileSync(IN,'utf8');const D=JSON.parse(fs.readFileSync(__dirname+'/en.json','utf8'));
const s0=src.indexOf(A),s1=B?src.indexOf(B,s0):src.length;const re=/<script>([\s\S]*?)<\/script>/g;let m;const out=new Set();
while((m=re.exec(src))){const off=m.index+8;const ast=acorn.parse(m[1],{ecmaVersion:'latest',allowReturnOutsideFunction:true});
 walk.full(ast,n=>{const p=off+n.start;if(p<s0||p>s1)return;
  if(n.type==='Literal'&&typeof n.value==='string'&&/[a-zçğışöü]{3}/i.test(n.value)&&!D.hasOwnProperty(n.value))out.add(n.value);
  if(n.type==='TemplateLiteral'){let pat='';n.quasis.forEach((q,i)=>{pat+=q.value.cooked;if(i<n.expressions.length)pat+='{'+i+'}'});if(/[A-Za-zÇĞİŞÖÜçğışöü]{3}/.test(pat.replace(/<[^>]*>/g,''))&&!D.hasOwnProperty(pat))out.add(pat)}})}
console.log(JSON.stringify([...out],null,1));
