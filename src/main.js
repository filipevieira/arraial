import './style.css';
import { initRunnerGame } from './runner.js';
import { initPamonhaGame } from './pamonha.js';
import { initQuentaoGame } from './quentao.js';
import { createPersonSvg } from './graphics.js';
import { getTopScores } from './ranking.js';
import { initLang, setLang, getLang, t } from './i18n.js';

initLang();

// Referência ao container principal
const app = document.querySelector('#app');
let cleanupCurrentMinigame = null;

// ----------------------------------------------------
// SCENE: HUB DO ARRAIAL
// ----------------------------------------------------
export function renderHub() {
  if (cleanupCurrentMinigame) {
    cleanupCurrentMinigame();
    cleanupCurrentMinigame = null;
  }
  
  app.innerHTML = `
    <div class="hub-scene" id="hub-scene">
      <div class="bunting">
        ${Array(15).fill('<div class="flag"></div>').join('')}
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 650px; padding: 0 20px; margin-top: 45px;">
        <h1 id="hub-title">${t('hub.title')}</h1>
        <button id="btn-about" style="background: none; border: none; font-size: 2rem; cursor: pointer; transition: transform 0.2s;" title="Sobre o Projeto">ℹ️</button>
      </div>
      
      <div class="barracas-container" style="flex-wrap: wrap; justify-content: center; max-width: 650px; gap: 1rem; z-index: 20;">
        <button class="barraca-btn" id="btn-ranking" style="background: #ffb703; color: #1a0f2e; border: 3px solid #fb5607; box-shadow: 0 4px #d00000;">
          <span class="barraca-icon">🏆</span> <span id="txt-btn-ranking">${t('hub.btnRanking')}</span>
        </button>
        <button class="barraca-btn" id="btn-runner">
          <span class="barraca-icon">🔥</span> <span id="txt-btn-runner">${t('hub.btnRunner')}</span>
        </button>
        <button class="barraca-btn" id="btn-pamonha">
          <span class="barraca-icon">🌽</span> <span id="txt-btn-pamonha">${t('hub.btnPamonha')}</span>
        </button>
        <button class="barraca-btn" id="btn-quentao">
          <span class="barraca-icon">🍷</span> <span id="txt-btn-quentao">${t('hub.btnQuentao')}</span>
        </button>
      </div>

      <!-- BARRACAS VISUAIS DE FUNDO (EDITÁVEIS) -->
      <div class="tent-bg active" data-angle="-10" style="width: 150px; height: 150px; left: 20px; top: 100px; transform: rotate(-10deg);">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,10 10,60 90,60" fill="#d00000" />
          <rect x="20" y="60" width="60" height="40" fill="#fdf0d5" />
          <polygon points="20,60 30,75 40,60 50,75 60,60 70,75 80,60" fill="#669bbc"/>
        </svg>
      </div>
      
      <div class="tent-bg active" data-angle="10" style="width: 160px; height: 160px; right: 20px; top: 100px; transform: rotate(10deg);">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,10 10,60 90,60" fill="#8338ec" />
          <rect x="20" y="60" width="60" height="40" fill="#fdf0d5" />
          <polygon points="20,60 30,75 40,60 50,75 60,60 70,75 80,60" fill="#ffbe0b"/>
        </svg>
      </div>

      <div class="tent-bg" data-angle="-5" style="width: 140px; height: 140px; left: 10px; bottom: 100px; transform: rotate(-5deg);">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,10 10,60 90,60" fill="#3a86ff" />
          <rect x="20" y="60" width="60" height="40" fill="#fdf0d5" />
        </svg>
      </div>
      
      <div class="tent-bg" data-angle="5" style="width: 150px; height: 150px; right: 10px; bottom: 100px; transform: rotate(5deg);">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,10 10,60 90,60" fill="#fb5607" />
          <rect x="20" y="60" width="60" height="40" fill="#fdf0d5" />
          <polygon points="20,60 30,75 40,60 50,75 60,60 70,75 80,60" fill="#3a86ff"/>
        </svg>
      </div>

      <!-- QUADRILHA ANIMADA (JS) -->
      <div class="quadrilha-container" id="quadrilha-container">
        <div class="pessoa-wrapper">${createPersonSvg('#1f7a8c', '#ffcdb2', 'p1')}</div>
        <div class="pessoa-wrapper">${createPersonSvg('#ff006e', '#bc6c25', 'p2')}</div>
        <div class="pessoa-wrapper">${createPersonSvg('#fb5607', '#ffcdb2', 'p3')}</div>
        <div class="pessoa-wrapper">${createPersonSvg('#8338ec', '#606c38', 'p4')}</div>
        <div class="pessoa-wrapper">${createPersonSvg('#06d6a0', '#e07a5f', 'p5')}</div>
        <div class="pessoa-wrapper">${createPersonSvg('#ef476f', '#ffe6a7', 'p6')}</div>
        <div class="pessoa-wrapper">${createPersonSvg('#118ab2', '#d4a373', 'p7')}</div>
        <div class="pessoa-wrapper">${createPersonSvg('#073b4c', '#f4a261', 'p8')}</div>
      </div>

      <!-- Fogueira centralizada decorativa -->
      <div class="fogueira">
        <div class="fire-glow"></div>
        <div class="flame"></div>
        <div class="logs"></div>
      </div>
      
      <!-- Modal Flutuante -->
      <div class="modal-overlay" id="info-modal">
        <div class="modal-content">
          <button class="modal-close" id="modal-close-btn">✖</button>
          <h2 id="modal-title" style="color: var(--color-text-secondary); margin-bottom: 15px;">Título</h2>
          <p id="modal-text" style="font-size: 1.2rem; line-height: 1.5;"></p>
        </div>
      </div>

      <!-- RANKING MODAL -->
      <div class="modal-overlay" id="ranking-modal">
        <div class="modal-content ranking-content">
          <button class="modal-close" id="ranking-close-btn">✖</button>
          <h2 style="font-family: 'Bungee', sans-serif; color: #ffca3a; text-align: center; margin-bottom: 5px;">🏆 Quadro de Medalhas</h2>
          <div class="ranking-grid" id="ranking-grid">
            <!-- Renderizado via JS -->
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-runner').addEventListener('click', renderMinigamePulaFogueira);
  document.getElementById('btn-pamonha').addEventListener('click', renderMinigamePamonha);
  document.getElementById('btn-quentao').addEventListener('click', renderMinigameQuentao);
  
  // Lógica do Modal de Ranking
  const rankingModal = document.getElementById('ranking-modal');
  const rankingGrid = document.getElementById('ranking-grid');
  
  const renderRanking = () => {
    const games = [
      { id: 'runner', title: t('game.runner'), suffix: t('suffix.runner') },
      { id: 'pamonha', title: t('game.pamonha'), suffix: t('suffix.pamonha') },
      { id: 'quentao', title: t('game.quentao'), suffix: t('suffix.quentao') }
    ];
    
    rankingGrid.innerHTML = '';
    const medals = ['🥇', '🥈', '🥉'];
    
    games.forEach(game => {
      const scores = getTopScores(game.id);
      let listHtml = '';
      
      if (scores.length === 0) {
        listHtml = `<div class="empty-ranking">${t('ranking.empty')}</div>`;
      } else {
        scores.forEach((s, i) => {
          const displayScore = game.id === 'quentao' ? Number(s).toFixed(3) : s;
          listHtml += `<li><span><span class="ranking-medal">${medals[i]||'🏅'}</span> ${i+1}${t('ranking.place')}</span> <span class="ranking-score">${displayScore} ${game.suffix}</span></li>`;
        });
        listHtml += '</ul>';
      }
      
      rankingGrid.innerHTML += `
        <div class="ranking-game">
          <h3>${game.title}</h3>
          ${listHtml}
        </div>
      `;
    });
  };

  document.getElementById('btn-ranking').addEventListener('click', () => {
    document.getElementById('ranking-title').innerText = t('ranking.title');
    renderRanking();
    rankingModal.classList.add('active');
  });

  document.getElementById('ranking-close-btn').addEventListener('click', () => {
    rankingModal.classList.remove('active');
  });
  
  // Lógica do Modal
  const modal = document.getElementById('info-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');
  
  // Lógica do Modal de Sobre
  document.getElementById('btn-about').addEventListener('click', () => {
    modalTitle.innerText = t('hub.aboutTitle');
    modalText.innerHTML = `
      <p style="margin-bottom: 10px;">${t('hub.aboutDesc1')}</p>
      <p style="margin-bottom: 10px;">${t('hub.aboutDesc2')}</p>
      <p style="font-size: 0.9rem; color: #ffb703; text-align: center; margin-top: 20px;">${t('hub.aboutFooter')}</p>
    `;
    modal.classList.add('active');
  });

  // Language Switcher Injector
  const appContainer = document.getElementById('app');
  const langSwitcher = document.createElement('div');
  langSwitcher.className = 'lang-switcher';
  langSwitcher.innerHTML = `
    <button class="lang-btn" data-lang="pt" title="Português">🇧🇷</button>
    <button class="lang-btn" data-lang="en" title="English">🇺🇸</button>
  `;
  appContainer.appendChild(langSwitcher);

  const updateLangUI = () => {
    const current = getLang();
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === current);
    });
    
    // Atualizar textos do Hub
    document.title = t('hub.title');
    const hubTitle = document.getElementById('hub-title');
    if (hubTitle) hubTitle.innerText = t('hub.title');
    
    const btnRanking = document.getElementById('txt-btn-ranking');
    if (btnRanking) btnRanking.innerText = t('hub.btnRanking');
    
    const btnRunner = document.getElementById('txt-btn-runner');
    if (btnRunner) btnRunner.innerText = t('hub.btnRunner');
    
    const btnPamonha = document.getElementById('txt-btn-pamonha');
    if (btnPamonha) btnPamonha.innerText = t('hub.btnPamonha');
    
    const btnQuentao = document.getElementById('txt-btn-quentao');
    if (btnQuentao) btnQuentao.innerText = t('hub.btnQuentao');
    
    const btnBack = document.getElementById('btn-back');
    if (btnBack) btnBack.innerText = t('hub.btnBack');
    
    if (rankingModal.classList.contains('active')) {
      document.getElementById('ranking-title').innerText = t('ranking.title');
      renderRanking();
    }
  };

  langSwitcher.addEventListener('click', (e) => {
    if (e.target.classList.contains('lang-btn')) {
      setLang(e.target.dataset.lang);
    }
  });

  window.addEventListener('languageChanged', updateLangUI);
  updateLangUI(); // Call once to set correct state
  
  document.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modalTitle.innerText = btn.dataset.title;
      modalText.innerText = btn.dataset.info;
      modal.classList.add('active');
    });
  });
  
  document.getElementById('modal-close-btn').addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Animação da Quadrilha em Círculo (Elipse)
  const quadrilhaWrappers = document.querySelectorAll('#quadrilha-container .pessoa-wrapper');
  let angle = 0;
  let quadrilhaAnimationId;

  function animateQuadrilha() {
    const container = document.getElementById('quadrilha-container');
    if (!container) return; // Para se sair da cena

    angle += 0.012; // Velocidade da roda
    const radiusX = Math.min(200, container.clientWidth / 2.5);
    const radiusY = 30; // Achatamento (perspectiva)
    const cx = container.clientWidth / 2;
    // O container fica acima da fogueira
    const cy = 40; 

    quadrilhaWrappers.forEach((wrapper, i) => {
      const pAngle = angle + (i * (Math.PI * 2 / quadrilhaWrappers.length));
      const x = cx + Math.cos(pAngle) * radiusX;
      const y = cy + Math.sin(pAngle) * radiusY;
      
      wrapper.style.position = 'absolute';
      wrapper.style.top = '0px';
      wrapper.style.left = '0px';
      // Ajusta o Z-index para quem está na frente sobrepor quem está atrás
      wrapper.style.zIndex = Math.floor(y);
      // Centraliza a âncora da pessoa
      wrapper.style.transform = `translate(${x - 20}px, ${y - 65}px)`;
      
      // Espelha quem está indo para a esquerda (fundo da roda)
      const isGoingLeft = Math.sin(pAngle) < 0; 
      const svg = wrapper.querySelector('svg');
      if (svg) {
        if (isGoingLeft && Math.cos(pAngle) < 0) {
          svg.style.transform = 'scaleX(-1)';
        } else if (!isGoingLeft && Math.cos(pAngle) > 0) {
          svg.style.transform = 'scaleX(-1)';
        } else {
          svg.style.transform = 'scaleX(1)';
        }
      }
    });
    quadrilhaAnimationId = requestAnimationFrame(animateQuadrilha);
  }
  
  if (quadrilhaWrappers.length > 0) {
    animateQuadrilha();
  }
  
  // Lógica de Edição Lúdica (Transform Controls)
  let activeTent = null;
  let transformAction = null; // 'drag', 'scale', 'rotate'
  let startX, startY;
  let tentRect;
  
  const hubScene = document.getElementById('hub-scene');

  document.querySelectorAll('.tent-bg').forEach(tent => {
    // Adiciona as bolinhas de controle dinamicamente
    const box = document.createElement('div');
    box.className = 'transform-box';
    box.innerHTML = `<div class="handle-rotate"></div><div class="handle-scale"></div>`;
    tent.appendChild(box);

    const startInteraction = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      // Limpa os outros
      document.querySelectorAll('.tent-bg').forEach(t => t.classList.remove('active'));
      tent.classList.add('active');
      activeTent = tent;
      tent.style.zIndex = 1000;

      const target = e.target;
      tentRect = tent.getBoundingClientRect();

      if (target.classList.contains('handle-scale')) {
        transformAction = 'scale';
        startX = clientX;
        startY = clientY;
      } else if (target.classList.contains('handle-rotate')) {
        transformAction = 'rotate';
      } else {
        transformAction = 'drag';
        // Compensa a posição do pai
        const parentRect = app.getBoundingClientRect();
        startX = clientX - tent.offsetLeft - parentRect.left;
        startY = clientY - tent.offsetTop - parentRect.top;
      }
      if(!e.touches) e.preventDefault(); // Impede seleção de texto no mouse
    };

    tent.addEventListener('mousedown', startInteraction);
    tent.addEventListener('touchstart', startInteraction, {passive: false});
  });

  const onMove = (e) => {
    if (!activeTent || !transformAction) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    if (transformAction === 'drag') {
      const parentRect = app.getBoundingClientRect();
      activeTent.style.left = `${clientX - parentRect.left - startX}px`;
      activeTent.style.top = `${clientY - parentRect.top - startY}px`;
      activeTent.style.right = 'auto';
      activeTent.style.bottom = 'auto';
    } 
    else if (transformAction === 'scale') {
      const dx = clientX - tentRect.left;
      const dy = clientY - tentRect.top;
      const size = Math.max(50, Math.max(dx, dy));
      activeTent.style.width = `${size}px`;
      activeTent.style.height = `${size}px`;
    } 
    else if (transformAction === 'rotate') {
      const cx = tentRect.left + tentRect.width / 2;
      const cy = tentRect.top + tentRect.height / 2;
      // Calcula o angulo entre o centro e o mouse
      const angle = Math.atan2(clientY - cy, clientX - cx) * 180 / Math.PI;
      // Soma 90 pois a bolinha está no topo (que é -90 graus)
      const finalAngle = angle + 90;
      activeTent.dataset.angle = finalAngle;
      activeTent.style.transform = `rotate(${finalAngle}deg)`;
    }
  };

  const onEnd = () => {
    if(activeTent && transformAction) {
      activeTent.style.zIndex = 5;
      transformAction = null;
    }
  };

  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onEnd);
  document.addEventListener('touchmove', onMove, {passive: true});
  document.addEventListener('touchend', onEnd);

  // Clique fora deseleciona
  app.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.tent-bg')) {
      document.querySelectorAll('.tent-bg').forEach(t => t.classList.remove('active'));
      activeTent = null;
      transformAction = null;
    }
  });
}

// ----------------------------------------------------
// SCENE: MINIGAME PULA FOGUEIRA
// ----------------------------------------------------
function renderMinigamePulaFogueira() {
  app.innerHTML = `
    <div class="minigame-scene active">
      <div class="top-bar">
        <h2>🔥 Pula Fogueira Runner</h2>
        <button class="back-btn" id="btn-back">${t('hub.btnBack')}</button>
      </div>
      <canvas id="gameCanvas"></canvas>
    </div>
  `;
  
  document.getElementById('btn-back').addEventListener('click', renderHub);
  
  const canvas = document.getElementById('gameCanvas');
  cleanupCurrentMinigame = initRunnerGame(canvas);
}

// ----------------------------------------------------
// SCENE: MINIGAME PAMONHA
// ----------------------------------------------------
function renderMinigamePamonha() {
  app.innerHTML = `
    <div class="minigame-scene active">
      <div class="top-bar">
        <h2>🌽 Ralador de Pamonha</h2>
        <button class="back-btn" id="btn-back">${t('hub.btnBack')}</button>
      </div>
      <div id="pamonha-game-container" style="width: 100%; height: calc(100vh - 60px); display: flex; justify-content: center; align-items: center; position: relative;"></div>
    </div>
  `;
  
  document.getElementById('btn-back').addEventListener('click', renderHub);
  
  const container = document.getElementById('pamonha-game-container');
  cleanupCurrentMinigame = initPamonhaGame(container);
}

// ----------------------------------------------------
// SCENE: MINIGAME QUENTÃO
// ----------------------------------------------------
function renderMinigameQuentao() {
  app.innerHTML = `
    <div class="minigame-scene active">
      <div class="top-bar">
        <h2>🍷 Servir Quentão</h2>
        <button class="back-btn" id="btn-back">${t('hub.btnBack')}</button>
      </div>
      <div id="quentao-container" style="display: flex; justify-content: center; align-items: center; width: 100%; height: calc(100vh - 60px);"></div>
    </div>
  `;
  
  document.getElementById('btn-back').addEventListener('click', renderHub);
  cleanupCurrentMinigame = initQuentaoGame(document.getElementById('quentao-container'));
}

// Inicia o jogo no Hub
renderHub();

// --- CONTROLE DE ÁUDIO GLOBAL ---
const muteBtn = document.getElementById('mute-btn');
const bgMusic = document.getElementById('bg-music');
if (muteBtn && bgMusic) {
  muteBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.volume = 0.5; // Um volume agradável de fundo
      bgMusic.play().then(() => {
        muteBtn.textContent = '🔊 Música ON';
        muteBtn.style.background = '#06d6a0';
      }).catch(e => {
        console.log("Erro ao reproduzir áudio:", e);
        muteBtn.textContent = '⚠️ Bloqueado';
      });
    } else {
      bgMusic.pause();
      muteBtn.textContent = '🎵 Tocar Música';
      muteBtn.style.background = '#ff006e';
    }
  });
}
