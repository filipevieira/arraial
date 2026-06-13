import { createPersonSvg } from './graphics.js';

import { saveScore, getHighScore } from './ranking.js';

export function initQuentaoGame(container) {
  const canvas = document.createElement('canvas');
  // Ajusta o tamanho
  canvas.width = container.clientWidth || 800;
  canvas.height = 400;
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  
  let animationId;
  let isGameOver = false;
  let isFalling = false;
  let showInstructions = true;
  let score = 0;
  
  // physics
  let cupX = canvas.width / 2;
  let cupY = -165;
  let cupVelocity = 0;
  let cupRotation = 0;
  
  // inputs
  let userTilt = 0; // -1 to 1
  let drunkTilt = 0;
  let drunkPhase = 0;
  let difficulty = 0.05;

  const personSvgStr = `
<svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
  <path d="M40,120 L30,190 L45,190 L50,120 Z" fill="#1d3557"/>
  <path d="M60,120 L70,190 L55,190 L50,120 Z" fill="#1d3557"/>
  <path d="M25,190 L45,190 L45,198 L20,198 Z" fill="#000"/>
  <path d="M55,190 L75,190 L80,198 L55,198 Z" fill="#000"/>
  
  <path d="M35,60 L65,60 L60,130 L40,130 Z" fill="#2a9d8f"/>
  <path d="M35,60 L65,60 L60,130 L40,130 Z" fill="url(#plaid)" />
  
  <defs>
    <pattern id="plaid" width="10" height="10" patternUnits="userSpaceOnUse">
      <rect width="10" height="10" fill="#2a9d8f"/>
      <path d="M0,5 L10,5 M5,0 L5,10" stroke="#000" stroke-width="2" opacity="0.3"/>
      <path d="M0,2 L10,2 M2,0 L2,10" stroke="#fff" stroke-width="1" opacity="0.4"/>
    </pattern>
  </defs>

  <path d="M35,65 Q0,60 15,10 Q20,5 25,5" fill="none" stroke="url(#plaid)" stroke-width="14" stroke-linecap="round"/>
  <path d="M65,65 Q100,60 85,10 Q80,5 75,5" fill="none" stroke="url(#plaid)" stroke-width="14" stroke-linecap="round"/>
  
  <circle cx="20" cy="5" r="7" fill="#ffcdb2"/>
  <circle cx="80" cy="5" r="7" fill="#ffcdb2"/>

  <circle cx="50" cy="45" r="18" fill="#ffcdb2"/>
  <circle cx="44" cy="43" r="2" fill="#000"/>
  <circle cx="56" cy="43" r="2" fill="#000"/>
  <path d="M45,50 Q50,55 55,50" fill="none" stroke="#000" stroke-width="2"/>
  <path d="M45,35 Q50,40 55,35" fill="none" stroke="#000" stroke-width="1"/>

  <ellipse cx="50" cy="28" rx="28" ry="6" fill="#e9c46a"/>
  <path d="M35,28 C35,10 65,10 65,28 Z" fill="#e9c46a"/>
  <path d="M38,20 L62,20 M42,15 L58,15 M30,28 L70,28" stroke="#d4a373" stroke-width="1.5" fill="none"/>
  <path d="M40,28 L45,12 M45,28 L50,10 M50,28 L55,10 M55,28 L60,12" stroke="#d4a373" stroke-width="1.5" fill="none"/>
</svg>`;
  const personImg = new Image();
  personImg.src = 'data:image/svg+xml,' + encodeURIComponent(personSvgStr);

  const cupSvgStr = `
<svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
  <rect x="25" y="5" width="8" height="45" rx="2" fill="#8b5a2b" transform="rotate(15 29 25)"/>
  <path d="M29,5 L29,50" stroke="#5c3a21" stroke-width="2" transform="rotate(15 29 25)"/>
  
  <path d="M10,35 A15,15 0 0,1 40,35 Z" fill="#f4a261"/>
  <path d="M15,33 L25,25 M25,33 L25,25 M35,33 L25,25" stroke="#e76f51" stroke-width="1.5"/>

  <path d="M35,35 L38,30 L40,35 L45,35 L41,38 L42,43 L38,40 L34,43 L35,38 L30,35 Z" fill="#5c3a21"/>
  
  <path d="M10,20 L50,20 L45,75 L15,75 Z" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M15,75 L45,75 L42,80 L18,80 Z" fill="rgba(255, 255, 255, 0.4)"/>
  <path d="M48,35 C65,35 65,65 46,65" fill="none" stroke="rgba(255,255,255,0.8)" stroke-width="3" stroke-linecap="round"/>
  <path d="M15,30 L18,70" stroke="rgba(255, 255, 255, 0.9)" stroke-width="3" stroke-linecap="round"/>
</svg>`;
  const cupImg = new Image();
  cupImg.src = 'data:image/svg+xml,' + encodeURIComponent(cupSvgStr);

  function handleMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    userTilt = (x / canvas.width) * 2 - 1;
  }

  function handleOrientation(e) {
    if (e.gamma !== null) {
      let gamma = e.gamma;
      if (gamma > 45) gamma = 45;
      if (gamma < -45) gamma = -45;
      userTilt = gamma / 45;
    }
  }

  document.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('deviceorientation', handleOrientation);

  function reset() {
    isGameOver = false;
    isFalling = false;
    score = 0;
    cupX = canvas.width / 2;
    cupY = -165;
    cupVelocity = 0;
    cupRotation = 0;
    difficulty = 0.05;
    gameLoop();
  }

  function update() {
    if (isGameOver || showInstructions) return;
    
    if (isFalling) {
      // O copo caiu da cabeça
      cupX += cupVelocity;
      cupY += 12; // Gravidade puxando pra baixo
      cupRotation += cupVelocity * 0.03; // Copo capota no ar
      
      // O chão (y=310) relativo ao pivot do personagem (y=340) é -30
      if (cupY >= -30) {
        cupY = -30;
        isGameOver = true;
        isFalling = false;
      }
      return;
    }
    
    score++;
    if (score % 60 === 0) difficulty += 0.005; 
    
    drunkPhase += 0.03;
    drunkTilt = Math.sin(drunkPhase) * difficulty + (Math.random() - 0.5) * (difficulty / 2);
    
    const totalTilt = userTilt + drunkTilt;
    
    cupVelocity += totalTilt * 0.8;
    cupVelocity *= 0.95; 
    cupX += cupVelocity;
    
    // Cai se passar muito da cabeça
    if (cupX < canvas.width / 2 - 40 || cupX > canvas.width / 2 + 40) {
      isFalling = true;
      cupVelocity = cupVelocity * 1.5; // Dá um tranco extra na inércia quando escorrega
    }
  }

  function draw() {
    ctx.fillStyle = '#2b2d42'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Estrelas
    ctx.fillStyle = '#fff';
    for(let i=0; i<30; i++) {
       let sx = (Math.sin(i * 123) * 1000) % canvas.width;
       if(sx < 0) sx += canvas.width;
       let sy = (Math.cos(i * 321) * 1000) % 200;
       if(sy < 0) sy += 200;
       ctx.globalAlpha = Math.abs(Math.sin((Date.now() + i*100) / 500)) * 0.5 + 0.5;
       ctx.fillRect(sx, sy, 2, 2);
    }
    ctx.globalAlpha = 1.0;

    // Debug do Acelerômetro
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Inclinação: ' + (userTilt * 100).toFixed(0) + '%', 10, 20);

    // Bandeirinhas
    const cores = ['#ff006e', '#8338ec', '#3a86ff', '#fb5607', '#ffbe0b'];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.quadraticCurveTo(canvas.width / 2, 50, canvas.width, 10);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    for(let i=1; i<=15; i++) {
      let t = i / 16;
      let x = (1-t)*(1-t)*0 + 2*(1-t)*t*(canvas.width/2) + t*t*canvas.width;
      let y = (1-t)*(1-t)*10 + 2*(1-t)*t*50 + t*t*10;
      
      ctx.fillStyle = cores[i % cores.length];
      ctx.beginPath();
      ctx.moveTo(x - 12, y);
      ctx.lineTo(x + 12, y);
      ctx.lineTo(x + 12, y + 25);
      ctx.lineTo(x, y + 15);
      ctx.lineTo(x - 12, y + 25);
      ctx.fill();
    }
    ctx.restore();
    
    // Chãozinho
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 310, canvas.width, canvas.height - 310);

    const pivotY = 340; // Pé do personagem
    ctx.save();
    ctx.translate(canvas.width / 2, pivotY);
    ctx.rotate(userTilt * 0.4); // Corpo balança com o tilt
    
    // Desenha o personagem (centralizado no X, ancorado no pé)
    ctx.drawImage(personImg, -50, -200, 100, 200);
    
    // Copo
    const relativeCupX = cupX - canvas.width / 2;
    const cupBaseY = cupY; 
    
    // Desenha o copo com rotação e o líquido dinâmico
    ctx.save();
    ctx.translate(relativeCupX, cupBaseY - 40);
    ctx.rotate(cupRotation);

    ctx.fillStyle = 'rgba(114, 9, 11, 0.95)';
    ctx.beginPath();
    ctx.moveTo(-12, 35);
    ctx.lineTo(-18, -15);
    ctx.lineTo(18, -15 + (cupVelocity * 1.5)); // Dinâmica da superfície
    ctx.lineTo(12, 35);
    ctx.fill();

    ctx.drawImage(cupImg, -30, -40, 60, 80);
    ctx.restore();

    // Fumaça
    if (score % 20 < 10 && !isGameOver && !isFalling) {
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.arc(relativeCupX, cupBaseY - 60, 5, 0, Math.PI*2);
      ctx.arc(relativeCupX - 10, cupBaseY - 70, 8, 0, Math.PI*2);
      ctx.fill();
    }

    ctx.restore();
    
    // HUD Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.roundRect(canvas.width - 190, 15, 175, 40, 8);
    ctx.fill();
    
    // HUD Text
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Tempo:`, canvas.width - 180, 43);
    
    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${(score/60).toFixed(3)}s`, canvas.width - 25, 43);
    
    if (showInstructions) {
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#ffb703';
      ctx.textAlign = 'center';
      ctx.font = 'bold 32px "Bungee", sans-serif';
      ctx.fillText("QUENTÃO EQUILIBRISTA", canvas.width / 2, canvas.height / 2 - 40);
      
      ctx.fillStyle = '#fefae0';
      ctx.font = '20px Outfit, sans-serif';
      ctx.fillText("Mova o mouse ou incline o celular", canvas.width / 2, canvas.height / 2);
      ctx.fillText("para não deixar o copo cair!", canvas.width / 2, canvas.height / 2 + 30);
      
      ctx.fillStyle = '#ff006e';
      ctx.font = 'bold 22px Outfit, sans-serif';
      ctx.fillText("👆 Clique para começar!", canvas.width / 2, canvas.height / 2 + 90);
    } else if (isGameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#e63946';
      ctx.textAlign = 'center';
      ctx.font = 'bold 28px "Bungee", sans-serif';
      ctx.fillText("VIXE, DERRAMOU O QUENTÃO!", canvas.width / 2, canvas.height / 2 - 30);
      
      ctx.fillStyle = '#fefae0';
      ctx.font = '22px Outfit, sans-serif';
      const finalScore = Number((score/60).toFixed(3));
      ctx.fillText(`Você equilibrou por ${finalScore.toFixed(3)} segundos.`, canvas.width / 2, canvas.height / 2 + 10);
      
      saveScore('quentao', finalScore);
      const hs = getHighScore('quentao');
      
      ctx.fillStyle = "#ffb703";
      ctx.font = "bold 16px 'Courier New'";
      ctx.fillText(`Recorde: ${Number(hs).toFixed(3)} segundos`, canvas.width / 2, canvas.height / 2 + 40);

      ctx.fillStyle = '#ffb703';
      ctx.font = 'bold 20px Outfit, sans-serif';
      ctx.fillText("👆 Clique para tentar de novo", canvas.width / 2, canvas.height / 2 + 80);
    }
  }

  function gameLoop() {
    update();
    draw();
    if (!isGameOver) {
      animationId = requestAnimationFrame(gameLoop);
    }
  }
  
  const handleStart = (e) => {
    if (e.type === 'touchstart') e.preventDefault();
    
    // Solicitar permissão do acelerômetro no iOS 13+
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          // Permissão concedida ou negada, o listener já está ativo
        })
        .catch(console.error);
    }

    if (showInstructions) {
      showInstructions = false;
    } else if (isGameOver) {
      reset();
    }
  };

  canvas.addEventListener('mousedown', handleStart);
  canvas.addEventListener('touchstart', handleStart, {passive: false});

  gameLoop();

  return function cleanup() {
    cancelAnimationFrame(animationId);
    document.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('deviceorientation', handleOrientation);
  };
}
