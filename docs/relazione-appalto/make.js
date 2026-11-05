const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,ImageRun,Table,TableRow,TableCell,WidthType,ShadingType,AlignmentType,LevelFormat,BorderStyle,Footer,PageNumber,LineRuleType,PageBreak}=require('docx');
const L=400; // 20 pt esatti -> 35 righe per facciata
const sp={line:L,lineRule:LineRuleType.EXACT,before:0,after:0};
const BLUE="1F3A5F";
const R=(t,o={})=>new TextRun({text:t,font:"Arial",size:22,...o});
// testo con **grassetto**
const rich=(s,o={})=>s.split(/(\*\*[^*]+\*\*)/).filter(Boolean).map(p=>p.startsWith("**")?R(p.slice(2,-2),{bold:true,...o}):R(p,o));
const P=(s,o={})=>new Paragraph({spacing:sp,alignment:AlignmentType.JUSTIFIED,children:rich(s),...o});
const H=(t)=>new Paragraph({spacing:sp,keepNext:true,children:[R(t,{bold:true,color:BLUE,size:24})]});
const B=(s)=>new Paragraph({spacing:sp,alignment:AlignmentType.LEFT,numbering:{reference:"b",level:0},children:rich(s)});
const pb=()=>new Paragraph({spacing:sp,children:[new PageBreak()]});

const W=[2300,5538,1800]; // 9638 dxa = 17 cm
const bd={style:BorderStyle.SINGLE,size:4,color:"9DB3CC"};
const borders={top:bd,bottom:bd,left:bd,right:bd};
const cell=(s,w,o={})=>new TableCell({borders,width:{size:w,type:WidthType.DXA},margins:{top:0,bottom:0,left:70,right:70},
  shading:o.fill?{fill:o.fill,type:ShadingType.CLEAR,color:"auto"}:undefined,
  children:[new Paragraph({spacing:sp,alignment:o.align||AlignmentType.LEFT,children:rich(s,o.run||{})})]});
const row=(a,b,c)=>new TableRow({cantSplit:true,children:[cell(a,W[0],{fill:"EAF1F8"}),cell(b,W[1]),cell(c,W[2],{align:AlignmentType.CENTER})]});
const hdr=new TableRow({tableHeader:true,children:["Figura","Funzioni e responsabilità","Presenza"].map((t,i)=>cell("**"+t+"**",W[i],{fill:BLUE,run:{color:"FFFFFF"},align:AlignmentType.CENTER}))});
const rows=[
 ["**Direttore Tecnico di Cantiere**","Pieni poteri di conduzione dei lavori; referente unico di RUP, DL e CSE; pianifica e controlla tempi, costi e milestone PNRR; firma i SAL.","Giornaliera, sempre reperibile"],
 ["**Resp. C.A.M. e DNSH** (il DTC)","Verifica la conformità a DNSH e C.A.M.; sottopone alla DL le schede prodotto prima dell'impiego; attesta la conformità a ogni SAL.","A ogni fornitura e SAL"],
 ["**Capocantiere** (formato C.A.M.)","Programma lavorazioni, squadre e imprese; pianifica risorse, mezzi e forniture; controlla subappalti e regolarità contributiva; prepara i SAL.","Continua, a tempo pieno"],
 ["**Preposto** (formato C.A.M.)","Verifica i POS e la coerenza con il PSC; vigila sull'applicazione delle misure da parte di tutte le imprese; individua i rischi e aggiorna le procedure.","Continua, a tempo pieno"],
 ["**Caposquadra** (formato C.A.M.)","Guida le squadre interne; cura posa, materiali e rifiuti secondo i C.A.M.","Continua, a tempo pieno"],
 ["**BIM Team esterno** (UNI 11337)","BIM Manager e BIM Coordinator certificati ICMQ: attuano la relazione OT.4 e aggiornano il modello per DL e Committenza fino all'as-built.","Settimanale e su richiesta"],
 ["**Resp. Ufficio Acquisti**","Forniture conformi C.A.M. nei tempi del cronoprogramma; subappalti con imprese qualificate.","Settimanale e su chiamata"],
 ["**Resp. Contabilità Lavori**","Raccoglie misure e dati per gli atti contabili e i SAL; monitora l'andamento economico della commessa.","Settimanale e a ogni SAL"],
 ["**Resp. Rilievi e Tracciamenti**","Tracciamenti, rilievi e monitoraggi in tutte le fasi; rilievo georeferenziato di reti e sottoservizi prima della chiusura degli scavi.","In ogni fase di tracciamento"],
 ["**Resp. Amministrativo**","Rapporti con Committenza e fornitori; regolarità contributiva; pagamenti disposti dal DTC.","In sede, su chiamata"],
 ["**Squadre interne e imprese**","Opere edili con personale diretto; imprese OS28, OS30 e specializzate per pavimentazioni, finiture, copertura in legno, facciate e serramenti.","Secondo crono­programma"],
];
const table=new Table({width:{size:9638,type:WidthType.DXA},columnWidths:W,rows:[hdr,...rows.map(r=>row(...r))]});

const img=fs.readFileSync("organigramma.png");
const children=[
 new Paragraph({spacing:sp,alignment:AlignmentType.CENTER,children:[R("RELAZIONE TECNICA – STRUTTURA ORGANIZZATIVA DI CANTIERE",{bold:true,color:BLUE,size:26})]}),
 new Paragraph({spacing:sp,alignment:AlignmentType.CENTER,children:[R("Lavori di ampliamento del Centro di Sicurezza Autostradale di Bolzano",{italics:true})]}),
 H("1. Impostazione della struttura in relazione alla specificità dell'opera"),
 P("La struttura è dimensionata sulle caratteristiche dell'intervento: ampliamento di un edificio a servizio dell'infrastruttura autostradale, con opere edili, copertura in legno, facciate ventilate, finiture e impianti meccanici ed elettrici, finanziato dal **PNRR** e quindi soggetto ai principi **DNSH**, ai **Criteri Ambientali Minimi** e alla gestione informativa **BIM** prevista dalla relazione OT.4. Per questo l'organigramma affianca alla filiera tecnico-esecutiva tre presidi trasversali – **ambiente (C.A.M./DNSH), sicurezza e BIM** – facenti capo a un unico centro decisionale, il Direttore Tecnico di Cantiere."),
 H("2. Organigramma di cantiere"),
 new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:0,after:0},children:[new ImageRun({type:"png",data:img,transformation:{width:642,height:480},altText:{title:"Organigramma",description:"Organigramma della struttura di cantiere",name:"org"}})]}),
 P("La struttura si articola su **tre livelli**: direzione e interfaccia con la Stazione Appaltante (DTC); staff tecnico-amministrativo di supporto (acquisti, contabilità, rilievi, amministrazione); livello operativo-esecutivo (Capocantiere, Preposto, Caposquadra, squadre interne e imprese qualificate). Le linee tratteggiate indicano il coordinamento con RUP, DL, CSE e BIM Team."),
 pb(),
 H("3. Figure professionali, funzioni e presenza in cantiere"),
 P("Figure **tecniche** e **amministrative** previste, con compiti univoci e presenza garantita:"),
 table,
 pb(),
 H("4. Procedimenti decisionali"),
 P("Le decisioni sono assunte secondo deleghe definite e ogni passaggio è tracciato (verbali, giornale dei lavori, ambiente di condivisione dati BIM):"),
 B("**Livello direzionale – DTC:** decisioni con effetti su contratto, tempi, costi, sicurezza e conformità C.A.M./DNSH; è l'unico interlocutore formale di RUP, DL e CSE."),
 B("**Livello di coordinamento – Capocantiere con lo staff:** programmazione settimanale, risorse, forniture e subappalti entro budget e cronoprogramma approvati dal DTC."),
 B("**Livello operativo – Preposto, Caposquadra, imprese:** esecuzione e controllo quotidiano; il Preposto può sospendere subito le lavorazioni in caso di pericolo."),
 P("**Flussi principali:**"),
 B("**Ordini della DL e varianti:** DL → DTC → istruttoria con Capocantiere, Contabilità e BIM Team → riscontro scritto alla DL → attuazione."),
 B("**Materiali C.A.M.:** Acquisti propone → Resp. C.A.M. verifica schede e certificazioni → approvazione DL → ordine → controllo in accettazione."),
 B("**SAL:** misure di Capocantiere e Rilievi → Contabilità → verifica DTC con attestazione C.A.M./DNSH → trasmissione alla DL."),
 B("**Sicurezza:** CSE ↔ DTC e Preposto; verifica dei POS, aggiornamento delle procedure, eventuale sospensione."),
 B("**Modello BIM:** richiesta di DL o Committenza → BIM Coordinator → validazione BIM Manager → pubblicazione."),
 P("Una **riunione settimanale di coordinamento** (DTC, Capocantiere, Preposto, staff, BIM Team, imprese) verifica avanzamento, criticità e programma della settimana successiva."),
 H("5. Presenza in cantiere delle figure"),
 P("Capocantiere, Preposto e Caposquadra sono presenti **in modo continuativo** per tutta la durata delle lavorazioni; il DTC è presente **ogni giorno** ed è sempre reperibile; le figure di staff intervengono con cadenza programmata e a ogni fase rilevante (tracciamenti, SAL, forniture). In cantiere è sempre presente personale formato per **primo soccorso, antincendio e BLSD**; per ogni ruolo chiave è individuato un sostituto."),
 H("6. Qualificazione del personale"),
 P("DTC, Capocantiere, Preposto e Caposquadra possiedono l'**attestato di formazione C.A.M.** (Centrofor Trento – D.M. 256/2022, 197/2024, 281/2025); il **BIM Team è certificato ICMQ** secondo UNI 11337; le imprese impiantistiche sono **qualificate OS28 e OS30**."),
];
const doc=new Document({
 styles:{default:{document:{run:{font:"Arial",size:22}}}},
 numbering:{config:[{reference:"b",levels:[{level:0,format:LevelFormat.BULLET,text:"•",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:284,hanging:284}}}}]}]},
 sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:1417,bottom:1417,left:1134,right:1134,header:567,footer:567}}},
  footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[R("Pag. "),new TextRun({children:[PageNumber.CURRENT],font:"Arial",size:22}),R(" di 3")]})]})},
  children}]});
Packer.toBuffer(doc).then(b=>fs.writeFileSync("Relazione_Struttura_Organizzativa.docx",b));
