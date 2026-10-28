"use strict";
/* ============================================================
   MOTOR DE EXERCÍCIOS — Keila Chrischner
   5 módulos x 3 níveis, 123 exercícios
   ============================================================ */

/* ---------- teoria base ---------- */
var PC = ['Dó','Dó#','Ré','Ré#','Mi','Fá','Fá#','Sol','Sol#','Lá','Lá#','Si'];
function noteName(m){ return PC[((Math.round(m)%12)+12)%12]; }
function noteFull(m){ var r=Math.round(m); return noteName(r)+(Math.floor(r/12)-1); }
function midiToFreq(m){ return 440*Math.pow(2,(m-69)/12); }
function freqToMidi(f){ return 69+12*Math.log2(f/440); }
function rnd(n){ return Math.floor(Math.random()*n); }
function pick(a){ return a[rnd(a.length)]; }
function shuffle(a){
  var b=a.slice();
  for(var i=b.length-1;i>0;i--){ var j=rnd(i+1); var t=b[i]; b[i]=b[j]; b[j]=t; }
  return b;
}
function uniq(a){ var o=[]; for(var i=0;i<a.length;i++) if(o.indexOf(a[i])===-1) o.push(a[i]); return o; }
function median(arr){
  if(!arr.length) return 0;
  var a=arr.slice().sort(function(x,y){return x-y;});
  var m=Math.floor(a.length/2);
  return a.length%2 ? a[m] : (a[m-1]+a[m])/2;
}

var INTERVAL_NAME = {
  1:'2ª menor',2:'2ª maior',3:'3ª menor',4:'3ª maior',5:'4ª justa',
  6:'trítono',7:'5ª justa',8:'6ª menor',9:'6ª maior',10:'7ª menor',
  11:'7ª maior',12:'oitava'
};

/* ============================================================
   MÓDULO 1 — PERCEPÇÃO AUDITIVA
   ============================================================ */

/* nível iniciante: notas distantes, registro, quantidade */
function percepcaoIniciante(i){
  var tipo = i % 4;

  if(tipo === 0){
    /* nota isolada a partir do Dó */
    var alvo = pick([64,65,67,69,72]);   /* Mi4 .. Dó5 (saltos claros) */
    var erradas = shuffle([62,64,65,67,69,71,72]
      .map(noteName).filter(function(n){ return n !== noteName(alvo); }));
    return {
      modulo:'percepcao', nivel:'iniciante',
      prompt:'Primeiro o Dó de referência, depois a nota. Que nota é?',
      events:[{midis:[60],at:0,dur:.9},{midis:[alvo],at:1.2,dur:1.2}],
      options: shuffle(uniq([noteName(alvo)].concat(erradas.slice(0,3)))),
      correct: noteName(alvo),
      explain:'Era '+noteFull(alvo)+' — '+INTERVAL_NAME[alvo-60].toLowerCase()+' acima do Dó.'
    };
  }

  if(tipo === 1){
    /* registro: grave / médio / agudo */
    var t = pick([45,48,52,55,57,60,62,64,65,67,69,72,76,79,81]);
    var reg = t < 60 ? 'Grave' : (t < 72 ? 'Médio' : 'Agudo');
    return {
      modulo:'percepcao', nivel:'iniciante',
      prompt:'Ouça a nota. Está na região grave, média ou aguda?',
      events:[{midis:[t],at:0,dur:1.4}],
      options:['Grave','Médio','Agudo'],
      correct: reg,
      explain:'Era '+noteFull(t)+' — região '+reg.toLowerCase()+'. Até Si3 é grave, de Dó4 a Si4 é médio, de Dó5 pra cima é agudo.'
    };
  }

  if(tipo === 2){
    /* quantidade de notas no conjunto */
    var n = pick([2,3]);
    var root = pick([55,57,60,62]);
    var steps=[0,4,7];
    var midis=[];
    for(var k=0;k<n;k++) midis.push(root+steps[k]);
    return {
      modulo:'percepcao', nivel:'iniciante',
      prompt:'Quantas notas soaram juntas?',
      events:[{midis:midis,at:0,dur:1.5}],
      options:['2 notas','3 notas'],
      correct:n+' notas',
      explain:'Soaram '+n+' notas: '+midis.map(noteFull).join(', ')+'.'
    };
  }

  /* escala subindo ou descendo (só maior) */
  var asc = i % 8 < 6;
  var r2 = pick([55,57,60,62]);
  var offs=[0,2,4,5,7,9,11,12].map(function(o){return r2+o;});
  var seq = asc ? offs : offs.slice().reverse();
  return {
    modulo:'percepcao', nivel:'iniciante',
    prompt:'Ouça. A escala está subindo ou descendo?',
    events: seq.map(function(m,k){ return {midis:[m],at:k*0.4,dur:.55}; }),
    options:['Subindo','Descendo'],
    correct: asc?'Subindo':'Descendo',
    explain:'Era a escala maior de '+noteName(r2)+' '+(asc?'ascendente':'descendente')+'.'
  };
}

/* nível intermediário: intervalos, maior/menor, escalas variadas */
function percepcaoIntermediario(i){
  var tipo = i % 3;

  if(tipo === 0){
    /* tipo de acorde */
    var tipos=[{n:'Maior',o:[0,4,7]},{n:'Menor',o:[0,3,7]},{n:'Quinta aberta',o:[0,7]}];
    var tp=pick(tipos), rt=pick([55,57,60,62]);
    var ms=tp.o.map(function(o){return rt+o;});
    return {
      modulo:'percepcao', nivel:'intermediario',
      prompt:'Que tipo de conjunto você ouviu?',
      events:[{midis:ms,at:0,dur:1.5}],
      options:['Maior','Menor','Quinta aberta'],
      correct:tp.n,
      explain:'Acorde '+tp.n.toLowerCase()+' em '+noteName(rt)+'. Maior tem a 3ª maior (4 semitons), menor tem a 3ª menor (3 semitons).'
    };
  }

  if(tipo === 1){
    /* intervalo entre duas notas */
    var cand=[{s:2,n:'2ª maior'},{s:4,n:'3ª maior'},{s:7,n:'5ª justa'},{s:12,n:'Oitava'}];
    var al=pick(cand), r3=pick([57,60,62,64]);
    var dist=shuffle(cand.filter(function(c){return c.n!==al.n;})).slice(0,3).map(function(c){return c.n;});
    return {
      modulo:'percepcao', nivel:'intermediario',
      prompt:'Duas notas seguidas. Qual o intervalo?',
      events:[{midis:[r3],at:0,dur:.85},{midis:[r3+al.s],at:1.1,dur:1.2}],
      options: shuffle([al.n].concat(dist)),
      correct: al.n,
      explain:'De '+noteFull(r3)+' a '+noteFull(r3+al.s)+' são '+al.s+' semitons — '+al.n.toLowerCase()+'.'
    };
  }

  /* escala: maior ou menor natural */
  var asc=i%2===0;
  var nome=pick(['Maior','Menor natural']);
  var escalas={'Maior':[0,2,4,5,7,9,11,12],'Menor natural':[0,2,3,5,7,8,10,12]};
  var rt2=pick([57,60,62]);
  var sq=escalas[nome].map(function(o){return rt2+o;});
  if(!asc) sq=sq.reverse();
  return {
    modulo:'percepcao', nivel:'intermediario',
    prompt:'Que escala é essa?',
    events: sq.map(function(m,k){ return {midis:[m],at:k*.36,dur:.5}; }),
    options:['Maior','Menor natural'],
    correct:nome,
    explain:'Escala '+nome.toLowerCase()+' de '+noteName(rt2)+'. A menor natural tem a 3ª, 6ª e 7ª menores.'
  };
}

/* nível avançado: alteradas, trítono, 7ª, pentatônica */
function percepcaoAvancado(i){
  var tipo = i % 3;

  if(tipo === 0){
    /* notas alteradas */
    var alvo=pick([61,63,66,68,70,71]);
    var cor=noteName(alvo);
    var prox=[];
    for(var d=-2;d<=2;d++){
      var mm=alvo+d;
      if(mm!==alvo && mm>=59 && mm<=73) prox.push(noteName(mm));
    }
    prox=uniq(prox).filter(function(n){return n!==cor;});
    var outros=shuffle(prox).slice(0,3);
    while(outros.length<3){
      var cand2=shuffle([61,62,63,64,65,66,67,68,69,70,71].map(noteName))
        .filter(function(n){ return n!==cor && outros.indexOf(n)===-1; });
      outros=outros.concat(cand2.slice(0,3-outros.length));
    }
    var base=cor.indexOf('#')>-1?cor.replace('#',''):cor;
    return {
      modulo:'percepcao', nivel:'avancado',
      prompt:'Referência: Dó. Qual nota alterada você ouviu?',
      events:[{midis:[60],at:0,dur:.9},{midis:[alvo],at:1.2,dur:1.25}],
      options: shuffle([cor].concat(outros.slice(0,3))),
      correct: cor,
      explain: cor.indexOf('#')>-1
        ? 'Era '+noteFull(alvo)+' — meio tom acima de '+base+'.'
        : 'Era '+noteFull(alvo)+' — nota natural.'
    };
  }

  if(tipo === 1){
    /* intervalo difícil: 6ª, 7ª, trítono */
    var cand=[{s:5,n:'4ª justa'},{s:6,n:'trítono'},{s:9,n:'6ª maior'},{s:10,n:'7ª menor'},{s:11,n:'7ª maior'}];
    var al2=pick(cand), r4=pick([55,57,59,60]);
    var ds=shuffle(cand.filter(function(c){return c.n!==al2.n;})).slice(0,3).map(function(c){return c.n;});
    return {
      modulo:'percepcao', nivel:'avancado',
      prompt:'Qual o intervalo entre as duas notas?',
      events:[{midis:[r4],at:0,dur:.85},{midis:[r4+al2.s],at:1.1,dur:1.25}],
      options: shuffle([al2.n].concat(ds)),
      correct: al2.n,
      explain:'De '+noteFull(r4)+' a '+noteFull(r4+al2.s)+': '+al2.s+' semitons — '+al2.n.toLowerCase()+'.'
    };
  }

  /* pentatônica ou escala maior */
  var asc2=i%2===0;
  var nm=pick(['Pentatônica maior','Maior']);
  var es={'Pentatônica maior':[0,2,4,7,9,12],'Maior':[0,2,4,5,7,9,11,12]};
  var r5=pick([57,60,62,64]);
  var sq2=es[nm].map(function(o){return r5+o;});
  if(!asc2) sq2.reverse();
  return {
    modulo:'percepcao', nivel:'avancado',
    prompt:'Que escala você ouviu?',
    events: sq2.map(function(m,k){ return {midis:[m],at:k*.33,dur:.48}; }),
    options:['Pentatônica maior','Maior'],
    correct:nm,
    explain:'Escala '+nm.toLowerCase()+' de '+noteName(r5)+'. A pentatônica tem 5 notas — sem a 4ª e a 7ª.'
  };
}

/* ============================================================
   MÓDULO 2 — CANTO (microfone)
   ============================================================ */
function cantoIniciante(center, i){
  var alvo;
  if(i % 3 === 0){
    alvo = center;                                  /* a própria tônica */
  } else if(i % 3 === 1){
    alvo = center + pick([-2,-1,1,2]);              /* vizinhas */
  } else {
    alvo = center + pick([3,4]);                    /* um pouco acima */
  }
  return {
    modulo:'canto', nivel:'iniciante',
    tipo:'nota',
    prompt:'Cante a nota',
    hint:'Ouça e repita cantando com "á". Sustente até o fim.',
    refMidis:[alvo], refDur:1.1,
    alvo: alvo, tolerancia:70, recMs:4000
  };
}

function cantoIntermediario(center, i){
  if(i % 2 === 0){
    var alvo = center + pick([-5,-4,-3,3,4,5]);
    return {
      modulo:'canto', nivel:'intermediario',
      tipo:'nota',
      prompt:'Cante a nota',
      hint:'Salto maior — ouça com atenção antes de cantar.',
      refMidis:[alvo], refDur:1.0,
      alvo: alvo, tolerancia:55, recMs:4200
    };
  }
  /* intervalo: toca só a referência */
  var semi = pick([3,4,5]);
  var ref = center - 1;
  return {
    modulo:'canto', nivel:'intermediario',
    tipo:'nota',
    prompt:'Cante uma '+INTERVAL_NAME[semi]+' acima',
    hint:'Você ouve só a referência. Ache a nota pelo intervalo.',
    refMidis:[ref], refDur:1.1,
    alvo: ref + semi, tolerancia:55, recMs:4500
  };
}

function cantoAvancado(center, i){
  var alvoAv = center + pick([-6,-5,-4,-3,3,4,5,6]);
  return {
    modulo:'canto', nivel:'avancado',
    tipo:'nota',
    prompt:'Cante a nota com precisão',
    hint:'Faixa estreita: o erro é medido em cents, sem desconto.',
    refMidis:[alvoAv], refDur:0.95,
    alvo: alvoAv,
    tolerancia:40, recMs:4200
  };
}

/* eco melódico por nível */
function ecoIniciante(center, i){
  var n = 3;
  var notas=[center];
  for(var k=1;k<n;k++) notas.push(notas[k-1] + pick([-2,-1,1,2]));
  return {
    modulo:'canto', nivel:'iniciante', tipo:'eco',
    prompt:'Repita a frase cantando',
    hint:'Ouça as 3 notas e cante na mesma ordem, com "á".',
    seq:notas, tempo:0.52, refDur:0.42,
    tolerancia:70, recMs: n*1100+1600
  };
}
function ecoIntermediario(center, i){
  var n = 4;
  var notas=[center + pick([-2,-1,0,1,2])];
  for(var k=1;k<n;k++){
    var d = Math.random()<.5?-1:1;
    var p = pick([1,2,3,4]);
    var nx = notas[k-1] + d*p;
    if(nx < center-7) nx = notas[k-1] + p;
    if(nx > center+7) nx = notas[k-1] - p;
    notas.push(nx);
  }
  return {
    modulo:'canto', nivel:'intermediario', tipo:'eco',
    prompt:'Repita a frase cantando',
    hint:'Ouça as 4 notas e cante na mesma ordem.',
    seq:notas, tempo:0.46, refDur:0.36,
    tolerancia:55, recMs: n*1000+1800
  };
}
function ecoAvancado(center, i){
  var n = 6;
  var notas=[center + pick([-3,-2,-1,0,1,2,3])];
  for(var k=1;k<n;k++){
    var d = Math.random()<.5?-1:1;
    var p = pick([1,2,3,4,5,7]);
    var nx = notas[k-1] + d*p;
    if(nx < center-9) nx = notas[k-1] + p;
    if(nx > center+9) nx = notas[k-1] - p;
    if(nx < center-9) nx = center-9;
    if(nx > center+9) nx = center+9;
    notas.push(nx);
  }
  return {
    modulo:'canto', nivel:'avancado', tipo:'eco',
    prompt:'Repita a frase cantando',
    hint:'Frase longa de 6 notas. Afinação estreita.',
    seq:notas, tempo:0.4, refDur:0.32,
    tolerancia:45, recMs: n*950+1800
  };
}

/* ============================================================
   MÓDULO 3 — TEORIA MUSICAL (sem áudio, com áudio de apoio)
   ============================================================ */
function teoriaIniciante(i){
  var banco = [
    {p:'Quantos semitons tem um tom?', o:['1 semitom','2 semitons','3 semitons'], c:'2 semitons',
     e:'Um tom = 2 semitons. Meio tom = 1 semitom.', midis:[60,62]},
    {p:'Qual nota vem depois de Dó?', o:['Ré','Si','Mi'], c:'Ré',
     e:'A ordem natural é Dó, Ré, Mi, Fá, Sol, Lá, Si.', midis:[60,62]},
    {p:'Entre Mi e Fá existe semitom ou tom?', o:['Semitom','Tom','Tom e meio'], c:'Semitom',
     e:'Mi–Fá e Si–Dó são as únicas distâncias de semitom entre notas naturais.', midis:[64,65]},
    {p:'Quantas notas tem a escala maior?', o:['5','7','8'], c:'7',
     e:'São 7 notas (a 8ª é a repetição da primeira, uma oitava acima).', midis:[60,62,64,65,67,69,71]},
    {p:'Qual é a nota mais grave entre estas?', o:['Dó4','Dó3','Dó5'], c:'Dó3',
     e:'Quanto menor o número, mais grave. Dó3 é uma oitava abaixo de Dó4.', midis:[48,60,72]},
    {p:'O que é uma oitava?', o:['A mesma nota, mais aguda','Uma nota diferente','Um acorde'], c:'A mesma nota, mais aguda',
     e:'A oitava é a mesma nota numa frequência dobrada — soa igual, mas mais aguda.', midis:[60,72]},
    {p:'Qual destas é uma nota natural?', o:['Dó#','Fá','Sol#'], c:'Fá',
     e:'Naturais são Dó, Ré, Mi, Fá, Sol, Lá, Si. As com # são alteradas.', midis:[65]},
    {p:'Se você sobe 1 semitom de Dó, chega em?', o:['Ré','Dó#','Si'], c:'Dó#',
     e:'Dó + 1 semitom = Dó#.', midis:[61]},
    {p:'Quantas notas tem uma pentatônica?', o:['5','7','12'], c:'5',
     e:'"Penta" = cinco. A pentatônica usa 5 notas por oitava.', midis:[60,62,64,67,69]},
    {p:'O que significa "a cappella"?', o:['Cantar sem instrumentos','Cantar forte','Cantar em coro'], c:'Cantar sem instrumentos',
     e:'A cappella é cantar só com a voz, sem acompanhamento instrumental.'}
  ];
  var q = banco[i % banco.length];
  return {
    modulo:'teoria', nivel:'iniciante',
    prompt:q.p, options:shuffle(q.o.slice()), correct:q.c, explain:q.e,
    events: q.midis ? [{midis:q.midis, at:0, dur:1.1}] : [],
    temAudio: !!q.midis
  };
}

function teoriaIntermediario(i){
  var banco = [
    {p:'Qual a diferença entre acorde maior e menor?', o:['A 3ª (maior x menor)','A 5ª','O número de notas'], c:'A 3ª (maior x menor)',
     e:'O maior tem 3ª maior (4 semitons); o menor tem 3ª menor (3 semitons). A 5ª é justa nos dois.', midis:[60,64,67]},
    {p:'O que é um intervalo de 5ª justa?', o:['7 semitons','5 semitons','12 semitons'], c:'7 semitons',
     e:'A 5ª justa tem 7 semitons — é o intervalo mais estável depois da oitava.', midis:[60,67]},
    {p:'Qual escala tem a 3ª, 6ª e 7ª menores?', o:['Menor natural','Maior','Pentatônica'], c:'Menor natural',
     e:'A menor natural abaixa 3ª, 6ª e 7ª em relação à maior.', midis:[60,62,63,65,67,68,70]},
    {p:'O que é o trítono?', o:['6 semitons','4 semitons','7 semitons'], c:'6 semitons',
     e:'Trítono = 3 tons = 6 semitons. É instável e pede resolução.', midis:[60,66]},
    {p:'Tonalidade de Sol maior tem quantos sustenidos?', o:['1 (Fá#)','2','0'], c:'1 (Fá#)',
     e:'Sol maior tem só o Fá#. A ordem dos sustenidos é Fá, Dó, Sol, Ré, Lá, Mi, Si.', midis:[67,71]},
    {p:'O que é tessitura?', o:['Região onde a voz rende melhor','Volume máximo','Tipo de voz'], c:'Região onde a voz rende melhor',
     e:'Tessitura é a faixa onde sua voz soa confortável e com qualidade — diferente de extensão total.'},
    {p:'Qual é a progressão I–V–vi–IV em Dó?', o:['Dó–Sol–Lá menor–Fá','Dó–Fá–Sol–Lá','Dó–Ré–Mi–Fá'], c:'Dó–Sol–Lá menor–Fá',
     e:'É a progressão mais comum da música pop: Dó, Sol, Lá menor, Fá.', midis:[60,67,69,65]},
    {p:'O que faz um acorde de 7ª?', o:['Acrescenta instabilidade','Deixa mais estável','Muda a tonalidade'], c:'Acrescenta instabilidade',
     e:'A 7ª cria tensão que pede resolução — muito usada em dominantes.', midis:[60,64,67,70]},
    {p:'Semitom é a menor distância entre duas notas no piano?', o:['Sim','Não, existe menor','Só em escalas menores'], c:'Sim',
     e:'No sistema temperado, o semitom é a menor distância entre teclas vizinhas.', midis:[60,61]},
    {p:'O que é modulação?', o:['Mudar de tonalidade','Mudar o ritmo','Mudar o volume'], c:'Mudar de tonalidade',
     e:'Modular é passar de uma tonalidade para outra durante a música.', midis:[60,65]}
  ];
  var q = banco[i % banco.length];
  return {
    modulo:'teoria', nivel:'intermediario',
    prompt:q.p, options:shuffle(q.o.slice()), correct:q.c, explain:q.e,
    events: q.midis ? [{midis:q.midis, at:0, dur:1.2}] : [],
    temAudio: !!q.midis
  };
}

function teoriaAvancado(i){
  var banco = [
    {p:'Qual é o relativo menor de Dó maior?', o:['Lá menor','Mi menor','Sol menor'], c:'Lá menor',
     e:'O relativo menor está uma 3ª menor abaixo: Dó maior → Lá menor (mesmas notas).', midis:[60,69]},
    {p:'O que é uma cadência autêntica?', o:['V → I','I → V','IV → I'], c:'V → I',
     e:'Autêntica é a resolução do dominante na tônica (V–I): conclusão forte.', midis:[67,60]},
    {p:'Quantos bemóis tem Fá maior?', o:['1 (Si♭)','2','0'], c:'1 (Si♭)',
     e:'Fá maior tem só o Si♭. Ordem dos bemóis: Si, Mi, Lá, Ré, Sol, Dó, Fá.', midis:[65,70]},
    {p:'O que é contraponto?', o:['Melodias simultâneas independentes','Um acorde só','Ritmo livre'], c:'Melodias simultâneas independentes',
     e:'Contraponto é a arte de combinar linhas melódicas que mantêm independência.'},
    {p:'Qual intervalo é mais dissonante?', o:['Trítono','5ª justa','Oitava'], c:'Trítono',
     e:'O trítono é o mais instável dos intervalos comuns — pede resolução.'},
    {p:'O que é divisão vocal (divisi)?', o:['Dividir uma voz em duas ou mais','Cantar mais forte','Mudar de tom'], c:'Dividir uma voz em duas ou mais',
     e:'Divisi é quando uma mesma nape (ex: sopranos) se divide em soprano 1 e 2.', midis:[60,64,67]},
    {p:'Qual a função do dominante (V)?', o:['Criar tensão para resolver na tônica','Concluir a música','Estabilizar'], c:'Criar tensão para resolver na tônica',
     e:'O V grau gera tensão que naturalmente resolve no I.', midis:[67,60]},
    {p:'O que é uma sexta napolitana?', o:['Acorde de ♭II na 1ª inversão','Um tipo de voz','Uma escala'], c:'Acorde de ♭II na 1ª inversão',
     e:'É o acorde do 2º grau rebaixado, usado em primeira inversão — cor dramática.'},
    {p:'Forma ternária é?', o:['A–B–A','A–B','A–A–B'], c:'A–B–A',
     e:'Ternária = A–B–A: apresenta, contrasta e retorna.'},
    {p:'O que é appoggiatura?', o:['Nota de apoio que resolve por grau conjunto','Um ornamento rápido','Um acorde'], c:'Nota de apoio que resolve por grau conjunto',
     e:'É uma nota estranha que atrasa a nota real e resolve por grau conjunto.'}
  ];
  var q = banco[i % banco.length];
  return {
    modulo:'teoria', nivel:'avancado',
    prompt:q.p, options:shuffle(q.o.slice()), correct:q.c, explain:q.e,
    events: q.midis ? [{midis:q.midis, at:0, dur:1.3}] : [],
    temAudio: !!q.midis
  };
}

/* ============================================================
   MÓDULO 4 — TÉCNICA E VOCALIZES (instrução guiada)
   ============================================================ */
var TECNICA = {
  iniciante: [
    {t:'Respiração diafragmática', d:'Deitado ou sentado, mão na barriga. Inspire em 4 tempos sentindo a barriga subir, segure 2, solte em 6. Repita 5 vezes sem levantar os ombros.',
     e:'Se os ombros sobem, a respiração é alta e curta. Apoio vem da expansão da base das costelas e do abdômen.'},
    {t:'Sopro controlado', d:'Inspire fundo e solte o ar num "ssss" contínuo, o mais longo e estável que conseguir. Cronometre. Repita 3 vezes.',
     e:'O "ssss" treina a saída de ar sem tensão. Meta: 20 a 30 segundos com som uniforme do início ao fim.'},
    {t:'Boca e mandíbula relaxadas', d:'Massageie a mandíbula em círculos, abra e feche a boca sem forçar, gire a língua dentro da boca. 30 segundos cada.',
     e:'Mandíbula travada fecha o som e cansa a garganta. Relaxar aqui já muda o timbre.'},
    {t:'Vocalize: "m" (humming)', d:'Boca fechada, lábios soltos, produza um "mmm" confortável. Sinta vibrar na região do nariz e dos lábios. 30 segundos na sua nota confortável.',
     e:'O humming aquece sem esforço e mostra se há tensão na garganta — o som deve vibrar, não raspar.'},
    {t:'Vocalize: 5 notas subindo e descendo', d:'Cante "a" em 5 notas seguidas subindo e descendo (Dó–Ré–Mi–Fá–Sol–Fá–Mi–Ré–Dó). Devagar, sem empurrar.',
     e:'Este é o vocalize mais básico: articula a voz sem exigir extremos. Faça na região confortável.'},
    {t:'Articulação com trava-língua', d:'Diga "três pratos de trigo para três tigres tristes" 3 vezes, aumentando a velocidade sem perder a clareza.',
     e:'Articulação clara não é cantar mais forte — é mover bem língua e lábios.'},
    {t:'Desaquecimento suave', d:'Ao terminar de cantar, faça um humming baixinho e depois fale normalmente por 2 minutos. Não sussurre.',
     e:'Sussurrar força mais que falar. Desaquecer evita que a voz fique "pesada" no dia seguinte.'}
  ],
  intermediario: [
    {t:'Apoio diafragmático em nota longa', d:'Cante uma nota confortável com "á" e sustente 12 a 15 segundos, mantendo o som igual do início ao fim. Repita 3 vezes.',
     e:'O erro mais comum é começar forte e ir enfraquecendo. A meta é o volume constante.'},
    {t:'Vocalize: arpejo maior', d:'Cante Dó–Mi–Sol–Mi–Dó com "a", subindo meio tom a cada repetição. Pare quando sentir esforço.',
     e:'O arpejo treina saltos de 3ª e 5ª. Não force o topo — se apertar, desça meio tom.'},
    {t:'Staccato e legato', d:'Na mesma nota, cante 4 staccatos curtos ("a-a-a-a") e depois um legato longo. Repita em 3 notas diferentes.',
     e:'Staccato ativa o apoio rápido; legato trabalha a continuidade. Os dois juntos dão controle.'},
    {t:'Ressonância: "nhô"', d:'Cante "nhô" numa nota confortável, buscando som mais à frente, na região do nariz e bochechas.',
     e:'"Nhô" projeta o som sem empurrar. Se sentir cócegas no nariz, está no caminho.'},
    {t:'Afinação com referência', d:'Toque uma nota no piano ou no jogo, cante, e confira. Repita em 5 notas diferentes, uma a uma.',
     e:'Cantar junto é mais fácil que cantar sozinho. Aqui você treina tirar a referência.'},
    {t:'Dinâmica: piano e forte', d:'Cante a mesma frase bem baixinho e depois mais forte, mantendo a afinação e o apoio nos dois.',
     e:'Forte sem apoio vira grito; piano sem apoio desafina. O controle é o que muda.'},
    {t:'Aquecimento antes de cantar', d:'5 minutos: humming, 5 notas, arpejo leve e um trava-língua. Sempre antes de ensaiar ou ministrar.',
     e:'Aquecer não é aquecer só a garganta: é preparar respiração, articulação e ressonância juntas.'}
  ],
  avancado: [
    {t:'Sustain longo com crescendo e decrescendo', d:'Sustente uma nota 15 segundos fazendo crescendo e decrescendo suave, sem mexer o volume bruscamente.',
     e:'Este é o exercício que separa controle de força. O ar precisa ser constante o tempo todo.'},
    {t:'Vocalize: arpejo de 7ª', d:'Cante Dó–Mi–Sol–Si–Sol–Mi–Dó com "a", descendo meio tom quando apertar.',
     e:'A 7ª exige espaço e apoio. Se o som ficar estrangulado, a laringe subiu — desça o tom.'},
    {t:'Messa di voce em duas oitavas', d:'Escolha a nota mais confortável e faça crescendo/decrescendo; depois repita uma oitava acima.',
     e:'Comparar as duas oitavas mostra onde o apoio falha. O topo nunca deve ser mais apertado.'},
    {t:'Passagem de registro (voz cheia x falsete)', d:'Suba uma escala lenta e atravesse a passagem sem "quebrar" o som, misturando as ressonâncias.',
     e:'A quebra acontece por falta de apoio no ponto de transição, não por falta de força.'},
    {t:'Divisão vocal em duas vozes', d:'Grave uma voz cantando a melodia, depois cante a segunda voz por cima, ouvindo a primeira.',
     e:'Divisi é o coração do canto em grupo. Comece com intervalos de 3ª e 6ª.'},
    {t:'Afinação sem referência (ouvido interno)', d:'Ouça uma nota, fique em silêncio, conte até 3 e cante a mesma nota. Confira no jogo.',
     e:'Este é o teste real de ouvido interno: manter a altura na memória sem apoio sonoro.'},
    {t:'Rotina de palco (pré e pós)', d:'Antes: 10 min de aquecimento + respiração. Depois: desaquecimento e hidratação, sem falar alto por 30 min.',
     e:'A voz que dura anos é a que tem rotina, não a que tem talento só.'}
  ]
};

function tecnicaEx(nivel, i){
  var arr = TECNICA[nivel];
  var item = arr[i % arr.length];
  return {
    modulo:'tecnica', nivel:nivel,
    tipo:'guiado',
    prompt:item.t,
    hint:item.d,
    explain:item.e,
    temAudio:false
  };
}

/* ============================================================
   MÓDULO 5 — ROTINA E SAÚDE VOCAL
   ============================================================ */
var ROTINA = {
  iniciante: [
    {t:'Aquecimento de 5 minutos', d:'Humming (1 min), 5 notas subindo e descendo (2 min), trava-língua (1 min), respiração (1 min).',
     e:'Aquecer a voz é como alongar antes do exercício: evita lesão e melhora o rendimento.'},
    {t:'Hidratação ao longo do dia', d:'Beba água em pequenas quantidades várias vezes ao dia. Não espere a sede chegar.',
     e:'As pregas vocais vibram melhor hidratadas. Água em temperatura ambiente é a mais indicada.'},
    {t:'Evitar pigarro', d:'Quando sentir vontade de raspar a garganta, engula saliva ou beba água em vez de pigarrear.',
     e:'Pigarrear bate as pregas uma contra a outra com força — repetido, machuca.'},
    {t:'Não sussurrar para "poupar" a voz', d:'Se estiver rouco, fale pouco e em volume normal. Evite sussurrar.',
     e:'Sussurrar exige mais esforço que falar baixo normalmente.'},
    {t:'Ambiente e umidade', d:'Cante em lugar ventilado. Ar-condicionado muito seco resseca a garganta — use um copo de água por perto.',
     e:'Ambiente seco aumenta o atrito das pregas vocais.'},
    {t:'Aquecimento antes de ministrar', d:'Antes de aula ou louvor, faça 5 minutos de aquecimento mesmo se já cantou de manhã.',
     e:'A voz "esfria" depois de horas sem uso. Aquecer de novo protege.'},
    {t:'Sono e voz', d:'Dormir mal deixa a voz mais rouca e o apoio pior. Tente manter horário regular nas vésperas de cantar.',
     e:'A fadiga aparece primeiro na voz — rouquidão sem gripe muitas vezes é sono.'}
  ],
  intermediario: [
    {t:'Sinal de alerta: rouquidão por 15 dias', d:'Rouquidão que passa de 15 dias precisa de avaliação médica, mesmo sem dor.',
     e:'A maior parte é benigna, mas persistência merece avaliação com otorrino ou fonoaudiólogo.'},
    {t:'Apoio x dor de garganta', d:'Dor ao cantar nota aguda quase sempre é técnica, não doença: falta de apoio ou laringe alta.',
     e:'Dor aguda pontual melhora quando você desce o tom e melhora o apoio.'},
    {t:'Aquecimento x desaquecimento', d:'Aqueça antes e desaqueça depois (humming baixo + fala normal). Nunca termine num agudo e pare.',
     e:'Terminar em nota alta deixa a musculatura tensa por horas.'},
    {t:'Cafeína e álcool antes de cantar', d:'Evite café em excesso e álcool antes de cantar: os dois ressecam e reduzem o controle.',
     e:'Álcool também diminui a percepção de esforço — você força sem sentir.'},
    {t:'Aquecimento em dia de show', d:'Faça o aquecimento completo 20 min antes e um leve 5 min antes de subir.',
     e:'Aquecer cedo demais esfria. O ideal é um aquecimento principal e um retoque perto da hora.'},
    {t:'Postura ao cantar', d:'Em pé, pés paralelos, ombros soltos, queixo nivelado. Não trave os joelhos.',
     e:'Postura travada limita a expansão das costelas e o apoio.'},
    {t:'Corrigir sem constranger', d:'Ao corrigir um aluno, aponte o ajuste técnico e demonstre. Nunca comente o corpo da pessoa.',
     e:'Aluno que se sente julgado canta com mais tensão — o oposto do que se quer.'}
  ],
  avancado: [
    {t:'Carga vocal semanal', d:'Conte as horas de canto por semana incluindo aulas, ensaios e cultos. Acima de 15h exige pausas planejadas.',
     e:'Carga alta sem pausa é a principal causa de lesão em quem canta profissionalmente.'},
    {t:'Pausa vocal planejada', d:'Um dia por semana com uso mínimo de voz (fala normal, sem canto) ajuda a recuperar.',
     e:'Recuperação é parte do treino. Atleta descansa; cantor também precisa.'},
    {t:'Monitoramento de sinais', d:'Anote rouquidão, cansaço ao falar, perda de agudo e dor. Padrão repetido é sinal de ajuste.',
     e:'Sinais pequenos e repetidos precedem quase toda lesão.'},
    {t:'Retorno após resfriado', d:'Volte cantando pouco e em região confortável. Não teste o agudo no primeiro dia.',
     e:'A mucosa ainda está inflamada mesmo depois que os sintomas somem.'},
    {t:'Aquecimento específico por repertório', d:'Antes de cantar algo com agudo, aqueça incluindo notas próximas ao agudo da música.',
     e:'Aquecer só no médio não prepara para o que a música exige.'},
    {t:'Ergonomia do microfone', d:'Mantenha o microfone a um palmo da boca, levemente de lado. Nunca cantar apontando para a caixa.',
     e:'Microfone longe força a voz; perto demais estoura e fecha o som.'},
    {t:'Registro profissional', d:'Guarde gravações de referência de tempos em tempos. Ajuda a detectar mudanças reais na voz.',
     e:'Percepção subjetiva engana. Comparar gravações mostra a evolução e sinais de fadiga.'}
  ]
};

function rotinaEx(nivel, i){
  var arr = ROTINA[nivel];
  var item = arr[i % arr.length];
  return {
    modulo:'rotina', nivel:nivel,
    tipo:'guiado',
    prompt:item.t,
    hint:item.d,
    explain:item.e,
    temAudio:false
  };
}

/* ============================================================
   MONTAGEM DOS TREINOS
   ============================================================ */
var NIVEIS = ['iniciante','intermediario','avancado'];

var CONTAGEM = {
  percepcao:{iniciante:10, intermediario:10, avancado:10},
  canto:{iniciante:7, intermediario:7, avancado:7},
  teoria:{iniciante:10, intermediario:10, avancado:10},
  tecnica:{iniciante:7, intermediario:7, avancado:7},
  rotina:{iniciante:7, intermediario:7, avancado:7}
};

var PERCEPCAO_FN = {iniciante:percepcaoIniciante, intermediario:percepcaoIntermediario, avancado:percepcaoAvancado};
var TEORIA_FN = {iniciante:teoriaIniciante, intermediario:teoriaIntermediario, avancado:teoriaAvancado};
var CANTO_FN = {iniciante:cantoIniciante, intermediario:cantoIntermediario, avancado:cantoAvancado};
var ECO_FN = {iniciante:ecoIniciante, intermediario:ecoIntermediario, avancado:ecoAvancado};

/* monta uma lista de exercícios; mod === 'tudo' pega os 5 módulos */
function montarTreino(modulo, nivel, center){
  var q = [];
  var level = nivel || 'iniciante';

  function addPercepcao(){
    var n = CONTAGEM.percepcao[level];
    for(var i=0;i<n;i++) q.push(PERCEPCAO_FN[level](i));
  }
  function addTeoria(){
    var n = CONTAGEM.teoria[level];
    for(var i=0;i<n;i++) q.push(TEORIA_FN[level](i));
  }
  function addCanto(){
    var nC = level==='iniciante'?5:(level==='intermediario'?4:4);
    var nE = level==='iniciante'?2:(level==='intermediario'?3:3);
    for(var i=0;i<nC;i++) q.push(CANTO_FN[level](center||60, i));
    for(var j=0;j<nE;j++) q.push(ECO_FN[level](center||60, j));
  }
  function addTecnica(){ var n=CONTAGEM.tecnica[level]; for(var i=0;i<n;i++) q.push(tecnicaEx(level,i)); }
  function addRotina(){ var n=CONTAGEM.rotina[level]; for(var i=0;i<n;i++) q.push(rotinaEx(level,i)); }

  if(modulo === 'tudo' || modulo === 'percepcao') addPercepcao();
  if(modulo === 'tudo' || modulo === 'teoria') addTeoria();
  if(modulo === 'tudo' || modulo === 'canto') addCanto();
  if(modulo === 'tudo' || modulo === 'tecnica') addTecnica();
  if(modulo === 'tudo' || modulo === 'rotina') addRotina();

  return (modulo === 'tudo') ? shuffle(q) : q;
}

/* teste de nivelamento: 9 perguntas, retorna nivel sugerido */
var TESTE = [
  {p:'Você identifica uma nota ouvindo só o Dó como referência?', opts:[['Não, ainda não',0],['Às vezes',1],['Sim, com segurança',2]]},
  {p:'Você distingue um acorde maior de um menor?', opts:[['Não',0],['Às vezes',1],['Sim',2]]},
  {p:'Você canta afinado sem acompanhamento?', opts:[['Não',0],['Mais ou menos',1],['Sim',2]]},
  {p:'Sabe o que é semitom e tom?', opts:[['Não',0],['Já ouvi falar',1],['Sei bem',2]]},
  {p:'Você sustenta uma nota 10 segundos sem perder o som?', opts:[['Não',0],['Consigo, mas cai',1],['Sim, firme',2]]},
  {p:'Já fez exercícios de respiração diafragmática?', opts:[['Nunca',0],['Poucas vezes',1],['Faço sempre',2]]},
  {p:'Você aquece a voz antes de cantar?', opts:[['Nunca',0],['Às vezes',1],['Sempre',2]]},
  {p:'Conhece sua tessitura (onde sua voz rende melhor)?', opts:[['Não',0],['Tenho ideia',1],['Sei exatamente',2]]},
  {p:'Você canta em duas vozes (divisão) em grupo?', opts:[['Não',0],['Já tentei',1],['Canto com frequência',2]]}
];

function calcularNivel(respostas){
  var soma = respostas.reduce(function(a,b){ return a + (b||0); }, 0);
  var max = TESTE.length * 2;
  var pct = soma / max;
  if(pct < 0.4) return 'iniciante';
  if(pct < 0.75) return 'intermediario';
  return 'avancado';
}
