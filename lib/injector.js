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
      'tocContainer.className = "post-toc-wrap motion-element";' +

      'const enToc = document.createElement("div");' +
      'enToc.id = "en-toc";' +
      'enToc.className = "post-toc";' +
      'enToc.style.display = "block";' +
      'enToc.style.transition = "opacity 0.2s ease-in-out";' +

      'const zhToc = document.createElement("div");' +
      'zhToc.id = "zh-toc";' +
      'zhToc.className = "post-toc";' +
      'zhToc.style.display = "none";' +
      'zhToc.style.transition = "opacity 0.2s ease-in-out";' +

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

      'window.addEventListener("scroll", updateTocStatus);' +
    '}' +

    'function expandParents(element) {' +
      'let parent = element.parentElement;' +
      'while (parent) {' +
        'if (parent.tagName.toLowerCase() === "li") {' +
          'parent.classList.add("active");' +
          'const childList = parent.querySelector("ol");' +
          'if (childList) {' +
            'childList.style.display = "block";' +
          '}' +
        '}' +
        'parent = parent.parentElement;' +
      '}' +
    '}' +

    'function updateTocStatus() {' +
      'var visibleContent = document.querySelector(".lang-content[style*=\'display: block\']");' +
      'var headers = [];' +
      
      'if (visibleContent) {' +
        'var headingLevels = ["h1", "h2", "h3", "h4", "h5", "h6"];' +
        'for (var i = 0; i < headingLevels.length; i++) {' +
          'var currentHeaders = visibleContent.getElementsByTagName(headingLevels[i]);' +
          'for (var j = 0; j < currentHeaders.length; j++) {' +
            'headers.push(currentHeaders[j]);' +
          '}' +
        '}' +
      '}' +

      'var tocLinks = document.getElementsByClassName("nav-link");' +
      'var viewportHeight = window.innerHeight;' +
      'var viewportTop = window.pageYOffset;' +
      'var viewportBottom = viewportTop + viewportHeight;' +
      'var viewportCenter = viewportTop + (viewportHeight / 2);' +

      'for (var i = 0; i < tocLinks.length; i++) {' +
        'tocLinks[i].className = tocLinks[i].className.replace(" active", "");' +
        'var parentLi = tocLinks[i].parentElement;' +
        'if (parentLi) {' +
          'parentLi.className = parentLi.className.replace(" active", "");' +
        '}' +
      '}' +

      'var closestHeader = null;' +
      'var minDistance = Infinity;' +
      
      'for (var i = 0; i < headers.length; i++) {' +
        'var header = headers[i];' +
        'var headerTop = header.getBoundingClientRect().top + viewportTop;' +
        'var distance = Math.abs(headerTop - viewportCenter);' +
        
        'if (headerTop <= viewportBottom) {' +
          'if (distance < minDistance) {' +
            'minDistance = distance;' +
            'closestHeader = header;' +
          '}' +
        '}' +
      '}' +

      'if (closestHeader) {' +
        'for (var i = 0; i < tocLinks.length; i++) {' +
          'var link = tocLinks[i];' +
          'if (link.getAttribute("href") === "#" + closestHeader.id) {' +
            'link.className += " active";' +
            
            'var parent = link.parentElement;' +
            'while (parent) {' +
              'if (parent.tagName.toLowerCase() === "li") {' +
                'parent.className += " active";' +
                'var childList = parent.querySelector("ol");' +
                'if (childList) {' +
                  'childList.style.display = "block";' +
                '}' +
              '}' +
              'parent = parent.parentElement;' +
            '}' +
            'break;' +
          '}' +
        '}' +
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
        'a.className = "nav-link";' +

        'const number = counter.slice(0, level).filter(n => n > 0).join(".");' +
        'a.textContent = number + ". " + header.textContent;' +
        
        'li.appendChild(a);' +

        'if (level > currentLevel) {' +
          'const newOl = document.createElement("ol");' +
          'newOl.className = "nav-child";' +
          'newOl.style.display = "none";' +
          'newOl.style.transition = "all 0.3s ease-in-out";' +
          
          'const parentLi = levelStack[currentLevel - 1].lastElementChild;' +
          'parentLi.classList.add("has-child");' +
          
          'parentLi.querySelector("a").addEventListener("click", function(e) {' +
            'e.preventDefault();' +
            'const childList = this.parentElement.querySelector("ol");' +
            'const isHidden = childList.style.display === "none";' +
            'childList.style.display = isHidden ? "block" : "none";' +
            'this.parentElement.classList.toggle("active-child");' +
          '});' +
          
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
        'enContent.style.opacity = 0;' +
        'enToc.style.opacity = 0;' +
        'setTimeout(function() {' +
          'enContent.style.display = "none";' +
          'enToc.style.display = "none";' +
          'zhContent.style.display = "block";' +
          'zhToc.style.display = "block";' +
          'setTimeout(function() {' +
            'zhContent.style.opacity = 1;' +
            'zhToc.style.opacity = 1;' +
          '}, 50);' +
        '}, 200);' +
        'buttonText.textContent = "Switch to English";' +
      '} else {' +
        'zhContent.style.opacity = 0;' +
        'zhToc.style.opacity = 0;' +
        'setTimeout(function() {' +
          'zhContent.style.display = "none";' +
          'zhToc.style.display = "none";' +
          'enContent.style.display = "block";' +
          'enToc.style.display = "block";' +
          'setTimeout(function() {' +
            'enContent.style.opacity = 1;' +
            'enToc.style.opacity = 1;' +
          '}, 50);' +
        '}, 200);' +
        'buttonText.textContent = "切换中文";' +
      '}' +
      'setTimeout(updateTocStatus, 300);' +
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
    '</script>' +
    '<style>' +
      '.post-toc .nav-link { transition: all 0.2s ease-in-out; }' +
      '.post-toc .nav-link.active { color: #fc6423; }' +
      '.post-toc .nav-child { padding-left: 1em; }' +
      '.post-toc .has-child > a:before { content: "▸"; display: inline-block; margin-right: 5px; transition: transform 0.3s; }' +
      '.post-toc .active-child > a:before { transform: rotate(90deg); }' +
      '.lang-content, .post-toc { transition: opacity 0.2s ease-in-out; }' +
    '</style>';
};