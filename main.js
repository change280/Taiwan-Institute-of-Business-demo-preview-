(function(){
  var btn=document.querySelector('.menu-btn'),d=document.getElementById('drawer'),x=d.querySelector('.drawer__close');
  function set(o){d.classList.toggle('is-open',o);btn.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':'';if(o)x.focus();else btn.focus();}
  btn.addEventListener('click',function(){set(true)});
  x.addEventListener('click',function(){set(false)});
  d.querySelectorAll('nav a').forEach(function(a){a.addEventListener('click',function(){set(false)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&d.classList.contains('is-open'))set(false)});
  var y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();
  // 桌機版創辦人經歷全部展開；手機版為摺疊
  var mq=window.matchMedia('(min-width:641px)');
  function syncBio(){document.querySelectorAll('.bio__g').forEach(function(g,i){g.open=mq.matches||i===0;});}
  if(document.querySelector('.bio__g')){syncBio();mq.addEventListener('change',syncBio);}
})();

(function(){
  var dock=document.querySelector('.dock');
  if(!dock)return;
  var footer=document.querySelector('.footer');
  var raf=0;
  function luminance(color){
    var values=color.match(/[\d.]+/g);
    if(!values||(values[3]!==undefined&&Number(values[3])<0.5))return -1;
    return (0.2126*values[0]+0.7152*values[1]+0.0722*values[2])/255;
  }
  function checkBackground(){
    raf=0;
    dock.style.removeProperty('--dock-bottom-lift');
    if(footer){
      var baseBottom=parseFloat(getComputedStyle(dock).bottom)||32;
      var dockHeight=dock.getBoundingClientRect().height;
      var footerTop=footer.getBoundingClientRect().top;
      var footerGap=16;
      var lift=window.innerHeight-footerTop+footerGap-baseBottom;
      if(lift>0)dock.style.setProperty('--dock-bottom-lift',lift+'px');
    }
    var rect=dock.getBoundingClientRect();
    var elements=document.elementsFromPoint(rect.left+rect.width/2,rect.top+rect.height/2);
    var dark=false;
    for(var i=0;i<elements.length;i+=1){
      var element=elements[i];
      if(dock.contains(element)||element.closest('.callbar'))continue;
      var level=-1;
      for(var current=element;current&&current!==document.documentElement;current=current.parentElement){
        level=luminance(getComputedStyle(current).backgroundColor);
        if(level>=0)break;
      }
      dark=level>=0&&level<0.4;
      break;
    }
    dock.classList.toggle('is-dark',dark);
  }
  function scheduleCheck(){if(!raf)raf=requestAnimationFrame(checkBackground);}
  window.addEventListener('scroll',scheduleCheck,{passive:true});
  window.addEventListener('resize',scheduleCheck);
  checkBackground();
})();
