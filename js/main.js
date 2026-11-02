(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Sticky header
  var header=document.querySelector('header');
  function onScroll(){header.classList.toggle('scrolled',window.scrollY>40);}
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});
  // Mobiel menu
  var burger=document.querySelector('.burger');
  burger.addEventListener('click',function(){var o=document.body.classList.toggle('menu-open');burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Menu sluiten':'Menu openen');});
  document.querySelectorAll('nav a').forEach(function(a){a.addEventListener('click',function(){document.body.classList.remove('menu-open');burger.setAttribute('aria-expanded','false');});});
  // Tekst-animaties: koppen woord voor woord, overige tekst gestaffeld
  function splitWords(el){var n=0;(function walk(node){Array.prototype.slice.call(node.childNodes).forEach(function(c){
      if(c.nodeType===3){var parts=c.textContent.split(/(\s+)/),f=document.createDocumentFragment();
        parts.forEach(function(t){if(!t)return;if(/^\s+$/.test(t)){f.appendChild(document.createTextNode(t));return;}
          var w=document.createElement('span');w.className='w';var i=document.createElement('span');i.className='wi';i.style.setProperty('--i',n++);i.textContent=t;w.appendChild(i);f.appendChild(w);});
        node.replaceChild(f,c);}
      else if(c.nodeType===1)walk(c);});})(el);el.classList.add('split');}
  var hero=document.querySelector('.hero h1, .phero h1');
  if(hero){splitWords(hero);requestAnimationFrame(function(){hero.classList.add('in')});}
  var txt=document.querySelectorAll('.mid h2, .mid .label, .mid p, .mid .link, .video .head h2, .video .head .label, .video .head .link, .agenda-s .head h2, .agenda-s .head .label, .agenda-s .head .link, .review .txt>.label, .review .txt>h2, .review .rctrl, .review .all, .ctab .label, .ctab h2, .ctab p, .ctab .cbtns, .fcols>div');
  var groups=new Map();
  txt.forEach(function(e){if(e.tagName==='H2')splitWords(e);else e.classList.add('tx');
    var g=e.closest('.wrap,.text,.fcols')||e.parentNode,k=groups.get(g)||0;groups.set(g,k+1);e.style.setProperty('--d',(k*0.05)+'s');e.classList.add('rv-t');});
  // Scroll-animaties
  var els=document.querySelectorAll('.rv,.rv-t');
  if(reduce||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});}
  else{var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{threshold:0,rootMargin:'0px 0px 12% 0px'});
    document.querySelectorAll('.ev.rv').forEach(function(e,i){e.style.setProperty('--d',(i*0.04)+'s')});
    els.forEach(function(e){io.observe(e)});}
  // Video-lightbox: zet per clip de YouTube-ID in data-yt
  var modal=document.getElementById('vmodal'),vbody=document.getElementById('vbody');
  if(modal){
  function closeM(){modal.classList.remove('open');setTimeout(function(){vbody.innerHTML='';},300);}
  document.querySelectorAll('[data-yt]').forEach(function(a){a.addEventListener('click',function(ev){ev.preventDefault();var id=a.getAttribute('data-yt');
    vbody.innerHTML=id?'<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="Videoclip" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>':'<div class="msg"><b>Clip volgt binnenkort</b><span>Voeg de YouTube-ID toe in data-yt.</span></div>';
    modal.classList.add('open');});});
  modal.addEventListener('click',function(e){if(e.target===modal||e.target.classList.contains('close'))closeM();});
  }
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(modal)closeM();document.body.classList.remove('menu-open');}});
  // Reviews-carrousel
  var R=[["Ruim op tijd, vooraf meegedacht met de locatie en precies de juiste muziek voor ons publiek. Absoluut een aanrader!","30e verjaardag","V","Vincent"],
  ["Van een mellow begin naar een volle dansvloer. Zelfs de meest verlegen collega's gingen los. Een echte aanrader!","Bedrijfsfeest","C","Camila"],
  ["Goed aangevoeld wat er gedraaid moest worden, verzoekjes konden makkelijk tussendoor. Jong en oud(er) danste volop!","Feest","G","Gloria"],
  ["Leuke interactie en volledig voldaan aan onze verwachtingen. Deze DJ moet je hebben voor een topfeest!","Verjaardag","N","Nick"]];
  var track=document.getElementById('rtrack'),dots=document.getElementById('rdots'),page=0,timer;
  if(track){
  function per(){return 2;}
  function pages(){return Math.ceil(R.length/per());}
  function card(r,i){return '<div class="rcard '+(i%2?'b':'a')+'"><div class="st" aria-label="5 sterren">★★★★★</div><p>“'+r[0]+'”</p><div class="who"><span class="av">'+r[2]+'</span><span><b>'+r[3]+'</b> · '+r[1]+'</span></div></div>';}
  function render(anim){var n=per(),s=page*n,html='';for(var i=0;i<n;i++){var r=R[(s+i)%R.length];html+=card(r,i);}
    if(anim&&!reduce){track.querySelectorAll('.rcard').forEach(function(c){c.classList.add('out')});setTimeout(function(){track.innerHTML=html;},250);}else track.innerHTML=html;
    var d='';for(var p=0;p<pages();p++)d+='<span class="'+(p===page?'on':'')+'"></span>';dots.innerHTML=d;}
  function go(dir){page=(page+dir+pages())%pages();render(true);restart();}
  function restart(){if(reduce)return;clearInterval(timer);timer=setInterval(function(){go(1)},7000);}
  document.querySelector('.rctrl .prev').onclick=function(){go(-1)};
  document.querySelector('.rctrl .next').onclick=function(){go(1)};
  track.addEventListener('mouseenter',function(){clearInterval(timer)});track.addEventListener('mouseleave',restart);
  render(false);restart();
  }
  // Boekingsformulier (nog te koppelen aan e-mail of een formulierdienst)
  var bf=document.getElementById('bform');
  if(bf){bf.addEventListener('submit',function(e){e.preventDefault();var m=bf.querySelector('.fmsg');
    if(!bf.checkValidity()){m.textContent='Vul in wie je bent, je naam en je e-mail.';m.hidden=false;var f=bf.querySelector(':invalid');if(f)f.focus();return;}
    m.textContent='Dit formulier wordt nog gekoppeld. Mail of bel me voor nu direct: info@tresormusic.nl of +31 6 48788618.';m.hidden=false;});}
})();
