(function(){
  var D=window.TIB_COURSES;
  if(!D)return;
  var PER=8, mobile=window.matchMedia('(max-width:640px)');
  var qs=new URLSearchParams(location.search);
  var st={cat:qs.get('cat')||'',year:qs.get('year')||'',q:qs.get('q')||'',page:+qs.get('page')||1,shown:PER};
  var tabs=document.querySelector('.tabs'),rows=document.getElementById('rows'),count=document.getElementById('course-count'),
      pager=document.querySelector('.pager'),more=document.querySelector('.more'),year=document.getElementById('f-year'),q=document.getElementById('f-q'),
      featured=document.getElementById('featured');
  if(!tabs||!rows||!count||!year||!q)return;

  function esc(value){return String(value===null||value===undefined?'':value).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function parseDate(value){
    var m=String(value||'').match(/(?<!\d)(1\d{2}|20\d{2})\s*(?:年|\/|\.)\s*(\d{1,2})\s*(?:月|\/|\.)\s*(\d{1,2})/);
    if(!m)return null;
    var y=+m[1];if(y<1911)y+=1911;
    return new Date(y,+m[2]-1,+m[3]);
  }
  function dateRange(value){
    var matches=String(value||'').match(/(?:1\d{2}|20\d{2})\s*(?:年|\/|\.)\s*\d{1,2}\s*(?:月|\/|\.)\s*\d{1,2}/g)||[];
    return matches.map(parseDate).filter(Boolean);
  }
  function roc(year){return Number(year)-1911;}
  function status(course){
    var registration=dateRange(course.enrolment), now=new Date();
    if(registration.length){
      var start=registration[0],end=registration[registration.length-1];
      end.setHours(23,59,59,999);
      if(now<start)return 'soon';
      if(now<=end)return 'open';
      return 'closed';
    }
    var classes=dateRange(course.classPeriod);
    if(classes.length&&classes[classes.length-1]<now)return 'closed';
    return 'archive';
  }
  var statusLabel={open:'報名中',soon:'即將開放',closed:'已截止',archive:'歷年紀錄'};
  var categoryName={};
  D.cats.forEach(function(c){categoryName[c.id]=c.name;});
  var items=D.items.slice().sort(function(a,b){
    return String(b.year||'').localeCompare(String(a.year||''),'zh-Hant',{numeric:true})||
      String(b.start||'').localeCompare(String(a.start||''))||String(b.id||'').localeCompare(String(a.id||''));
  });
  var years=[...new Set(items.map(function(item){return item.year;}).filter(Boolean))].sort(function(a,b){return Number(b)-Number(a);});
  years.forEach(function(y){var option=document.createElement('option');option.value=y;option.textContent='民國 '+y+' 年';year.appendChild(option);});
  tabs.innerHTML=D.cats.map(function(c){return '<button type="button" role="tab" class="tab" data-cat="'+esc(c.id)+'">'+esc(c.name)+'</button>';}).join('');
  year.value=st.year;q.value=st.q;

  function fee(value){return value===null||value===undefined?'原站未載':'NT$ '+Number(value).toLocaleString('en-US');}
  function dateLine(course){
    if(course.start){
      var d=new Date(course.start+'T00:00:00');
      return {main:String(d.getMonth()+1).padStart(2,'0')+'.'+String(d.getDate()).padStart(2,'0'),year:'民國 '+roc(d.getFullYear())+' 年'};
    }
    return {main:course.year||'—',year:course.year?'年度':'日期未載'};
  }
  function filtered(){
    var keyword=st.q.trim().toLocaleLowerCase();
    return items.filter(function(item){
      var haystack=[item.title,item.teacher,item.teacherBio,item.category,item.year,item.classPeriod,item.time,item.enrolment,item.code,item.detailText,JSON.stringify(item.outline||[])].join(' ').toLocaleLowerCase();
      return (!st.cat||item.cat===st.cat)&&(!st.year||item.year===st.year)&&(!keyword||haystack.indexOf(keyword)>-1);
    });
  }
  function sourceSummary(course){
    var values=[];
    values.push(course.teacher?'師資　'+course.teacher:'師資依原站紀錄');
    var period=course.classPeriod||course.time;
    if(period)values.push(period);
    if(course.hours)values.push(course.hours+' 小時');
    if(course.fee!==null&&course.fee!==undefined)values.push(fee(course.fee));
    return values;
  }
  function row(course){
    var date=dateLine(course),state=status(course),url='course-detail.html?id='+encodeURIComponent(course.id);
    return '<a class="row course-row" href="'+url+'">'+
      '<div class="row__date"><b>'+esc(date.main)+'</b><span>'+esc(date.year)+'</span><i>'+esc(date.main)+' <span>'+esc(date.year)+'</span></i></div>'+
      '<div class="row__tag"><span class="tag tag--line">'+esc(categoryName[course.cat]||course.category)+'</span><span class="tag '+(state==='open'?'tag--solid':'tag--gold')+'">'+esc(statusLabel[state])+'</span></div>'+
      '<div class="row__body"><h3>'+esc(course.title)+'</h3><ul>'+sourceSummary(course).map(function(text){return '<li>'+esc(text)+'</li>';}).join('')+'</ul></div>'+
      '<div class="row__go" aria-hidden="true">→</div></a>';
  }
  function renderFeatured(){
    if(!featured)return;
    var spotlight=items.find(function(item){return item.type==='course'&&item.start;})||items[0];
    var courses=items.filter(function(item){return item.type==='course';}).length;
    var seminars=items.filter(function(item){return item.type==='seminar';}).length;
    if(!spotlight){featured.innerHTML='';return;}
    var facts=[
      ['開課日期',spotlight.classPeriod||'依原站年度課綱'],
      ['課程時段',spotlight.time||'詳見原站課程內容'],
      ['總時數',spotlight.hours?spotlight.hours+' 小時':'原站未載'],
      ['原站學費',fee(spotlight.fee)]
    ];
    featured.innerHTML='<div class="c-feat__main">'+
      '<div class="c-feat__tags"><span class="tag tag--line">'+esc(categoryName[spotlight.cat]||spotlight.category)+'</span><span class="st st--'+status(spotlight)+'">'+esc(statusLabel[status(spotlight)])+'</span><span class="c-feat__lbl">原站課程紀錄</span></div>'+
      '<h2>'+esc(spotlight.title)+'</h2><p class="c-feat__teacher">講師　'+esc(spotlight.teacher||'依原站紀錄')+'</p>'+
      '<dl class="c-feat__facts">'+facts.map(function(f){return '<div><dt>'+esc(f[0])+'</dt><dd>'+esc(f[1])+'</dd></div>';}).join('')+'</dl>'+
      '<div class="c-feat__cta"><a class="btn btn--solid" href="course-detail.html?id='+encodeURIComponent(spotlight.id)+'">查看課程詳情</a><a class="btn btn--line" href="'+esc(spotlight.sourceUrl)+'" target="_blank" rel="noopener">開啟原站紀錄 ↗</a></div></div>'+
      '<aside class="c-feat__side"><div class="c-feat__stag">Course archive</div><p class="c-feat__shead">完整收錄原站公開的課程與研討會資料</p><dl>'+
      '<div><dt>實務課程</dt><dd class="big">'+courses+' 筆</dd></div><div><dt>研討會</dt><dd class="big">'+seminars+' 筆</dd></div><div><dt>公開年度</dt><dd>民國 106—115 年</dd></div><div><dt>資料來源</dt><dd>原站分類頁 · 2026.10</dd></div></dl>'+
      '<a class="c-feat__ojt" href="https://www.tib.org.tw/product.html" target="_blank" rel="noopener">核對 TIB 原版課程資訊 ↗</a></aside>';
  }
  function sync(){
    var params=new URLSearchParams();
    if(st.cat)params.set('cat',st.cat);if(st.year)params.set('year',st.year);if(st.q)params.set('q',st.q);
    if(st.page>1&&!mobile.matches)params.set('page',st.page);
    history.replaceState(null,'',location.pathname+(params.toString()?'?'+params:''));
  }
  function render(){
    var list=filtered(),pages=Math.max(1,Math.ceil(list.length/PER));
    if(st.page>pages)st.page=pages;
    var shown=mobile.matches?list.slice(0,st.shown):list.slice((st.page-1)*PER,st.page*PER);
    tabs.querySelectorAll('.tab').forEach(function(button){var active=button.dataset.cat===st.cat;button.classList.toggle('is-active',active);button.setAttribute('aria-selected',String(active));});
    year.value=st.year;q.value=st.q;
    count.textContent='共 '+list.length+' 筆原站公開紀錄 · 課程與研討會依上課日期排序';
    rows.innerHTML=shown.length?shown.map(row).join(''):'<p class="empty">沒有符合條件的課程紀錄。</p>';
    if(mobile.matches){pager.hidden=true;more.hidden=st.shown>=list.length;}
    else{
      more.hidden=true;pager.hidden=pages<2;
      var html='<button type="button" data-p="'+(st.page-1)+'"'+(st.page<2?' disabled':'')+' aria-label="上一頁">←</button>';
      for(var n=1;n<=pages;n++){
        if(n===1||n===pages||Math.abs(n-st.page)<=1)html+='<button type="button" data-p="'+n+'"'+(n===st.page?' aria-current="page"':'')+'>'+n+'</button>';
        else if(Math.abs(n-st.page)===2)html+='<span>…</span>';
      }
      html+='<button type="button" data-p="'+(st.page+1)+'"'+(st.page>=pages?' disabled':'')+' aria-label="下一頁">→</button>';
      pager.innerHTML=html;
    }
    sync();
  }
  tabs.addEventListener('click',function(event){var button=event.target.closest('.tab');if(!button)return;st.cat=button.dataset.cat;st.page=1;st.shown=PER;render();});
  pager.addEventListener('click',function(event){var button=event.target.closest('button[data-p]');if(!button||button.disabled)return;st.page=+button.dataset.p;render();window.scrollTo({top:document.querySelector('.n-list').getBoundingClientRect().top+scrollY-90,behavior:'smooth'});});
  more.addEventListener('click',function(){st.shown+=PER;render();});
  year.addEventListener('change',function(){st.year=year.value;st.page=1;st.shown=PER;render();});
  var timer;q.addEventListener('input',function(){clearTimeout(timer);timer=setTimeout(function(){st.q=q.value;st.page=1;st.shown=PER;render();},200);});
  mobile.addEventListener('change',render);
  renderFeatured();render();
})();
