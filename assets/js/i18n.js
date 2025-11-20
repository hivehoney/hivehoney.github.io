(function () {
    var STORAGE_KEY = 'lang';
    var translations = window.TRANSLATIONS || {};
    var defaultLang = window.DEFAULT_LANG || 'en';
  
    function getCurrentLang() {
      var htmlLang = document.documentElement.getAttribute('lang');
      if (htmlLang && translations[htmlLang]) {
        return htmlLang;
      }
    
      if (translations[defaultLang]) return defaultLang;
      if (translations.en) return 'en';
      if (translations.ko) return 'ko';
    
      var keys = Object.keys(translations);
      return keys.length ? keys[0] : 'en';
    }
  
    function setCurrentLang(lang) {
      document.documentElement.setAttribute('lang', lang);
    }
  
    function resolveTranslation(lang, path) {
      var parts = path.split('.');
      var value = translations[lang];
  
      for (var i = 0; i < parts.length; i++) {
        if (!value || typeof value !== 'object') return null;
        value = value[parts[i]];
      }
  
      return typeof value === 'string' ? value : null;
    }
  
    function updateActiveLangButtons() {
      var lang = getCurrentLang();
    
      // 버튼 is-active 토글
      var buttons = document.querySelectorAll('[data-lang-toggle]');
      
      buttons.forEach(function (btn) {
        var btnLang = btn.getAttribute('data-lang-toggle');
        btn.classList.toggle('is-active', btnLang === lang);
      });
    
      // lang-switch 컨테이너에 활성 클래스 붙이기
      var wrappers = document.querySelectorAll('.lang-switch');
      wrappers.forEach(function (wrap) {
        wrap.classList.toggle('lang-switch--ko-active', lang === 'ko');
        wrap.classList.toggle('lang-switch--en-active', lang === 'en');
      });
    }
  
    function applyTranslations() {
      var lang = getCurrentLang();
  
      // 일반 텍스트
      var els = document.querySelectorAll('[data-i18n]');
      els.forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        var text = resolveTranslation(lang, key);
        if (text) el.textContent = text;
      });
  
      // placeholder
      var phEls = document.querySelectorAll('[data-i18n-placeholder]');
      phEls.forEach(function (el) {
        var key = el.getAttribute('data-i18n-placeholder');
        var text = resolveTranslation(lang, key);
        if (text) el.setAttribute('placeholder', text);
      });
  
      updateActiveLangButtons();
    }
  
    function setupLangToggle() {
      var buttons = document.querySelectorAll('[data-lang-toggle]');
      var pageType = document.body.getAttribute('data-page-type');
      
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var lang = btn.getAttribute('data-lang-toggle');
          var url  = btn.getAttribute('data-lang-url');
    
          // 1) URL 있으면 → 해당 언어 포스트로 이동
          if (url) {
            window.location.href = url;
            return;
          }

          // 2) URL 없는데, 여기가 포스트 페이지라면 → 번역 글이 없는 것\
          if (pageType === 'post') {
            if (lang === 'ko') {
              alert('이 글은 아직 한국어 버전이 없습니다.');
            } else if (lang === 'en') {
              alert('This post is not available in English yet.');
            } else {
              alert('해당 언어 버전의 글이 없습니다.');
            }
            return;
          }

          // 2) URL 없으면 → 그냥 UI 텍스트만 토글 (홈, 목록 등)
          if (!translations[lang]) return;
          setCurrentLang(lang);
          applyTranslations();
        });
      });
    }
  
    document.addEventListener('DOMContentLoaded', function () {
      applyTranslations();
      setupLangToggle();
    });
  })();
    