// Header wordt solide na scrollen
const header=document.querySelector('.site-header');
const onScroll=()=>header.classList.toggle('solid',window.scrollY>40);
onScroll();window.addEventListener('scroll',onScroll,{passive:true});

// Mobiel menu
const toggle=document.querySelector('.menu-toggle'),menu=document.getElementById('menu');
toggle.addEventListener('click',()=>{
  const open=menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded',open);
  toggle.setAttribute('aria-label',open?'Menu sluiten':'Menu openen');
  header.classList.toggle('solid',open||window.scrollY>40);
});

// Reviews wisselen
const reviews=[
  {q:"Ruim op tijd, vooraf meegedacht en zelfs al contact gehad met de locatie. Tijdens het feest draaide hij precies de juiste muziek voor ons publiek. Absoluut een aanrader!",w:"Vincent · 30e verjaardag"},
  {q:"Van start tot eind goed aangevoeld wat er gedraaid moest worden. Verzoekjes konden makkelijk tussendoor en er werd volop gedanst door jong en oud(er)!",w:"Gloria · Feest, juli 2025"},
  {q:"Van een mellow begin naar een volwaardig dansfeest, zelfs de meest verlegen collega's gingen los. Persoonlijk, interactief en super geluid. Een echte aanrader!",w:"Camila · Bedrijfsfeest"}
];
const quote=document.getElementById('quote');
if(quote)document.querySelectorAll('.who button').forEach(b=>b.addEventListener('click',()=>{
  const r=reviews[+b.dataset.i];
  quote.querySelector('p').textContent=r.q;
  quote.querySelector('cite').textContent=r.w;
  quote.classList.remove('swap');void quote.offsetWidth;quote.classList.add('swap');
  document.querySelectorAll('.who button').forEach(x=>x.setAttribute('aria-pressed',x===b));
}));

// ===== Boekingsformulier =====
const form=document.getElementById('boekform');
if(form){
  // Soort feest vooraf invullen vanuit ?soort= (links op de homepage)
  const soort=new URLSearchParams(location.search).get('soort');
  const map={samenwerking:'Samenwerking (artiest, venue, merk)',bruiloft:'Bruiloft',bedrijfsfeest:'Bedrijfsfeest of borrel',studentenfeest:"Studentenfeest of gala"};
  if(soort==='dj-sax'){form.querySelector('input[name="formule"][value="DJ + saxofoon"]').checked=true;}
  else if(map[soort]){form.soort.value=map[soort];}

  const msgs={naam:'Vul je naam in.',email:'Vul een geldig e-mailadres in.',soort:'Kies het soort aanvraag.',datum:'Kies een datum.',plaats:'Vul de plaats in.'};
  const check=el=>{
    const ok=el.checkValidity();
    el.setAttribute('aria-invalid',!ok);
    const e=document.getElementById('err-'+el.name); if(e) e.textContent=ok?'':msgs[el.name];
    return ok;
  };
  form.querySelectorAll('[required]').forEach(el=>el.addEventListener('blur',()=>check(el)));
  form.addEventListener('submit',ev=>{
    ev.preventDefault();
    let first=null;
    form.querySelectorAll('[required]').forEach(el=>{if(!check(el)&&!first)first=el;});
    if(first){first.focus();return;}
    // TODO: koppel aan een formulierdienst of eigen endpoint (bijv. fetch(form.action,{method:'POST',body:new FormData(form)})).
    form.hidden=true;
    const s=document.getElementById('bedankt'); s.hidden=false; s.querySelector('h2').focus();
  });
}
