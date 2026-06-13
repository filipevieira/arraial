export function createPersonSvg(shirtColor, skinColor, type, extraSvg = '') {
  return `
  <svg class="pessoa-svg ${type}" viewBox="0 0 40 80" xmlns="http://www.w3.org/2000/svg">
    <!-- Chapéu -->
    <ellipse cx="20" cy="15" rx="15" ry="5" fill="#d4a373"/>
    <rect x="12" y="8" width="16" height="7" fill="#d4a373"/>
    <!-- Cabeça -->
    <circle cx="20" cy="25" r="7" fill="${skinColor}"/>
    <!-- Braço Esquerdo (Atrás) -->
    <rect class="arm-l" x="10" y="32" width="6" height="20" rx="3" fill="${shirtColor}"/>
    <!-- Perna Esquerda (Atrás) -->
    <rect class="leg-l" x="14" y="55" width="5" height="20" rx="2" fill="#022b3a"/>
    <!-- Corpo -->
    <rect x="12" y="32" width="16" height="25" rx="3" fill="${shirtColor}"/>
    <!-- Perna Direita (Frente) -->
    <rect class="leg-r" x="21" y="55" width="5" height="20" rx="2" fill="#022b3a"/>
    <!-- Braço Direito (Frente) -->
    <rect class="arm-r" x="24" y="32" width="6" height="20" rx="3" fill="${shirtColor}"/>
    ${extraSvg}
  </svg>
  `;
}
