/* =========================================================================
   English Class · Biblioteca virtual — aplicación (JavaScript puro)
   Funciona en GitHub Pages. Se conecta a Firebase (Firestore + Auth).
   Si aún no pegas tu configuración en config.js, corre en MODO DEMO.
   ========================================================================= */

/* ---------- 0. Firebase (con respaldo a modo demo) ---------- */
var DB = null, AUTH = null, DEMO = true;
(function initFirebase () {
  var c = window.FIREBASE_CONFIG || {};
  var ok = c.projectId && String(c.projectId).indexOf('PEGA') === -1;
  if (ok && window.firebase) {
    try {
      firebase.initializeApp(c);
      DB = firebase.firestore();
      AUTH = firebase.auth();
      DEMO = false;
    } catch (e) { console.warn('Firebase no inició, modo demo:', e); DEMO = true; }
  }
})();

/* ---------- 1. Datos de referencia ---------- */
var SUBJECTS = {
  grammar:   { name:'Grammar',    es:'Gramática',    color:'#8b7bf0', light:'#f0ecff', count:28, pct:70 },
  vocab:     { name:'Vocabulary', es:'Vocabulario',  color:'#17b4a6', light:'#e6faf7', count:34, pct:85 },
  reading:   { name:'Reading',    es:'Lectura',      color:'#ff8a4c', light:'#fff2e8', count:19, pct:48 },
  listening: { name:'Listening',  es:'Escucha',      color:'#46a7ff', light:'#eaf5ff', count:22, pct:55 },
  speaking:  { name:'Speaking',   es:'Conversación', color:'#ff6f9c', light:'#ffeef4', count:11, pct:30 },
  writing:   { name:'Writing',    es:'Escritura',    color:'#35c07a', light:'#eafaf1', count:14, pct:40 }
};
var SUBJ_ORDER = ['grammar','vocab','reading','listening','speaking','writing'];
var TYPES = {
  PDF:   { color:'#e5573c', light:'#fff1ee' },
  Audio: { color:'#7c6cf0', light:'#f3f0ff' },
  Video: { color:'#2f8ce0', light:'#eaf5ff' },
  Doc:   { color:'#2aa464', light:'#eafaf1' }
};

/* material de ejemplo (modo demo o mientras carga) */
function seed () {
  var id = 0, R = function (title, subject, type, dl, link) {
    return { id:'demo'+(++id), title:title, subject:subject, type:type, dl:dl, link:link||'' };
  };
  return [
    R('Present Perfect: guía completa','grammar','PDF',true),
    R('Conditionals explained','grammar','Video',false,'https://www.youtube.com/embed/videoseries'),
    R('Modal verbs — worksheet','grammar','Doc',true),
    R('Irregular verbs (audio drill)','grammar','Audio',false),
    R('Reported speech — rules','grammar','PDF',true),
    R('Vocabulary: Travel & Tourism','vocab','Audio',false),
    R('Phrasal verbs list B1','vocab','PDF',true),
    R('Food & cooking flashcards','vocab','Doc',true),
    R('"A Cup of Tea" — short story','reading','Doc',true),
    R('News article + questions','reading','PDF',true),
    R('Reading strategies','reading','Video',false,'https://www.youtube.com/embed/videoseries'),
    R('Vocabulary in context','reading','PDF',true),
    R('Job Interview — B1','listening','Video',false,'https://www.youtube.com/embed/videoseries'),
    R('Everyday conversations','listening','Audio',false),
    R('Numbers & dates dictation','listening','Audio',true),
    R('Listening exam practice','listening','PDF',true),
    R('Making introductions','speaking','Video',false,'https://www.youtube.com/embed/videoseries'),
    R('Pronunciation: /th/ sound','speaking','Audio',false),
    R('Opinion essay — model','writing','Doc',true),
    R('Punctuation guide','writing','PDF',true)
  ];
}

/* ---------- 2. Textos ES / EN ---------- */
var STR = {
  es: {
    nav_home:'Inicio', nav_subjects:'Materias', admin:'Entrar (Admin)',
    mascot:'¡Hola! Soy Bigotes, tu guía', hero_title:'¿Qué aprendemos hoy?',
    hero_sub:'Toda tu biblioteca de inglés para bachillerato en un solo lugar: PDFs, audios, vídeos y documentos, organizados por materia.',
    cta:'Explorar materias', stat_res:'recursos', stat_subj:'materias',
    subjects:'Materias', subjects_hint:'Elige una para empezar', materials:'recursos',
    recent:'Recién agregado', view:'Ver', watch:'Ver vídeo', listen:'Escuchar', download:'Descargar',
    back:'Volver', all:'Todos', dlable:'descargable', empty:'Aún no hay material en esta materia.',
    login_title:'Panel de administración', login_sub:'Solo Teacher Azul puede subir material.',
    email:'Correo', password:'Contraseña', enter:'Entrar',
    demo_note:'Modo demo: escribe cualquier cosa y entra.', bad_login:'Correo o contraseña incorrectos.',
    add_title:'Agregar recurso', add_sub:'Pega el enlace de Drive o YouTube.',
    f_title:'Título', f_title_ph:'Ej. Present Perfect: guía', f_subject:'Materia', f_type:'Tipo',
    f_link:'Enlace (Drive / YouTube)', f_link_ph:'https://…', f_dl:'Permitir descarga', add_btn:'Agregar a la biblioteca',
    manage:'Material publicado', logout:'Salir',
    c_title:'Título', c_subject:'Materia', c_type:'Tipo', c_dl:'Descarga', yes:'Sí', del:'Eliminar',
    tip:'Los vídeos van a YouTube (embebidos) y los PDF/audios/docs a Google Drive con enlace público. Aquí solo guardas el enlace: nunca te quedas sin espacio y todo sigue gratis.',
    open_new:'Abrir en pestaña nueva', no_link:'Este recurso todavía no tiene enlace. Agrégalo desde el panel.',
    demo_badge:'MODO DEMO · conecta Firebase en config.js'
  },
  en: {
    nav_home:'Home', nav_subjects:'Subjects', admin:'Log in (Admin)',
    mascot:'Hi! I\u2019m Whiskers, your guide', hero_title:'What shall we learn today?',
    hero_sub:'Your whole high-school English library in one place: PDFs, audio, videos and documents, organized by subject.',
    cta:'Explore subjects', stat_res:'resources', stat_subj:'subjects',
    subjects:'Subjects', subjects_hint:'Pick one to start', materials:'resources',
    recent:'Recently added', view:'View', watch:'Watch', listen:'Listen', download:'Download',
    back:'Back', all:'All', dlable:'downloadable', empty:'No material in this subject yet.',
    login_title:'Admin panel', login_sub:'Only Teacher Azul can upload material.',
    email:'Email', password:'Password', enter:'Log in',
    demo_note:'Demo mode: type anything and log in.', bad_login:'Wrong email or password.',
    add_title:'Add resource', add_sub:'Paste the Drive or YouTube link.',
    f_title:'Title', f_title_ph:'e.g. Present Perfect: guide', f_subject:'Subject', f_type:'Type',
    f_link:'Link (Drive / YouTube)', f_link_ph:'https://…', f_dl:'Allow download', add_btn:'Add to library',
    manage:'Published material', logout:'Log out',
    c_title:'Title', c_subject:'Subject', c_type:'Type', c_dl:'Download', yes:'Yes', del:'Delete',
    tip:'Videos live on YouTube (embedded) and PDFs/audio/docs on Google Drive with a public link. Here you only store the link: you never run out of space and it stays free.',
    open_new:'Open in new tab', no_link:'This resource has no link yet. Add it from the panel.',
    demo_badge:'DEMO MODE · connect Firebase in config.js'
  }
};

/* ---------- 3. Estado ---------- */
var S = {
  lang: localStorage.getItem('ec_lang') || 'es',
  view: 'home', subject: 'grammar', filter: 'all',
  authed: false, resources: seed(), loaded: false,
  fDl: true, loginErr: ''
};
function t () { return STR[S.lang]; }

/* ---------- 4. Iconos (SVG) ---------- */
function svg (paths, stroke, size, extra) {
  return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="'+stroke+
    '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+paths+(extra||'')+'</svg>';
}
function subjIcon (key, stroke, size) {
  var P = {
    grammar:'<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    vocab:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    reading:'<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    listening:'<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 15a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2zM3 15a2 2 0 0 0 2 2h1v-5H5a2 2 0 0 0-2 2z"/>',
    speaking:'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    writing:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>'
  };
  return svg(P[key], stroke, size);
}
function typeIcon (type, stroke, size) {
  if (type === 'Audio') return svg('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>', stroke, size);
  if (type === 'Video') return svg('<rect x="2" y="4" width="20" height="16" rx="4"/>', stroke, size, '<path d="M10 9l5 3-5 3z" fill="'+stroke+'"/>');
  return svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/>', stroke, size);
}
var CAT = '<svg width="27" height="27" viewBox="0 0 32 32" fill="none"><path d="M6 5 L11 11 Q16 8 21 11 L26 5 Q27 13 26 18 A10 8 0 1 1 6 18 Q5 13 6 5Z" fill="#fff"></path><circle cx="12.5" cy="17" r="1.6" fill="#2a2740"></circle><circle cx="19.5" cy="17" r="1.6" fill="#2a2740"></circle><path d="M16 20 l-1.5 1.6 h3 z" fill="#ff8a4c"></path><path d="M16 21.6 v1.6" stroke="#2a2740" stroke-width="1.1"></path></svg>';
var CAT_BIG = '<svg width="98" height="98" viewBox="0 0 32 32" fill="none"><path d="M6 5 L11 11 Q16 8 21 11 L26 5 Q27 13 26 18 A10 8 0 1 1 6 18 Q5 13 6 5Z" fill="#ff9a52"></path><circle cx="12.3" cy="16.5" r="1.9" fill="#2a2740"></circle><circle cx="19.7" cy="16.5" r="1.9" fill="#2a2740"></circle><circle cx="12.9" cy="15.9" r=".6" fill="#fff"></circle><circle cx="20.3" cy="15.9" r=".6" fill="#fff"></circle><path d="M16 19 l-1.7 1.7 h3.4 z" fill="#c94f2e"></path><path d="M16 20.7 c0 1.2 -1.4 1.6 -2.3 1" stroke="#2a2740" stroke-width="1" fill="none" stroke-linecap="round"></path><path d="M16 20.7 c0 1.2 1.4 1.6 2.3 1" stroke="#2a2740" stroke-width="1" fill="none" stroke-linecap="round"></path><circle cx="9.6" cy="19" r="1.5" fill="#ff7f9c" opacity=".5"></circle><circle cx="22.4" cy="19" r="1.5" fill="#ff7f9c" opacity=".5"></circle></svg>';
var DL_ICON = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/></svg>';

/* ---------- 5. Utilidades ---------- */
function esc (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
  return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]; }); }
function viewLabel (type) { return type === 'Video' ? t().watch : (type === 'Audio' ? t().listen : t().view); }

/* ---------- 6. Vistas (HTML) ---------- */
function navHTML () {
  var T = t();
  var demoBadge = DEMO ? '<span style="background:#fff3e8;color:#c96a1e;font-weight:800;font-size:10.5px;padding:4px 9px;border-radius:99px;border:1px solid #ffd9b8">'+T.demo_badge+'</span>' : '';
  return '<div class="nav"><div class="wrap" style="display:flex;align-items:center;justify-content:space-between;padding:0">'+
    '<div class="brand" data-action="home"><div class="brand-logo">'+CAT+'</div>'+
      '<div><div class="brand-name">English Class</div><div class="brand-sub">Teacher Azul Covarrubias</div></div></div>'+
    '<div class="nav-links">'+ demoBadge +
      '<button class="nav-link '+(S.view==='home'?'active':'')+'" data-action="home">'+T.nav_home+'</button>'+
      '<button class="nav-link" data-action="home">'+T.nav_subjects+'</button>'+
      '<div class="lang"><button class="'+(S.lang==='es'?'on':'')+'" data-action="lang" data-lang="es">ES</button>'+
        '<button class="'+(S.lang==='en'?'on':'')+'" data-action="lang" data-lang="en">EN</button></div>'+
      '<button class="btn-admin" data-action="admin">'+T.admin+'</button>'+
    '</div></div></div>';
}

function subjCardHTML (key) {
  var s = SUBJECTS[key];
  return '<div class="subjcard" data-action="open-subject" data-subject="'+key+'">'+
    '<div class="subj-icon" style="background:'+s.color+'">'+subjIcon(key,'#fff',27)+'</div>'+
    '<div style="flex:1;min-width:0"><div class="name">'+s.name+'</div><div class="es">'+s.es+'</div>'+
      '<div class="bar"><div style="width:'+s.pct+'%;background:'+s.color+'"></div></div>'+
      '<div class="count">'+s.count+' '+t().materials+'</div></div></div>';
}

function resCardHTML (r) {
  var ty = TYPES[r.type] || TYPES.Doc, T = t();
  var dlCorner = r.dl ? '<div class="res-dl" style="color:#35c07a">'+DL_ICON+'</div>' : '';
  var dlBtn = r.dl ? '<button class="btn-dl" title="'+T.download+'" data-action="download" data-id="'+r.id+'">'+DL_ICON+'</button>' : '';
  var meta = r.type === 'Video' ? 'YouTube' : (SUBJECTS[r.subject] ? SUBJECTS[r.subject].name : '');
  if (r.dl) meta += ' · ' + T.dlable;
  return '<div class="rescard">'+
    '<div class="res-banner" style="background:'+ty.light+'">'+
      '<div class="res-badge" style="color:'+ty.color+'">'+esc(r.type)+'</div>'+ dlCorner +
      typeIcon(r.type, ty.color, 44) +
    '</div>'+
    '<div class="res-body"><div class="res-title">'+esc(r.title)+'</div>'+
      '<div class="res-meta">'+esc(meta)+'</div>'+
      '<div class="res-actions"><button class="btn-view" data-action="view" data-id="'+r.id+'">'+viewLabel(r.type)+'</button>'+ dlBtn +'</div>'+
    '</div></div>';
}

function homeHTML () {
  var T = t();
  var subjects = SUBJ_ORDER.map(subjCardHTML).join('');
  var recent = S.resources.slice(0, 4).map(resCardHTML).join('');
  return '<div class="wrap">'+
    '<div class="hero"><div class="hero-cat">'+CAT_BIG+'</div>'+
      '<div style="flex:1"><div class="tag">🐾 '+T.mascot+'</div>'+
        '<h1>'+T.hero_title+'</h1><p>'+T.hero_sub+'</p>'+
        '<button class="btn-primary" data-action="open-subject" data-subject="grammar">'+T.cta+'</button></div>'+
      '<div class="stats"><div class="stat"><b style="color:#17b4a6">120+</b><span>'+T.stat_res+'</span></div>'+
        '<div class="stat"><b style="color:#ff8a4c">6</b><span>'+T.stat_subj+'</span></div></div></div>'+
    '<div class="section-head"><h2>'+T.subjects+'</h2><span class="hint">'+T.subjects_hint+'</span></div>'+
    '<div class="subjects">'+subjects+'</div>'+
    '<div class="section-head"><h2>'+T.recent+'</h2></div>'+
    '<div class="grid4">'+recent+'</div>'+
    footerHTML()+'</div>';
}

function subjectHTML () {
  var T = t(), s = SUBJECTS[S.subject];
  var chipsKeys = ['all','PDF','Audio','Video','Doc'];
  var chips = chipsKeys.map(function (k) {
    var on = S.filter === k;
    var label = k === 'all' ? T.all : k;
    var style = on ? 'background:'+s.color+';color:#fff;border-color:'+s.color : '';
    return '<button class="chip" style="'+style+'" data-action="filter" data-filter="'+k+'">'+label+'</button>';
  }).join('');
  var inSubj = S.resources.filter(function (r) { return r.subject === S.subject; });
  var list = (S.filter === 'all' ? inSubj : inSubj.filter(function (r) { return r.type === S.filter; }));
  var cards = list.length ? list.map(resCardHTML).join('') : '<div class="empty">'+T.empty+'</div>';
  return '<div class="wrap">'+
    '<button class="back" data-action="home">'+svg('<path d="M19 12H5M12 19l-7-7 7-7"/>','currentColor',15)+' '+T.back+'</button>'+
    '<div class="subj-head" style="background:'+s.light+'">'+
      '<div class="big-icon" style="background:'+s.color+'">'+subjIcon(S.subject,'#fff',36)+'</div>'+
      '<div><h1>'+s.name+'</h1><div class="sub">'+s.es+' · '+s.count+' '+T.materials+'</div></div></div>'+
    '<div class="chips">'+chips+'</div>'+
    '<div class="grid3">'+cards+'</div>'+
    footerHTML()+'</div>';
}

function adminHTML () {
  var T = t();
  if (!S.authed) {
    return '<div class="wrap"><div class="login">'+
      '<div class="cat">'+CAT+'</div><h2>'+T.login_title+'</h2><p class="subt">'+T.login_sub+'</p>'+
      '<div class="field"><label>'+T.email+'</label><input id="in-email" placeholder="azul@englishclass.mx"/></div>'+
      '<div class="field"><label>'+T.password+'</label><input id="in-pass" type="password" placeholder="••••••••"/></div>'+
      '<button class="btn-block" style="background:#8b7bf0;box-shadow:0 10px 20px -8px rgba(139,123,240,.7)" data-action="login">'+T.enter+'</button>'+
      '<div class="err">'+esc(S.loginErr)+'</div>'+
      (DEMO ? '<p class="demo-note">'+T.demo_note+'</p>' : '')+
    '</div></div>';
  }
  var opts = SUBJ_ORDER.map(function (k) { return '<option value="'+k+'">'+SUBJECTS[k].name+'</option>'; }).join('');
  var typeOpts = ['PDF','Audio','Video','Doc'].map(function (k) {
    return '<option value="'+k+'">'+(k==='Video'?'Video (YouTube)':k)+'</option>'; }).join('');
  var rows = S.resources.map(function (r) {
    var ty = TYPES[r.type] || TYPES.Doc;
    var dl = r.dl ? '<span style="font-size:11px;font-weight:800;color:#2aa464">✓ '+T.yes+'</span>'
                  : '<span style="font-size:11px;font-weight:700;color:#c2bfd0">—</span>';
    return '<div class="trow"><div class="t">'+esc(r.title)+'</div>'+
      '<div style="font-size:12.5px;color:#57536b;font-weight:700">'+(SUBJECTS[r.subject]?SUBJECTS[r.subject].name:esc(r.subject))+'</div>'+
      '<div><span class="pill" style="background:'+ty.light+';color:'+ty.color+'">'+esc(r.type)+'</span></div>'+
      '<div>'+dl+'</div>'+
      '<div><button class="btn-del" title="'+T.del+'" data-action="delete" data-id="'+r.id+'">'+
        svg('<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>','currentColor',15)+'</button></div></div>';
  }).join('');
  return '<div class="wrap"><div class="admin">'+
    '<div class="admin-form"><h2>'+T.add_title+'</h2><p class="subt">'+T.add_sub+'</p>'+
      '<div class="field"><label>'+T.f_title+'</label><input id="f-title" placeholder="'+T.f_title_ph+'"/></div>'+
      '<div class="row2"><div style="flex:1"><label>'+T.f_subject+'</label><select id="f-subject">'+opts+'</select></div>'+
        '<div style="flex:1"><label>'+T.f_type+'</label><select id="f-type">'+typeOpts+'</select></div></div>'+
      '<div class="field"><label>'+T.f_link+'</label><input id="f-link" placeholder="'+T.f_link_ph+'"/></div>'+
      '<div class="switch" data-action="toggle-dl"><div class="track" style="background:'+(S.fDl?'#35c07a':'#d7d3e6')+'">'+
        '<div class="knob" style="transform:translateX('+(S.fDl?'18px':'0')+')"></div></div>'+
        '<span style="font-size:13.5px;font-weight:700;color:#57536b">'+T.f_dl+'</span></div>'+
      '<button class="btn-block" style="background:#35c07a;box-shadow:0 10px 20px -8px rgba(53,192,122,.6);display:flex;align-items:center;justify-content:center;gap:7px" data-action="add">'+
        svg('<path d="M12 5v14M5 12h14"/>','currentColor',17)+' '+T.add_btn+'</button>'+
    '</div>'+
    '<div class="admin-list"><div class="section-head"><h2>'+T.manage+'</h2>'+
      '<div style="display:flex;align-items:center;gap:10px"><span class="hint">'+S.resources.length+' '+T.materials+'</span>'+
        '<button class="chip" data-action="logout">'+T.logout+'</button></div></div>'+
      '<div class="table"><div class="trow thead"><div>'+T.c_title+'</div><div>'+T.c_subject+'</div><div>'+T.c_type+'</div><div>'+T.c_dl+'</div><div></div></div>'+
        rows+'</div>'+
      '<div class="tip"><div style="font-size:20px">💡</div><div>'+T.tip+'</div></div>'+
    '</div></div>'+ footerHTML()+'</div>';
}

function footerHTML () {
  return '<div class="footer"><div>🐾 English Class · Teacher Azul Covarrubias</div>'+
    '<div>Firebase + GitHub Pages</div></div>';
}

/* ---------- 7. Modal reproductor ---------- */
function openViewer (r) {
  var T = t(), root = document.getElementById('modal-root');
  var body;
  if (!r.link) {
    body = '<div style="padding:50px;text-align:center;color:#9a97ad;font-weight:700">'+T.no_link+'</div>';
  } else if (r.type === 'Audio' && /\.(mp3|ogg|wav|m4a)(\?|$)/i.test(r.link)) {
    body = '<audio controls src="'+esc(r.link)+'"></audio>';
  } else {
    body = '<iframe src="'+esc(r.link)+'" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
  }
  var openLink = r.link ? '<a href="'+esc(r.link)+'" target="_blank" rel="noopener">'+T.open_new+'</a>' : '';
  root.innerHTML = '<div class="modal-bg" data-action="close-modal"><div class="modal" data-stop="1">'+
    '<div class="modal-head"><h3>'+esc(r.title)+'</h3><button class="modal-close" data-action="close-modal">×</button></div>'+
    '<div class="modal-body">'+body+'</div>'+
    '<div class="modal-foot">'+openLink+'</div></div></div>';
}
function closeViewer () { document.getElementById('modal-root').innerHTML = ''; }

/* ---------- 8. Render ---------- */
function render () {
  var html = navHTML();
  if (S.view === 'home') html += homeHTML();
  else if (S.view === 'subject') html += subjectHTML();
  else if (S.view === 'admin') html += adminHTML();
  document.getElementById('app').innerHTML = html;
  window.scrollTo(0, 0);
}

/* ---------- 9. Acciones ---------- */
function byId (id) { return S.resources.filter(function (r) { return r.id === id; })[0]; }

document.addEventListener('click', function (e) {
  var el = e.target.closest ? e.target.closest('[data-action]') : null;
  if (!el) return;
  var a = el.getAttribute('data-action');

  if (a === 'home')          { S.view = 'home'; render(); }
  else if (a === 'admin')    { S.view = 'admin'; S.loginErr = ''; render(); }
  else if (a === 'lang')     { S.lang = el.getAttribute('data-lang'); localStorage.setItem('ec_lang', S.lang); render(); }
  else if (a === 'open-subject') { S.view = 'subject'; S.subject = el.getAttribute('data-subject'); S.filter = 'all'; render(); }
  else if (a === 'filter')   { S.filter = el.getAttribute('data-filter'); render(); }
  else if (a === 'toggle-dl'){ S.fDl = !S.fDl; render(); }
  else if (a === 'logout')   { doLogout(); }
  else if (a === 'login')    { doLogin(); }
  else if (a === 'add')      { doAdd(); }
  else if (a === 'delete')   { doDelete(el.getAttribute('data-id')); }
  else if (a === 'view')     { openViewer(byId(el.getAttribute('data-id'))); }
  else if (a === 'download') { var r = byId(el.getAttribute('data-id')); if (r && r.link) window.open(r.link, '_blank'); else openViewer(r); }
  else if (a === 'close-modal') { if (!e.target.closest('[data-stop]') || e.target.closest('.modal-close')) closeViewer(); }
});
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeViewer(); });

/* ---------- 10. Auth ---------- */
function doLogin () {
  var email = (document.getElementById('in-email') || {}).value || '';
  var pass  = (document.getElementById('in-pass') || {}).value || '';
  if (DEMO) { S.authed = true; S.loginErr = ''; render(); return; }
  AUTH.signInWithEmailAndPassword(email.trim(), pass).then(function () {
    S.authed = true; S.loginErr = ''; render();
  }).catch(function () { S.loginErr = t().bad_login; render(); });
}
function doLogout () {
  if (!DEMO && AUTH) { AUTH.signOut(); }
  S.authed = false; S.view = 'home'; render();
}

/* ---------- 11. Agregar / eliminar ---------- */
function doAdd () {
  var title = (document.getElementById('f-title') || {}).value || '';
  title = title.trim(); if (!title) { return; }
  var rec = {
    title: title,
    subject: (document.getElementById('f-subject') || {}).value || 'grammar',
    type: (document.getElementById('f-type') || {}).value || 'PDF',
    link: ((document.getElementById('f-link') || {}).value || '').trim(),
    dl: S.fDl,
    fecha: new Date().toISOString().slice(0, 10)
  };
  if (DEMO) {
    rec.id = 'demo' + Date.now();
    S.resources.unshift(rec); S.fDl = true; render(); return;
  }
  DB.collection('recursos').add({
    titulo: rec.title, materia: rec.subject, tipo: rec.type,
    enlace: rec.link, descargable: rec.dl, fecha: rec.fecha
  }).then(function () { S.fDl = true; loadResources(); })
    .catch(function (err) { alert('No se pudo guardar: ' + err.message); });
}
function doDelete (id) {
  if (DEMO) { S.resources = S.resources.filter(function (r) { return r.id !== id; }); render(); return; }
  DB.collection('recursos').doc(id).delete().then(loadResources)
    .catch(function (err) { alert('No se pudo eliminar: ' + err.message); });
}

/* ---------- 12. Cargar desde Firestore ---------- */
function loadResources () {
  if (DEMO) { S.loaded = true; render(); return; }
  DB.collection('recursos').orderBy('fecha', 'desc').get().then(function (snap) {
    var arr = [];
    snap.forEach(function (doc) {
      var d = doc.data();
      arr.push({
        id: doc.id, title: d.titulo || '', subject: d.materia || 'grammar',
        type: d.tipo || 'Doc', link: d.enlace || '', dl: !!d.descargable, fecha: d.fecha || ''
      });
    });
    if (arr.length) S.resources = arr;   // si está vacío, deja el material de ejemplo
    S.loaded = true; render();
  }).catch(function (err) {
    console.warn('No se pudo leer Firestore, usando ejemplo:', err);
    S.loaded = true; render();
  });
}

/* ---------- 13. Arranque ---------- */
render();
loadResources();
if (!DEMO && AUTH) {
  AUTH.onAuthStateChanged(function (user) {
    S.authed = !!user;
    if (S.view === 'admin') render();
  });
}
