(function(){
  var data=window.TIB_NEWS;if(!data)return;
  function esc(v){return String(v===null||v===undefined?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function safeUrl(u){try{var x=new URL(u,location.href);return x.protocol==='http:'||x.protocol==='https:'?x.href:'';}catch(e){return '';}}
  function roc(y){return Number(y)-1911;}
  var params=new URLSearchParams(location.search),id=params.get('id'),item=data.items.find(function(x){return x.id===id;});
  if(!item){document.querySelector('main').innerHTML='<section class="n-hero"><div class="wrap"><div><nav class="crumb"><a href="index.html">首頁</a><span>/</span><a href="news.html">最新消息</a></nav><div class="kicker kicker--rule">News Record</div><h1>找不到這筆消息</h1><p class="n-hero__lead">查無符合原站紀錄的消息編號，請返回消息列表重新選擇。</p><a class="course-detail__back" href="news.html">← 返回最新消息</a></div></div></section>';return;}
  function dateText(){if(item.date){var d=new Date(item.date+'T00:00:00');return '民國 '+roc(d.getFullYear())+' 年 '+(d.getMonth()+1)+' 月 '+d.getDate()+' 日';}return item.year?'民國 '+roc(item.year)+' 年，原站未載精確日期':'原站未載日期';}
  document.title=item.title+'｜最新消息｜財團法人企業大學文教基金會 TIB';
  document.getElementById('news-title').textContent=item.title;
  document.getElementById('news-lead').textContent=item.excerpt||'原站紀錄以圖片或附件呈現，完整內容請參閱下方資料。';
  document.getElementById('news-category-crumb').textContent=item.category;
  document.getElementById('news-category').textContent=item.categoryPath.join(' / ')||item.category;
  document.getElementById('news-date').textContent=dateText();
  var source=safeUrl(item.sourceUrl)||'https://www.tib.org.tw/hot.html',cat=safeUrl(item.categoryUrl)||'https://www.tib.org.tw/hot.html';
  ['news-source','news-source-button'].forEach(function(id){var a=document.getElementById(id);a.href=source;});
  document.getElementById('news-category-button').href=cat;
  var body=document.getElementById('news-body'),lines=(item.body||'').split(/\n+/).map(function(x){return x.trim();}).filter(Boolean);
  if(lines.length)body.innerHTML=lines.map(function(x){return '<p>'+esc(x)+'</p>';}).join('');
  else body.innerHTML='<p>原站此筆紀錄未提供可擷取的本文文字；請參閱下方原站圖片、附件及來源頁。</p>';
  var imgwrap=document.getElementById('news-images-section'),imgs=document.getElementById('news-images');
  if(item.images&&item.images.length){
    imgwrap.hidden=false;
    imgs.innerHTML=item.images.map(function(img,n){var u=safeUrl(img.url);if(!u)return '';return '<figure><a href="'+esc(u)+'" target="_blank" rel="noopener"><img style="display:none" src="'+esc(u)+'" alt="'+esc(img.alt||item.title+' 圖片 '+(n+1))+'" decoding="async"><figcaption>原站圖片 '+(n+1)+'　↗</figcaption></a></figure>';}).join('');
    var figures=[...imgs.querySelectorAll('figure')],settled=0,loaded=0;
    function imageDone(image,ok){if(image.dataset.checked)return;image.dataset.checked='true';settled++;if(ok){loaded++;image.style.display='';}else{image.closest('figure').remove();}if(settled===figures.length&&!loaded){imgs.innerHTML='<a class="news-detail__image-fallback" href="'+esc(source)+'" target="_blank" rel="noopener"><span>原站收錄 '+figures.length+' 張圖片</span><b>開啟原站消息查看圖片 ↗</b></a>';}}
    figures.forEach(function(figure){var image=figure.querySelector('img');image.addEventListener('load',function(){imageDone(image,true)},{once:true});image.addEventListener('error',function(){imageDone(image,false)},{once:true});if(image.complete)imageDone(image,image.naturalWidth>0);});
  }
  var linkwrap=document.getElementById('news-links-section'),linklist=document.getElementById('news-links');
  if(item.links&&item.links.length){linkwrap.hidden=false;linklist.innerHTML=item.links.map(function(link){var u=safeUrl(link.url);return u?'<li><a href="'+esc(u)+'" target="_blank" rel="noopener"><span>'+esc(link.text)+'</span><span aria-hidden="true">↗</span></a></li>':'';}).join('');}
  var facts=[['原站分類',item.category],['原站編號',item.id],['日期依據',item.dateSource],['資料快照',data.sourceSnapshot]];
  document.getElementById('news-facts').innerHTML=facts.map(function(f){return '<div><dt>'+esc(f[0])+'</dt><dd>'+esc(f[1])+'</dd></div>';}).join('');
  var prov=['資料來源：TIB 原版最新消息頁與原站分類／詳情頁。','發布日期：'+dateText()+'。','日期標記：'+item.dateSource+'。','原站詳情：'+item.sourceUrl,'原站分類：'+item.categoryUrl];
  document.getElementById('news-provenance').innerHTML=prov.map(function(p){return '<p>'+esc(p)+'</p>';}).join('');
})();
