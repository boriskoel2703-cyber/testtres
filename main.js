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
  {q:"Tresor wist precies wanneer hij de zaal los moest laten. Van rustige achtergrondmuziek tijdens het diner tot een volle dansvloer later op de avond — top geregeld!",w:"Lisanne · Bruiloft Zeewolde"},
  {q:"Als studievereniging hadden we een DJ nodig die het publiek aanvoelt. Tresor deed dat perfect, de sfeer zat er meteen goed in.",w:"Thomas · Studentengala"},
  {q:"Communicatie vooraf verliep soepel en op de avond zelf speelde hij precies de mix die bij ons bedrijfsfeest paste. Aanrader!",w:"Sander · Bedrijfsborrel Amersfoort"}
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
  const map={bruiloft:'Bruiloft',bedrijfsfeest:'Bedrijfsfeest of borrel',studentenfeest:"Studentenfeest of gala"};
  if(soort==='dj-sax'){form.querySelector('input[name="formule"][value="DJ + saxofoon"]').checked=true;}
  else if(map[soort]){form.soort.value=map[soort];}

  const msgs={naam:'Vul je naam in.',email:'Vul een geldig e-mailadres in.',soort:'Kies het soort feest.',datum:'Kies een datum.',plaats:'Vul de plaats in.'};
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
