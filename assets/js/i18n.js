/* SoBa — ortak dil motoru.
 * Kullanım: sayfa, bu dosyadan ÖNCE `window.PAGE_I18N = {tr:{...},en:{...},de:{...},fr:{...}}` tanımlar.
 * HTML'de:
 *   data-i18n="key"              → textContent
 *   data-i18n-html="key"         → innerHTML (güvenilir, kendi yazdığımız metin için)
 *   data-i18n-attr="alt:key,title:key2" → nitelikler
 * Özel anahtarlar: meta_title, meta_desc → <title>, description, og:*, twitter:*
 * Dil seçimi: ?lang=xx → localStorage (kullanıcının önceki seçimi) → tr
 * Türkçe temiz URL'de, diğer diller ?lang=xx ile temsil edilir (hreflang ile uyumlu).
 * Tarayıcı diline göre otomatik seçim BİLEREK yok: hreflang'ın işlemesi için temiz URL'in
 * içeriği her ziyaretçi (ve Googlebot) için aynı olmalı. Yabancı ziyaretçi arama motorundan
 * zaten ?lang=xx adresine gelir; ilk kez temiz URL'e gelen ise üstteki EN/DE/FR düğmelerini görür.
 */
(function(){
  var LANGS=["tr","en","de","fr"];
  var COMMON={
    tr:{tag:"oyun stüdyosu",nav_home:"Ana Sayfa",nav_games:"Oyunlar",nav_privacy:"Gizlilik",nav_support:"Destek",
        foot_rights:"© 2026 SoBa · soba.games",foot_contact:"İletişim:",lang_label:"Dil seçimi"},
    en:{tag:"game studio",nav_home:"Home",nav_games:"Games",nav_privacy:"Privacy",nav_support:"Support",
        foot_rights:"© 2026 SoBa · soba.games",foot_contact:"Contact:",lang_label:"Language"},
    de:{tag:"Spielestudio",nav_home:"Start",nav_games:"Spiele",nav_privacy:"Datenschutz",nav_support:"Support",
        foot_rights:"© 2026 SoBa · soba.games",foot_contact:"Kontakt:",lang_label:"Sprache"},
    fr:{tag:"studio de jeux",nav_home:"Accueil",nav_games:"Jeux",nav_privacy:"Confidentialité",nav_support:"Assistance",
        foot_rights:"© 2026 SoBa · soba.games",foot_contact:"Contact :",lang_label:"Langue"}
  };
  var PAGE=window.PAGE_I18N||{};
  function dict(l){var d={},k;for(k in COMMON[l])d[k]=COMMON[l][k];if(PAGE[l])for(k in PAGE[l])d[k]=PAGE[l][k];return d;}

  function langUrl(l){
    var p=location.pathname;
    return l==="tr"?p:p+"?lang="+l;
  }
  function setMeta(sel,val){var el=document.querySelector(sel);if(el&&val!==undefined)el.setAttribute("content",val);}

  function setLang(l,push){
    if(LANGS.indexOf(l)<0)l="tr";
    var d=dict(l);
    document.documentElement.lang=l;
    try{localStorage.setItem("soba_lang",l)}catch(e){}

    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var k=el.getAttribute("data-i18n");if(d[k]!==undefined)el.textContent=d[k];});
    document.querySelectorAll("[data-i18n-html]").forEach(function(el){
      var k=el.getAttribute("data-i18n-html");if(d[k]!==undefined)el.innerHTML=d[k];});
    document.querySelectorAll("[data-i18n-attr]").forEach(function(el){
      el.getAttribute("data-i18n-attr").split(",").forEach(function(pair){
        var a=pair.split(":");if(a.length===2&&d[a[1].trim()]!==undefined)el.setAttribute(a[0].trim(),d[a[1].trim()]);});});

    if(d.meta_title){document.title=d.meta_title;setMeta('meta[property="og:title"]',d.meta_title);setMeta('meta[name="twitter:title"]',d.meta_title);}
    if(d.meta_desc){setMeta('meta[name="description"]',d.meta_desc);setMeta('meta[property="og:description"]',d.meta_desc);setMeta('meta[name="twitter:description"]',d.meta_desc);}
    setMeta('meta[property="og:locale"]',{tr:"tr_TR",en:"en_US",de:"de_DE",fr:"fr_FR"}[l]);

    var url=langUrl(l), abs=location.origin+url;
    var can=document.querySelector('link[rel="canonical"]');if(can)can.setAttribute("href",abs);
    setMeta('meta[property="og:url"]',abs);
    if(push&&history.replaceState){try{history.replaceState(null,"",url+location.hash)}catch(e){}}

    document.querySelectorAll(".langs a").forEach(function(a){
      var al=a.getAttribute("data-lang");
      a.classList.toggle("on",al===l);
      a.setAttribute("href",langUrl(al));
      if(al===l)a.setAttribute("aria-current","true");else a.removeAttribute("aria-current");
    });
    // Site içi linklerde dili koru (tr temiz URL)
    document.querySelectorAll("a[data-keep-lang]").forEach(function(a){
      var base=a.getAttribute("data-keep-lang");
      a.setAttribute("href",l==="tr"?base:base+"?lang="+l);
    });
    document.dispatchEvent(new CustomEvent("soba:lang",{detail:l}));
  }

  document.querySelectorAll(".langs a").forEach(function(a){
    a.addEventListener("click",function(e){e.preventDefault();setLang(a.getAttribute("data-lang"),true);});
  });

  var q=new URLSearchParams(location.search).get("lang");
  var saved=null;try{saved=localStorage.getItem("soba_lang")}catch(e){}
  var initial=q||saved||"tr";
  if(LANGS.indexOf(initial)<0)initial="tr";
  // ?lang verilmişse URL'i olduğu gibi bırak; kayıtlı tercihten geliyorsa URL'i ona uydur
  setLang(initial,!q);
  window.sobaSetLang=setLang;
})();
