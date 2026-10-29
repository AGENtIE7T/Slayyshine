(function(){
  var d=document,$=function(s,c){return(c||d).querySelector(s)},$$=function(s,c){return[].slice.call((c||d).querySelectorAll(s))};
  // Nav background on scroll
  var nav=$('.nav');
  if(nav&&!nav.classList.contains('solid')){var onS=function(){nav.classList.toggle('scrolled',scrollY>40)};onS();addEventListener('scroll',onS,{passive:true})}
  // Mobile menu
  var menu=$('#menu'),openB=$('.menu-btn'),closeB=$('.menu-close');
  function setMenu(o){if(!menu)return;menu.classList.toggle('open',o);menu.setAttribute('aria-hidden',!o);openB&&openB.setAttribute('aria-expanded',o);d.body.style.overflow=o?'hidden':'';if(o)closeB.focus();else openB&&openB.focus()}
  openB&&openB.addEventListener('click',function(){setMenu(true)});
  closeB&&closeB.addEventListener('click',function(){setMenu(false)});
  menu&&$$('a',menu).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu&&menu.classList.contains('open'))setMenu(false)});
  // Reveal on scroll
  var rv=$$('.reveal');
  if('IntersectionObserver'in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});rv.forEach(function(el){io.observe(el)})}else rv.forEach(function(el){el.classList.add('in')});
  setTimeout(function(){rv.forEach(function(el){if(el.getBoundingClientRect().top<innerHeight)el.classList.add('in')})},300);
  // Cart (local only)
  var KEY='ssj-cart',cart=[];try{cart=JSON.parse(localStorage.getItem(KEY))||[]}catch(e){}
  var badge=$('.cart-count'),toast=$('.toast'),tt;
  function paint(){if(!badge)return;badge.textContent=cart.length;badge.setAttribute('data-n',cart.length);var b=badge.parentNode;b.setAttribute('aria-label','Cart, '+cart.length+' item'+(cart.length===1?'':'s'))}
  function say(m){if(!toast)return;toast.textContent=m;toast.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('show')},2200)}
  paint();
  $$('.add').forEach(function(b){b.addEventListener('click',function(){cart.push(b.dataset.id);try{localStorage.setItem(KEY,JSON.stringify(cart))}catch(e){}paint();b.classList.add('added');b.textContent='✓ Added';say(b.dataset.name+' added to cart');setTimeout(function(){b.classList.remove('added');b.textContent='Add to Cart'},1800)})});
  // Newsletter
  var f=$('.sub-form');
  f&&f.addEventListener('submit',function(e){e.preventDefault();var i=$('input',f),m=$('.sub-msg');if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(i.value.trim())){m.className='sub-msg err';m.textContent='Please enter a valid email address.';i.focus();return}m.className='sub-msg';m.textContent="You're in. New drops land in your inbox first.";f.reset()});
  // Shop filters
  var grid=$('#shop-grid');
  if(grid){
    var cards=$$('.card',grid),pills=$$('.pill'),h1=$('#shop-title'),cnt=$('#shop-count'),lbl={};
    pills.forEach(function(p){lbl[p.dataset.f]=p.textContent});
    function apply(f){if(!lbl[f])f='all';var n=0;cards.forEach(function(c){var show=f==='all'||c.dataset.cats.split(' ').indexOf(f)>-1;c.hidden=!show;if(show)n++});pills.forEach(function(p){p.setAttribute('aria-pressed',p.dataset.f===f)});$$('.nav-links a, .menu a').forEach(function(a){var h=a.getAttribute('href')||'';if(h.indexOf('shop.html#')===0){if(h==='shop.html#'+f)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')}});h1.textContent=f==='all'?'Shop All Jewellery':lbl[f];cnt.textContent=n+(n===1?' piece':' pieces');d.title=(f==='all'?'Shop All Demifine Jewellery':lbl[f]+' — Demifine Jewellery')+' | Slayyshine Jewels'}
    pills.forEach(function(p){p.addEventListener('click',function(){history.replaceState(null,'','#'+p.dataset.f);apply(p.dataset.f)})});
    addEventListener('hashchange',function(){apply(location.hash.slice(1))});
    apply(location.hash.slice(1)||'all');
  }
  var y=$('#year');y&&(y.textContent=new Date().getFullYear());
})();
