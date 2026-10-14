(function(){
  var D=window.TIB_COURSES;
  if(!D)return;
  var id=new URLSearchParams(location.search).get('id');
  var course=D.items.find(function(item){return item.id===id||(item.sourceIds||[]).indexOf(id)>-1;});
  var title=document.getElementById('course-title'),crumb=document.getElementById('course-crumb');
  var lead=document.getElementById('course-lead'),year=document.getElementById('course-year');
  var facts=document.getElementById('course-facts'),teacher=document.getElementById('course-teacher');
  var outline=document.getElementById('course-outline'),raw=document.getElementById('course-original-description');
  var statusNode=document.getElementById('course-status'),actions=document.getElementById('course-actions');
  var sources=document.getElementById('course-sources'),images=document.getElementById('course-images'),imageSection=document.getElementById('course-images-section');
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
  function status(item){
    var enrol=dateRange(item.enrolment),now=new Date();
    if(enrol.length){var begin=enrol[0],end=enrol[enrol.length-1];end.setHours(23,59,59,999);return now<begin?'招生尚未開始':now<=end?'報名期間內':'報名已截止';}
    var classes=dateRange(item.classPeriod);
    return classes.length&&classes[classes.length-1]<now?'課程已結束':'歷年資料';
  }
  function fee(value){return value===null||value===undefined?'原站未載':'NT$ '+Number(value).toLocaleString('en-US');}
  function fact(label,value){return '<div><dt>'+esc(label)+'</dt><dd>'+esc(value||'原站未載')+'</dd></div>';}
  function renderText(value){
    var lines=String(value||'').split(/\n+/).map(function(line){return line.trim();}).filter(Boolean);
    return lines.length?lines.map(function(line){return '<p>'+esc(line)+'</p>';}).join(''):'<p>原站頁面未提供其他課程說明。</p>';
  }
  if(!course){
    document.querySelector('.course-detail__grid').innerHTML='<div class="course-detail__missing"><div class="kicker">Record not found</div><h2>找不到這筆課程紀錄</h2><p>請回到課程列表重新選擇一筆資料。</p><a class="btn btn--solid" href="courses.html">返回課程列表</a></div>';
    title.textContent='找不到課程紀錄';crumb.textContent='資料不存在';lead.textContent='請從課程資訊列表選擇原站公開的課程。';
    return;
  }
  var category=course.category||course.cat;
  title.textContent=course.title;crumb.textContent=course.title;lead.textContent=(course.teacher?'講師　'+course.teacher+'　·　':'')+category+'　·　原站公開紀錄';
  year.textContent=course.year?'民國 '+course.year+' 年度':'課程年度依原站資料';
  document.title=course.title+'｜課程資訊｜財團法人企業大學文教基金會 TIB';
  var rows=[];
  rows.push(fact('課程類別',category));
  rows.push(fact('課程年度',course.year?'民國 '+course.year+' 年':'原站未載'));
  rows.push(fact('報名期間',course.enrolment));
  rows.push(fact('上課日期',course.classPeriod));
  rows.push(fact('上課時間',course.time));
  rows.push(fact('總時數',course.hours?course.hours+' 小時':''));
  rows.push(fact('課程費用',fee(course.fee)));
  if(course.code)rows.push(fact('課程代碼',course.code));
  facts.innerHTML=rows.join('');
  if(course.teacherBio){teacher.hidden=false;teacher.innerHTML='<h3>講師經歷</h3>'+renderText(course.teacherBio.replace(/\s+·\s+/g,'\n'));}
  var rowsOfOutline=course.outline||[];
  if(rowsOfOutline.length){
    var columns=Object.keys(rowsOfOutline[0]);
    outline.innerHTML='<div class="course-detail__table-wrap"><table class="course-detail__table"><thead><tr>'+columns.map(function(column){return '<th scope="col">'+esc(column)+'</th>';}).join('')+'</tr></thead><tbody>'+rowsOfOutline.map(function(record){return '<tr>'+columns.map(function(column){return '<td>'+esc(record[column])+'</td>';}).join('')+'</tr>';}).join('')+'</tbody></table></div>';
  }else{
    outline.innerHTML='<div class="course-detail__copy">'+renderText(course.detailText)+'</div>';
  }
  raw.innerHTML='<div class="course-detail__copy">'+renderText(course.detailText)+'</div>';
  statusNode.textContent=status(course);
  statusNode.classList.toggle('is-closed',/截止|結束/.test(statusNode.textContent));
  var links=[];
  if(course.registrationUrl){
    var linkLabel=status(course).indexOf('報名期間內')>-1?'前往在職訓練網報名 ↗':'查看在職訓練網原始紀錄 ↗';
    links.push('<a class="course-detail__button course-detail__button--solid" href="'+esc(course.registrationUrl)+'" target="_blank" rel="noopener">'+linkLabel+'</a>');
  }
  if(!links.length)links.push('<p class="course-detail__unavailable">原站未提供報名平台連結。</p>');
  actions.innerHTML=links.join('');
  sources.innerHTML=(course.sourceUrls||[course.sourceUrl]).map(function(url,index){
    var label=url.indexOf('product_cg363086.html')>-1?'最新課程分類原始列':'課程分類原始列'+((course.sourceUrls||[]).length>1?' '+(index+1):'');
    return '<li><a href="'+esc(url)+'" target="_blank" rel="noopener">'+esc(label)+' ↗</a></li>';
  }).join('');
  var media=[];
  if(course.poster)media.push({url:course.poster,alt:course.title+' 原站課程圖片'});
  (course.images||[]).forEach(function(image){if(media.length<5&&media.every(function(item){return item.url!==image.url;}))media.push(image);});
  if(media.length){
    imageSection.hidden=false;
    images.innerHTML=media.map(function(image){return '<figure><a href="'+esc(image.url)+'" target="_blank" rel="noopener"><img src="'+esc(image.url)+'" alt="'+esc(image.alt||course.title+' 原站課程素材')+'" loading="lazy" decoding="async"><span>開啟原始圖片 ↗</span></a></figure>';}).join('');
    images.querySelectorAll('img').forEach(function(img){img.addEventListener('error',function(){img.closest('figure').classList.add('is-unavailable');});});
  }
})();
