(function(){
  var D=window.TIB_NEWS;if(!D)return;
  var PER=8,mobile=window.matchMedia('(max-width:640px)'),qs=new URLSearchParams(location.search);
  var st={cat:qs.get('cat')||'',subcat:qs.get('subcat')||'',year:qs.get('year')||'',q:qs.get('q')||'',page:+qs.get('page')||1,shown:PER};
  var tabs=document.querySelector('.tabs'),rows=document.getElementById('rows'),count=document.querySelector('.n-count'),pager=document.querySelector('.pager'),more=document.querySelector('.more'),year=document.getElementById('f-year'),subcat=document.getElementById('f-subcat'),q=document.getElementById('f-q'),features=document.getElementById('feature-grid');
  if(!tabs||!rows||!count||!year||!subcat||!q)return;
  function esc(v){return String(v===null||v===undefined?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function roc(y){return Number(y)-1911;}
  function dateScore(i){return i.date?Number(i.date.replace(/-/g,'')):Number(i.year||0)*10000;}
  var items=D.items.slice().sort(function(a,b){return dateScore(b)-dateScore(a)||Number(b.id)-Number(a.id);});
  var years=[...new Set(items.map(function(i){return i.year;}).filter(Boolean))].sort(function(a,b){return Number(b)-Number(a);});
  years.forEach(function(y){var o=document.createElement('option');o.value=String(y);o.textContent='民國 '+roc(y)+' 年';year.appendChild(o);});
  function refreshSubcats(){
    var current=subcat.value||st.subcat,filtered=items.filter(function(i){return !st.cat||i.group===st.cat;}),ids=[...new Set(filtered.map(function(i){return i.categoryId;}).filter(Boolean))];
    var available=D.categories.filter(function(c){return ids.indexOf(c.id)>-1;});
    subcat.innerHTML='<option value="">全部原站分類</option>'+available.map(function(c){return '<option value="'+esc(c.id)+'">'+esc(c.name)+'</option>';}).join('');
    subcat.value=available.some(function(c){return c.id===current;})?current:'';st.subcat=subcat.value;
  }
  tabs.innerHTML=D.cats.map(function(c){return '<button type="button" role="tab" class="tab" data-cat="'+esc(c.id)+'" aria-label="'+esc(c.name)+'，'+c.count+' 筆">'+esc(c.name)+' <small>'+c.count+'</small></button>';}).join('');
  year.value=st.year;q.value=st.q;refreshSubcats();
  var totalLabel=document.getElementById('archive-total'),groupLabel=document.getElementById('archive-groups'),categoryLabel=document.getElementById('archive-categories'),datedLabel=document.getElementById('archive-dated');
  if(totalLabel)totalLabel.textContent=items.length;if(groupLabel)groupLabel.textContent=String(D.cats.filter(function(c){return c.id;}).length);
  if(categoryLabel)categoryLabel.textContent=String(new Set(items.map(function(i){return i.categoryId;}).filter(Boolean)).size);
  if(datedLabel)datedLabel.textContent=String(items.filter(function(i){return !!i.date;}).length);
  function dateText(i){if(i.date){var d=new Date(i.date+'T00:00:00');return '民國 '+roc(d.getFullYear())+' 年 '+(d.getMonth()+1)+' 月 '+d.getDate()+' 日';}return i.year?'民國 '+roc(i.year)+' 年，原站未載精確日期':'原站未載日期';}
  function excerpt(i){return i.excerpt|| (i.images.length?'原站以圖片或附件呈現內容。':'此筆原站紀錄未提供可擷取的本文文字。');}
  function featureMarkup(i,index){
    var date=dateText(i),image=i.images&&i.images[0];
    if(index===0)return '<a class="f-issue" href="news-detail.html?id='+encodeURIComponent(i.id)+'"><div><div class="f-issue__tag">原站最新紀錄 · '+esc(i.category)+'</div><div class="f-issue__no">'+esc(i.year?roc(i.year):'NEWS')+'</div><div class="f-issue__date">'+esc(date)+'</div></div><div class="f-issue__toc"><strong>'+esc(i.title)+'</strong><span>'+esc(excerpt(i))+'</span><span class="f-issue__read">閱讀完整消息 →</span></div></a>';
    var photo=image?'<figure class="event-photo f-event__ph"><img src="'+esc(image.url)+'" alt="'+esc(image.alt||i.title)+'" loading="lazy" decoding="async"><figcaption>原站紀錄圖片</figcaption></figure>':'<div class="event-photo f-event__ph f-event__ph--pattern" aria-hidden="true"></div>';
    return '<a class="f-event" href="news-detail.html?id='+encodeURIComponent(i.id)+'"><div class="f-event__body"><div class="f-event__meta"><span class="tag tag--solid">原站消息</span><span>'+esc(i.category)+'</span></div><div class="f-event__date">'+esc(date)+'</div><h2>'+esc(i.title)+'</h2><p>'+esc(excerpt(i))+'</p><span class="link-u">查看原文紀錄 →</span></div>'+photo+'</a>';
  }
  function renderFeatures(){if(!features)return;features.innerHTML=items.slice(0,2).map(featureMarkup).join('');features.querySelectorAll('img').forEach(function(img){img.addEventListener('error',function(){var frame=img.closest('.f-event__ph');img.remove();if(frame){frame.classList.add('f-event__ph--pattern');frame.setAttribute('aria-label','原站圖片暫無法載入，請開啟原站消息');}});});}
  function filtered(){var keyword=st.q.trim().toLocaleLowerCase();return items.filter(function(i){var hay=[i.title,i.category,i.categoryPath.join(' '),i.body,i.excerpt].join(' ').toLocaleLowerCase();return(!st.cat||i.group===st.cat)&&(!st.subcat||i.categoryId===st.subcat)&&(!st.year||String(i.year||'')===String(st.year))&&(!keyword||hay.indexOf(keyword)>-1);});}
  function row(i){var d=i.date?new Date(i.date+'T00:00:00'):null,md=d?String(d.getMonth()+1).padStart(2,'0')+'.'+String(d.getDate()).padStart(2,'0'):i.year?String(roc(i.year)):'—',y=i.year?'民國 '+roc(i.year)+' 年': '年份未載';
    return '<a class="row news-row" href="news-detail.html?id='+encodeURIComponent(i.id)+'"><div class="row__date"><b>'+esc(md)+'</b><span>'+esc(y)+'</span><i>'+esc(md)+(d?' · '+esc(y):' · 日期未載')+'</i></div><div class="row__tag"><span class="tag tag--line">'+esc(i.category)+'</span></div><div class="row__body"><h3>'+esc(i.title)+'</h3><p>'+esc(excerpt(i))+'</p></div><div class="row__go" aria-hidden="true">→</div></a>';}
  function sync(){var p=new URLSearchParams();if(st.cat)p.set('cat',st.cat);if(st.subcat)p.set('subcat',st.subcat);if(st.year)p.set('year',st.year);if(st.q)p.set('q',st.q);if(st.page>1&&!mobile.matches)p.set('page',st.page);history.replaceState(null,'',location.pathname+(p.toString()?'?'+p:''));}
  function render(){var list=filtered(),pages=Math.max(1,Math.ceil(list.length/PER));if(st.page>pages)st.page=pages;var shown=mobile.matches?list.slice(0,st.shown):list.slice((st.page-1)*PER,st.page*PER);
    tabs.querySelectorAll('.tab').forEach(function(b){var on=b.dataset.cat===st.cat;b.classList.toggle('is-active',on);b.setAttribute('aria-selected',String(on));});
    count.textContent='共 '+list.length+' 筆原站公開紀錄　·　資料快照 '+D.sourceSnapshot;
    rows.innerHTML=shown.length?shown.map(row).join(''):'<p class="empty">沒有符合條件的消息紀錄。</p>';
    if(mobile.matches){pager.hidden=true;more.hidden=st.shown>=list.length;}else{more.hidden=true;pager.hidden=pages<2;var h='<button type="button" data-p="'+(st.page-1)+'"'+(st.page<2?' disabled':'')+' aria-label="上一頁">←</button>';for(var n=1;n<=pages;n++){if(n===1||n===pages||Math.abs(n-st.page)<=1)h+='<button type="button" data-p="'+n+'"'+(n===st.page?' aria-current="page"':'')+'>'+n+'</button>';else if(Math.abs(n-st.page)===2)h+='<span>…</span>';}h+='<button type="button" data-p="'+(st.page+1)+'"'+(st.page>=pages?' disabled':'')+' aria-label="下一頁">→</button>';pager.innerHTML=h;}sync();}
  tabs.addEventListener('click',function(e){var b=e.target.closest('.tab');if(!b)return;st.cat=b.dataset.cat;st.subcat='';st.page=1;st.shown=PER;refreshSubcats();render();});
  pager.addEventListener('click',function(e){var b=e.target.closest('button[data-p]');if(!b||b.disabled)return;st.page=+b.dataset.p;render();window.scrollTo({top:document.querySelector('.n-list').getBoundingClientRect().top+scrollY-90,behavior:'smooth'});});
  more.addEventListener('click',function(){st.shown+=PER;render();});
  year.addEventListener('change',function(){st.year=year.value;st.page=1;st.shown=PER;render();});
  subcat.addEventListener('change',function(){st.subcat=subcat.value;st.page=1;st.shown=PER;render();});
  var timer;q.addEventListener('input',function(){clearTimeout(timer);timer=setTimeout(function(){st.q=q.value;st.page=1;st.shown=PER;render();},180);});
  mobile.addEventListener('change',render);renderFeatures();render();
})();
