'use strict';

module.exports = function() {
  return '<script>' +
    '(function() {' +  
      'function calculateHeight(element) {' +
        'let height = 0;' +
        'const items = element.children;' +
        'for (let i = 0; i < items.length; i++) {' +
          'height += items[i].offsetHeight || 25;' +
          'const child = items[i].querySelector(".nav-child");' +
          'if (child && child.style.display !== "none") {' +
            'height += calculateHeight(child);' +
          '}' +
        '}' +
        'return height;' +
      '}' +

      'function generateToc(lang, container) {' +
        'const content = document.getElementById(lang + "-content");' +
        'if (!content) return;' +
        
        'const headers = Array.from(content.querySelectorAll("h1, h2, h3, h4, h5, h6"));' +
        'if (headers.length === 0) return;' +
        
        'const ol = document.createElement("ol");' +
        'ol.className = "nav";' +
        
        'let currentLevel = 1;' +
        'let currentOl = ol;' +
        'let stack = [ol];' +
        'let counters = [0, 0, 0, 0, 0, 0];' +
        
        'headers.forEach((header, index) => {' +
          'const level = parseInt(header.tagName[1]);' +
          'counters[level - 1]++;' +
          'for (let i = level; i < 6; i++) counters[i] = 0;' +
          
          'const li = document.createElement("li");' +
          'li.className = "nav-item nav-level-" + level;' +
          
          'if (level === 1 && index === 0) {' +
            'li.classList.add("active", "active-current");' +
          '}' +
          
          'const link = document.createElement("a");' +
          'link.className = "nav-link";' +
          'if (level === 1 && index === 0) link.classList.add("active");' +
          'link.href = "#" + header.id;' +
          
          'const numSpan = document.createElement("span");' +
          'numSpan.className = "nav-number";' +
          'numSpan.textContent = counters.slice(0, level).filter(n => n > 0).join(".");' +
          
          'const textSpan = document.createElement("span");' +
          'textSpan.className = "nav-text";' +
          'textSpan.textContent = header.textContent;' +
          
          'link.appendChild(numSpan);' +
          'link.appendChild(document.createTextNode(" "));' +
          'link.appendChild(textSpan);' +
          'li.appendChild(link);' +
          
          'if (level > currentLevel) {' +
            'const newOl = document.createElement("ol");' +
            'newOl.className = "nav-child";' +
            'if (currentLevel === 1) {' +
              'newOl.style.display = "block";' +
              'stack[currentLevel - 1].lastElementChild.classList.add("active");' +
            '}' +
            'stack[currentLevel - 1].lastElementChild.appendChild(newOl);' +
            'stack[level - 1] = newOl;' +
            'currentOl = newOl;' +
          '} else if (level < currentLevel) {' +
            'currentOl = stack[level - 1];' +
          '}' +
          
          'currentOl.appendChild(li);' +
          'currentLevel = level;' +
        '});' +
        
        'container.appendChild(ol);' +
        
        'setTimeout(() => {' +
          'const navHeight = calculateHeight(ol);' +
          'ol.style.setProperty("--height", navHeight + "px");' +
          
          'const navChilds = ol.getElementsByClassName("nav-child");' +
          'Array.from(navChilds).forEach(child => {' +
            'if (child.style.display === "block") {' +
              'const childHeight = calculateHeight(child);' +
              'child.style.setProperty("--height", childHeight + "px");' +
            '}' +
          '});' +
        '}, 0);' +
        
        'return ol;' +
      '}' +

      'function initToc() {' +
        'const originalToc = document.querySelector(".post-toc-wrap");' +
        'if (!originalToc || !document.getElementById("langToggle")) return;' +
        
        'const tocContainer = document.createElement("div");' +
        'tocContainer.className = "post-toc-wrap sidebar-panel sidebar-panel-active";' +
        
        'const enToc = document.createElement("div");' +
        'enToc.id = "en-toc";' +
        'enToc.className = "post-toc motion-element";' +
        'enToc.style.display = "block";' +
        
        'const zhToc = document.createElement("div");' +
        'zhToc.id = "zh-toc";' +
        'zhToc.className = "post-toc motion-element";' +
        'zhToc.style.display = "none";' +
        
        'generateToc("en", enToc);' +
        'generateToc("zh", zhToc);' +
        
        'tocContainer.appendChild(enToc);' +
        'tocContainer.appendChild(zhToc);' +
        'originalToc.parentNode.replaceChild(tocContainer, originalToc);' +
      '}' +

      'window.toggleLanguage = function() {' +  
        'const enContent = document.getElementById("en-content");' +
        'const zhContent = document.getElementById("zh-content");' +
        'const enToc = document.getElementById("en-toc");' +
        'const zhToc = document.getElementById("zh-toc");' +
        'const button = document.getElementById("langToggle");' +
        
        'if (!enContent || !zhContent || !enToc || !zhToc || !button) return;' +
        
        'const isEnglish = enContent.style.display === "block";' +
        
        'enContent.style.display = isEnglish ? "none" : "block";' +
        'zhContent.style.display = isEnglish ? "block" : "none";' +
        'enToc.style.display = isEnglish ? "none" : "block";' +
        'zhToc.style.display = isEnglish ? "block" : "none";' +
        
        'button.querySelector(".button-text").textContent = isEnglish ? "Switch to English" : "切换中文";' +
      '};' +

      'document.addEventListener("DOMContentLoaded", initToc);' +
    '})();' +
    '</script>' +
    '<style>' +
      '.post-toc { transition: all 0.2s ease-in-out; }' +
      '.post-toc .nav { padding-left: 0; }' +
      '.post-toc .nav-child { padding-left: 1em; }' +
      '.post-toc .nav-item { line-height: 1.8; }' +
      '.post-toc .nav-link { color: #555; }' +
      '.post-toc .nav-link:hover { color: #222; }' +
      '.post-toc .nav-link.active { color: #fc6423; }' +
      '.post-toc .active > .nav-link { color: #fc6423; }' +
      '.post-toc .active-current > .nav-link { color: #fc6423; }' +
    '</style>';
};