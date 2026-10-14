(function(){
  var data=window.TIB_BOOKS;
  var tabs=document.querySelector('.b-list .tabs');
  var grid=document.getElementById('b-grid');
  var count=document.querySelector('.b-list .n-count');
  var search=document.getElementById('b-q');
  var feature=document.getElementById('b-feat');
  var dialog=document.getElementById('b-dlg');
  if(!data||!tabs||!grid||!count||!search||!feature||!dialog)return;

  var categoryNames={};
  data.cats.forEach(function(category){categoryNames[category.id]=category.name;});
  var params=new URLSearchParams(location.search);
  var state={category:params.get('cat')||'',query:params.get('q')||''};
  if(!data.cats.some(function(category){return category.id===state.category;}))state.category='';
  search.value=state.query;

  function escape(value){
    return String(value||'').replace(/[&<>"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char];});
  }
  function inquiryLink(book){
    var subject=encodeURIComponent('出版品洽詢：'+book.title);
    return 'mailto:taichung@tib.org.tw?subject='+subject;
  }
  function cover(book,variant){
    var media=book.cover?'<img src="'+escape(book.cover)+'" alt="《'+escape(book.title)+'》書封" loading="lazy" decoding="async">':'';
    var marker=book.cover?'封面':'封面待補';
    return '<span class="b-cover b-cover--'+variant+' b-cover--topic-'+escape(book.cat)+(book.cover?' has-image':'')+'">'+media+
      '<span class="b-cover__fallback"><span class="b-cover__series">TIB · KNOWLEDGE</span><strong>'+escape(book.title)+'</strong><small>'+marker+'</small></span></span>';
  }
  function meta(book){
    var values=[];
    if(book.publishedDate)values.push(book.publishedDate);
    if(book.price)values.push('NT$ '+book.price);
    return values;
  }
  function featureMarkup(book){
    var facts=meta(book).map(function(value){return '<span>'+escape(value)+'</span>';}).join('');
    feature.innerHTML='<article class="b-feat__inner"><div class="b-feat__visual">'+cover(book,'feature')+
      '<span class="b-feat__index">TIB · PUBLICATIONS</span></div><div class="b-feat__body">'+
      '<div class="b-feat__tag"><span class="tag tag--solid">精選出版</span><span>'+escape(categoryNames[book.cat]||'出版品')+'</span></div>'+
      '<h2>'+escape(book.title)+'</h2>'+(book.subtitle?'<p class="b-sub">'+escape(book.subtitle)+'</p>':'')+
      '<p class="b-by">'+escape(book.author)+'</p><p class="b-desc">'+escape(book.summary||'本頁未刊載書籍簡介，歡迎洽詢出版資訊。')+'</p>'+
      '<div class="b-feat__meta">'+facts+'</div><div class="b-cta">'+
      '<a class="btn btn--solid" href="'+inquiryLink(book)+'">來信詢問此書 →</a>'+
      '<button type="button" class="btn btn--line" data-open="'+escape(book.id)+'">查看出版資訊</button></div></div></article>';
  }
  function card(book){
    var facts=meta(book).map(function(value){return '<span>'+escape(value)+'</span>';}).join('<i aria-hidden="true">·</i>');
    return '<li><button type="button" class="b-card" data-open="'+escape(book.id)+'" aria-label="查看《'+escape(book.title)+'》出版資訊">'+
      '<span class="b-card__visual">'+cover(book,'card')+'</span><span class="b-card__text">'+
      '<span class="b-card__cat">'+escape(categoryNames[book.cat]||'出版品')+'</span><span class="b-card__title">'+escape(book.title)+'</span>'+
      (book.subtitle?'<span class="b-card__subtitle">'+escape(book.subtitle)+'</span>':'')+
      '<span class="b-card__by">'+escape(book.author||'')+'</span>'+
      (facts?'<span class="b-card__meta">'+facts+'</span>':'')+
      '<span class="b-card__more">查看書籍資訊 <span aria-hidden="true">↗</span></span></span></button></li>';
  }
  function render(){
    var query=state.query.trim().toLocaleLowerCase();
    var books=data.items.filter(function(book){
      var searchable=[book.title,book.subtitle,book.author,book.publishedDate,book.summary,book.specs].join(' ').toLocaleLowerCase();
      return (!state.category||book.cat===state.category)&&(!query||searchable.indexOf(query)!==-1);
    });
    tabs.querySelectorAll('[data-cat]').forEach(function(button){
      var active=button.dataset.cat===state.category;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',String(active));
    });
    grid.innerHTML=books.length?books.map(card).join(''):'<li class="b-empty">沒有找到符合條件的出版品，請試試其他關鍵字或分類。</li>';
    count.textContent='目前顯示 '+books.length+' 本，共 '+data.items.length+' 本書目';
    var next=new URLSearchParams();
    if(state.category)next.set('cat',state.category);
    if(state.query.trim())next.set('q',state.query.trim());
    history.replaceState(null,'',location.pathname+(next.toString()?'?'+next.toString():''));
  }
  function openDetails(id){
    var book=data.items.find(function(item){return item.id===id;});
    if(!book)return;
    var specs=[['作者',book.author],['出版日期',book.publishedDate],['定價',book.price?'NT$ '+book.price:''],['規格',book.specs]].filter(function(row){return !!row[1];});
    var metadata=specs.map(function(row){return '<div><dt>'+escape(row[0])+'</dt><dd>'+escape(row[1])+'</dd></div>';}).join('');
    var toc=book.toc?'<details class="b-toc"><summary>展開目錄資訊</summary><pre>'+escape(book.toc)+'</pre></details>':'';
    var summary=book.summary?'<p class="b-dlg__summary">'+escape(book.summary)+'</p>':'<p class="b-dlg__summary b-dlg__summary--note">參考書目頁未刊載此書簡介或出版規格，可來信或來電洽詢。</p>';
    dialog.querySelector('.b-dlg__in').innerHTML='<button type="button" class="b-dlg__x" aria-label="關閉書籍資訊">×</button>'+cover(book,'detail')+
      '<div class="b-dlg__body"><div class="b-card__cat">'+escape(categoryNames[book.cat]||'出版品')+'</div><h2 id="b-dlg-t">'+escape(book.title)+'</h2>'+
      (book.subtitle?'<p class="b-dlg__subtitle">'+escape(book.subtitle)+'</p>':'')+
      (book.award?'<p class="b-dlg__award">'+escape(book.award)+'</p>':'')+summary+
      (metadata?'<dl class="b-dlg__facts">'+metadata+'</dl>':'')+toc+
      '<div class="b-cta"><a class="btn btn--solid" href="'+inquiryLink(book)+'">來信詢問此書 →</a><a class="btn btn--line" href="tel:+886423028277">電話洽詢</a></div></div>';
    dialog.showModal();
  }

  tabs.innerHTML=data.cats.map(function(category){return '<button type="button" class="tab" data-cat="'+escape(category.id)+'" aria-pressed="false">'+escape(category.name)+'</button>';}).join('');
  var featured=data.items.find(function(book){return book.id===data.featured;});
  if(featured)featureMarkup(featured);
  tabs.addEventListener('click',function(event){
    var button=event.target.closest('[data-cat]');
    if(!button)return;
    state.category=button.dataset.cat;
    render();
  });
  search.addEventListener('input',function(){state.query=search.value;render();});
  document.addEventListener('click',function(event){
    var opener=event.target.closest('[data-open]');
    if(opener){openDetails(opener.dataset.open);return;}
    if(event.target.closest('.b-dlg__x'))dialog.close();
  });
  dialog.addEventListener('click',function(event){if(event.target===dialog)dialog.close();});
  document.addEventListener('error',function(event){
    if(event.target.tagName==='IMG'&&event.target.closest('.b-cover'))event.target.closest('.b-cover').classList.remove('has-image');
  },true);
  render();
})();
