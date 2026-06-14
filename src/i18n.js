// i18n.js - Módulo de Internacionalização

const translations = {
const translations = {
  pt: {
    'hub.title': 'Arraial do Solstício',
    'hub.aboutTitle': 'Por que "Arraial do Solstício"?',
    'hub.aboutDesc1': 'O tema da Game Jam é <strong>"June Solstice"</strong> (Solstício de Junho). No Brasil, essa mesma época astronômica marca a chegada do inverno e é celebrada com a nossa tradicional <strong>Festa Junina</strong>!',
    'hub.aboutDesc2': 'Por isso, o <em>Arraial do Solstício</em> une o tema global do evento com a nossa cultura local, através de minigames feitos com Vanilla JS e muito carinho.',
    'hub.aboutFooter': 'Desenvolvido para a DEV Challenge',
    'hub.btnRunner': 'Pula Fogueira',
    'hub.btnPamonha': 'Fazer Pamonha',
    'hub.btnQuentao': 'Quentão',
    'hub.btnRanking': 'Ranking',
    'ranking.title': 'Quadro de Medalhas',
    'ranking.empty': 'Ainda não jogou',
    'ranking.place': 'º Lugar',
    'game.runner': '🔥 Pula Fogueira',
    'game.pamonha': '🌽 Pamonha',
    'game.quentao': '🍷 Quentão',
    'suffix.runner': 'pts',
    'suffix.pamonha': 'unid.',
    'suffix.quentao': 'seg.',
    
    // Pula Fogueira
    'runner.title': 'PULA FOGUEIRA',
    'runner.desc1': 'Pressione ESPAÇO, SETA PARA CIMA',
    'runner.desc2': 'ou toque na tela para pular!',
    'runner.clickStart': '👆 Clique para começar!',
    'runner.overTitle': 'VIXE, VOCÊ CAIU!',
    'runner.overResult': 'Você fez {X} pontos.',
    'runner.overRecord': 'Recorde Atual: {X} pontos',
    'runner.clickRetry': '👆 Clique para tentar de novo',
    'runner.scorePrefix': 'Pontos: ',
    'runner.invincible': '✨ INVENCÍVEL!',
    
    // Pamonha
    'pamonha.title': 'RALADOR DE PAMONHA',
    'pamonha.desc1': 'Arraste para cima e para baixo',
    'pamonha.desc2': 'para ralar o milho o mais rápido que puder!',
    'pamonha.clickStart': '👆 Clique para começar!',
    'pamonha.overTitle': 'VIXE, QUEBROU O RALADOR!',
    'pamonha.overResult': 'Você fez {X} pamonhas.',
    'pamonha.overRecord': 'Recorde: {X} pamonhas',
    'pamonha.clickRetry': '👆 Clique para tentar de novo',
    'pamonha.scorePrefix': 'Pontos: ',
    'pamonha.hudMassa': 'PONTO DA MASSA',
    'pamonha.hudRalador': 'DESGASTE DO RALADOR',
    
    // Quentao
    'quentao.title': 'QUENTÃO EQUILIBRISTA',
    'quentao.desc1': 'Mova o mouse ou incline o celular',
    'quentao.desc2': 'para não deixar o copo cair!',
    'quentao.clickStart': '👆 Clique para começar!',
    'quentao.overTitle': 'VIXE, DERRAMOU O QUENTÃO!',
    'quentao.overResult': 'Você equilibrou por {X} segundos.',
    'quentao.overRecord': 'Recorde: {X} segundos',
    'quentao.clickRetry': '👆 Clique para tentar de novo',
    'quentao.scorePrefix': 'Tempo:',
    'quentao.hudAngle': 'Inclinação: '
  },
  en: {
    'hub.title': 'Solstice Festival',
    'hub.aboutTitle': 'Why "Solstice Festival"?',
    'hub.aboutDesc1': 'The Game Jam theme is <strong>"June Solstice"</strong>. In Brazil, this astronomical period marks the arrival of winter and is celebrated with our traditional <strong>"Festa Junina"</strong>!',
    'hub.aboutDesc2': 'That\'s why the <em>Solstice Festival (Arraial do Solstício)</em> bridges the global theme with our local culture, through minigames built with Vanilla JS and love.',
    'hub.aboutFooter': 'Developed for the DEV Challenge',
    'hub.btnRunner': 'Fire Jumper',
    'hub.btnPamonha': 'Grate Corn',
    'hub.btnQuentao': 'Balance Drink',
    'hub.btnRanking': 'Leaderboard',
    'ranking.title': 'Medal Board',
    'ranking.empty': 'No games played yet',
    'ranking.place': ' Place',
    'game.runner': '🔥 Fire Jumper',
    'game.pamonha': '🌽 Corn Treats',
    'game.quentao': '🍷 Hot Drink',
    'suffix.runner': 'pts',
    'suffix.pamonha': 'units',
    'suffix.quentao': 'sec.',
    
    // Runner
    'runner.title': 'FIRE JUMPER',
    'runner.desc1': 'Press SPACE, UP ARROW',
    'runner.desc2': 'or touch the screen to jump!',
    'runner.clickStart': '👆 Click to start!',
    'runner.overTitle': 'OOPS, YOU FELL!',
    'runner.overResult': 'You got {X} points.',
    'runner.overRecord': 'Current Record: {X} points',
    'runner.clickRetry': '👆 Click to try again',
    'runner.scorePrefix': 'Score: ',
    'runner.invincible': '✨ INVINCIBLE!',
    
    // Pamonha
    'pamonha.title': 'CORN GRATER',
    'pamonha.desc1': 'Swipe up and down',
    'pamonha.desc2': 'to grate the corn as fast as you can!',
    'pamonha.clickStart': '👆 Click to start!',
    'pamonha.overTitle': 'OOPS, GRATER BROKE!',
    'pamonha.overResult': 'You made {X} treats.',
    'pamonha.overRecord': 'Record: {X} treats',
    'pamonha.clickRetry': '👆 Click to try again',
    'pamonha.scorePrefix': 'Score: ',
    'pamonha.hudMassa': 'DOUGH PROGRESS',
    'pamonha.hudRalador': 'GRATER WEAR',
    
    // Quentao
    'quentao.title': 'DRINK BALANCER',
    'quentao.desc1': 'Move your mouse or tilt your phone',
    'quentao.desc2': 'to keep the cup from falling!',
    'quentao.clickStart': '👆 Click to start!',
    'quentao.overTitle': 'OOPS, DRINK SPILLED!',
    'quentao.overResult': 'You balanced for {X} seconds.',
    'quentao.overRecord': 'Record: {X} seconds',
    'quentao.clickRetry': '👆 Click to try again',
    'quentao.scorePrefix': 'Time:',
    'quentao.hudAngle': 'Tilt: '
  }
};
};

let currentLang = 'pt';

export function initLang() {
  const stored = localStorage.getItem('solsticio_lang');
  if (stored && translations[stored]) {
    currentLang = stored;
  } else {
    // Detectar do navegador
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('en')) {
      currentLang = 'en';
    } else {
      currentLang = 'pt';
    }
  }
  
  // Atualizar a tag do HTML
  document.documentElement.lang = currentLang;
}

export function setLang(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('solsticio_lang', lang);
    document.documentElement.lang = lang;
    
    // Disparar evento global para re-renderizar textos na tela
    const event = new CustomEvent('languageChanged', { detail: { lang } });
    window.dispatchEvent(event);
  }
}

export function getLang() {
  return currentLang;
}

export function t(key, replacements = {}) {
  let text = translations[currentLang][key] || translations['pt'][key] || key;
  
  // Troca os parâmetros {X}
  for (const [k, v] of Object.entries(replacements)) {
    text = text.replace(`{${k}}`, v);
  }
  
  return text;
}
