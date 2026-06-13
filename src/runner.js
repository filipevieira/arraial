import { createPersonSvg } from './graphics.js';
import { saveScore, getHighScore } from './ranking.js';

export function initRunnerGame(canvas) {
  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 400; // T-Rex style (fixed reduced height)
  }
  window.addEventListener('resize', resize);
  resize();

  let score = 0;
  let isGameOver = false;
  let showInstructions = true;
  let gameSpeed = window.innerWidth < 768 ? 3.5 : 6;
  let frame = 0;
  let animationId;

  const groundY = canvas.height - 40;

  const player = {
    x: 50,
    y: groundY - 80,
    width: 40,
    height: 80,
    dy: 0,
    jumpForce: 14,
    gravity: 0.6,
    isGrounded: true,
    invincibleTimer: 0
  };

  const playerSvgStr = `
<svg viewBox="0 0 50 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M5,25 Q25,12 45,25 L40,28 Q25,15 10,28 Z" fill="#000"/>
  <path d="M14,22 C14,5 36,5 36,22 Z" fill="#000" stroke="#fefae0" stroke-width="1"/>
  <circle cx="25" cy="15" r="2.5" fill="#fefae0"/>
  <circle cx="18" cy="18" r="1.5" fill="#fefae0"/>
  <circle cx="32" cy="18" r="1.5" fill="#fefae0"/>
  
  <path d="M18,22 C14,40 25,42 25,42 C25,42 36,40 32,22 Z" fill="#fefae0" stroke="#000" stroke-width="2"/>
  <path d="M20,29 Q22,27 24,29" stroke="#000" fill="none" stroke-width="1.5"/>
  <path d="M26,29 Q28,27 30,29" stroke="#000" fill="none" stroke-width="1.5"/>
  <line x1="25" y1="32" x2="24" y2="36" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M22,38 Q25,41 28,38" stroke="#000" fill="none" stroke-width="1.5"/>
  <line x1="21" y1="38" x2="29" y2="38" stroke="#000" stroke-width="1.5"/>

  <path d="M15,40 L35,40 L32,65 L18,65 Z" fill="#000"/>
  <circle cx="20" cy="46" r="1" fill="#fefae0"/> <circle cx="30" cy="46" r="1" fill="#fefae0"/>
  <circle cx="25" cy="51" r="1" fill="#fefae0"/> 
  <circle cx="20" cy="56" r="1" fill="#fefae0"/> <circle cx="30" cy="56" r="1" fill="#fefae0"/>
  <circle cx="25" cy="61" r="1" fill="#fefae0"/>

  <path d="M16,43 Q8,40 10,28" fill="none" stroke="#fefae0" stroke-width="4" stroke-linecap="round"/>
  <path d="M16,43 Q8,40 10,28" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/>
  <circle cx="10" cy="26" r="3" fill="#fefae0" stroke="#000" stroke-width="1.5"/> 

  <path d="M34,43 Q42,50 40,62" fill="none" stroke="#fefae0" stroke-width="4" stroke-linecap="round"/>
  <path d="M34,43 Q42,50 40,62" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/>
  <circle cx="40" cy="64" r="3" fill="#fefae0" stroke="#000" stroke-width="1.5"/> 

  <path d="M18,63 L14,88 L20,88 L24,63" fill="#000" stroke="#fefae0" stroke-width="1"/>
  <path d="M32,63 L38,75 L30,82 L26,63" fill="#000" stroke="#fefae0" stroke-width="1"/>
  
  <line x1="16" y1="70" x2="22" y2="70" stroke="#fefae0" stroke-width="1"/>
  <line x1="15" y1="80" x2="20" y2="80" stroke="#fefae0" stroke-width="1"/>
  <line x1="33" y1="72" x2="36" y2="72" stroke="#fefae0" stroke-width="1"/>

  <path d="M11,88 L22,88 L22,93 L9,93 Z" fill="#000"/>
  <path d="M30,82 L38,76 L40,80 L32,86 Z" fill="#000"/>
</svg>`;
  const playerImg = new Image();
  playerImg.src = 'data:image/svg+xml,' + encodeURIComponent(playerSvgStr);

  const fireFrames = [];
  const flamePaths = [
    {
      r: "M10,70 Q15,40 20,20 Q25,30 30,10 Q35,30 40,20 Q45,40 50,70 Z",
      o: "M15,70 Q20,45 25,30 Q30,40 30,20 Q35,45 45,70 Z",
      y: "M22,70 Q25,50 30,40 Q35,50 38,70 Z"
    },
    {
      r: "M10,70 Q10,40 15,20 Q20,30 25,10 Q30,30 35,20 Q45,40 50,70 Z",
      o: "M15,70 Q15,45 20,30 Q25,40 28,20 Q35,45 45,70 Z",
      y: "M22,70 Q25,50 28,40 Q35,50 38,70 Z"
    },
    {
      r: "M10,70 Q20,40 25,20 Q30,30 35,10 Q40,30 45,20 Q45,40 50,70 Z",
      o: "M15,70 Q25,45 30,30 Q35,40 35,20 Q35,45 45,70 Z",
      y: "M22,70 Q25,50 32,40 Q35,50 38,70 Z"
    }
  ];

  flamePaths.forEach(paths => {
    const img = new Image();
    img.src = 'data:image/svg+xml,' + encodeURIComponent(`
      <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
        <path d="${paths.r}" fill="#d00000" stroke="#fefae0" stroke-width="2" stroke-linejoin="round"/>
        <path d="${paths.o}" fill="#e85d04" stroke="#fefae0" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="${paths.y}" fill="#ffba08" />
        <g stroke="#000" stroke-width="8" stroke-linecap="round">
          <line x1="15" y1="75" x2="45" y2="65" />
          <line x1="15" y1="65" x2="45" y2="75" />
          <line x1="10" y1="70" x2="50" y2="70" />
        </g>
        <g stroke="#fefae0" stroke-width="1.5" stroke-linecap="round">
          <line x1="15" y1="75" x2="45" y2="65" />
          <line x1="15" y1="65" x2="45" y2="75" />
          <line x1="10" y1="70" x2="50" y2="70" />
        </g>
        <g fill="#000" stroke="#fefae0" stroke-width="1.5">
          <circle cx="15" cy="75" r="2.5" />
          <circle cx="15" cy="65" r="2.5" />
          <circle cx="10" cy="70" r="2.5" />
          <circle cx="45" cy="65" r="2.5" />
          <circle cx="45" cy="75" r="2.5" />
          <circle cx="50" cy="70" r="2.5" />
        </g>
      </svg>
    `);
    fireFrames.push(img);
  });

  const pamonhaImg = new Image();
  pamonhaImg.src = 'data:image/svg+xml,' + encodeURIComponent(`
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="5" width="24" height="30" rx="3" fill="#fefae0" stroke="#000" stroke-width="3"/>
      <path d="M4,12 L36,12 M4,28 L36,28" stroke="#000" stroke-width="3"/>
      <line x1="12" y1="16" x2="12" y2="24" stroke="#000" stroke-width="2"/>
      <line x1="18" y1="15" x2="18" y2="25" stroke="#000" stroke-width="2"/>
      <line x1="24" y1="17" x2="24" y2="23" stroke="#000" stroke-width="2"/>
      <line x1="28" y1="15" x2="28" y2="25" stroke="#000" stroke-width="2"/>
    </svg>
  `);

  const macaImg = new Image();
  macaImg.src = 'data:image/svg+xml,' + encodeURIComponent(`
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="22" r="14" fill="#000" stroke="#fefae0" stroke-width="2"/>
      <path d="M12,20 A8,8 0 0,1 18,12" stroke="#fefae0" fill="none" stroke-width="2"/>
      <path d="M20,8 Q24,2 28,4" fill="none" stroke="#000" stroke-width="3"/>
      <path d="M20,8 Q24,2 28,4" fill="none" stroke="#fefae0" stroke-width="1"/>
    </svg>
  `);

  const obstacles = [];
  const items = [];
  
  // Estilo Xilogravura (Cordel)
  const cordelStrings = [
    { y: 50, speed: 2, folhetos: [] }
  ];
  const stars = Array(30).fill(0).map(() => ({
    x: Math.random() * 2000,
    y: Math.random() * 200,
    size: Math.random() * 3 + 1
  }));
  let bgOffset = 0;

  function spawnCordel() {
    cordelStrings.forEach(str => {
      if (Math.random() < 0.015) {
        str.folhetos.push({
          x: canvas.width,
          width: 30,
          height: 45
        });
      }
    });
  }

  function drawCordelBackground() {
    // 1. Céu noturno (preto)
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Estrelas
    ctx.fillStyle = '#ffffff';
    stars.forEach(s => {
      let sx = s.x - (frame * 0.2);
      while(sx < 0) sx += 2000;
      if (sx < canvas.width) {
         ctx.fillRect(sx, s.y, s.size, s.size);
      }
    });

    // 3. Montanhas Brancas
    bgOffset -= gameSpeed * 0.3;
    if (bgOffset <= -600) bgOffset += 600;

    ctx.fillStyle = '#fefae0'; // Cor do papel
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';

    for(let i = 0; i < Math.ceil(canvas.width / 600) + 1; i++) {
       const mx = bgOffset + i * 600;
       ctx.beginPath();
       ctx.moveTo(mx, groundY);
       ctx.lineTo(mx + 150, groundY - 150);
       ctx.lineTo(mx + 300, groundY - 80);
       ctx.lineTo(mx + 450, groundY - 180);
       ctx.lineTo(mx + 600, groundY);
       ctx.fill();
       ctx.stroke();
       
       // Ranhuras de gravura nas montanhas
       ctx.beginPath();
       ctx.moveTo(mx + 150, groundY - 150); ctx.lineTo(mx + 150, groundY);
       ctx.moveTo(mx + 300, groundY - 80); ctx.lineTo(mx + 300, groundY);
       ctx.moveTo(mx + 450, groundY - 180); ctx.lineTo(mx + 450, groundY);
       ctx.stroke();
    }

    // 4. Chão Xilogravura
    ctx.fillStyle = '#fefae0';
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
    
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(canvas.width, groundY);
    ctx.lineWidth = 6;
    ctx.stroke();

    // Textura cavada no chão (traços grossos pretos)
    ctx.fillStyle = '#000000';
    for(let i = 0; i < canvas.width + 60; i+= 60) {
       const dashX = (i - (frame * gameSpeed) % 60);
       ctx.fillRect(dashX, groundY + 10, 35, 4);
       ctx.fillRect(dashX + 25, groundY + 25, 35, 4);
    }

    // 5. Cordéis (Varal)
    cordelStrings.forEach(str => {
      ctx.beginPath();
      ctx.moveTo(0, str.y);
      ctx.lineTo(canvas.width, str.y);
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ffffff'; // Fio branco brilhando no céu noturno
      ctx.stroke();

      str.folhetos.forEach(f => {
        f.x -= gameSpeed * (str.speed / 5);
        ctx.fillStyle = '#fefae0';
        ctx.fillRect(f.x, str.y, f.width, f.height);
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(f.x, str.y, f.width, f.height);
        
        // Desenho interno (capa da xilogravura)
        ctx.fillStyle = '#000000';
        ctx.fillRect(f.x + 5, str.y + 8, 20, 15); 
        ctx.fillRect(f.x + 5, str.y + 28, 20, 3);
        ctx.fillRect(f.x + 5, str.y + 35, 15, 3);
      });

      str.folhetos = str.folhetos.filter(f => f.x + f.width > 0);
    });
  }

  function jump() {
    if (player.isGrounded) {
      player.dy = -player.jumpForce;
      player.isGrounded = false;
    }
  }

  function spawnObstacle() {
    if (frame % Math.floor(Math.random() * 60 + 60) === 0) {
      const isHigh = Math.random() > 0.5;
      const height = isHigh ? 60 : 40;
      obstacles.push({
        x: canvas.width,
        y: groundY - height,
        width: height * 0.75,
        height: height
      });
    }
  }

  function spawnItem() {
    if (frame % 200 === 0) {
      const type = Math.random() > 0.7 ? 'maca' : 'pamonha';
      // Pamonha nasce perto do alcance do pulo, não do céu infinito
      const itemY = groundY - 100 - Math.random() * 40;
      items.push({
        x: canvas.width,
        y: itemY,
        width: 30,
        height: 30,
        type: type,
        dy: type === 'pamonha' ? 2 : 0 // pamonha cai de leve, maçã fica reta
      });
    }
  }

  function update() {
    if (isGameOver || showInstructions) return;

    frame++;
    gameSpeed += 0.002;

    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height >= groundY) {
      player.y = groundY - player.height;
      player.dy = 0;
      player.isGrounded = true;
    }

    if (player.invincibleTimer > 0) {
      player.invincibleTimer--;
    }

    spawnCordel();
    spawnObstacle();
    spawnItem();

    obstacles.forEach((obs, index) => {
      obs.x -= gameSpeed;
      if (obs.x + obs.width < 0) {
        obstacles.splice(index, 1);
        score += 10;
      }

      // Colisão mais permissiva (hitbox menor para o fogo e pro jogador)
      const obsMarginX = obs.width * 0.25;
      const obsMarginY = obs.height * 0.3;
      const playerMarginX = 10;
      
      if (
        player.invincibleTimer === 0 &&
        player.x + playerMarginX < obs.x + obs.width - obsMarginX &&
        player.x + player.width - playerMarginX > obs.x + obsMarginX &&
        player.y < obs.y + obs.height &&
        player.y + player.height > obs.y + obsMarginY
      ) {
        isGameOver = true;
      } else if (player.invincibleTimer > 0 && 
        player.x < obs.x + obs.width &&
        player.x + player.width > obs.x &&
        player.y < obs.y + obs.height &&
        player.y + player.height > obs.y) {
          obstacles.splice(index, 1);
          score += 20;
      }
    });

    items.forEach((item, index) => {
      item.x -= gameSpeed;
      if (item.type === 'pamonha') {
        item.y += item.dy;
        if (item.y + item.height > groundY) item.y = groundY - item.height;
      }

      if (item.x + item.width < 0) {
        items.splice(index, 1);
      }

      if (
        player.x < item.x + item.width &&
        player.x + player.width > item.x &&
        player.y < item.y + item.height &&
        player.y + player.height > item.y
      ) {
        if (item.type === 'pamonha') {
          score += 50;
        } else if (item.type === 'maca') {
          player.invincibleTimer = 300;
        }
        items.splice(index, 1);
      }
    });
  }

  function draw() {
    drawCordelBackground();

    ctx.save();
    if (player.invincibleTimer > 0 && Math.floor(frame / 5) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }
    
    // Move o ponto de âncora para os pés do personagem
    ctx.translate(player.x + player.width / 2, player.y + player.height);
    
    if (!player.isGrounded) {
      // Animação de pulo: Dá uma cambalhota (flip) no ar!
      // A rotação é proporcional a velocidade Y para fechar um giro completo no pulo
      const airProgress = (player.dy / player.jumpForce); // Vai de -1 (início) a 1 (fim)
      // Converte esse progresso para um ângulo legal
      ctx.translate(0, -player.height / 2); // Âncora no meio da barriga pra girar
      ctx.rotate(airProgress * Math.PI * 0.5); // Gira pra trás e pra frente, ou dá um flip dependendo do efeito
      ctx.translate(0, player.height / 2);
    } else {
      // Animação de corrida: Ele fica "pulandinho" (bobbing) enquanto corre
      const runBob = Math.abs(Math.sin(frame * 0.3)) * 8; 
      ctx.translate(0, -runBob);
      // E um pequeno squash (amassa e estica) pra dar vida
      ctx.scale(1 - (runBob/100), 1 + (runBob/100));
    }

    ctx.drawImage(playerImg, -player.width / 2, -player.height, player.width, player.height);
    ctx.restore();

    obstacles.forEach(obs => {
      const fIdx = Math.floor(frame / 6) % 3;
      ctx.drawImage(fireFrames[fIdx], obs.x, obs.y, obs.width, obs.height);
    });

    items.forEach(item => {
      if (item.type === 'pamonha') {
        ctx.drawImage(pamonhaImg, item.x, item.y, item.width, item.height);
      } else {
        ctx.drawImage(macaImg, item.x, item.y, item.width, item.height);
      }
    });

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText("Pontos: " + score, 20, 40);
    
    if (player.invincibleTimer > 0) {
      ctx.fillStyle = '#ffba08';
      ctx.fillText("✨ INVENCÍVEL!", 20, 70);
    }

    if (showInstructions) {
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#ffb703';
      ctx.textAlign = 'center';
      ctx.font = 'bold 32px "Bungee", sans-serif';
      ctx.fillText("PULA FOGUEIRA", canvas.width / 2, canvas.height / 2 - 40);
      
      ctx.fillStyle = '#fefae0';
      ctx.font = '20px Outfit, sans-serif';
      ctx.fillText("Pressione ESPAÇO, SETA PARA CIMA", canvas.width / 2, canvas.height / 2);
      ctx.fillText("ou toque na tela para pular!", canvas.width / 2, canvas.height / 2 + 30);
      
      ctx.fillStyle = '#ff006e';
      ctx.font = 'bold 22px Outfit, sans-serif';
      ctx.fillText("👆 Clique para começar!", canvas.width / 2, canvas.height / 2 + 90);
    } else if (isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#e63946';
      ctx.textAlign = 'center';
      ctx.font = 'bold 32px "Bungee", sans-serif';
      ctx.fillText("VIXE, VOCÊ CAIU!", canvas.width / 2, canvas.height / 2 - 30);
      
      ctx.fillStyle = '#fefae0';
      ctx.font = '22px Outfit, sans-serif';
      ctx.fillText(`Você fez ${score} pontos.`, canvas.width / 2, canvas.height / 2 + 10);
      
      saveScore('runner', score);
      const hs = getHighScore('runner');
      ctx.fillStyle = '#ff006e';
      ctx.font = '20px "Outfit", sans-serif';
      ctx.fillText(`Recorde Atual: ${hs} pontos`, canvas.width / 2, canvas.height / 2 + 40);

      ctx.fillStyle = '#ffbe0b';
      ctx.font = '24px "Outfit", sans-serif';
      ctx.fillText('👆 Clique para tentar de novo', canvas.width / 2, canvas.height / 2 + 80);
    }
  }

  function gameLoop() {
    update();
    draw();
    animationId = requestAnimationFrame(gameLoop);
  }

  function handleInput(e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    
    if (showInstructions) {
      showInstructions = false;
      return;
    }
    
    if (isGameOver) {
      isGameOver = false;
      score = 0;
      gameSpeed = window.innerWidth < 768 ? 3.5 : 6;
      obstacles.length = 0;
      items.length = 0;
      cordelStrings.forEach(str => str.folhetos.length = 0);
      player.y = groundY - player.height;
      player.dy = 0;
      player.isGrounded = true;
      player.invincibleTimer = 0;
      return;
    }
    
    jump();
  }

  canvas.addEventListener('mousedown', handleInput);
  canvas.addEventListener('touchstart', handleInput, { passive: false });
  
  const handleKeydown = (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      handleInput(e);
    }
  };
  window.addEventListener('keydown', handleKeydown);

  gameLoop();

  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resize);
    window.removeEventListener('keydown', handleKeydown);
    canvas.removeEventListener('mousedown', handleInput);
    canvas.removeEventListener('touchstart', handleInput);
  };
}
