/* Rebuild the website figures from the report's native chart caches.
   Run: node website/scripts/build-results.cjs */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../dist/assets/results');
const data=JSON.parse(fs.readFileSync(path.join(root,'results-data.json'),'utf8'));
const colors=['#afb8c5','#6e89ae','#0071e3'];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const text=(x,y,s,size=22,fill='#283748',anchor='start',weight=400)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}">${esc(s)}</text>`;
const line=(x1,y1,x2,y2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e0e4e7"/>`;
const rect=(x,y,w,h,fill)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
function svg(name,lang,height,title,description,body){
 const out=`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="${height}" viewBox="0 0 960 ${height}" role="img" aria-labelledby="title desc"><title id="title">${esc(title)}</title><desc id="desc">${esc(description)}</desc><rect width="960" height="${height}" fill="#fff"/><g font-family="Arial, Microsoft YaHei, PingFang SC, sans-serif">${body}</g></svg>`;
 fs.writeFileSync(path.join(root,`${name}-${lang}.svg`),out);
}
function legend(lang,y=47){
 const labels=lang==='zh'?['A 基础模型','B 原始语料 RAG','C 老师傅智能体']:['A Base model','B Raw-corpus RAG','C KUPAS MASTER'];
 return labels.map((s,i)=>rect(35+i*300,y-15,17,17,colors[i])+text(63+i*300,y,s,21)).join('');
}
for(const lang of ['zh','en']){
 const zh=lang==='zh';
 let body='';
 const names=zh?['基础模型','原始语料 RAG','老师傅智能体']:['Base model','Raw-corpus RAG','KUPAS MASTER'];
 const axisX=50, axisW=830;
 for(const n of [0,25,50,75,100])body+=line(axisX+n/100*axisW,110,axisX+n/100*axisW,645)+text(axisX+n/100*axisW,690,n,20,'#65707a','middle');
 body+=text(50,55,zh?'综合得分（满分 100）':'Composite score (out of 100)',25,'#1d1d1f','start',600);
 data.composite.values.forEach((v,i)=>{const y=160+i*172;body+=text(50,y,`${'ABC'[i]}  ${names[i]}`,27,'#1d1d1f','start',600)+text(880,y,v.toFixed(2),36,colors[i],'end',700)+rect(50,y+25,v/100*axisW,68,colors[i]);});
 svg('composite',lang,740,zh?'老师傅综合得分领先':'KUPAS MASTER leads in composite score',data.composite.values.map((v,i)=>`${names[i]} ${v}`).join('; '),body);

 body=legend(lang);
 const dimNames=zh?['结果正确性','成果可操作性','专业判断深度','依据充分性与准确性','工具与技能运用适当性','需求理解准确性','边界与合规性']:[['Result correctness'],['Output actionability'],['Depth of professional','judgment'],['Evidence sufficiency','and accuracy'],['Appropriate tool','and skill use'],['Understanding','requirements'],['Boundaries','and compliance']];
 const plotX=290,plotW=600;
 for(const n of [0,25,50,75,100])body+=line(plotX+n/100*plotW,83,plotX+n/100*plotW,733)+text(plotX+n/100*plotW,775,n,20,'#65707a','middle');
 dimNames.forEach((label,i)=>{const y=108+i*91;const parts=Array.isArray(label)?label:[label];parts.forEach((s,j)=>body+=text(28,y+22+j*25,s,20,'#283748'));data.dimensions.values.forEach((vals,s)=>{const val=vals[i];body+=rect(plotX,y+s*19,val/100*plotW,13,colors[s])+text(plotX+val/100*plotW+7,y+s*19+13,val.toFixed(1),16,['#536272','#4a6488','#0066cc'][s]);});});
 body+=text(890,820,zh?'得分（满分 100）':'Score (out of 100)',20,'#65707a','end');
 svg('dimensions',lang,850,zh?'老师傅在七个评分维度均领先':'KUPAS MASTER leads across all seven dimensions',data.dimensions.values.map((v,i)=>`${names[i]}: ${v.map(n=>n.toFixed(1)).join(', ')}`).join('; '),body);

 const labels=zh?data.practitioners.zh:data.practitioners.en;
 body=text(30,40,zh?'相较原始语料 RAG 的综合得分提升':'Composite score gain over raw-corpus RAG',26,'#1d1d1f','start',600);
 const gainX=370,gainW=490;
 for(const n of [0,5,10,15])body+=line(gainX+n/15*gainW,69,gainX+n/15*gainW,795)+text(gainX+n/15*gainW,833,n,20,'#65707a','middle');
 const gains=data.practitioners.values[0].map((v,i)=>Number((v-data.practitioners.values[1][i]).toFixed(2)));
 labels.forEach((s,i)=>{const y=81+i*35.2;body+=text(30,y+16,s,18)+rect(gainX,y,gains[i]/15*gainW,22,colors[2])+text(gainX+gains[i]/15*gainW+10,y+18,`+${gains[i].toFixed(2)}`,18,'#0066cc');});
 body+=text(30,833,zh?'单位：分':'Unit: points',18,'#65707a');
 svg('practitioners',lang,870,zh?'全部 20 位从业者的评测组均有提升':'All 20 practitioner groups improve',labels.map((s,i)=>`${s}: +${gains[i].toFixed(2)}`).join('; '),body);
}
console.log('Built six bilingual SVG figures from verified report values.');
