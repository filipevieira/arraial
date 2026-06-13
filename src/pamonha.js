import { saveScore, getHighScore } from './ranking.js';

export function initPamonhaGame(container) {
  const canvas = document.createElement('canvas');
  canvas.width = container.clientWidth || 400;
  canvas.height = container.clientHeight || 600;
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  
  let animationId;
  let isGameOver = false;
  let showInstructions = true;
  let pamonhas = 0;
  let massa = 0; // 0 to 100
  let stress = 0; // 0 to 100
  
  // Interaction variables
  let isGrating = false;
  let graterY = canvas.height / 2;
  let lastGraterY = graterY;
  let lastTime = performance.now();
  
  // Particles
  let particles = [];
  
  // Corn dimensions
  const cornWidth = 100;
  const cornHeight = 350;
  const cornX = canvas.width / 2;
  const cornY = canvas.height / 2;
  
  function handleDown(e) {
    if (e.cancelable) e.preventDefault();
    if (isGameOver) {
      // restart
      isGameOver = false;
      pamonhas = 0;
      massa = 0;
      stress = 0;
      particles = [];
      return;
    }
    showInstructions = false;
    isGrating = true;
    updateMouse(e);
  }
  
  function handleUp(e) {
    isGrating = false;
  }
  
  function handleMove(e) {
    if (isGrating && !isGameOver) {
      if (e.cancelable) e.preventDefault();
      updateMouse(e);
    }
  }
  
  function updateMouse(e) {
    let clientY;
    if (e.touches && e.touches.length > 0) {
      clientY = e.touches[0].clientY;
    } else {
      clientY = e.clientY;
    }
    const rect = canvas.getBoundingClientRect();
    graterY = clientY - rect.top;
  }
  
  canvas.addEventListener('mousedown', handleDown);
  canvas.addEventListener('mousemove', handleMove);
  window.addEventListener('mouseup', handleUp);
  
  canvas.addEventListener('touchstart', handleDown, {passive: false});
  canvas.addEventListener('touchmove', handleMove, {passive: false});
  window.addEventListener('touchend', handleUp);
  
  function spawnParticle(y, amount) {
    for (let i = 0; i < amount; i++) {
      particles.push({
        x: cornX + (Math.random() - 0.5) * cornWidth,
        y: y + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 2 + 2,
        life: 1.0,
        size: Math.random() * 4 + 2
      });
    }
  }
  
  function update(dt) {
    if (isGameOver) return;
    
    // Calculate grating physics
    if (isGrating) {
      // Check if within corn bounds vertically
      const cornTop = cornY - cornHeight/2;
      const cornBottom = cornY + cornHeight/2;
      
      if (graterY >= cornTop && graterY <= cornBottom) {
        let dy = Math.abs(graterY - lastGraterY);
        let velocity = dy / dt; // pixels per ms
        
        if (dy > 1) {
          // Generated mass
          massa += dy * 0.05;
          if (massa >= 100) {
            pamonhas++;
            massa -= 100;
          }
          
          spawnParticle(graterY, Math.floor(dy / 5) + 1);
          
          // Stress calculation
          const safeSpeed = 1.0; // pixels per ms
          if (velocity > safeSpeed) {
            stress += (velocity - safeSpeed) * 1.5;
          }
        }
      }
    }
    
    lastGraterY = graterY;
    
    // Cooling down
    stress -= 0.1 * dt;
    if (stress < 0) stress = 0;
    
    if (stress >= 100) {
      stress = 100;
      isGameOver = true;
    }
    
    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }
  
  function drawCorn(ctx, x, y, w, h) {
    ctx.save();
    ctx.translate(x, y);
    
    // Leaves (Palha)
    ctx.fillStyle = '#8ab060';
    ctx.beginPath();
    ctx.moveTo(0, h/2 + 20);
    ctx.quadraticCurveTo(-w, 0, -w/2, -h/2);
    ctx.quadraticCurveTo(0, -h/4, 0, 0);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(0, h/2 + 20);
    ctx.quadraticCurveTo(w, 0, w/2, -h/2);
    ctx.quadraticCurveTo(0, -h/4, 0, 0);
    ctx.fill();
    
    // Corn body
    ctx.fillStyle = '#ffca3a';
    ctx.beginPath();
    ctx.ellipse(0, 0, w/2, h/2, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#e0a800';
    ctx.stroke();
    
    // Kernels (dentinhos)
    ctx.fillStyle = '#ffb703';
    for (let i = -h/2 + 25; i < h/2 - 25; i += 16) {
      for (let j = -w/2 + 15; j < w/2 - 15; j += 14) {
        // Curve the x slightly based on y for 3D effect
        let offsetX = j * Math.cos((i / h) * Math.PI/2);
        
        // Draw kernel shape instead of just circles
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.roundRect(offsetX - 5, i - 6, 10, 12, 3);
        ctx.fill();
        ctx.strokeStyle = '#e0a800';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }
  
  function drawGrater(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(-45, -35, 90, 70);
    
    // Grater body
    ctx.fillStyle = '#adb5bd';
    ctx.fillRect(-50, -40, 100, 80);
    
    // Handle
    ctx.fillStyle = '#6c757d';
    ctx.fillRect(-15, -60, 30, 20);
    ctx.fillStyle = '#495057';
    ctx.fillRect(-25, -70, 50, 10);
    ctx.beginPath();
    ctx.arc(-25, -65, 5, 0, Math.PI*2);
    ctx.arc(25, -65, 5, 0, Math.PI*2);
    ctx.fill();
    
    // Grater holes
    ctx.fillStyle = '#495057';
    for (let i = -20; i <= 20; i += 15) {
      for (let j = -30; j <= 30; j += 20) {
        ctx.beginPath();
        ctx.arc(j, i, 3, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(j, i - 1, 1.5, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#495057';
      }
    }
    
    ctx.restore();
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Corn
    drawCorn(ctx, cornX, cornY, cornWidth, cornHeight);
    
    // Draw particles
    particles.forEach(p => {
      ctx.fillStyle = `rgba(255, 202, 58, ${p.life})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
    });
    
    // Draw Grater
    if (!isGameOver) {
      drawGrater(ctx, cornX, Math.max(cornY - cornHeight/2, Math.min(cornY + cornHeight/2, graterY)));
    }
    
    // Draw UI - Pontos
    ctx.fillStyle = '#fff';
    ctx.font = '24px "Bungee", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Pontos: ' + pamonhas, 20, 40);
    
    // Draw Massa Bar (Ponto da Pamonha)
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#ffca3a';
    ctx.fillText('PONTO DA MASSA', 20, 75);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath(); ctx.roundRect(20, 85, 120, 12, 6); ctx.fill();
    ctx.fillStyle = '#ffca3a';
    ctx.beginPath(); ctx.roundRect(20, 85, (massa/100)*120, 12, 6); ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw Stress Bar (Gastura do Ralador)
    ctx.fillStyle = '#e63946';
    ctx.textAlign = 'right';
    ctx.fillText('DESGASTE DO RALADOR', canvas.width - 20, 75);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath(); ctx.roundRect(canvas.width - 140, 85, 120, 12, 6); ctx.fill();
    
    // Color gradient for stress
    let stressColor = '#8ab060';
    if (stress > 50) stressColor = '#ffb703';
    if (stress > 80) stressColor = '#e63946';
    
    ctx.fillStyle = stressColor;
    ctx.beginPath(); ctx.roundRect(canvas.width - 140, 85, (stress/100)*120, 12, 6); ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    
    if (showInstructions) {
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#ffb703';
      ctx.textAlign = 'center';
      ctx.font = 'bold 32px "Bungee", sans-serif';
      ctx.fillText("RALADOR DE PAMONHA", canvas.width / 2, canvas.height / 2 - 40);
      
      ctx.fillStyle = '#fefae0';
      ctx.font = '20px Outfit, sans-serif';
      ctx.fillText("Arraste para cima e para baixo", canvas.width / 2, canvas.height / 2);
      ctx.fillText("para ralar o milho o mais rápido que puder!", canvas.width / 2, canvas.height / 2 + 30);
      
      ctx.fillStyle = '#ff006e';
      ctx.font = 'bold 22px Outfit, sans-serif';
      ctx.fillText("👆 Clique para começar!", canvas.width / 2, canvas.height / 2 + 90);
    }
    
    if (isGameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#e63946';
      ctx.textAlign = 'center';
      ctx.font = 'bold 28px "Bungee", sans-serif';
      ctx.fillText("VIXE, QUEBROU O RALADOR!", canvas.width / 2, canvas.height / 2 - 30);
      
      ctx.fillStyle = '#fefae0';
      ctx.font = '22px Outfit, sans-serif';
      ctx.fillText(`Você fez ${pamonhas} pamonhas.`, canvas.width / 2, canvas.height / 2 + 10);
      
      saveScore('pamonha', pamonhas);
      const hs = getHighScore('pamonha');
      ctx.fillStyle = '#ff006e';
      ctx.font = '20px "Outfit", sans-serif';
      ctx.fillText(`Recorde: ${hs} pamonhas`, canvas.width / 2, canvas.height / 2 + 40);

      ctx.fillStyle = '#ffb703';
      ctx.font = 'bold 20px Outfit, sans-serif';
      ctx.fillText("👆 Clique para tentar de novo", canvas.width / 2, canvas.height / 2 + 80);
    }
  }
  
  function loop(time) {
    if (!animationId) return; // stopped
    const dt = time - lastTime;
    lastTime = time;
    
    if (dt > 0) {
      update(dt);
      draw();
    }
    
    animationId = requestAnimationFrame(loop);
  }
  
  animationId = requestAnimationFrame(loop);
  
  return function cleanup() {
    cancelAnimationFrame(animationId);
    animationId = null;
    canvas.removeEventListener('mousedown', handleDown);
    canvas.removeEventListener('mousemove', handleMove);
    window.removeEventListener('mouseup', handleUp);
    canvas.removeEventListener('touchstart', handleDown);
    canvas.removeEventListener('touchmove', handleMove);
    window.removeEventListener('touchend', handleUp);
    canvas.remove();
  };
}
