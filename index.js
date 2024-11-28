'use strict';

hexo.extend.tag.register('language_switch', function(args) {
  const defaultOptions = {
    buttonClass: 'lang-switch-btn',
    languages: ['en', 'zh'],
    defaultLang: 'en',
    labels: {
      en: '切换中文',
      zh: 'Switch to English'
    }
  };

  const styles = 
    '<style>' +
      '.lang-content {' +
        'width: 100%;' +
        'overflow: hidden;' +
      '}' +
      '.lang-content:not(:first-child) {' +
        'display: none;' +
      '}' +
    '</style>';

  const button = 
    '<div style="text-align: right; margin: 0 0 20px auto; max-width: 200px;">' +
      '<button id="langToggle" onclick="toggleLanguage()" class="' + defaultOptions.buttonClass + '" style="' +
        'width: 100%;' +
        'padding: 10px 20px;' +
        'border-radius: 8px;' +
        'border: 2px solid #2c3e50;' +
        'background-color: #fff;' +
        'cursor: pointer;' +
        'color: #2c3e50;' +
        'font-size: 15px;' +
        'transition: all 0.3s ease;' +
        'display: flex;' +
        'align-items: center;' +
        'justify-content: center;' +
        'gap: 8px;' +
        'box-shadow: 0 2px 4px rgba(0,0,0,0.1);">' +
        '<span class="button-text">' + defaultOptions.labels[defaultOptions.defaultLang] + '</span>' +
      '</button>' +
    '</div>';

  return styles + button;
}, {ends: false});

hexo.extend.tag.register('lang_content', function(args, content) {
  const lang = args[0] || 'en';
  const defaultLang = 'en';
  const display = lang === defaultLang ? 'block' : 'none';
  
  let processedContent = content.replace(
    /(#{1,6})\s+(.*?)(?:\n|$)/g,
    function(match, hashes, title) {
      if (/{#.*}/.test(title)) {
        return match;
      }
      
      const baseTitle = title.trim();
      const slug = baseTitle
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')  
        .replace(/^-|-$/g, '');
      
      return hashes + ' ' + baseTitle + ' {#' + slug + '}\n';
    }
  );
  
  const rendered = hexo.render.renderSync({text: processedContent, engine: 'markdown'});
  
  return '<div id="' + lang + '-content" class="lang-content" style="display: ' + display + ';">' +
    rendered +
  '</div>';
}, {ends: true});

hexo.extend.injector.register('head_end', require('./lib/injector'));