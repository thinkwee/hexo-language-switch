'use strict';

module.exports = function() {
  return '<script>' +
    'function processToc() {' +
      'const observer = new MutationObserver((mutations, obs) => {' +
        'const sidebarNav = document.querySelector(".sidebar-nav");' +
        'const postToc = document.querySelector(".post-toc");' +
        'const langContent = document.querySelector(".lang-content");' +
        
        'if (sidebarNav && postToc) {' +
          'obs.disconnect();' +
          'if (langContent) {' +
            'initializeToc();' +
          '}' +
        '}' +
      '});' +

      'observer.observe(document.body, {' +
        'childList: true,' +
        'subtree: true' +
      '});' +
    '}' +

    'function initializeToc() {' +
      'const sidebarNav = document.querySelector(".sidebar-nav");' +
      'const tocContainer = document.createElement("div");' +
      'tocContainer.className = "post-toc-wrap";' +

      'const enToc = document.createElement("div");' +
      'enToc.id = "en-toc";' +
      'enToc.className = "post-toc";' +
      'enToc.style.display = "block";' +

      'const zhToc = document.createElement("div");' +
      'zhToc.id = "zh-toc";' +
      'zhToc.className = "post-toc";' +
      'zhToc.style.display = "none";' +

      'if (document.querySelector(".post-toc")) {' +
        'const enOl = document.createElement("ol");' +
        'enOl.className = "nav";' +

        'const zhOl = document.createElement("ol");' +
        'zhOl.className = "nav";' +

        'processLanguageToc("en", enOl);' +
        'processLanguageToc("zh", zhOl);' +

        'enToc.appendChild(enOl);' +
        'zhToc.appendChild(zhOl);' +
      '}' +

      'tocContainer.appendChild(enToc);' +
      'tocContainer.appendChild(zhToc);' +

      'const originalToc = document.querySelector(".post-toc");' +
      'if (originalToc) {' +
        'originalToc.parentNode.replaceChild(tocContainer, originalToc);' +
      '} else {' +
        'sidebarNav.appendChild(tocContainer);' +
      '}' +
    '}' +

    'function processLanguageToc(lang, ol) {' +
      'const content = document.getElementById(lang + "-content");' +
      'if (!content) return;' +

      'const headers = Array.from(content.querySelectorAll("h1, h2, h3, h4, h5, h6"));' +
      'let currentLevel = 1;' +
      'let currentOl = ol;' +
      'let levelStack = [ol];' +
      'let counter = [0, 0, 0, 0, 0, 0];' +

      'headers.forEach((header) => {' +
        'const level = parseInt(header.tagName.charAt(1));' +
        
        'counter[level - 1]++;' +
        'for (let i = level; i < counter.length; i++) {' +
          'counter[i] = 0;' +
        '}' +

        'const li = document.createElement("li");' +
        'const a = document.createElement("a");' +
        'a.href = "#" + header.id;' +

        'const number = counter.slice(0, level).filter(n => n > 0).join(".");' +
        'a.textContent = number + ". " + header.textContent;' +
        
        'li.appendChild(a);' +

        'if (level > currentLevel) {' +
          'const newOl = document.createElement("ol");' +
          'levelStack[currentLevel - 1].lastElementChild.appendChild(newOl);' +
          'levelStack[level - 1] = newOl;' +
          'currentOl = newOl;' +
        '} else if (level < currentLevel) {' +
          'currentOl = levelStack[level - 1];' +
        '}' +

        'currentOl.appendChild(li);' +
        'currentLevel = level;' +
      '});' +
    '}' +

    'function toggleLanguage() {' +
      'const enContent = document.getElementById("en-content");' +
      'const zhContent = document.getElementById("zh-content");' +
      'const enToc = document.getElementById("en-toc");' +
      'const zhToc = document.getElementById("zh-toc");' +
      'const button = document.getElementById("langToggle");' +
      'const buttonText = button.querySelector(".button-text");' +
      
      'if (enContent.style.display === "block") {' +
        'enContent.style.display = "none";' +
        'zhContent.style.display = "block";' +
        'enToc.style.display = "none";' +
        'zhToc.style.display = "block";' +
        'buttonText.textContent = "Switch to English";' +
        'button.style.backgroundColor = "#2c3e50";' +
        'button.style.color = "#fff";' +
      '} else {' +
        'enContent.style.display = "block";' +
        'zhContent.style.display = "none";' +
        'enToc.style.display = "block";' +
        'zhToc.style.display = "none";' +
        'buttonText.textContent = "切换中文";' +
        'button.style.backgroundColor = "#fff";' +
        'button.style.color = "#2c3e50";' +
      '}' +
    '}' +

    'document.addEventListener("DOMContentLoaded", function() {' +
      'if (document.getElementById("langToggle")) {' +
        'processToc();' +
      '}' +
      
      'const button = document.getElementById("langToggle");' +
      'if (!button) return;' +
      
      'button.addEventListener("mouseover", function() {' +
        'this.style.transform = "translateY(-2px)";' +
        'this.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";' +
      '});' +

      'button.addEventListener("mouseout", function() {' +
        'this.style.transform = "translateY(0)";' +
        'this.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";' +
      '});' +

      'button.addEventListener("mousedown", function() {' +
        'this.style.transform = "translateY(1px)";' +
        'this.style.boxShadow = "0 1px 2px rgba(0,0,0,0.1)";' +
      '});' +

      'button.addEventListener("mouseup", function() {' +
        'this.style.transform = "translateY(-2px)";' +
        'this.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";' +
      '});' +
    '});' +
    '</script>';
};