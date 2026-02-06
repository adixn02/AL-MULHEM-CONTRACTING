/**
 * Full-site language switcher: EN / AR.
 * Requires SITE_TRANSLATIONS (translations.js) and elements with data-i18n or data-i18n-placeholder.
 */
(function () {
  var STORAGE_KEY = 'siteLang';

  function getLang() {
    var l = localStorage.getItem(STORAGE_KEY) || 'en';
    return l === 'ar' ? 'ar' : 'en';
  }

  function applyLang(lang) {
    if (lang !== 'en' && lang !== 'ar') return;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', lang);

    var t = window.SITE_TRANSLATIONS && window.SITE_TRANSLATIONS[lang];
    if (!t) return;

    // Text content (use innerHTML for values containing \n so they render as line breaks)
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] != null) {
        var val = t[key];
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (el.getAttribute('data-i18n-placeholder') !== 'true') el.value = val;
        } else if (typeof val === 'string' && val.indexOf('\n') !== -1) {
          el.innerHTML = val.replace(/\n/g, '<br>');
        } else {
          el.textContent = val;
        }
      }
    });

    // Placeholders (data-i18n-placeholder="key" or same key as placeholder)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (t[key] != null) el.placeholder = t[key];
    });

    // Lang switcher UI
    var label = document.getElementById('langSwitcherLabel');
    if (label) label.textContent = lang === 'ar' ? 'AR' : 'EN';
    document.querySelectorAll('.lang-option').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-lang') === lang);
    });
  }

  function init() {
    applyLang(getLang());
    document.querySelectorAll('.lang-option').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var l = el.getAttribute('data-lang');
        if (l) applyLang(l);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
