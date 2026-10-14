(function(){
  var D=window.TIB_NEWS; if(!D) return;
  var PER=8, mobile=window.matchMedia('(max-width:640px)');
  var qs=new URLSearchParams(location.search);
  var st={cat:qs.get('cat')||'',year:qs.get('year')||'',q:qs.get('q')||'',page:+qs.get('page')||1,shown:PER};
  var tabs=document.querySelector('.tabs'),rows=document.getElementById('rows'),count=document.querySelector('.n-count'),
      pager=document.querySelector('.pager'),more=document.querySelector('.more'),year=document.getElementById('f-year'),q=document.getElementById('f-q');
  function roc(y){return +y-1911;}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  var items=D.items.slice().sort(function(a,b){return b.date.localeCompare(a.date);});
  var years=[...new Set(items.map(function(i){return i.date.slice(0,4);}))].sort().reverse();
  years.forEach(function(y){var o=document.createElement('option');o.value=y;o.textContent=roc(y)+' 年';year.appendChild(o);});
  tabs.innerHTML=D.cats.map(function(c){return '<button type="button" role="tab" class="tab" data-cat="'+c.id+'">'+esc(c.name)+'</button>';}).join('');
  year.value=st.year; q.value=st.q;
  function kind(i){return i.cat==='newsletter'?'gold':i.cat==='events'?'solid':'line';}
  function filtered(){var k=st.q.trim().toLowerCase();return items.filter(function(i){
    return (!st.cat||i.cat===st.cat)&&(!st.year||i.date.slice(0,4)===st.year)&&(!k||(i.title+' '+i.points.join(' ')+' '+i.tag).toLowerCase().indexOf(k)>-1);});}
  function row(i){
    var y=i.date.slice(0,4),md=i.date.length>4?i.date.slice(5).replace('-','.'):'';
    return '<a class="row" href="#demo-dialog" data-demo-preview="news" data-demo-title="'+esc(i.title)+'" data-demo-summary="'+esc(i.points.join(' · '))+'">'+
      '<div class="row__date"><b>'+(md||roc(y))+'</b><span>'+(md?'民國 '+roc(y)+' 年':'年度')+'</span><i>'+(md?roc(y)+'.'+md:roc(y)+' 年度')+'</i></div>'+
      '<div class="row__tag"><span class="tag tag--'+kind(i)+'">'+esc(i.tag)+'</span></div>'+
      '<div class="row__body"><h3>'+esc(i.title)+(i.sample?'<small class="sample">示意</small>':'')+'</h3><ul>'+i.points.map(function(p){return '<li>'+esc(p)+'</li>';}).join('')+'</ul></div>'+
      '<div class="row__go" aria-hidden="true">→</div></a>';}
  function sync(){var p=new URLSearchParams();if(st.cat)p.set('cat',st.cat);if(st.year)p.set('year',st.year);if(st.q)p.set('q',st.q);if(st.page>1&&!mobile.matches)p.set('page',st.page);
    history.replaceState(null,'',location.pathname+(p.toString()?'?'+p:''));}
  function render(){
    var list=filtered(),pages=Math.max(1,Math.ceil(list.length/PER));
    if(st.page>pages)st.page=pages;
    var slice=mobile.matches?list.slice(0,st.shown):list.slice((st.page-1)*PER,st.page*PER);
    tabs.querySelectorAll('.tab').forEach(function(b){var on=b.dataset.cat===st.cat;b.classList.toggle('is-active',on);b.setAttribute('aria-selected',on);});
    count.textContent='共 '+list.length+' 則　·　依日期排序';
    rows.innerHTML=slice.length?slice.map(row).join(''):'<p class="empty">沒有符合條件的消息。</p>';
    if(mobile.matches){pager.hidden=true;more.hidden=st.shown>=list.length;}
    else{more.hidden=true;pager.hidden=pages<2;var h='<button type="button" data-p="'+(st.page-1)+'"'+(st.page<2?' disabled':'')+' aria-label="上一頁">←</button>';
      for(var n=1;n<=pages;n++){if(n===1||n===pages||Math.abs(n-st.page)<=1)h+='<button type="button" data-p="'+n+'"'+(n===st.page?' aria-current="page"':'')+'>'+n+'</button>';else if(Math.abs(n-st.page)===2)h+='<span>…</span>';}
      h+='<button type="button" data-p="'+(st.page+1)+'"'+(st.page>=pages?' disabled':'')+' aria-label="下一頁">→</button>';pager.innerHTML=h;}
    sync();}
  tabs.addEventListener('click',function(e){var b=e.target.closest('.tab');if(!b)return;st.cat=b.dataset.cat;st.page=1;st.shown=PER;render();});
  pager.addEventListener('click',function(e){var b=e.target.closest('button[data-p]');if(!b||b.disabled)return;st.page=+b.dataset.p;render();
    var top=document.querySelector('.n-list').getBoundingClientRect().top+scrollY-90;window.scrollTo({top:top,behavior:'smooth'});});
  more.addEventListener('click',function(){st.shown+=PER;render();});
  year.addEventListener('change',function(){st.year=year.value;st.page=1;st.shown=PER;render();});
  var t;q.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){st.q=q.value;st.page=1;st.shown=PER;render();},200);});
  mobile.addEventListener('change',render);
  render();
})();
