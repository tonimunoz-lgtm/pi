import './style.css';
import { store, splitPlan, canEdit } from './store.js';
import { DX, DXL, UNI, ADD, INT, CAT, B, QALL } from './catalog.js';
import { $, $$, esc, norm, defaultCurs, toast, fmtDate, parseDate, setPath, getPath } from './util.js';

/* ============ Estat i persistència ============ */
let S={settings:{centre:'INS Matadepera',director:'Xavi Ros Calsina',curs:defaultCurs(),coordinador:''},students:[],plans:{},cur:null};
let user=null;
const isEditor=()=>canEdit(user&&user.role);
const setStatus=t=>{$('#status').textContent=t};
const privLoaded=new Set();
let dirty={plans:new Set(),settings:false};
let saveT,imported=[];
function save(){if(!isEditor())return;if(S.cur&&S.plans[S.cur])dirty.plans.add(S.cur);setStatus('Desant…');clearTimeout(saveT);saveT=setTimeout(flush,700)}
async function flush(){const d=dirty;dirty={plans:new Set(),settings:false};
  try{if(d.settings)await store.saveSettings(S.settings);
    for(const id of d.plans){const {pub,priv}=splitPlan(S.plans[id]);await store.savePlan(id,pub,(privLoaded.has(id)||store.mode==='local')?priv:null)}
    setStatus('Desat')}
  catch(e){console.error(e);setStatus('Error en desar: '+(e.code||e.message));d.plans.forEach(x=>dirty.plans.add(x));if(d.settings)dirty.settings=true}}
async function saveImported(){const list=imported;imported=[];try{await store.saveStudents(list);setStatus('Desat')}catch(e){console.error(e);toast("No s'ha pogut desar l'alumnat: "+(e.code||e.message))}}
window.addEventListener('beforeunload',e=>{if(dirty.plans.size||dirty.settings){e.preventDefault();e.returnValue=''}});
const stu=()=>S.students.find(s=>s.id===S.cur);
function cursKey(c){c=norm(c);const n=(c.match(/\d/)||[''])[0];if(!n)return'';return(/bat/.test(c)?'B':'E')+n}
function newPlan(s){const d=new Date();const mesos=['Gener','Febrer','Març','Abril','Maig','Juny','Juliol','Agost','Setembre','Octubre','Novembre','Desembre'];
  return{estudis:cursKey(s.curs),cursAc:S.settings.curs,psiPrevi:'no',suportPrevi:'',dataInici:mesos[d.getMonth()]+' '+d.getFullYear(),coordinador:S.settings.coordinador,
  participants:"Alumne/a, mare i/o pare de l'alumne/a, equip docent i orientador/a",altres:'',j:{nese:false,neescd:false,caei:false,psico:false},dx:[],dxCodi:'',dxInforme:'',dxAltre:'',informe:'',
  q:{},open:{},altresNec:'',add:[],addC:[],int:[],intC:[],uniOff:[],obs:'',acord:'',lloc:'',data:''}}
function P(){const s=stu();if(!s)return null;if(!S.plans[s.id])S.plans[s.id]=newPlan(s);return S.plans[s.id]}
function progress(id){const p=S.plans[id];if(!p)return 0;let n=0;if((p.dx||[]).length)n++;
  const nq=Object.values(p.q||{}).filter(x=>x&&x.a).length||p.nq||0;if(nq||Object.values(p.open||{}).some(v=>v))n++;
  if((p.add||[]).length+(p.addC||[]).length+(p.int||[]).length+(p.intC||[]).length)n++;if(p.acord)n++;return n===0?0:n>=4?2:1}

async function selectStudent(id){S.cur=id;renderRoster();const s=S.students.find(x=>x.id===id);
  if(!S.plans[id]){S.plans[id]=newPlan(s);privLoaded.add(id)}
  else if(isEditor()&&!privLoaded.has(id)){try{const pr=await store.loadPrivate(id);if(pr)Object.assign(S.plans[id],pr);privLoaded.add(id)}catch(e){toast('No es pot carregar la part privada del pla');return}}
  renderMain();window.scrollTo({top:0})}
function lockView(){const q=s=>$$(s);$('#s-nec')&&$('#s-nec').remove();q('.secnav a[href="#s-nec"]').forEach(e=>e.remove());
  q('[data-f="informe"],[data-f="dxCodi"],[data-f="dxInforme"],[data-f="suportPrevi"]').forEach(e=>{const l=e.closest('label');if(l)l.remove()});
  q('#main input,#main textarea,#main select').forEach(e=>e.disabled=true)}
function applyRole(){const ed=isEditor();$('#btnImport').hidden=!ed;$('#btnSettings').hidden=!ed;
  $('#who').textContent=store.mode==='local'?'':`${user.email} (${user.role})`;$('#btnLogout').hidden=store.mode==='local';
  $('#demoBanner').hidden=store.mode!=='local';$$('.local-only').forEach(e=>e.hidden=store.mode!=='local')}

/* ============ Alumnat: importació ============ */
function parseDelim(text){text=text.replace(/^\uFEFF/,'');const first=text.split(/\r?\n/)[0]||'';
  const cnt={';':(first.match(/;/g)||[]).length,'\t':(first.match(/\t/g)||[]).length,',':(first.match(/,/g)||[]).length};
  const d=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0];const rows=[];let row=[],f='',q=false;
  for(let i=0;i<text.length;i++){const c=text[i];
    if(q){if(c==='"'){if(text[i+1]==='"'){f+='"';i++}else q=false}else f+=c}
    else if(c==='"')q=true;else if(c===d){row.push(f);f=''}
    else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(f);f='';if(row.some(x=>x.trim()))rows.push(row);row=[]}
    else f+=c}
  row.push(f);if(row.some(x=>x.trim()))rows.push(row);return rows}
function importRows(rows){if(rows.length<2)return 0;
  const h=rows[0].map(x=>norm(x).replace(/[^a-z]/g,''));const idx=names=>h.findIndex(x=>names.includes(x));
  const iN=idx(['nom','name','nomalumne','nomalumnat']),iC=idx(['cognoms','cognom','llinatges']),iF=idx(['nomicognoms','alumne','alumnat','nomcomplet','alumnealumna']);
  const iD=idx(['naixement','datanaixement','datadenaixement','naixament','birth','datanaix']),iCu=idx(['curs','nivell','estudis']),iG=idx(['grup','classe','linia']),iT=idx(['tutor','tutora','tutoria','tutoratutora']);
  if(iN<0&&iF<0){toast("No trobo la columna «nom». Revisa les capçaleres.");return 0}
  let n=0;rows.slice(1).forEach(r=>{const nom=(iN>=0?r[iN]:r[iF]||'').trim(),cog=iC>=0?(r[iC]||'').trim():'';if(!nom&&!cog)return;
    const nai=iD>=0?parseDate(r[iD]):'';const id=norm(cog+nom+nai).replace(/[^a-z0-9]/g,'');
    const o={id,nom,cognoms:cog,naixement:nai,curs:iCu>=0?(r[iCu]||'').trim():'',grup:iG>=0?(r[iG]||'').trim():'',tutor:iT>=0?(r[iT]||'').trim():''};
    const k=S.students.findIndex(s=>s.id===id);if(k>=0)S.students[k]=o;else S.students.push(o);imported.push(o);n++});
  S.students.sort((a,b)=>(a.cognoms+a.nom).localeCompare(b.cognoms+b.nom,'ca'));return n}
const SAMPLE=`Cognoms;Nom;Data naixement;Curs;Grup;Tutor
Garcia Puig;Marc;12/03/2011;3r ESO;3B;Anna Vila
Soler Mas;Laia;04/11/2011;3r ESO;3B;Anna Vila
Ferrer Roca;Pau;23/07/2010;4t ESO;4A;Jordi Camps
Martí Sala;Núria;15/01/2012;2n ESO;2C;Elena Pons
Vidal Riera;Àlex;30/09/2009;1r Batxillerat;1BA;Marta Font
Costa Bosch;Ona;08/05/2012;2n ESO;2A;Elena Pons
Pujol Serra;Biel;19/12/2010;3r ESO;3A;Toni Mir`;

/* ============ Roster ============ */
function renderRoster(){const q=norm($('#q').value),fc=$('#fCurs').value;
  const cursos=[...new Set(S.students.map(s=>s.curs).filter(Boolean))].sort();const sel=$('#fCurs');const keep=sel.value;
  sel.innerHTML='<option value="">Tots els cursos</option>'+cursos.map(c=>`<option ${c===keep?'selected':''}>${esc(c)}</option>`).join('');
  const list=S.students.filter(s=>(!fc||s.curs===fc)&&(!q||norm(s.cognoms+' '+s.nom).includes(q)));
  $('#roster').innerHTML=list.length?list.map(s=>`<button class="stu" data-id="${s.id}" ${s.id===S.cur?'aria-current="true"':''}><span class="dot p${progress(s.id)}"></span><span><span class="n">${esc(s.cognoms?s.cognoms+', '+s.nom:s.nom)}</span><br><span class="c">${esc([s.curs,s.grup].filter(Boolean).join(' '))}</span></span></button>`).join(''):`<p class="hint">${S.students.length?'Cap resultat.':'Encara no hi ha alumnat.'}</p>`}

/* ============ Vista principal ============ */
const STUDIES=[['E1','1r ESO'],['E2','2n ESO'],['E3','3r ESO'],['E4','4t ESO'],['B1','1r Batxillerat'],['B2','2n Batxillerat']];
function renderMain(){const s=stu(),m=$('#main');
  if(!s){m.innerHTML=`<div class="empty"><h2>${S.students.length?'Tria un alumne/a':'Comença important l\'alumnat'}</h2><p>${S.students.length?'Selecciona algú de la llista per obrir o crear el seu pla.':'Puja un fitxer amb noms, curs i data de naixement. A partir d\'aquí, cada pla s\'obre ja amb les dades de l\'alumne/a.'}</p>${S.students.length?'':'<button class="btn primary" id="emptyImport">Importa alumnat</button> <button class="btn" id="emptySample">Prova amb alumnat fictici</button>'}</div>`;return}
  const p=P();
  m.innerHTML=`
  <div class="stuhead"><h2>${esc(s.cognoms?s.cognoms+', '+s.nom:s.nom)}</h2><div class="meta"><span>${esc(s.curs)} ${esc(s.grup)}</span><span>Naixement: ${esc(fmtDate(s.naixement))||'—'}</span><span>Tutor/a: ${esc(s.tutor)||'—'}</span></div></div>
  <nav class="secnav" aria-label="Seccions"><a href="#s-dades">Dades</a><a href="#s-just">Justificació</a><a href="#s-nec">Necessitats</a><a href="#s-ori">Orientacions</a><a href="#s-sig">Signatura</a></nav>

  <section class="card" id="s-dades"><h3>Dades de l'alumne/a i professionals</h3><p class="lead">Ja omplert des del fitxer d'alumnat. Només cal revisar-ho.</p>
   <div class="grid">
    <label class="f">Estudis que cursa<select data-f="estudis"><option value="">—</option>${STUDIES.map(x=>`<option value="${x[0]}" ${p.estudis===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select></label>
    <label class="f">Curs acadèmic<input data-f="cursAc" value="${esc(p.cursAc)}"></label>
    <label class="f">Data d'inici del pla<input data-f="dataInici" value="${esc(p.dataInici)}"></label>
    <label class="f">Coordinador/a del pla<input data-f="coordinador" value="${esc(p.coordinador)}"></label>
   </div>
   <div class="sub-h">Ha seguit un pla de suport individualitzat en cursos anteriors?</div>
   <div class="radios"><label><input type="radio" name="psi" data-f="psiPrevi" value="si" ${p.psiPrevi==='si'?'checked':''}>Sí</label><label><input type="radio" name="psi" data-f="psiPrevi" value="no" ${p.psiPrevi==='no'?'checked':''}>No</label></div>
   <label class="f" style="margin-top:10px">Si no, indica si ha rebut algun altre suport (material, adaptació)<textarea data-f="suportPrevi">${esc(p.suportPrevi)}</textarea></label>
   <div class="grid" style="margin-top:14px">
    <label class="f">Membres que han participat en l'elaboració<textarea data-f="participants">${esc(p.participants)}</textarea></label>
    <label class="f">Altres professionals (logopeda, EAP, externs…)<textarea data-f="altres">${esc(p.altres)}</textarea></label>
   </div>
  </section>

  <section class="card" id="s-just"><h3>Justificació del pla</h3><p class="lead">El diagnòstic tria les mesures universals de l'apartat Orientacions.</p>
   <div class="checks">
    <label><input type="checkbox" data-f="j.nese" ${p.j.nese?'checked':''}>Té informe NESE (necessitats específiques de suport educatiu)</label>
    <label><input type="checkbox" data-f="j.neescd" ${p.j.neescd?'checked':''}>Té informe NEESCD (situacions socioeconòmiques o socioculturals desfavorides)</label>
    <label><input type="checkbox" data-f="j.caei" ${p.j.caei?'checked':''}>Decisió de la CAEI (Comissió d'Atenció Educativa Inclusiva)</label>
    <label><input type="checkbox" data-f="j.psico" ${p.j.psico?'checked':''}>Té informe d'avaluació psicopedagògica de l'equip d'orientació, amb suport de l'EAP</label>
   </div>
   <div class="sub-h">Trastorn o perfil que condiciona l'aprenentatge (pots marcar-ne més d'un)</div>
   <div class="toggles" role="group">${DX.map(d=>`<label class="tog"><input type="checkbox" data-dx="${d.k}" ${p.dx.includes(d.k)?'checked':''}>${esc(d.l)}</label>`).join('')}</div>
   <div class="grid" style="margin-top:14px">
    <label class="f">Detall (presentació, codi CIM/DSM…)<input data-f="dxCodi" value="${esc(p.dxCodi)}" placeholder="Presentació predominantment inatenta [314.00 / F90.0]"></label>
    <label class="f">Data de l'informe<input data-f="dxInforme" value="${esc(p.dxInforme)}" placeholder="Març 2026"></label>
    <label class="f">Altre diagnòstic o perfil<input data-f="dxAltre" value="${esc(p.dxAltre)}"></label>
   </div>
   <label class="f" style="margin-top:14px">Detecció de necessitats segons l'informe (perfil cognitiu, atenció, competències acadèmiques, emocional…)<textarea data-f="informe" style="min-height:150px">${esc(p.informe)}</textarea></label>
  </section>

  <section class="card" id="s-nec"><h3>Necessitats detectades amb l'alumne/a</h3>
   <p class="lead">Guia per a una conversa entre orientador/a i alumne/a. Respon Sí, A vegades o No, i anota en breu què diu. Les respostes que indiquen dificultat es marquen i alimenten les mesures suggerides.</p>
   <div id="blocks">${B.map(b=>renderBlock(b,p)).join('')}</div>
   <label class="f" style="margin-top:14px">Altres necessitats que manifesta<textarea data-f="altresNec">${esc(p.altresNec)}</textarea></label>
  </section>

  <section class="card" id="s-ori"><h3>Orientacions</h3><p class="lead">Tres nivells de mesures i suports, seguint el marc d'atenció inclusiva: universals, addicionals i intensius.</p>
   <div id="sugg"></div>
   <div class="lvl uni"><h4>Mesures universals</h4><p class="desc">Sempre les mateixes segons el diagnòstic. Desmarca les que no calgui aplicar.</p><div id="uni"></div></div>
   <div class="lvl add"><h4>Mesures addicionals</h4><p class="desc">Es trien segons el cas. Les marcades com a «recomanada» encaixen amb el diagnòstic seleccionat.</p><div id="ms-add"></div></div>
   <div class="lvl int"><h4>Mesures intensives</h4><p class="desc">Per a situacions que requereixen suports més estables i específics.</p><div id="ms-int"></div></div>
   <label class="f">Observacions i altres orientacions<textarea data-f="obs">${esc(p.obs)}</textarea></label>
   <p class="hint links" style="margin-top:12px">Més propostes: <a href="https://educacio.gencat.cat/web/.content/home/departament/publicacions/colleccions/inclusio/tdah/tdah.pdf" target="_blank" rel="noopener">El TDAH: detecció i actuació en l'àmbit educatiu</a>, <a href="https://docs.google.com/spreadsheets/d/1nOAxPUEMULsewZZZ-zrToACcRzuWhNCQl5X0TAwajY0/edit#gid=0" target="_blank" rel="noopener">Pautes DUA Andy Morodo</a>, <a href="https://drive.google.com/file/d/1q7vj1uQoR8kl2lXu9lzGxDXjfRHJRCrd/view?usp=sharing" target="_blank" rel="noopener">Pautes internes de l'INS Matadepera</a>.</p>
  </section>

  <section class="card" id="s-sig"><h3>Signatura</h3>
   <p class="lead">El pare, la mare o els tutors legals són informats d'aquest pla i acorden amb el tutor/a el seguiment.</p>
   <div class="radios"><label><input type="radio" name="ac" data-f="acord" value="acord" ${p.acord==='acord'?'checked':''}>Acord</label><label><input type="radio" name="ac" data-f="acord" value="desacord" ${p.acord==='desacord'?'checked':''}>Desacord</label></div>
   <div class="grid" style="margin-top:12px"><label class="f">Lloc<input data-f="lloc" value="${esc(p.lloc)}"></label><label class="f">Data<input type="date" data-f="data" value="${esc(p.data)}"></label></div>
   <p class="hint" style="margin-top:12px">Les signatures es fan sobre el PDF imprès.</p>
  </section>`;
  renderUni();renderMs('add');renderMs('int');renderSugg();updateCounts();$$('.q').forEach(r=>paintQ(r.dataset.q));if(!isEditor())lockView();
}
function renderBlock(b,p){return`<details class="blk" data-b="${b.id}" ${b.id==='ini'?'open':''}><summary>${esc(b.t)}<span class="cnt"></span></summary>${b.intro?`<div class="intro">${esc(b.intro)}</div>`:''}${b.qs.map(q=>q.open?
  `<div class="q" data-q="${q.id}"><div class="qt">${esc(q.t)}</div><textarea class="ta" data-open="${q.id}" rows="2">${esc(p.open[q.id]||'')}</textarea></div>`:
  `<div class="q" data-q="${q.id}"><div><div class="qt">${esc(q.t)}</div><div class="why">Per aprofundir: ${esc(q.why||'')}</div></div><div class="seg" role="group" aria-label="Resposta">${[['si','Sí'],['av','A vegades'],['no','No']].map(o=>`<button type="button" data-qa="${q.id}" data-v="${o[0]}" aria-pressed="${(p.q[q.id]||{}).a===o[0]}">${o[1]}</button>`).join('')}</div><input class="note" data-note="${q.id}" placeholder="Què diu l'alumne/a…" value="${esc((p.q[q.id]||{}).n||'')}"></div>`).join('')}</details>`}
function isDiff(q,a){if(!a||q.neutral||q.open)return false;return q.neg?(a==='si'||a==='av'):(a==='no'||a==='av')}
function paintQ(id){const q=QALL.find(x=>x.id===id),p=P();if(!q||q.open)return;const row=$(`.q[data-q="${id}"]`);if(!row)return;const a=(p.q[id]||{}).a;
  row.classList.toggle('flag',isDiff(q,a));$$('button[data-qa]',row).forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===a))}
function updateCounts(){const p=P();B.forEach(b=>{const d=$(`details[data-b="${b.id}"] .cnt`);if(!d)return;const qs=b.qs.filter(q=>!q.open);if(!qs.length){d.textContent='';return}
  const ans=qs.filter(q=>(p.q[q.id]||{}).a).length,fl=qs.filter(q=>isDiff(q,(p.q[q.id]||{}).a)).length;d.innerHTML=`${ans}/${qs.length} respostes${fl?` · <b>${fl} a reforçar</b>`:''}`})}

/* Universals */
function uniList(p){const out=[];const seen=new Set();const order=['comu',...p.dx];order.forEach(k=>{(UNI[k]?UNI[k].m:[]).forEach((t,i)=>{if(seen.has(t))return;seen.add(t);out.push({id:k+':'+i,k,t})})});return out}
function renderUni(){const p=P(),list=uniList(p);const el=$('#uni');
  if(!p.dx.length){el.innerHTML='<p class="hint">Selecciona un diagnòstic a «Justificació» per veure\'n les mesures. Mentrestant, s\'apliquen les comunes.</p>'}else el.innerHTML='';
  const groups={};list.forEach(x=>(groups[x.k]=groups[x.k]||[]).push(x));
  el.innerHTML+=Object.keys(groups).map(k=>`<div class="uni-grp"><h5>${esc(UNI[k].l)}</h5><div class="uni-list">${groups[k].map(x=>`<label class="${p.uniOff.includes(x.id)?'off':''}"><input type="checkbox" data-uni="${x.id}" ${p.uniOff.includes(x.id)?'':'checked'}><span>${esc(x.t)}</span></label>`).join('')}</div></div>`).join('')}

/* Desplegable múltiple */
function renderMs(lv){const p=P(),src=lv==='add'?ADD:INT,key=lv==='add'?'add':'int',ckey=lv==='add'?'addC':'intC',el=$('#ms-'+lv);
  if(!isEditor()){el.innerHTML=`<div class="chips" data-chips="${lv}"></div>`;renderChips(lv);return}
  const groups=[...new Set(src.map(a=>a[1]))];
  el.innerHTML=`<div class="ms" data-lv="${lv}"><button type="button" class="ms-btn" data-mstoggle="${lv}" aria-expanded="false"><span>Selecciona mesures ${lv==='add'?'addicionals':'intensives'}</span><span class="badge" data-badge="${lv}"></span></button>
   <div class="ms-panel" hidden><div class="ms-search"><input type="search" placeholder="Cerca dins la llista…" data-mssearch="${lv}" aria-label="Cerca mesures"></div>
   ${groups.map(g=>`<div class="ms-group"><h5>${esc(g)}</h5>${src.filter(a=>a[1]===g).map(a=>{const rec=a[3].some(d=>p.dx.includes(d));return`<label class="ms-opt" data-t="${esc(norm(a[2]))}"><input type="checkbox" data-ms="${lv}" value="${a[0]}" ${p[key].includes(a[0])?'checked':''}><span>${esc(a[2])}${rec?'<span class="rec">recomanada</span>':''}</span></label>`}).join('')}</div>`).join('')}</div></div>
   <div class="chips" data-chips="${lv}"></div>
   <div class="custom-row"><input type="text" data-custom="${lv}" placeholder="Afegeix una mesura pròpia…" aria-label="Mesura pròpia"><button type="button" class="btn" data-addcustom="${lv}">Afegeix</button></div>`;
  renderChips(lv)}
function renderChips(lv){const p=P(),key=lv==='add'?'add':'int',ckey=lv==='add'?'addC':'intC';
  const c=$(`[data-chips="${lv}"]`);if(!c)return;
  c.innerHTML=p[key].map(id=>`<div class="chip"><span>${esc(CAT[id].t)}</span><button class="x" type="button" data-rm="${lv}:${id}" aria-label="Treu">×</button></div>`).join('')+p[ckey].map((t,i)=>`<div class="chip custom"><span>${esc(t)}</span><button class="x" type="button" data-rmc="${lv}:${i}" aria-label="Treu">×</button></div>`).join('');
  const n=p[key].length+p[ckey].length;const b=$(`[data-badge="${lv}"]`);if(b)b.textContent=n+' seleccionades';
  $$(`input[data-ms="${lv}"]`).forEach(i=>i.checked=p[key].includes(i.value));if(!isEditor())$$('.chip .x').forEach(b=>b.remove())}
function renderSugg(){const p=P(),cnt={};QALL.forEach(q=>{if(isDiff(q,(p.q[q.id]||{}).a))(q.sug||[]).forEach(m=>cnt[m]=(cnt[m]||0)+1)});
  const list=Object.entries(cnt).filter(([m])=>!p.add.includes(m)).sort((a,b)=>b[1]-a[1]);const el=$('#sugg');
  el.innerHTML=list.length?`<div class="sugg"><h4>Mesures suggerides a partir de la conversa</h4><ul>${list.map(([m,n])=>`<li><span>${esc(CAT[m].t)} <span class="n">(${n} ${n>1?'respostes':'resposta'})</span></span><button type="button" class="btn small" data-sug="${m}">Afegeix</button></li>`).join('')}</ul><p class="hint" style="margin:8px 0 0"><button type="button" class="btn small" data-sugall>Afegeix-les totes</button></p></div>`:''}

/* ============ Esdeveniments ============ */
document.addEventListener('input',e=>{const t=e.target,p=P();
  if(t.dataset.note){const id=t.dataset.note;(p.q[id]=p.q[id]||{}).n=t.value;save();return}
  if(t.dataset.open){p.open[t.dataset.open]=t.value;save();return}
  if(t.dataset.mssearch){const q=norm(t.value);$$(`#ms-${t.dataset.mssearch} .ms-opt`).forEach(l=>l.hidden=q&&!l.dataset.t.includes(q));return}
  if(t.dataset.f&&p&&t.type!=='checkbox'&&t.type!=='radio'){setPath(p,t.dataset.f,t.value);save()}
  if(t.dataset.s){S.settings[t.dataset.s]=t.value;$('#centreName').textContent=S.settings.centre;dirty.settings=true;save()}});
document.addEventListener('change',e=>{const t=e.target,p=P();if(!p)return;
  if(t.dataset.f&&(t.type==='checkbox')){setPath(p,t.dataset.f,t.checked);save()}
  if(t.dataset.f&&t.type==='radio'){setPath(p,t.dataset.f,t.value);save();renderRoster()}
  if(t.dataset.dx){const k=t.dataset.dx;p.dx=t.checked?[...p.dx,k]:p.dx.filter(x=>x!==k);save();renderUni();renderMs('add');renderMs('int');renderRoster()}
  if(t.dataset.uni){const id=t.dataset.uni;p.uniOff=t.checked?p.uniOff.filter(x=>x!==id):[...p.uniOff,id];t.closest('label').classList.toggle('off',!t.checked);save()}
  if(t.dataset.ms){const lv=t.dataset.ms,key=lv==='add'?'add':'int',v=t.value;p[key]=t.checked?[...new Set([...p[key],v])]:p[key].filter(x=>x!==v);save();renderChips(lv);renderSugg();renderRoster()}});
document.addEventListener('click',e=>{const t=e.target.closest('button,a,label'),p=P();
  const ms=e.target.closest('.ms');$$('.ms-panel').forEach(pn=>{if(!pn.parentElement.contains(e.target))pn.hidden=true});
  if(!t)return;
  if(t.classList.contains('stu')){selectStudent(t.dataset.id);return}
  if(t.dataset.mstoggle){const pn=t.nextElementSibling;pn.hidden=!pn.hidden;t.setAttribute('aria-expanded',String(!pn.hidden));if(!pn.hidden)$('input',pn).focus();return}
  if(t.dataset.qa){const id=t.dataset.qa;const cur=(p.q[id]||{}).a;(p.q[id]=p.q[id]||{}).a=cur===t.dataset.v?'':t.dataset.v;if(!p.q[id].a&&!p.q[id].n)delete p.q[id];save();paintQ(id);updateCounts();renderSugg();renderRoster();return}
  if(t.dataset.rm){const [lv,id]=t.dataset.rm.split(':'),key=lv==='add'?'add':'int';p[key]=p[key].filter(x=>x!==id);save();renderChips(lv);renderSugg();return}
  if(t.dataset.rmc){const [lv,i]=t.dataset.rmc.split(':'),ck=lv==='add'?'addC':'intC';p[ck].splice(+i,1);save();renderChips(lv);return}
  if(t.dataset.addcustom){addCustom(t.dataset.addcustom);return}
  if(t.dataset.sug){p.add=[...new Set([...p.add,t.dataset.sug])];save();renderChips('add');renderSugg();renderRoster();return}
  if(t.hasAttribute('data-sugall')){const cnt=new Set();QALL.forEach(q=>{if(isDiff(q,(p.q[q.id]||{}).a))(q.sug||[]).forEach(m=>cnt.add(m))});p.add=[...new Set([...p.add,...cnt])];save();renderChips('add');renderSugg();renderRoster();return}
  if(t.id==='emptyImport')$('#dImport').showModal();
  if(t.id==='emptySample')loadSample()});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.dataset.custom){e.preventDefault();addCustom(e.target.dataset.custom)}if(e.key==='Escape')$$('.ms-panel').forEach(p=>p.hidden=true)});
function addCustom(lv){const i=$(`[data-custom="${lv}"]`),v=i.value.trim();if(!v)return;const p=P();p[lv==='add'?'addC':'intC'].push(v);i.value='';save();renderChips(lv)}
function loadSample(){importRows(parseDelim(SAMPLE));saveImported();renderRoster();renderMain();$('#dImport').close();toast('Alumnat fictici carregats')}
$('#q').addEventListener('input',renderRoster);$('#fCurs').addEventListener('change',renderRoster);

/* Importació */
$('#btnImport').onclick=()=>$('#dImport').showModal();
$('#cancelImport').onclick=()=>$('#dImport').close();
$('#btnSample').onclick=loadSample;
$('#fileCsv').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$('#pasteCsv').value=r.result};r.readAsText(f,'utf-8')});
$('#doImport').onclick=()=>{const n=importRows(parseDelim($('#pasteCsv').value));if(n){saveImported();renderRoster();renderMain();$('#dImport').close();toast(n+' alumnes importats')}};
$('#btnTemplate').onclick=()=>download('plantilla-alumnat.csv','Cognoms;Nom;Data naixement;Curs;Grup;Tutor\n','text/csv');
function download(name,txt,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}

/* Configuració */
$('#btnSettings').onclick=()=>{$$('[data-s]').forEach(i=>i.value=S.settings[i.dataset.s]||'');$('#dSettings').showModal()};
$('#closeSettings').onclick=()=>{$('#dSettings').close();dirty.settings=true;save()};
$('#btnExport').onclick=()=>download('psi-copia.json',JSON.stringify({settings:S.settings,students:S.students,plans:S.plans},null,1),'application/json');
$('#fileRestore').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);store.replaceAll({settings:o.settings,students:o.students,plans:o.plans});location.reload()}catch(err){toast('El fitxer no és vàlid')}};r.readAsText(f)});
$('#btnWipe').onclick=()=>{if(confirm("Vols esborrar tot l'alumnat i tots els plans d'aquest navegador?")){store.wipe();location.reload()}};

/* ============ Document per imprimir ============ */
function buildPrint(){const s=stu();const d=$('#pd');if(!s){d.innerHTML='';return}const p=P(),C=S.settings;
  const box=v=>v?'☒':'☐';
  const dxTxt=p.dx.map(k=>DXL[k]).concat(p.dxAltre?[p.dxAltre]:[]).join(', ');
  const uni=uniList(p).filter(x=>!p.uniOff.includes(x.id)).map(x=>x.t);
  const add=p.add.map(i=>CAT[i].t).concat(p.addC),it=p.int.map(i=>CAT[i].t).concat(p.intC);
  const ul=a=>a.length?'<ul>'+a.map(x=>`<li>${esc(x)}</li>`).join('')+'</ul>':'<p><i>Cap mesura seleccionada.</i></p>';
  const nl=t=>esc(t).replace(/\n/g,'<br>');
  const rows=[];B.forEach(b=>{const qs=b.qs.filter(q=>!q.open&&((p.q[q.id]||{}).a||(p.q[q.id]||{}).n));if(qs.length)rows.push(`<tr><th colspan="5">${esc(b.t)}</th></tr>`+qs.map(q=>{const a=(p.q[q.id]||{}).a;return`<tr><td>${esc(q.t)}</td><td class="c">${a==='si'?'X':''}</td><td class="c">${a==='av'?'X':''}</td><td class="c">${a==='no'?'X':''}</td><td>${esc((p.q[q.id]||{}).n||'')}</td></tr>`}).join(''))});
  const opens=QALL.filter(q=>q.open&&p.open[q.id]).map(q=>`<p><b>${esc(q.t)}</b><br>${nl(p.open[q.id])}</p>`).join('');
  d.innerHTML=`<h1>Pla de suport individualitzat per a alumnes amb necessitats específiques de suport educatiu a l'ESO i al batxillerat</h1>
  <p>${esc(C.centre)}</p>
  <h2>Dades de l'alumne/a</h2>
  <table><tr><td><b>Nom i cognoms</b><br>${esc((s.nom+' '+s.cognoms).trim())}</td><td><b>Data de naixement</b><br>${esc(fmtDate(s.naixement))}</td><td><b>Curs acadèmic</b><br>${esc(p.cursAc)}</td></tr>
  <tr><td colspan="3"><b>Estudis que cursa</b><br>ESO: ${STUDIES.filter(x=>x[0][0]==='E').map(x=>box(p.estudis===x[0])+' '+x[1].split(' ')[0]).join(' &nbsp; ')}<br>Batxillerat: ${STUDIES.filter(x=>x[0][0]==='B').map(x=>box(p.estudis===x[0])+' '+x[1].split(' ')[0]).join(' &nbsp; ')}</td></tr>
  <tr><td colspan="3"><b>Cursos anteriors.</b> Ha seguit un pla de suport individualitzat: ${box(p.psiPrevi==='si')} Sí &nbsp; ${box(p.psiPrevi==='no')} No<br>${nl(p.suportPrevi)}</td></tr></table>
  <h2>Dades dels professionals que intervenen al pla</h2>
  <p>Data d'inici del pla: <b>${esc(p.dataInici)}</b> &nbsp; Director/a: <b>${esc(C.director)}</b><br>Coordinador/a del pla: <b>${esc(p.coordinador)}</b></p>
  <p>Membres que han participat en l'elaboració: <b>${esc(p.participants)}</b></p>
  ${p.altres?`<p>Altres professionals: ${nl(p.altres)}</p>`:''}
  <h2>Justificació del pla</h2>
  <ul style="list-style:none;margin-left:0"><li>${box(p.j.nese)} Té informe NESE</li><li>${box(p.j.neescd)} Té informe NEESCD</li><li>${box(p.j.caei)} Decisió de la CAEI</li><li>${box(p.j.psico)} Té informe d'avaluació psicopedagògica de l'equip d'orientació, amb suport de l'EAP</li></ul>
  <p>Trastorn o perfil que condiciona l'aprenentatge: <b>${esc(dxTxt)||'—'}</b>${p.dxCodi?' — '+esc(p.dxCodi):''}${p.dxInforme?' (Informe '+esc(p.dxInforme)+')':''}</p>
  ${p.informe?`<h3>Detecció de necessitats segons l'informe</h3><p>${nl(p.informe)}</p>`:''}
  ${rows.length||opens||p.altresNec?`<h2>Detecció de necessitats segons l'alumne/a</h2>${rows.length?`<table><tr><th>Pregunta</th><th class="c">Sí</th><th class="c">A vegades</th><th class="c">No</th><th>Observacions</th></tr>${rows.join('')}</table>`:''}${opens}${p.altresNec?`<p><b>Altres necessitats que manifesta:</b> ${nl(p.altresNec)}</p>`:''}`:''}
  <h2>Orientacions</h2>
  <h3>Mesures universals</h3>${ul(uni)}
  <h3>Mesures addicionals</h3>${ul(add)}
  <h3>Mesures intensives</h3>${ul(it)}
  ${p.obs?`<h3>Observacions</h3><p>${nl(p.obs)}</p>`:''}
  <h2>Signatura</h2>
  <p>El pare, la mare o els tutors legals són informats d'aquest pla individualitzat de l'alumne/a ${esc((s.nom+' '+s.cognoms).trim())} i acorden amb el tutor/a el seguiment del mateix.</p>
  <p>${box(p.acord==='acord')} Acord &nbsp; ${box(p.acord==='desacord')} Desacord</p>
  <p>${esc(p.lloc)}${p.lloc&&p.data?', ':''}${esc(fmtDate(p.data))}</p>
  <div class="sig"><div>Signatura del/de la tutor/a</div><div>Signatura dels pares de l'alumne/a</div><div>Signatura del/de la director/a</div></div>`}
$('#btnPrint').onclick=()=>{if(!stu()){toast('Tria primer un alumne/a');return}buildPrint();window.print()};
window.addEventListener('beforeprint',buildPrint);

/* ============ Inici ============ */
/* ============ Inici i sessió ============ */
$('#btnLogin').onclick=()=>store.login().catch(e=>{$('#loginMsg').textContent="No s'ha pogut iniciar la sessió: "+(e.code||e.message)});
$('#btnLogout').onclick=()=>store.logout().then(()=>location.reload());
store.onAuth(async u=>{
  if(!u){user=null;$('#login').hidden=false;return}
  if(u.error){user=null;$('#loginMsg').textContent=u.error;$('#login').hidden=false;return}
  user=u;$('#login').hidden=true;
  try{const d=await store.loadAll();
    S.settings=Object.assign(S.settings,d.settings||{});
    S.students=d.students.sort((a,b)=>(a.cognoms+a.nom).localeCompare(b.cognoms+b.nom,'ca'));
    S.plans={};Object.entries(d.plans).forEach(([id,pub])=>{const s=S.students.find(x=>x.id===id);if(s)S.plans[id]=Object.assign(newPlan(s),pub)});
  }catch(e){console.error(e);toast('No es poden carregar les dades: '+(e.code||e.message))}
  applyRole();$('#centreName').textContent=S.settings.centre;renderRoster();renderMain()});
