'use strict';

const languageButtons = [...document.querySelectorAll('[data-language]')];
const translations = [...document.querySelectorAll('[data-zh]')].map(element => ({
  element, english: element.textContent, chinese: element.dataset.zh,
}));
const translatedAttributes = [
  ['aria-label', 'data-zh-label'], ['alt', 'data-zh-alt'], ['content', 'data-zh-content'],
].flatMap(([attribute, translation]) => [...document.querySelectorAll(`[${translation}]`)].map(element => ({
  element, attribute, english: element.getAttribute(attribute), chinese: element.getAttribute(translation),
})));

function localized(english, chinese) {
  return document.documentElement.lang === 'zh-CN' ? chinese : english;
}

function setSiteLanguage(language) {
  document.documentElement.lang = language;
  for (const {element, english, chinese} of translations) element.textContent = localized(english, chinese);
  for (const {element, attribute, english, chinese} of translatedAttributes) {
    element.setAttribute(attribute, localized(english, chinese));
  }
  for (const button of languageButtons) button.setAttribute('aria-pressed', String(button.dataset.language === language));
  document.dispatchEvent(new Event('site-languagechange'));
}

for (const button of languageButtons) {
  button.addEventListener('click', () => {
    const language = button.dataset.language;
    setSiteLanguage(language);
    try { localStorage.setItem('egomyo-language', language); } catch {}
  });
}

try {
  if (localStorage.getItem('egomyo-language') === 'zh-CN') setSiteLanguage('zh-CN');
} catch {}
