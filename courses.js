(function(){
  var D=window.TIB_COURSES; if(!D) return;
  var now=new Date(), qs=new URLSearchParams(location.search);
  var st={cat:qs.get('cat')||'',open:qs.get('open')==='1',loc:qs.get('loc')||''};
  var tabs=document.querySelector('.tabs'),rows=document.getElementById('rows'),count=document.querySelector('.n-count'),
      openBtn=document.getElementById('f-open'),loc=document.getElementById('f-loc'),feat=document.getElementById('featured');
  var catName={};D.cats.forEach(function(c){catName[c.id]=c.name;});
  var WD=['週日','週一','週二','週三','週四','週五','週六'];
  function d(s){return new Date(s.length>10?s:s+'T00:00');}
  function roc(s){return d(s).getFullYear()-1911;}
  function md(s){return s.slice(5,7)+'.'+s.slice(8,10);}
  function rocDate(s){return roc(s)+'.'+md(s);}
  function fee(n){return n?'NT$ '+n.toLocaleString('en-US'):'免費';}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function status(c){var a=d(c.enrolStart),b=d(c.enrolEnd);if(c.enrolEnd.length<=10)b.setHours(23,59,59);
    return now<a?'soon':now<=b?'open':'closed';}
  var LBL={open:'報名中',soon:'即將開放',closed:'已結束'};
  var items=D.items.map(function(c){c.st=status(c);return c;});
  var order={open:0,soon:1,closed:2};
  items.sort(function(a,b){return order[a.st]-order[b.st]||(a.st==='closed'?b.start.localeCompare(a.start):a.start.localeCompare(b.start));});
  tabs.innerHTML=D.cats.map(function(c){return '<button type="button" role="tab" class="tab" data-cat="'+c.id+'">'+esc(c.name)+'</button>';}).join('');
  loc.value=st.loc;
  function sample(c){return c.sample?'<small class="sample">示意</small>':'';}
  function renderFeat(){
    var c=items.find(function(i){return i.st==='open';})||items.slice().sort(function(a,b){return b.start.localeCompare(a.start);})[0];
    if(!c){feat.hidden=true;return;}
    var range=rocDate(c.start)+(c.end!==c.start?' – '+md(c.end):'');
    feat.innerHTML='<div class="c-feat__main">'+
      '<figure class="c-feat__visual"><img src="assets/course-session-example.webp" alt="講師於講堂授課、學員聆聽的課程情境示意" loading="lazy" decoding="async"><figcaption>課程交流情境示意</figcaption></figure>'+
      '<div class="c-feat__tags"><span class="tag">'+esc(catName[c.cat])+'</span>'+(c.ttip?'<span class="tag tag--gold">產業人才投資方案</span>':'')+'<span class="st st--'+c.st+'">'+(c.st==='closed'?'報名已截止':LBL[c.st])+'</span><span class="c-feat__lbl">'+(c.st==='open'?'熱門報名中':'最新課程')+'</span></div>'+
      '<h2>'+esc(c.title)+sample(c)+'</h2>'+
      '<p class="c-feat__teacher">講師　'+esc(c.teacher)+(c.teacherNote?' · '+esc(c.teacherNote):'')+'</p>'+
      '<dl class="c-feat__facts"><div><dt>上課日期</dt><dd class="num">'+range+'</dd></div><div><dt>上課時間</dt><dd>'+esc(c.time)+'</dd></div><div><dt>總時數</dt><dd class="num">'+c.hours+' <small>小時</small></dd></div><div><dt>費用</dt><dd class="num">'+fee(c.fee)+'</dd></div></dl>'+
      '<div class="c-feat__cta"><a class="btn btn--solid" href="#demo-dialog" data-demo-preview="course" data-demo-title="'+esc(c.title)+'" data-demo-status="'+esc(LBL[c.st])+'">課程資訊預覽</a><a class="btn btn--line" href="#demo-dialog" data-demo-preview="registration" data-demo-title="'+esc(c.title)+'" data-demo-status="'+esc(LBL[c.st])+'">報名流程示意</a></div>'+
    '</div><aside class="c-feat__side"><div class="c-feat__stag">報名方式</div><p class="c-feat__shead">正式開課資訊核定後，依公告方式報名</p>'+
      '<dl><div><dt>課程代碼</dt><dd class="num big">'+(c.code||'即將公佈')+'</dd></div><div><dt>報名期間</dt><dd>'+rocDate(c.enrolStart)+' – '+md(c.enrolEnd)+'</dd></div><div><dt>上課地點</dt><dd>'+esc(c.loc)+'教室</dd></div></dl>'+
      '<a class="c-feat__ojt" href="#demo-dialog" data-demo-preview="registration" data-demo-title="'+esc(c.title)+'" data-demo-status="'+esc(LBL[c.st])+'">查看報名方式示意 →</a></aside>';}
  function row(c){
    return '<a class="crow" href="#demo-dialog" data-demo-preview="course" data-demo-title="'+esc(c.title)+'" data-demo-status="'+esc(LBL[c.st])+'">'+
      '<div class="crow__date"><b>'+md(c.start)+'</b><span>民國 '+roc(c.start)+' 年 · '+WD[d(c.start).getDay()]+'</span><i>'+rocDate(c.start)+' <span>'+WD[d(c.start).getDay()]+'</span></i></div>'+
      '<div class="crow__main"><div class="crow__cat">'+esc(catName[c.cat])+(c.ttip?'<span class="tag tag--gold">產業人才投資方案</span>':'')+'</div><h3>'+esc(c.title)+sample(c)+'</h3><p class="crow__teacher">講師　'+esc(c.teacher)+'</p><p class="crow__meta">講師　'+esc(c.teacher)+' · '+esc(c.loc)+' · '+esc(c.time)+' · '+c.hours+' 小時 · '+fee(c.fee)+'</p></div>'+
      '<div class="crow__time">'+esc(c.time)+'<span>共 '+c.hours+' 小時</span></div>'+
      '<div class="crow__loc">'+esc(c.loc)+'</div>'+
      '<div class="crow__fee"><b>'+fee(c.fee)+'</b>'+(c.ttip?'<span>符合資格補助 80%</span>':'')+'</div>'+
      '<div class="crow__st"><span class="st st--'+c.st+'">'+LBL[c.st]+'</span><i aria-hidden="true">→</i></div></a>';}
  function render(){
    var list=items.filter(function(c){return (!st.cat||c.cat===st.cat)&&(!st.open||c.st==='open')&&(!st.loc||c.loc===st.loc);});
    tabs.querySelectorAll('.tab').forEach(function(b){var on=b.dataset.cat===st.cat;b.classList.toggle('is-active',on);b.setAttribute('aria-selected',on);});
    openBtn.setAttribute('aria-pressed',st.open);
    rows.innerHTML=list.length?list.map(row).join(''):'<p class="empty">此條件目前沒有課程'+(st.open?' · <button type="button" class="linkbtn" id="show-all">顯示全部課程</button>':'')+'</p>';
    var sa=document.getElementById('show-all');if(sa)sa.onclick=function(){st.open=false;render();};
    count.textContent='共 '+list.length+' 門課程 · 報名狀態依今日日期自動更新';
    var p=new URLSearchParams();if(st.cat)p.set('cat',st.cat);if(st.open)p.set('open','1');if(st.loc)p.set('loc',st.loc);
    history.replaceState(null,'',location.pathname+(p.toString()?'?'+p:''));}
  tabs.addEventListener('click',function(e){var b=e.target.closest('.tab');if(!b)return;st.cat=b.dataset.cat;render();});
  openBtn.addEventListener('click',function(){st.open=!st.open;render();});
  loc.addEventListener('change',function(){st.loc=loc.value;render();});
  renderFeat();render();
})();
