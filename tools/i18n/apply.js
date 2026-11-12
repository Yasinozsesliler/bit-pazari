// Türkçe oyun HTML'inden İngilizce sürüm üretir: node apply.js in.html out.html en.json
// Metinler AST ile bulunur (acorn), sözlükte karşılığı olan dize ve şablonlar değiştirilir.
const fs = require('fs'); const acorn = require('acorn'); const walk = require('acorn-walk');
const [, , IN, OUT, DICT] = process.argv;
const src = fs.readFileSync(IN, 'utf8'); const D = JSON.parse(fs.readFileSync(DICT, 'utf8'));
const nodes = []; const re = /<script>([\s\S]*?)<\/script>/g; let m;
while ((m = re.exec(src))) {
  const off = m.index + '<script>'.length;
  const ast = acorn.parse(m[1], { ecmaVersion: 'latest', sourceType: 'script', allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true });
  walk.full(ast, (n) => {
    if (n.type === 'Literal' && typeof n.value === 'string' && Object.prototype.hasOwnProperty.call(D, n.value)) nodes.push({ k: 's', s: off + n.start, e: off + n.end, v: D[n.value] });
    if (n.type === 'TemplateLiteral') {
      let pat = ''; n.quasis.forEach((q, i) => { pat += q.value.cooked; if (i < n.expressions.length) pat += '{' + i + '}'; });
      if (Object.prototype.hasOwnProperty.call(D, pat)) nodes.push({ k: 't', s: off + n.start, e: off + n.end, v: D[pat], ex: n.expressions.map((x) => [off + x.start, off + x.end]) });
    }
  });
}
nodes.sort((a, b) => a.s - b.s || b.e - a.e);
let used = 0;
function emit(s, e) {
  let out = '', p = s;
  for (const n of nodes) {
    if (n.s < p || n.s < s || n.e > e) continue;
    out += src.slice(p, n.s); out += render(n); p = n.e; used++;
  }
  return out + src.slice(p, e);
}
function render(n) {
  if (n.k === 's') return JSON.stringify(n.v);
  const esc = (t) => t.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  return '`' + n.v.split(/(\{\d+\})/).map((part) => { const mm = /^\{(\d+)\}$/.exec(part); return mm ? '${' + emit(n.ex[+mm[1]][0], n.ex[+mm[1]][1]) + '}' : esc(part); }).join('') + '`';
}
let res = emit(0, src.length);
// sayı/büyük harf biçimleri
res = res.replace("const pct=n=>'%'+n;", "const pct=n=>n+'%';");
res = res.replace('content:"Dokun, incele"', 'content:"Tap to inspect"');
res = res.replace(/'tr-TR'/g, "'en-US'").replace(/"tr-TR"/g, '"en-US"').replace('<html lang="tr">', '<html lang="en">');
fs.writeFileSync(OUT, res);
console.log('i18n: nodes', nodes.length, 'applied', used);
