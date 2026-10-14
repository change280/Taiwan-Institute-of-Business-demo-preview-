(function(){
  var copy={
    language:{tag:'LANGUAGE PREVIEW',title:'英文版展示準備中',body:'目前展示版本以繁體中文呈現。英文入口保留為介面預覽，翻譯內容與正式發布時間待核定。',note:'返回頁面即可繼續觀看繁體中文內容。'},
    charter:{tag:'DOCUMENT PREVIEW',title:'捐助章程預覽',body:'這裡展示新版文件閱讀視窗的版型。正式版本將置入經核准的完整章程文件，目前未載入章程內文。',note:'文件內容與下載檔案須完成核對後再公開。'},
    organization:{tag:'ORGANIZATION PREVIEW',title:'組織架構預覽',body:'新版組織架構的閱讀版型已備妥，圖表內容會在現行組織資料核定後放入。',note:'本視窗不代表正式組織圖已發布。'},
    'basic-info':{tag:'PUBLIC INFORMATION',title:'基金會基本資料預覽',body:'此入口會在正式版呈現基金會核准公開的基本資料；Demo 先展示頁面樣式與閱讀動線。',note:'公開欄位及聯絡時間仍須以業主核定資料為準。'},
    course:{tag:'COURSE PREVIEW',title:'課程資訊預覽',body:'這筆課程資料用來展示分類、日期、地點及課程說明的呈現方式。標有「示意」的內容不代表正式開班或招生。',note:'本次展示不會提交報名資料。'},
    registration:{tag:'ENROLMENT PREVIEW',title:'報名流程示意',body:'此互動用來說明課程資訊與報名入口之間的流程。正式報名須以核准開課資料及主辦單位公告為準。',note:'Demo 不會連線、開啟外部報名頁或送出個人資料。'},
    subscribe:{tag:'SUBSCRIPTION PREVIEW',title:'訂閱操作示意',body:'畫面互動已完成；這次展示沒有寄出或保存任何電子郵件地址。',note:'正式訂閱服務、隱私說明與退訂流程待建置。'},
    issue:{tag:'PUBLICATION PREVIEW',title:'企大通訊期刊預覽',body:'這裡展示期刊摘要與閱讀入口。正式閱讀頁將連接已核對的完整內容與下載檔案。',note:'本次展示不會開啟舊站頁面或下載檔案。'},
    news:{tag:'NEWS PREVIEW',title:'消息內容預覽',body:'消息列表提供日期、分類及摘要，讓訪客先掌握文章主題。正式文章頁完成內容核對後，會由這裡進入完整內容。',note:'此視窗為前端展示狀態，沒有連接舊站文章。'},
    publication:{tag:'BOOK PREVIEW',title:'出版品資訊預覽',body:'精選出版品卡片已套用業主提供的實際書封，可檢視書目層級與出版品列表樣式。',note:'正式版本、定價及購書資料仍以出版社核定資訊為準。'}
  };
  var dialog=document.createElement('dialog');
  dialog.className='demo-dialog';
  dialog.id='demo-dialog';
  dialog.setAttribute('aria-labelledby','demo-dialog-title');
  dialog.innerHTML='<div class="demo-dialog__panel"><div class="demo-dialog__head"><span class="demo-dialog__eyebrow">TIB　/　DEMO PREVIEW</span><button class="demo-dialog__close" type="button" aria-label="關閉預覽">×</button></div><div class="demo-dialog__body"><div class="demo-dialog__tag"></div><h2 class="demo-dialog__title" id="demo-dialog-title"></h2><p class="demo-dialog__copy"></p><p class="demo-dialog__note"></p><div class="demo-dialog__actions"><button class="demo-dialog__done" type="button">返回頁面</button></div></div></div>';
  document.body.appendChild(dialog);
  var title=dialog.querySelector('.demo-dialog__title'),tag=dialog.querySelector('.demo-dialog__tag'),body=dialog.querySelector('.demo-dialog__copy'),note=dialog.querySelector('.demo-dialog__note');
  function openPreview(trigger){
    var kind=trigger.dataset.demoPreview,preset=copy[kind];
    if(!preset)return;
    var card=trigger.closest('.book,.row,.crow,.issue,.f-issue');
    var displayTitle=trigger.dataset.demoTitle||(card&&card.querySelector('h2,h3')&&card.querySelector('h2,h3').textContent.trim());
    tag.textContent=preset.tag;
    title.textContent=displayTitle||preset.title;
    body.textContent=(kind==='news'&&trigger.dataset.demoSummary?trigger.dataset.demoSummary+'。':'')+preset.body+(kind==='course'&&trigger.dataset.demoStatus?' 目前畫面狀態：'+trigger.dataset.demoStatus+'。':'');
    note.textContent=preset.note;
    dialog.showModal();
    dialog.querySelector('.demo-dialog__close').focus();
  }
  document.addEventListener('click',function(event){
    var trigger=event.target.closest('[data-demo-preview]');
    if(!trigger)return;
    event.preventDefault();
    if(trigger.dataset.demoPreview==='subscribe'){
      var input=document.getElementById('sub-email'),status=document.getElementById('subscribe-status');
      if(!input||!input.checkValidity()){if(input)input.reportValidity();return;}
      if(status)status.textContent='展示操作完成；本次沒有寄出或儲存任何信箱資料。';
      input.value='';
      return;
    }
    openPreview(trigger);
  });
  dialog.querySelector('.demo-dialog__close').addEventListener('click',function(){dialog.close();});
  dialog.querySelector('.demo-dialog__done').addEventListener('click',function(){dialog.close();});
  dialog.addEventListener('click',function(event){if(event.target===dialog)dialog.close();});
})();
