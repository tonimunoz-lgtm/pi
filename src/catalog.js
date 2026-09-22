/* ============ Catàlegs ============ */
export const DX=[
 {k:'tdah',l:'TDAH'},{k:'dislexia',l:'Dislèxia'},{k:'discalculia',l:'Discalcúlia'},{k:'tea',l:'TEA'},
 {k:'tdl',l:'Trastorn del llenguatge (TDL)'},{k:'disgrafia',l:'Disgrafia / disortografia'},{k:'altcap',l:'Altes capacitats'},{k:'altre',l:'Altre / sense diagnòstic'}
];
export const DXL=Object.fromEntries(DX.map(d=>[d.k,d.l]));

/* Mesures universals: sempre les mateixes segons diagnòstic */
export const UNI={
 comu:{l:'Comunes a tots els perfils',m:[
  "Informar tot l'equip docent del perfil de l'alumne/a i de les pautes acordades.",
  "Assegurar que entén què ha de fer en cada moment (enunciats concrets i simples; comprovar la comprensió).",
  "Reforç positiu de l'esforç i dels avenços, més enllà del resultat.",
  "Coordinació periòdica amb la família i amb el tutor/a."]},
 tdah:{l:'TDAH',m:[
  "Ubicació a prop de la pissarra i del professorat, sense distractors i amb companys/es tranquils.",
  "Pactar una consigna discreta per reconduir l'atenció (contacte visual, toc a la taula…).",
  "Fraccionar el treball en períodes curts i en passos concrets.",
  "Presentar els continguts de manera visual (esquemes, mapes, imatges, vídeos).",
  "Fomentar la participació a classe i el moviment regulat (repartir material, esborrar la pissarra).",
  "Supervisar l'agenda (Classroom o paper) i pautar rutines d'organització.",
  "Permetre suports d'acompanyament emocional en situacions de desregulació (pausa breu, objecte antiestrès, persona de referència).",
  "Més temps en activitats i avaluacions si ho necessita.",
  "Fomentar la revisió de les respostes abans de lliurar (segones lectures, llista de verificació)."]},
 dislexia:{l:'Dislèxia',m:[
  "Més temps en proves i activitats escrites.",
  "Textos i enunciats amb tipografia clara (sense serifs, 12–14 pt), interlineat ampli i sense justificar.",
  "Lectura en veu alta dels enunciats o ús de lector de text quan calgui.",
  "No penalitzar les errades ortogràfiques ni de lectoescriptura en àrees no lingüístiques.",
  "Permetre xuleta ortogràfica i corrector.",
  "No fer llegir en veu alta davant del grup sense acord previ amb l'alumne/a.",
  "Facilitar apunts, esquemes o presentacions abans de la sessió.",
  "Valorar alternatives a l'examen escrit (oral, preguntes tancades) quan l'escriptura limiti l'expressió del coneixement."]},
 discalculia:{l:'Discalcúlia',m:[
  "Permetre calculadora, taula de multiplicar i full de fórmules a proves i activitats.",
  "Més temps en activitats numèriques.",
  "Materials manipulatius i representacions visuals (gràfics, esquemes, colors) per als conceptes matemàtics.",
  "Descompondre els problemes en passos i oferir models resolts.",
  "Valorar el procés de raonament per sobre del resultat i no penalitzar errades de càlcul mecànic.",
  "Enunciats de problemes amb llenguatge senzill i suport a la lectura.",
  "Evitar l'exposició pública d'errades (resoldre a la pissarra sense avís previ)."]},
 tea:{l:'TEA',m:[
  "Anticipar la rutina, els canvis i les activitats (agenda visual, avisos previs).",
  "Instruccions clares, literals i concretes; una instrucció cada vegada; evitar ironies i dobles sentits.",
  "Disposar d'un espai i d'una persona de referència per a situacions de sobrecàrrega emocional o sensorial.",
  "Suports visuals (pictogrames, esquemes, guions) per a normes i tasques.",
  "Estructurar el treball en grup: rols definits, parelles estables i pautes d'interacció.",
  "Tenir en compte els aspectes sensorials (soroll, llum, patis, canvis d'aula).",
  "Explicitar les normes socials implícites i treballar-les amb guions socials.",
  "Aprofitar els interessos de l'alumne/a com a motor de motivació."]},
 tdl:{l:'Trastorn del llenguatge (TDL)',m:[
  "Parlar de manera clara i pausada, amb frases curtes; comprovar la comprensió.",
  "Suport visual i gestual; anticipar el vocabulari clau de cada unitat.",
  "Donar més temps de resposta oral i escrita.",
  "Preguntes tancades o amb opcions quan calgui; no penalitzar la morfosintaxi.",
  "Coordinació amb el/la logopeda."]},
 disgrafia:{l:'Disgrafia / disortografia',m:[
  "Permetre l'ús de l'ordinador o la tauleta per escriure, amb corrector.",
  "No penalitzar la cal·ligrafia ni la presentació; valorar el contingut.",
  "Més temps en produccions escrites i en exàmens.",
  "Alternatives orals o de resposta curta quan l'escriptura limiti.",
  "Facilitar apunts o esquemes complets per evitar la còpia."]},
 altcap:{l:'Altes capacitats',m:[
  "Activitats d'ampliació i enriquiment dins l'aula, amb marge d'autonomia.",
  "Evitar la repetició de tasques ja dominades; compactar el currículum.",
  "Oferir reptes oberts i projectes d'interès.",
  "Atenció al desenvolupament emocional i social (asincronia, perfeccionisme)."]},
 altre:{l:'Altre / sense diagnòstic',m:[]}
};

/* Mesures addicionals: [id, àmbit, text, diagnòstics recomanats] */
export const ADD=[
 ['a_seient','Metodologia i aula',"Canvi d'ubicació o seient estratègic (prop del docent, lluny de portes i finestres)",['tdah','tea']],
 ['a_guions','Metodologia i aula',"Guions o bastides d'orientació per a tasques de diversos passos (llistes de passos, exemples resolts)",['tdah','discalculia','tdl']],
 ['a_tutoria','Metodologia i aula',"Tutoria individual breu setmanal per planificar tasques i revisar objectius",['tdah','tea']],
 ['a_mentor','Metodologia i aula',"Company/a acompanyant o tutoria entre iguals en tasques concretes",['tea','tdah','dislexia']],
 ['a_pauses','Metodologia i aula',"Pauses actives programades o permís per moure's de manera regulada",['tdah']],
 ['a_agrup','Metodologia i aula',"Agrupaments cooperatius amb rols definits i companys de referència",['tea','tdl']],
 ['a_anticipar','Metodologia i aula',"Anticipació de continguts: facilitar apunts, esquemes o presentacions abans de la sessió",['dislexia','tdl','tea']],
 ['a_instr','Metodologia i aula',"Instruccions orals i escrites, un pas cada vegada",['tdah','tea','tdl']],
 ['a_altcap','Metodologia i aula',"Projectes d'ampliació amb suport d'un docent de referència",['altcap']],
 ['a_temps','Avaluació',"Temps addicional en proves i activitats (25 % o 50 %)",['dislexia','tdah','discalculia','disgrafia','tdl']],
 ['a_fracc','Avaluació',"Fraccionar els exàmens en parts o en dues sessions",['tdah']],
 ['a_oral','Avaluació',"Avaluació oral o alternativa a l'examen escrit",['dislexia','disgrafia','tdl']],
 ['a_enunciats','Avaluació',"Adaptació d'enunciats (llenguatge senzill, tipografia clara, paraules clau ressaltades)",['dislexia','tdah','tdl','discalculia']],
 ['a_lectura','Avaluació',"Lectura dels enunciats pel docent o amb lector de text",['dislexia']],
 ['a_ortog','Avaluació',"No penalitzar ortografia ni cal·ligrafia en àrees no lingüístiques",['dislexia','disgrafia','tdah']],
 ['a_calc','Avaluació',"Calculadora, taula de multiplicar o full de fórmules a les proves",['discalculia']],
 ['a_espaiexam','Avaluació',"Fer les proves en un espai amb menys estímuls (aula de guàrdia, biblioteca)",['tdah','tea']],
 ['a_revisio','Avaluació',"Llista de revisió abans de lliurar l'examen",['tdah']],
 ['a_agenda','Organització i hàbits',"Supervisió diària de l'agenda i Classroom (tutor/a o família)",['tdah']],
 ['a_calendari','Organització i hàbits',"Calendari visual de lliuraments i exàmens amb recordatoris",['tdah','tea']],
 ['a_carpeta','Organització i hàbits',"Carpeta única organitzada per colors o joc de material a casa i a l'aula",['tdah']],
 ['a_descomp','Organització i hàbits',"Descomposició de treballs llargs amb dates intermèdies de lliurament",['tdah','tea']],
 ['a_estudi','Organització i hàbits',"Ensenyament explícit de tècniques d'estudi (esquemes, mapes conceptuals, resums)",['tdah','dislexia','tdl']],
 ['a_ordinador','Tecnologia i materials',"Ús de l'ordinador o tauleta per escriure, amb corrector ortogràfic",['dislexia','disgrafia','tdah']],
 ['a_tts','Tecnologia i materials',"Lector de text (síntesi de veu) i audiollibres",['dislexia']],
 ['a_dictat','Tecnologia i materials',"Dictat per veu per a produccions escrites",['dislexia','disgrafia']],
 ['a_adaptats','Tecnologia i materials',"Materials adaptats (tipografia, interlineat, contrast, mapes visuals)",['dislexia','tdl']],
 ['a_xuleta','Tecnologia i materials',"Xuleta ortogràfica o glossari de vocabulari per àrees",['dislexia','disgrafia','tdah']],
 ['a_autoinstr','Suport emocional i social',"Treball d'autoinstruccions i tècniques d'autoregulació",['tdah','tea']],
 ['a_calma','Suport emocional i social',"Espai o moment de calma pactat, amb persona de referència",['tdah','tea']],
 ['a_social','Suport emocional i social',"Guions socials i anticipació de situacions (sortides, canvis d'horari, patis)",['tea']],
 ['a_pati','Suport emocional i social',"Suport o alternatives en moments no estructurats (pati, canvis de classe)",['tea','tdah']],
 ['a_sensorial','Suport emocional i social',"Adaptacions sensorials (auriculars, ubicació, llum)",['tea']],
 ['a_referent','Suport emocional i social',"Adult de referència a qui adreçar-se en cas de dificultat",['tea','tdah']],
 ['a_familia','Coordinació',"Reunions periòdiques amb la família i full de comunicació setmanal",[]],
 ['a_externs','Coordinació',"Coordinació amb professionals externs (logopeda, psicòleg/òloga, CSMIJ)",[]],
 ['a_seguiment','Coordinació',"Reunió de seguiment trimestral amb l'equip docent",[]]
];
/* Mesures intensives */
export const INT=[
 ['i_pi','Currículum i avaluació',"Pla individualitzat (PI) amb adaptació significativa d'objectius, continguts i criteris d'avaluació en àrees concretes",[]],
 ['i_proves','Currículum i avaluació',"Adaptació significativa de les proves d'avaluació (format, contingut, temps)",[]],
 ['i_flex','Currículum i avaluació',"Flexibilització horària o d'assignatures amb pla de treball alternatiu",[]],
 ['i_enriq','Currículum i avaluació',"Programa d'enriquiment o ampliació curricular (o flexibilització del cicle)",['altcap']],
 ['i_aula','Suport personal',"Suport a l'aula d'un segon docent o professional en àrees concretes (cotutoria)",[]],
 ['i_petit','Suport personal',"Atenció individual o en petit grup fora de l'aula ordinària en àrees instrumentals",['dislexia','discalculia','tdl']],
 ['i_flexgrup','Suport personal',"Agrupaments flexibles o desdoblaments per a treball intensiu",[]],
 ['i_mentoria','Suport personal',"Mentoria intensiva i acompanyament per fer deures en hores de guàrdia o biblioteca",['tdah']],
 ['i_orient','Suport personal',"Seguiment setmanal per part de l'orientador/a",['tdah','tea']],
 ['i_logo','Intervenció especialitzada',"Intervenció logopèdica o psicopedagògica sistemàtica",['dislexia','tdl','disgrafia']],
 ['i_reg','Intervenció especialitzada',"Pla d'intervenció en regulació emocional i conducta amb protocol d'actuació",['tdah','tea']],
 ['i_tec','Intervenció especialitzada',"Recursos tecnològics d'ús permanent (dispositiu i programari específic)",['dislexia','disgrafia']],
 ['i_serveis','Coordinació',"Coordinació intensiva amb serveis externs (EAP, CSMIJ, serveis socials)",['tea']]
];
export const CAT={};
ADD.forEach(a=>CAT[a[0]]={id:a[0],g:a[1],t:a[2],dx:a[3],lv:'add'});
INT.forEach(a=>CAT[a[0]]={id:a[0],g:a[1],t:a[2],dx:a[3],lv:'int'});

/* Conversa orientador/a – alumne/a */
export const B=[
 {id:'ini',t:'Per començar la conversa',intro:'Preguntes obertes per crear un clima de confiança. Escolta abans de fer les preguntes tancades.',qs:[
  {id:'o1',open:true,t:"Com et sents al centre aquest curs?"},
  {id:'o2',open:true,t:"Què se't dona bé? Què t'agrada fer?"},
  {id:'o3',open:true,t:"Què és el que et costa més?"}]},
 {id:'act',t:'Actitud',qs:[
  {id:'q1',t:"T'esforces per seguir el treball de classe?",why:"Què t'ajuda a seguir-lo? Què et fa perdre el fil?",sug:['a_seient','a_fracc','a_guions']},
  {id:'q2',t:"Tens el material endreçat (carpeta, estoig)?",why:"Ho fas tu o algú t'ho recorda?",sug:['a_carpeta','a_agenda']},
  {id:'q3',t:"Pots estar assegut el temps necessari per fer la feina?",why:"En quines hores o assignatures et costa més?",sug:['a_pauses','a_seient']},
  {id:'q4',t:"Respectes les normes de classe?",why:"Hi ha alguna norma que et costa especialment? Per què?"}]},
 {id:'hab',t:'Hàbits i organització',qs:[
  {id:'q5',neg:true,t:"Se't van acumulant les tasques?",why:"Com decideixes per on comences?",sug:['a_agenda','a_descomp','a_calendari']},
  {id:'q6',t:"Portes cada dia el material de treball?",why:"Què passa quan te'l descuides?",sug:['a_carpeta','a_agenda']},
  {id:'q7',t:"Entregues les tasques amb puntualitat i bona presentació?",why:"Què et fa arribar tard o entregar-les incompletes?",sug:['a_calendari','a_descomp']},
  {id:'q8',t:"Dediques un temps a revisar l'agenda (Classroom, Google Calendar…)?",why:"Com t'ho muntes per recordar què tens pendent?",sug:['a_agenda','a_calendari']},
  {id:'q9',t:"Treballes sol/a si coneixes la feina?",why:"Quan necessites que algú et vagi guiant?",sug:['a_guions','a_tutoria']}]},
 {id:'aten',t:'Atenció i concentració',qs:[
  {id:'q10',neg:true,t:"Et costa mantenir l'atenció durant una explicació llarga?",why:"Quant de temps aguantes? Què fas quan et desconnectes?",sug:['a_seient','a_pauses','a_instr']},
  {id:'q11',neg:true,t:"Et distreus amb el soroll o amb els companys?",why:"Amb què et distreus més?",sug:['a_seient','a_espaiexam','a_sensorial']},
  {id:'q12',neg:true,t:"Se t'oblida què has de fer mentre ho estàs fent (instruccions de diversos passos)?",why:"Què faries per no perdre't?",sug:['a_guions','a_instr']}]},
 {id:'lle',t:'Llegir i escriure',qs:[
  {id:'q13',neg:true,t:"Quan llegeixes un text llarg, has de tornar-lo a llegir per entendre'l?",why:"Què et fa perdre el fil? Et cansa la vista?",sug:['a_tts','a_adaptats','a_anticipar']},
  {id:'q14',neg:true,t:"Escriure (a mà o a l'ordinador) et resulta feixuc o cansat?",why:"Què és el més difícil: pensar què escriure, l'ortografia o el moviment?",sug:['a_ordinador','a_dictat','a_temps']},
  {id:'q15',neg:true,t:"Fas faltes d'ortografia encara que sàpigues la regla?",why:"T'adones de les errades quan rellegeixes?",sug:['a_xuleta','a_ortog','a_ordinador']},
  {id:'q16',t:"Entens bé els enunciats dels exàmens?",why:"Què fas quan no ho tens clar?",sug:['a_enunciats','a_lectura']}]},
 {id:'mat',t:'Matemàtiques',qs:[
  {id:'q17',neg:true,t:"Et costa memoritzar taules, fórmules o passos de càlcul?",why:"Quines operacions o conceptes et costen més?",sug:['a_calc','a_guions']},
  {id:'q18',neg:true,t:"Entens els problemes però et perds en fer les operacions?",why:"Ho fas millor amb dibuixos o material?",sug:['a_calc','a_guions','a_temps']}]},
 {id:'exa',t:'Exàmens i estudi',qs:[
  {id:'q19',t:"Tens temps suficient per acabar els exàmens?",why:"Què et fa anar just de temps?",sug:['a_temps','a_fracc']},
  {id:'q20',neg:true,t:"Els nervis o el bloqueig t'afecten en els exàmens?",why:"Què notes al cos i què et passa pel cap?",sug:['a_autoinstr','a_espaiexam','a_oral']},
  {id:'q21',t:"Coneixes estratègies per estudiar (esquemes, resums…)?",why:"Com estudies un tema nou?",sug:['a_estudi']}]},
 {id:'emo',t:'Emocions i benestar',qs:[
  {id:'q22',neg:true,t:"Et costa calmar-te quan et frustres o t'enfades?",why:"Què et va bé per tranquil·litzar-te?",sug:['a_calma','a_autoinstr','a_referent']},
  {id:'q23',neg:true,t:"Et sents nerviós/a o preocupat/da amb freqüència?",why:"Quan passa? Ho has parlat amb algú?",sug:['a_referent','a_autoinstr']},
  {id:'q24',t:"Et sents recolzat/da pels companys i pel professorat?",why:"Amb qui et sents més còmode?",sug:['a_referent','a_mentor']},
  {id:'q25',neg:true,t:"Hi ha situacions del centre que et fan sentir malament (soroll, canvis d'horari, pati…)?",why:"Quines? Què et ajudaria?",sug:['a_sensorial','a_pati','a_social']}]},
 {id:'rel',t:'Relacions',qs:[
  {id:'q26',neutral:true,t:"Prefereixes treballar en grup que individualment? Per què?",why:"Quins rols et van millor en un grup?",sug:['a_agrup']},
  {id:'q27',neg:true,t:"Necessites el suport de l'adult (avisos, mirades…) per controlar-te?",why:"Quin tipus d'avís t'ajuda i quin t'incomoda?",sug:['a_referent','a_seient']},
  {id:'q28',t:"Acceptes opinions o maneres de treballar diferents de la teva?",why:"Què passa quan no estàs d'acord amb algú?",sug:['a_agrup','a_social']},
  {id:'q29',t:"Demanes ajuda als companys/es o al professorat si tens un dubte?",why:"Què et fa dubtar de demanar-la?",sug:['a_mentor','a_referent']},
  {id:'q30',t:"Tens amics amb qui et sents còmode al centre?",why:"Amb qui passes el pati?",sug:['a_pati','a_social']}]},
 {id:'fora',t:'Fora del centre',qs:[
  {id:'q31',t:"Tens un lloc i un moment tranquils per fer els deures a casa?",why:"Com és una tarda normal d'estudi?",sug:[]},
  {id:'q32',t:"Algú t'ajuda a casa amb els deures o l'estudi?",why:"Com us organitzeu a casa?",sug:['a_familia']},
  {id:'q33',t:"Tens accés a ordinador i a internet a casa?",why:"Què utilitzes per fer les tasques?",sug:[]}]},
 {id:'tan',t:'Per tancar',intro:'Deixa que l\'alumne/a proposi les seves pròpies solucions: és qui millor coneix què l\'ajuda.',qs:[
  {id:'o4',open:true,t:"Què creus que t'ajudaria més per anar millor a classe?"},
  {id:'o5',open:true,t:"Hi ha alguna cosa que t'agradaria que els professors sabessin o fessin diferent?"},
  {id:'o6',open:true,t:"Hi ha alguna altra cosa que vulguis explicar-me?"}]}
];
/* neteja suggeriments inexistents */
B.forEach(b=>b.qs.forEach(q=>{if(q.sug)q.sug=q.sug.filter(s=>CAT[s]);}));
export const QALL=[];B.forEach(b=>b.qs.forEach(q=>QALL.push(Object.assign({b:b.id},q))));

