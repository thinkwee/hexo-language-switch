# hexo-language-switch

A [Hexo](https://hexo.io/zh-cn/) plugin that enables seamless switching between multiple language versions of your posts. It is suitable for the hexo [next](https://github.com/next-theme/hexo-theme-next) theme.


# Features
- only change your post between chinese/english
- a seperate bottom for switching language
- with an automatically generated table of contents for each language.

## Installation
- clone this repo then
```bash
npm install hexo-language-switch
```

## Usage
- organize your post like
```markdown
---
title: xxxxx
date: 2024-xx-xx xx:xx:xx
categories: xxxx
tags:
  - xx
  - xx
---
some text....
<!--more-->
{% language_switch %}

{% lang_content en %}
YOUR_ENGLISH_POST_HERE
{% endlang_content %}

{% lang_content zh %}
YOUR_CHINESE_POST_HERE
{% endlang_content %}
```
- where use ``language_switch`` to put your language switch buttom and use ``lang_content`` to wrap your post in different languages

## License

MIT

## Author

thinkwee