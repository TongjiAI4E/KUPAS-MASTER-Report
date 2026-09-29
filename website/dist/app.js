/* Bilingual presentation; all research values are transcribed from the supplied September 2026 reports. */
'use strict';
const reportPaths={zh:'assets/reports/KUPAS-MASTER-Technical-Report-ZH.pdf',en:'assets/reports/KUPAS-MASTER-Technical-Report-EN.pdf'};
let language='zh';
const originalText=new WeakMap();
document.querySelectorAll('[data-en]').forEach(el=>originalText.set(el,el.innerHTML));
function setLanguage(next,updateUrl=true){
  language=next==='en'?'en':'zh';
  document.documentElement.lang=language==='en'?'en':'zh-CN';
  document.querySelectorAll('[data-en]').forEach(el=>{if(!originalText.has(el))originalText.set(el,el.innerHTML);el.innerHTML=language==='en'?el.dataset.en:originalText.get(el)});
  document.querySelectorAll('[data-lang]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lang===language)));
  document.querySelectorAll('.current-report').forEach(link=>link.href=reportPaths[language]+(link.dataset.page?'#page='+link.dataset.page:''));
  document.title=language==='en'?'KUPAS MASTER | Experience Engineering for AI Agents': '老师傅 KUPAS MASTER | 经验工程与 AI 智能体技术报告';
  const description=language==='en'?'KUPAS MASTER: experience engineering for AI agents. Nine-layer cognitive corpus construction turns tacit knowledge into traceable experience corpora and callable skills. Bilingual reports and RAG evaluation.':'老师傅 KUPAS MASTER：面向 AI 智能体的经验工程平台，以九层认知语料化将隐性知识转化为可追溯经验语料与可调用技能。提供中英文技术报告与 RAG 对比评测。';
  document.querySelector('meta[name="description"]').content=description;
  document.querySelector('meta[property="og:title"]').content=document.title;
  document.querySelector('meta[property="og:description"]').content=description;
  document.querySelector('meta[property="og:locale"]').content=language==='en'?'en_US':'zh_CN';
  document.querySelector('meta[property="og:locale:alternate"]').content=language==='en'?'zh_CN':'en_US';
  document.querySelector('meta[name="twitter:title"]').content=document.title;
  document.querySelector('meta[name="twitter:description"]').content=description;
  try{localStorage.setItem('kupas-master-language',language)}catch{}
  if(updateUrl&&location.protocol!=='file:'){const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url)}
  document.dispatchEvent(new CustomEvent('languagechange',{detail:language}));
}
document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.lang)));
const menuButton=document.querySelector('.menu-toggle'),mobileNav=document.querySelector('.mobile-nav');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));mobileNav.hidden=!open});
function closeMenu(){menuButton.setAttribute('aria-expanded','false');mobileNav.hidden=true}
mobileNav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
let saved='zh';try{saved=localStorage.getItem('kupas-master-language')||'zh'}catch{}
setLanguage(new URLSearchParams(location.search).get('lang')||saved,false);

const layers=[
  {zh:['用到了哪些事实与概念？','将多源片段中的实体、术语与关系对齐到知识图谱，按时间保留属性版本，并关联原文位置与事件时间。','知识单元、属性版本及供其他管线共用的锚点映射。','区分“被提及”与“有调用证据”，不因低频而自动删除关键知识。'],en:['Which facts and concepts were used?','Align entities, terms, and relationships across source fragments. Keep time-specific attribute versions and links to source passages and event times.','Knowledge units, attribute versions, and shared anchor mappings for the other pipelines.','Distinguish mention from documented use; low frequency alone does not justify removing critical knowledge.']},
  {zh:['优先关注了哪些观察信息？','依据注意提示语、检查顺序与选择日志，记录关注对象及其随时间的转移，并保留相应来源证据。','关注对象、转移路径及证据类型。','未提及不等于被忽略，模型注意力权重不替代从业者关注证据。'],en:['Which observations received attention?','Use explicit attention cues, inspection sequences, and selection logs to record what the practitioner focused on and how that focus changed.','Focus objects, attention transitions, and evidence types.','An unmentioned feature was not necessarily ignored. Model attention weights cannot substitute for practitioner evidence.']},
  {zh:['什么依据支持这一判断？','从显式推理中提取判断目标、正反证据与排除条件，保留连接条件与结论的中间前提。','包含适用条件、成立与失效边界及证据引用的判断规则。','证据缺失保留待复核，支持分不等同于正确概率。'],en:['What evidence supports this judgment?','Extract the judgment target, supporting and opposing evidence, and exclusion conditions. Preserve the intermediate premises connecting conditions to a conclusion.','Judgment rules with conditions of use, validity boundaries, and evidence references.','Missing evidence remains subject to review; a support score is not a probability of correctness.']},
  {zh:['如何选择下一步行动？','记录候选动作、排除理由及触发、终止和回退条件，核对适用事实与局部约束，再保留选择依据。','可追溯的行动条件与决策记录，区分候选、计划、选定和已实施动作。','局部条件通过不代表整体合规；未知条件须补证或转交处理。'],en:['How is the next action selected?','Record candidate actions, exclusion reasons, and trigger, stopping, and fallback conditions. Check relevant facts and local constraints while retaining the basis of selection.','Traceable action conditions and decision records, distinguishing candidates, plans, selections, and executed actions.','Passing local checks does not establish overall compliance. Unknown conditions require evidence or escalation.']},
  {zh:['哪些案例或概念与当前问题相关？','从明确的类比、回忆与关联表达中识别起点、目标及桥接线索，结合图结构筛选待核验关联。','带桥接线索的联想单元，以及可用于补充解释或行动的候选关联。','相似性不等于因果关系；从业者联想需要口述或过程证据。'],en:['Which other cases or concepts are relevant?','Identify starting concepts, targets, and bridging cues in explicit analogies and recalled precedents. Use graph structure to screen candidate links for verification.','Association units with bridging evidence and candidate links for alternative explanations or actions.','Similarity is not causality. Practitioner associations require verbal or process evidence.']},
  {zh:['预期会出现什么后果？','记录当前状态、候选行动、预测结果与时间范围，冻结预测时的信息及版本，再与符合条件的实际结果配对核实。','包含预判、有效时间范围及后续核实记录的经验单元。','区分事前预测与事后事实；未实施方案不直接配对真实结果。'],en:['What consequences are anticipated?','Record the current state, candidate action, expected outcome, and time horizon. Preserve the information available at prediction time, then verify against eligible observed outcomes.','Anticipations with valid time horizons and follow-up verification records.','Keep predictions separate from hindsight. Unexecuted plans cannot be directly matched to observed outcomes.']},
  {zh:['何时需要补充证据或重新检查？','识别不确定、求证、修正与超出职责范围的表达，关联到具体命题，记录状态转换与触发证据。','知识缺口、待核验事项与复核条件。','分别保存陈述确信程度、证据充分性与职责边界，不把语言强度当作正确概率。'],en:['When is further evidence or review needed?','Identify uncertainty, requests for verification, corrections, and statements beyond the practitioner’s role. Link them to specific claims and the evidence behind state changes.','Knowledge gaps, items awaiting verification, and conditions for review.','Keep expressed confidence, evidence sufficiency, and authority boundaries distinct; strong wording is not a correctness probability.']},
  {zh:['哪些流程在不同案例中反复出现？','按从业者、任务类型与可比情境组织操作日志，归一化动作序列，结合跨时间复现、样本量与例外检查重复模式。','原子操作、复合流程及可选话术配置。','重复出现的行为不自动构成强制要求，也不直接等同于专业能力。'],en:['Which practices recur across cases?','Organize action logs by practitioner, task, and comparable context. Normalize action sequences and check recurrence over time, sample coverage, and exceptions.','Atomic operations, composite workflows, and optional communication templates.','Recurring behavior does not automatically become a mandatory rule or demonstrate competence.']},
  {zh:['哪些事情不能做，哪些必须做？','核对规范来源，抽取适用前提、禁止事项、必须动作、责任边界及替代方案，并检查已编码条件的一致性。','保留依据、适用范围与审核状态的约束记录。','未知前提仍须补证复核；硬约束不能被评分覆盖，日志缺失不证明合规。'],en:['What is prohibited—and what is required?','Check normative sources and extract prerequisites, prohibitions, obligations, authority boundaries, and alternatives. Check consistency among the encoded conditions.','Constraint records with their basis, scope, and review status.','Unknown premises still need review. Scores cannot override hard constraints; missing logs do not establish compliance.']}
];
let selectedLayer=2;
function renderLayer(index){
  selectedLayer=index;
  const text=layers[index][language];
  ['layer-question','layer-description','layer-output','layer-boundary'].forEach((id,i)=>document.getElementById(id).textContent=text[i]);
  document.getElementById('layer-number').textContent='L'+(index+1);
  document.getElementById('layer-panel').setAttribute('aria-labelledby','layer-tab-'+index);
  document.querySelectorAll('[data-layer]').forEach(button=>{const chosen=Number(button.dataset.layer)===index;button.setAttribute('aria-selected',String(chosen));button.tabIndex=chosen?0:-1});
}
document.querySelectorAll('[data-layer]').forEach(button=>button.addEventListener('click',()=>renderLayer(Number(button.dataset.layer))));
function wireTabKeys(selector,select){const tabs=[...document.querySelectorAll(selector)];tabs.forEach((tab,index)=>tab.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();tabs[next].focus();select(tabs[next])}))}
wireTabKeys('[data-layer]',tab=>renderLayer(Number(tab.dataset.layer)));
// The three figures share the report's data, series colors, and zero-based axes.
let selectedResult=0;
const resultSlides=[...document.querySelectorAll('.result-slide')];
const resultNames={zh:['综合表现','多维度质量','不同从业者上的表现'],en:['Composite performance','Dimension scores','Practitioner results']};
const chartAlt={
  zh:['三种配置的综合得分：基础模型 70.63、原始语料 RAG 79.75、老师傅 89.58。','三种配置的七维均分，老师傅的各维度得分均高于两个基线。','全部 20 个从业者组相较原始语料 RAG 的综合得分增量均为正。'],
  en:['Composite scores: base model 70.63, raw-corpus RAG 79.75, KUPAS MASTER 89.58.','Mean scores across seven dimensions. KUPAS MASTER exceeds both baselines in every dimension.','Positive composite score gains over raw-corpus RAG for all 20 practitioner groups.']
};
const carousel=document.querySelector('.results-carousel');
const stage=document.querySelector('.results-stage');
const viewport=document.querySelector('.results-viewport');
const track=document.querySelector('.results-track');
const previousResult=document.querySelector('.result-prev');
const nextResult=document.querySelector('.result-next');
const figureDialog=document.querySelector('.figure-dialog');
let expandedIndex=0,slideStep=0,gesture=null,suppressClickUntil=0;
const clampResult=index=>Math.max(0,Math.min(resultSlides.length-1,index));
function measureResults(){slideStep=resultSlides[0].getBoundingClientRect().width+parseFloat(getComputedStyle(track).columnGap)}
function placeResults(offset){
  track.style.transform=`translate3d(${offset}px,0,0)`;
  const position=-offset/slideStep;
  resultSlides.forEach((slide,i)=>slide.style.setProperty('--frost',Math.min(1,Math.abs(i-position))));
}
function renderResult(index){
  selectedResult=clampResult(index);
  measureResults();
  placeResults(-selectedResult*slideStep);
  resultSlides.forEach((slide,i)=>{slide.setAttribute('aria-hidden',String(i!==selectedResult));slide.inert=i!==selectedResult});
  document.querySelectorAll('[data-slide]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.slide)===selectedResult)));
  document.querySelector('.slide-status').textContent=`0${selectedResult+1} / 03 — ${resultNames[language][selectedResult]}`;
  previousResult.disabled=selectedResult===0;
  nextResult.disabled=selectedResult===resultSlides.length-1;
}
function localizeResults(){
  document.querySelectorAll('[data-chart]').forEach((img,i)=>{img.src=`assets/results/${img.dataset.chart}-${language}.svg`;img.alt=chartAlt[language][i]});
  document.querySelectorAll('[data-source]').forEach(link=>link.href=`assets/results/${link.dataset.source}-${language}.pdf`);
  renderResult(selectedResult);
  if(figureDialog.open)updateExpandedFigure();
}
document.querySelectorAll('[data-slide]').forEach(button=>button.addEventListener('click',()=>renderResult(Number(button.dataset.slide))));
previousResult.addEventListener('click',()=>renderResult(selectedResult-1));
nextResult.addEventListener('click',()=>renderResult(selectedResult+1));
carousel.addEventListener('keydown',event=>{
  if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
    event.preventDefault();
    // Keep keyboard focus in the carousel if its current slide becomes inert.
    if(event.target.closest('.result-slide'))carousel.focus({preventScroll:true});
    renderResult(selectedResult+(event.key==='ArrowRight'?1:-1));
  }
});
// Move the real track on every pointer move, then settle on a bounded card.
stage.addEventListener('pointerdown',event=>{
  if(!event.isPrimary||event.button!==0)return;
  measureResults();
  const transform=getComputedStyle(track).transform;
  const offset=transform==='none'?0:new DOMMatrixReadOnly(transform).m41;
  suppressClickUntil=0;
  gesture={x:event.clientX,y:event.clientY,id:event.pointerId,offset,current:offset,lastX:event.clientX,lastTime:performance.now(),velocity:0,dragging:false};
});
window.addEventListener('pointermove',event=>{
  if(!gesture||gesture.id!==event.pointerId)return;
  const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
  if(!gesture.dragging){
    if(Math.max(Math.abs(dx),Math.abs(dy))<6)return;
    if(Math.abs(dy)>Math.abs(dx)){gesture=null;return}
    gesture.dragging=true;
    stage.classList.add('is-dragging');
    stage.setPointerCapture(event.pointerId);
  }
  event.preventDefault();
  const now=performance.now();
  gesture.velocity=(event.clientX-gesture.lastX)/Math.max(1,now-gesture.lastTime);
  gesture.lastX=event.clientX;gesture.lastTime=now;
  gesture.current=Math.max(-(resultSlides.length-1)*slideStep,Math.min(0,gesture.offset+dx));
  placeResults(gesture.current);
},{passive:false});
function finishGesture(event,cancelled=false){
  if(!gesture||(event&&gesture.id!==event.pointerId))return;
  const finished=gesture;gesture=null;
  if(!finished.dragging)return;
  stage.classList.remove('is-dragging');
  if(stage.hasPointerCapture(finished.id))stage.releasePointerCapture(finished.id);
  suppressClickUntil=performance.now()+350;
  let target=selectedResult;
  if(!cancelled){
    const velocity=performance.now()-finished.lastTime<100?finished.velocity:0;
    const momentum=Math.abs(velocity)>.45?Math.max(-slideStep*.25,Math.min(slideStep*.25,velocity*140)):0;
    const projected=finished.current+momentum;
    target=clampResult(Math.round(-projected/slideStep));
    const distance=finished.current-finished.offset;
    if(target===selectedResult&&Math.abs(distance)>Math.min(100,slideStep*.2))target+=distance<0?1:-1;
  }
  renderResult(target);
}
window.addEventListener('pointerup',event=>finishGesture(event));
window.addEventListener('pointercancel',event=>finishGesture(event,true));
stage.addEventListener('lostpointercapture',event=>{if(event.target===stage)finishGesture(event,true)});
stage.addEventListener('dragstart',event=>event.preventDefault());
stage.addEventListener('click',event=>{
  if(performance.now()<suppressClickUntil){event.preventDefault();event.stopImmediatePropagation();return}
  // Inert neighbors remain out of the tab order; their real visible edge can select them.
  const neighbor=resultSlides.findIndex(slide=>{const rect=slide.getBoundingClientRect();return event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom});
  if(neighbor>=0&&neighbor!==selectedResult){event.preventDefault();event.stopImmediatePropagation();renderResult(neighbor)}
},true);
new ResizeObserver(()=>{
  finishGesture(null,true);
  stage.classList.add('is-resizing');
  renderResult(selectedResult);
  requestAnimationFrame(()=>stage.classList.remove('is-resizing'));
}).observe(viewport);
function updateExpandedFigure(){
  const source=resultSlides[expandedIndex].querySelector('[data-chart]');
  const expanded=document.getElementById('expanded-figure');expanded.src=source.src;expanded.alt=source.alt;
}
document.querySelectorAll('[data-zoom]').forEach(button=>button.addEventListener('click',()=>{
  expandedIndex=Number(button.dataset.zoom);updateExpandedFigure();figureDialog.showModal();
  document.body.style.overflow='hidden';
}));
document.querySelector('.figure-close').addEventListener('click',()=>figureDialog.close());
figureDialog.addEventListener('click',event=>{if(event.target===figureDialog){const b=figureDialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)figureDialog.close()}});
figureDialog.addEventListener('close',()=>{document.body.style.overflow=''});
document.addEventListener('languagechange',()=>{renderLayer(selectedLayer);localizeResults()});
renderLayer(selectedLayer);
localizeResults();

if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('.desktop-nav a').forEach(link=>{const active=link.hash==='#'+entry.target.id;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')})}})},{rootMargin:'-15% 0px -65% 0px'});
  document.querySelectorAll('#top,#overview,#framework,#technology,#evaluation,#report').forEach(section=>observer.observe(section));
}
window.addEventListener('resize',()=>{if(window.innerWidth>1050)closeMenu()},{passive:true});
