// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const storedTheme = localStorage.getItem('portfolio-theme') || 'light';
document.documentElement.setAttribute('data-theme', storedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
});

// Kebab menu / drawer
const kebabBtn = document.getElementById('kebabBtn');
const drawer = document.getElementById('drawer');

kebabBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  drawer.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (!drawer.contains(e.target) && !kebabBtn.contains(e.target)) {
    drawer.classList.remove('open');
  }
});

drawer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    drawer.classList.remove('open');
  });
});

// Projects data - Edit this array to add your projects
// Each project has: title, description, and reportUrl (link to your PDF)
const projects = [
  {
    title: "Klein Tunneling in Graphene",
    description: "Study of the relativistic quantum mechanical phenomenon where electrons in graphene can pass through potential barriers with 100% transmission probability, demonstrating the unique Dirac fermion behavior in 2D materials.",
    reportUrl: "https://github.com/Soumik969/All_at_once/blob/main/Klein%20Tunneling%20in%20Graphene.pdf"
  },
  {
    title: "Orbital Hall Effect",
    description: "Investigation of the orbital Hall effect - a transport phenomenon where an orbital angular momentum current flows perpendicular to an applied electric field, exploring its role in spintronics and topological materials.",
    reportUrl: "https://github.com/Soumik969/All_at_once/blob/main/Orbital%20Hall%20Effect.pdf"
  },
  {
    title: "Supervised Learning Project (SLP)",
    description: "Comprehensive machine learning project implementing and analyzing various supervised learning algorithms for classification and regression tasks with detailed performance evaluation and model comparison.",
    reportUrl: "https://github.com/Soumik969/All_at_once/blob/main/SLP_final_report.pdf"
  },
  {
    title: "AIDS Data Analysis Project",
    description: "Data science project involving statistical analysis and predictive modeling on AIDS-related datasets, utilizing machine learning techniques for pattern recognition and insights extraction.",
    reportUrl: "https://github.com/Soumik969/All_at_once/blob/main/AIDS%20PROJECT.pdf"
  },
  {
    title: "C++ Programming Project",
    description: "Object-oriented programming project in C++ demonstrating core concepts including classes, inheritance, polymorphism, and efficient algorithm implementation.",
    reportUrl: "https://github.com/Soumik969/All_at_once/blob/main/CPP-23b1825.pdf"
  }
];

// Render projects
const projectsList = document.getElementById('projectsList');

function renderProjects() {
  projectsList.innerHTML = '';
  
  projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-info">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
      </div>
      <a href="${project.reportUrl}" target="_blank" rel="noopener" class="project-link">
        View Report →
      </a>
    `;
    projectsList.appendChild(card);
  });
}

renderProjects();

// Smooth reveal animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

// ========== GAME TAB SWITCHING ==========
const gameTabs = document.querySelectorAll('.game-tab');
const gamePanels = document.querySelectorAll('.game-panel');

gameTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const gameId = tab.dataset.game;
    
    // Update tabs
    gameTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Update panels
    gamePanels.forEach(p => p.classList.remove('active'));
    document.getElementById(`${gameId}-game`).classList.add('active');
  });
});

// ========== FLAPPY BIRD GAME ==========
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('gameStatus');

// Game constants
const GRAVITY = 0.35;
const JUMP_FORCE = -7;
const PIPE_SPEED = 1.8;
const PIPE_GAP = 170;
const PIPE_WIDTH = 55;
const GROUND_HEIGHT = 40;

// Game state
let gameState = 'idle'; // 'idle', 'playing', 'gameover'
let score = 0;
let highScore = parseInt(localStorage.getItem('flappyHighScore')) || 0;
let pipeTimer = 0;
const PIPE_INTERVAL = 100; // frames

// Parallax background
let bgOffset = 0;
let cloudOffset = 0;
let groundOffset = 0;

// Bird
const bird = {
  x: 100,
  y: 200,
  width: 34,
  height: 26,
  vy: 0,
  frame: 0,
  
  reset() {
    this.y = 200;
    this.vy = 0;
    this.frame = 0;
  },
  
  update() {
    if (gameState === 'playing') {
      this.vy += GRAVITY;
      this.y += this.vy;
      this.frame++;
    }
  },
  
  jump() {
    this.vy = JUMP_FORCE;
  },
  
  draw() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Rotate based on velocity
    const angle = Math.min(Math.max(this.vy * 3, -25), 90) * Math.PI / 180;
    ctx.rotate(angle);
    
    // Wing flap animation
    const wingY = Math.sin(this.frame * 0.3) * 3;
    
    // Body (yellow bird)
    ctx.fillStyle = '#fbbf24';
    ctx.strokeStyle = isDark ? '#d97706' : '#b45309';
    ctx.lineWidth = 2;
    
    // Main body
    ctx.beginPath();
    ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Wing
    ctx.fillStyle = isDark ? '#f59e0b' : '#d97706';
    ctx.beginPath();
    ctx.ellipse(-2, 4 + wingY, 10, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye white
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(8, -4, 7, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye pupil
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(10, -4, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Beak
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(14, 2);
    ctx.lineTo(24, 4);
    ctx.lineTo(14, 8);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }
};

// Pipes
let pipes = [];

function createPipe() {
  const minTop = 60;
  const maxTop = canvas.height - PIPE_GAP - GROUND_HEIGHT - 60;
  const topHeight = Math.random() * (maxTop - minTop) + minTop;
  
  return {
    x: canvas.width + 20,
    topHeight: topHeight,
    bottomY: topHeight + PIPE_GAP,
    scored: false
  };
}

function drawPipe(pipe) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  // Pipe gradient
  const pipeGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
  pipeGrad.addColorStop(0, '#22c55e');
  pipeGrad.addColorStop(0.5, '#4ade80');
  pipeGrad.addColorStop(1, isDark ? '#16a34a' : '#15803d');
  
  ctx.fillStyle = pipeGrad;
  ctx.strokeStyle = '#14532d';
  ctx.lineWidth = 3;
  
  // Top pipe body
  ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight - 25);
  ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight - 25);
  
  // Top pipe cap
  ctx.fillRect(pipe.x - 6, pipe.topHeight - 30, PIPE_WIDTH + 12, 30);
  ctx.strokeRect(pipe.x - 6, pipe.topHeight - 30, PIPE_WIDTH + 12, 30);
  
  // Bottom pipe body
  const bottomStart = pipe.bottomY + 25;
  ctx.fillRect(pipe.x, bottomStart, PIPE_WIDTH, canvas.height - bottomStart - GROUND_HEIGHT);
  ctx.strokeRect(pipe.x, bottomStart, PIPE_WIDTH, canvas.height - bottomStart - GROUND_HEIGHT);
  
  // Bottom pipe cap
  ctx.fillRect(pipe.x - 6, pipe.bottomY, PIPE_WIDTH + 12, 30);
  ctx.strokeRect(pipe.x - 6, pipe.bottomY, PIPE_WIDTH + 12, 30);
}

function drawBackground() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height - GROUND_HEIGHT);
  if (isDark) {
    skyGrad.addColorStop(0, '#0f172a');
    skyGrad.addColorStop(0.4, '#1e293b');
    skyGrad.addColorStop(1, '#334155');
  } else {
    skyGrad.addColorStop(0, '#38bdf8');
    skyGrad.addColorStop(0.4, '#7dd3fc');
    skyGrad.addColorStop(1, '#bae6fd');
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height - GROUND_HEIGHT);
  
  // Moving clouds
  if (gameState === 'playing') {
    cloudOffset = (cloudOffset + 0.5) % (canvas.width + 200);
  }
  
  ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(255, 255, 255, 0.9)';
  
  // Cloud 1
  const c1x = (canvas.width - cloudOffset + 100) % (canvas.width + 200) - 100;
  ctx.beginPath();
  ctx.ellipse(c1x, 70, 50, 25, 0, 0, Math.PI * 2);
  ctx.ellipse(c1x + 40, 65, 35, 20, 0, 0, Math.PI * 2);
  ctx.ellipse(c1x - 30, 75, 30, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Cloud 2
  const c2x = (canvas.width - cloudOffset + 350) % (canvas.width + 200) - 100;
  ctx.beginPath();
  ctx.ellipse(c2x, 130, 40, 20, 0, 0, Math.PI * 2);
  ctx.ellipse(c2x + 35, 125, 30, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Cloud 3
  const c3x = (canvas.width - cloudOffset * 0.7 + 500) % (canvas.width + 300) - 100;
  ctx.beginPath();
  ctx.ellipse(c3x, 50, 45, 22, 0, 0, Math.PI * 2);
  ctx.ellipse(c3x + 30, 48, 28, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Distant hills
  if (gameState === 'playing') {
    bgOffset = (bgOffset + 1) % 1000;
  }
  
  ctx.fillStyle = isDark ? '#1e3a5f' : '#86efac';
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - GROUND_HEIGHT);
  for (let x = 0; x <= canvas.width; x += 20) {
    const hillY = Math.sin((x + bgOffset * 0.3) * 0.015) * 25 + (canvas.height - GROUND_HEIGHT - 35);
    ctx.lineTo(x, hillY);
  }
  ctx.lineTo(canvas.width, canvas.height - GROUND_HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function drawGround() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  // Moving ground
  if (gameState === 'playing') {
    groundOffset = (groundOffset + PIPE_SPEED) % 60;
  }
  
  // Ground base
  ctx.fillStyle = isDark ? '#854d0e' : '#a3e635';
  ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
  
  // Ground top stripe
  ctx.fillStyle = isDark ? '#a16207' : '#84cc16';
  ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, 10);
  
  // Ground pattern
  ctx.fillStyle = isDark ? '#713f12' : '#65a30d';
  for (let i = -1; i < canvas.width / 60 + 2; i++) {
    const x = i * 60 - groundOffset;
    ctx.fillRect(x, canvas.height - GROUND_HEIGHT + 10, 30, GROUND_HEIGHT - 10);
  }
}

function drawUI() {
  // Score during play
  if (gameState === 'playing') {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.font = 'bold 48px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeText(score.toString(), canvas.width / 2, 60);
    ctx.fillText(score.toString(), canvas.width / 2, 60);
  }
}

function drawStartScreen() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  // Semi-transparent overlay
  ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.92)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Title
  ctx.fillStyle = isDark ? '#fbbf24' : '#f59e0b';
  ctx.font = 'bold 36px Inter, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FLAPPY BIRD', canvas.width / 2, 100);
  
  // Bird preview (animated)
  ctx.save();
  ctx.translate(canvas.width / 2, 180);
  const bobY = Math.sin(Date.now() * 0.005) * 10;
  ctx.translate(0, bobY);
  
  ctx.fillStyle = '#fbbf24';
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, 30, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.ellipse(-2, 5, 12, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(10, -5, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(12, -5, 4, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(18, 2);
  ctx.lineTo(32, 5);
  ctx.lineTo(18, 10);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  
  // Instructions
  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.font = '18px Inter, Arial, sans-serif';
  ctx.fillText('Press SPACE or Click to Flap', canvas.width / 2, 280);
  
  // High score
  ctx.fillStyle = isDark ? '#fbbf24' : '#d97706';
  ctx.font = 'bold 22px Inter, Arial, sans-serif';
  ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, 340);
  
  // Start prompt
  ctx.fillStyle = isDark ? '#3b82f6' : '#2563eb';
  ctx.font = 'bold 24px Inter, Arial, sans-serif';
  ctx.fillText('Click START to Play', canvas.width / 2, 420);
}

function drawGameOver() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  // Funny roast messages based on score
  const roastMessages = [
    { max: 0, msg: '💀 You didn\'t even try!', emoji: '🤡' },
    { max: 3, msg: '😂 My grandma plays better!', emoji: '👵' },
    { max: 5, msg: '🐣 Are you a baby bird?', emoji: '😅' },
    { max: 10, msg: '🥴 Skill issue detected!', emoji: '📉' },
    { max: 20, msg: '😬 Almost decent... almost', emoji: '🫠' },
    { max: 50, msg: '👀 Ok you\'re getting there', emoji: '🔥' },
    { max: Infinity, msg: '🏆 Respect! You\'re a legend!', emoji: '👑' }
  ];
  
  const roast = roastMessages.find(r => score <= r.max);
  
  // Dark overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Game over panel
  const panelWidth = 300;
  const panelHeight = 290;
  const panelX = (canvas.width - panelWidth) / 2;
  const panelY = (canvas.height - panelHeight) / 2 - 20;
  
  // Panel background
  ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
  ctx.strokeStyle = isDark ? '#3b82f6' : '#2563eb';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 16);
  ctx.fill();
  ctx.stroke();
  
  // Game Over text
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 32px Inter, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, panelY + 45);
  
  // Roast message
  ctx.fillStyle = isDark ? '#fbbf24' : '#f59e0b';
  ctx.font = '16px Inter, Arial, sans-serif';
  ctx.fillText(roast.msg, canvas.width / 2, panelY + 80);
  
  // Big emoji
  ctx.font = '40px Arial';
  ctx.fillText(roast.emoji, canvas.width / 2, panelY + 130);
  
  // Score label
  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.font = '16px Inter, Arial, sans-serif';
  ctx.fillText('Your Score', canvas.width / 2, panelY + 165);
  
  // Score value
  ctx.font = 'bold 42px Inter, Arial, sans-serif';
  ctx.fillStyle = isDark ? '#f1f5f9' : '#1e293b';
  ctx.fillText(score.toString(), canvas.width / 2, panelY + 210);
  
  // High score
  ctx.font = '16px Inter, Arial, sans-serif';
  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.fillText(`Best: ${highScore}`, canvas.width / 2, panelY + 240);
  
  // New high score badge
  if (score >= highScore && score > 0) {
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 16px Inter, Arial, sans-serif';
    ctx.fillText('🎉 NEW BEST!', canvas.width / 2, panelY + 268);
  }
  
  // Restart prompt
  ctx.fillStyle = isDark ? '#3b82f6' : '#2563eb';
  ctx.font = 'bold 18px Inter, Arial, sans-serif';
  ctx.fillText('Click START to Play Again', canvas.width / 2, panelY + panelHeight + 40);
}

function checkCollision() {
  // Ground
  if (bird.y + bird.height / 2 > canvas.height - GROUND_HEIGHT) {
    return true;
  }
  
  // Ceiling
  if (bird.y - bird.height / 2 < 0) {
    return true;
  }
  
  // Pipes (with small hitbox padding for fairness)
  for (const pipe of pipes) {
    const birdLeft = bird.x - bird.width / 2 + 5;
    const birdRight = bird.x + bird.width / 2 - 5;
    const birdTop = bird.y - bird.height / 2 + 3;
    const birdBottom = bird.y + bird.height / 2 - 3;
    
    const pipeLeft = pipe.x - 6;
    const pipeRight = pipe.x + PIPE_WIDTH + 6;
    
    if (birdRight > pipeLeft && birdLeft < pipeRight) {
      if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
        return true;
      }
    }
  }
  
  return false;
}

function update() {
  bird.update();
  
  if (gameState !== 'playing') return;
  
  // Pipe spawning
  pipeTimer++;
  if (pipeTimer >= PIPE_INTERVAL) {
    pipes.push(createPipe());
    pipeTimer = 0;
  }
  
  // Update pipes
  for (const pipe of pipes) {
    pipe.x -= PIPE_SPEED;
    
    // Score
    if (!pipe.scored && pipe.x + PIPE_WIDTH < bird.x) {
      pipe.scored = true;
      score++;
      scoreEl.textContent = score;
    }
  }
  
  // Remove off-screen pipes
  pipes = pipes.filter(p => p.x + PIPE_WIDTH + 20 > 0);
  
  // Collision
  if (checkCollision()) {
    gameState = 'gameover';
    statusEl.textContent = 'Game Over!';
    
    // Update high score
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('flappyHighScore', highScore.toString());
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawBackground();
  
  for (const pipe of pipes) {
    drawPipe(pipe);
  }
  
  drawGround();
  bird.draw();
  
  if (gameState === 'idle') {
    drawStartScreen();
  } else if (gameState === 'playing') {
    drawUI();
  } else if (gameState === 'gameover') {
    drawGameOver();
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  bird.reset();
  pipes = [];
  score = 0;
  pipeTimer = 0;
  scoreEl.textContent = '0';
  statusEl.textContent = 'Playing! Press SPACE or Click to flap';
  gameState = 'playing';
}

// Event listeners - START button only starts the game
startBtn.addEventListener('click', () => {
  if (gameState === 'idle' || gameState === 'gameover') {
    startGame();
  }
});

// Canvas click/touch only flaps during gameplay
canvas.addEventListener('click', () => {
  if (gameState === 'playing') {
    bird.jump();
  }
});

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (gameState === 'playing') {
    bird.jump();
  }
});

// Space only flaps during gameplay
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (gameState === 'playing') {
      bird.jump();
    }
  }
});

// Initialize
statusEl.textContent = 'Click START to begin!';
requestAnimationFrame(gameLoop);


// ========== SNAKE GAME ==========
const snakeCanvas = document.getElementById('snakeCanvas');
const snakeCtx = snakeCanvas.getContext('2d');
const snakeStartBtn = document.getElementById('snakeStartBtn');
const snakeScoreEl = document.getElementById('snakeScore');
const snakeStatusEl = document.getElementById('snakeStatus');

// Snake game constants
const GRID_SIZE = 20;
const TILE_COUNT = snakeCanvas.width / GRID_SIZE;
const SNAKE_SPEED = 100; // ms per move

// Snake game state
let snake = [];
let food = { x: 0, y: 0 };
let direction = { x: 0, y: 0 };
let nextDirection = { x: 0, y: 0 };
let snakeScore = 0;
let snakeHighScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
let snakeGameState = 'idle'; // 'idle', 'playing', 'gameover'
let snakeGameInterval = null;
let lastMoveTime = 0;

// Snake colors
function getSnakeColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    bg: isDark ? '#0f172a' : '#f8fafc',
    grid: isDark ? '#1e293b' : '#e2e8f0',
    snake: '#22c55e',
    snakeHead: '#16a34a',
    snakeBorder: '#15803d',
    food: '#ef4444',
    foodGlow: 'rgba(239, 68, 68, 0.3)',
    text: isDark ? '#f1f5f9' : '#1e293b',
    textMuted: isDark ? '#94a3b8' : '#64748b',
    accent: '#2563eb'
  };
}

function initSnake() {
  const centerX = Math.floor(TILE_COUNT / 2);
  const centerY = Math.floor(TILE_COUNT / 2);
  snake = [
    { x: centerX, y: centerY },
    { x: centerX - 1, y: centerY },
    { x: centerX - 2, y: centerY }
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  snakeScore = 0;
  snakeScoreEl.textContent = snakeScore;
  spawnFood();
}

function spawnFood() {
  let validPosition = false;
  while (!validPosition) {
    food.x = Math.floor(Math.random() * TILE_COUNT);
    food.y = Math.floor(Math.random() * TILE_COUNT);
    validPosition = !snake.some(segment => segment.x === food.x && segment.y === food.y);
  }
}

function drawSnakeGame() {
  const colors = getSnakeColors();
  
  // Clear canvas
  snakeCtx.fillStyle = colors.bg;
  snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
  
  // Draw grid
  snakeCtx.strokeStyle = colors.grid;
  snakeCtx.lineWidth = 0.5;
  for (let i = 0; i <= TILE_COUNT; i++) {
    snakeCtx.beginPath();
    snakeCtx.moveTo(i * GRID_SIZE, 0);
    snakeCtx.lineTo(i * GRID_SIZE, snakeCanvas.height);
    snakeCtx.stroke();
    snakeCtx.beginPath();
    snakeCtx.moveTo(0, i * GRID_SIZE);
    snakeCtx.lineTo(snakeCanvas.width, i * GRID_SIZE);
    snakeCtx.stroke();
  }
  
  // Draw food with glow effect
  snakeCtx.shadowColor = colors.foodGlow;
  snakeCtx.shadowBlur = 15;
  snakeCtx.fillStyle = colors.food;
  snakeCtx.beginPath();
  snakeCtx.arc(
    food.x * GRID_SIZE + GRID_SIZE / 2,
    food.y * GRID_SIZE + GRID_SIZE / 2,
    GRID_SIZE / 2 - 2,
    0, Math.PI * 2
  );
  snakeCtx.fill();
  snakeCtx.shadowBlur = 0;
  
  // Draw snake
  snake.forEach((segment, index) => {
    const isHead = index === 0;
    const x = segment.x * GRID_SIZE;
    const y = segment.y * GRID_SIZE;
    
    // Snake body with gradient effect
    const gradient = snakeCtx.createLinearGradient(x, y, x + GRID_SIZE, y + GRID_SIZE);
    if (isHead) {
      gradient.addColorStop(0, colors.snakeHead);
      gradient.addColorStop(1, colors.snake);
    } else {
      const alpha = 1 - (index / snake.length) * 0.4;
      snakeCtx.globalAlpha = alpha;
      gradient.addColorStop(0, colors.snake);
      gradient.addColorStop(1, '#4ade80');
    }
    
    snakeCtx.fillStyle = gradient;
    snakeCtx.strokeStyle = colors.snakeBorder;
    snakeCtx.lineWidth = 2;
    
    // Rounded rectangle for snake segment
    const radius = 4;
    snakeCtx.beginPath();
    snakeCtx.roundRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2, radius);
    snakeCtx.fill();
    snakeCtx.stroke();
    
    snakeCtx.globalAlpha = 1;
    
    // Draw eyes on head
    if (isHead) {
      snakeCtx.fillStyle = 'white';
      const eyeSize = 4;
      const eyeOffset = 5;
      
      if (direction.x === 1) { // Right
        snakeCtx.beginPath();
        snakeCtx.arc(x + GRID_SIZE - eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
        snakeCtx.arc(x + GRID_SIZE - eyeOffset, y + GRID_SIZE - eyeOffset, eyeSize, 0, Math.PI * 2);
        snakeCtx.fill();
      } else if (direction.x === -1) { // Left
        snakeCtx.beginPath();
        snakeCtx.arc(x + eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
        snakeCtx.arc(x + eyeOffset, y + GRID_SIZE - eyeOffset, eyeSize, 0, Math.PI * 2);
        snakeCtx.fill();
      } else if (direction.y === -1) { // Up
        snakeCtx.beginPath();
        snakeCtx.arc(x + eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
        snakeCtx.arc(x + GRID_SIZE - eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
        snakeCtx.fill();
      } else { // Down
        snakeCtx.beginPath();
        snakeCtx.arc(x + eyeOffset, y + GRID_SIZE - eyeOffset, eyeSize, 0, Math.PI * 2);
        snakeCtx.arc(x + GRID_SIZE - eyeOffset, y + GRID_SIZE - eyeOffset, eyeSize, 0, Math.PI * 2);
        snakeCtx.fill();
      }
      
      // Pupils
      snakeCtx.fillStyle = '#1e293b';
      const pupilSize = 2;
      if (direction.x === 1) {
        snakeCtx.beginPath();
        snakeCtx.arc(x + GRID_SIZE - eyeOffset + 1, y + eyeOffset, pupilSize, 0, Math.PI * 2);
        snakeCtx.arc(x + GRID_SIZE - eyeOffset + 1, y + GRID_SIZE - eyeOffset, pupilSize, 0, Math.PI * 2);
        snakeCtx.fill();
      } else if (direction.x === -1) {
        snakeCtx.beginPath();
        snakeCtx.arc(x + eyeOffset - 1, y + eyeOffset, pupilSize, 0, Math.PI * 2);
        snakeCtx.arc(x + eyeOffset - 1, y + GRID_SIZE - eyeOffset, pupilSize, 0, Math.PI * 2);
        snakeCtx.fill();
      } else if (direction.y === -1) {
        snakeCtx.beginPath();
        snakeCtx.arc(x + eyeOffset, y + eyeOffset - 1, pupilSize, 0, Math.PI * 2);
        snakeCtx.arc(x + GRID_SIZE - eyeOffset, y + eyeOffset - 1, pupilSize, 0, Math.PI * 2);
        snakeCtx.fill();
      } else {
        snakeCtx.beginPath();
        snakeCtx.arc(x + eyeOffset, y + GRID_SIZE - eyeOffset + 1, pupilSize, 0, Math.PI * 2);
        snakeCtx.arc(x + GRID_SIZE - eyeOffset, y + GRID_SIZE - eyeOffset + 1, pupilSize, 0, Math.PI * 2);
        snakeCtx.fill();
      }
    }
  });
}

function drawSnakeStartScreen() {
  const colors = getSnakeColors();
  
  // Background
  snakeCtx.fillStyle = colors.bg;
  snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
  
  // Draw decorative snake
  snakeCtx.fillStyle = colors.snake;
  const decorSnake = [
    { x: 8, y: 10 }, { x: 9, y: 10 }, { x: 10, y: 10 }, { x: 11, y: 10 },
    { x: 11, y: 11 }, { x: 11, y: 12 }, { x: 10, y: 12 }, { x: 9, y: 12 }
  ];
  decorSnake.forEach((seg, i) => {
    const alpha = 1 - (i / decorSnake.length) * 0.5;
    snakeCtx.globalAlpha = alpha;
    snakeCtx.beginPath();
    snakeCtx.roundRect(seg.x * GRID_SIZE + 2, seg.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4, 4);
    snakeCtx.fill();
  });
  snakeCtx.globalAlpha = 1;
  
  // Title
  snakeCtx.fillStyle = colors.text;
  snakeCtx.font = 'bold 36px Inter, sans-serif';
  snakeCtx.textAlign = 'center';
  snakeCtx.fillText('🐍 SNAKE', snakeCanvas.width / 2, 100);
  
  // Instructions
  snakeCtx.fillStyle = colors.textMuted;
  snakeCtx.font = '16px Inter, sans-serif';
  snakeCtx.fillText('Use Arrow Keys to move', snakeCanvas.width / 2, 300);
  snakeCtx.fillText('Eat food to grow!', snakeCanvas.width / 2, 325);
  
  // High score
  if (snakeHighScore > 0) {
    snakeCtx.fillStyle = colors.accent;
    snakeCtx.font = 'bold 18px Inter, sans-serif';
    snakeCtx.fillText(`🏆 Best: ${snakeHighScore}`, snakeCanvas.width / 2, 365);
  }
}

function drawSnakeGameOver() {
  const colors = getSnakeColors();
  
  // Funny roast messages based on score
  const roastMessages = [
    { max: 0, msg: '💀 You ate yourself instantly!', emoji: '🤦' },
    { max: 20, msg: '🐛 More like a worm than a snake', emoji: '😂' },
    { max: 50, msg: '🥶 Cold blooded failure!', emoji: '🫣' },
    { max: 100, msg: '😤 Skill issue! Try harder!', emoji: '📉' },
    { max: 150, msg: '🐍 Now we\'re talking!', emoji: '👀' },
    { max: 200, msg: '🔥 Snek master loading...', emoji: '💪' },
    { max: Infinity, msg: '👑 You ARE the snake king!', emoji: '🏆' }
  ];
  
  const roast = roastMessages.find(r => snakeScore <= r.max);
  
  // Semi-transparent overlay
  snakeCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
  
  // Game Over panel
  const panelWidth = 300;
  const panelHeight = 260;
  const panelX = (snakeCanvas.width - panelWidth) / 2;
  const panelY = (snakeCanvas.height - panelHeight) / 2;
  
  snakeCtx.fillStyle = colors.bg;
  snakeCtx.strokeStyle = colors.accent;
  snakeCtx.lineWidth = 3;
  snakeCtx.beginPath();
  snakeCtx.roundRect(panelX, panelY, panelWidth, panelHeight, 16);
  snakeCtx.fill();
  snakeCtx.stroke();
  
  // Game Over text
  snakeCtx.fillStyle = '#ef4444';
  snakeCtx.font = 'bold 28px Inter, sans-serif';
  snakeCtx.textAlign = 'center';
  snakeCtx.fillText('GAME OVER', snakeCanvas.width / 2, panelY + 40);
  
  // Roast message
  snakeCtx.fillStyle = '#fbbf24';
  snakeCtx.font = '14px Inter, sans-serif';
  snakeCtx.fillText(roast.msg, snakeCanvas.width / 2, panelY + 70);
  
  // Big emoji
  snakeCtx.font = '36px Arial';
  snakeCtx.fillText(roast.emoji, snakeCanvas.width / 2, panelY + 115);
  
  // Score
  snakeCtx.fillStyle = colors.text;
  snakeCtx.font = '18px Inter, sans-serif';
  snakeCtx.fillText(`Score: ${snakeScore}`, snakeCanvas.width / 2, panelY + 155);
  
  // Best score
  snakeCtx.fillStyle = colors.accent;
  snakeCtx.font = 'bold 16px Inter, sans-serif';
  snakeCtx.fillText(`🏆 Best: ${snakeHighScore}`, snakeCanvas.width / 2, panelY + 185);
  
  // New best indicator
  if (snakeScore === snakeHighScore && snakeScore > 0) {
    snakeCtx.fillStyle = '#22c55e';
    snakeCtx.font = 'bold 14px Inter, sans-serif';
    snakeCtx.fillText('🎉 NEW HIGH SCORE!', snakeCanvas.width / 2, panelY + 215);
  }
  
  // Restart hint
  snakeCtx.fillStyle = colors.textMuted;
  snakeCtx.font = '14px Inter, sans-serif';
  snakeCtx.fillText('Click START to play again', snakeCanvas.width / 2, panelY + 245);
}

function updateSnake() {
  // Apply direction change
  direction = { ...nextDirection };
  
  // Calculate new head position
  const head = { 
    x: snake[0].x + direction.x, 
    y: snake[0].y + direction.y 
  };
  
  // Check wall collision
  if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
    snakeGameOver();
    return;
  }
  
  // Check self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    snakeGameOver();
    return;
  }
  
  // Add new head
  snake.unshift(head);
  
  // Check food collision
  if (head.x === food.x && head.y === food.y) {
    snakeScore += 10;
    snakeScoreEl.textContent = snakeScore;
    spawnFood();
  } else {
    // Remove tail if no food eaten
    snake.pop();
  }
}

function snakeGameLoop() {
  if (snakeGameState !== 'playing') return;
  
  updateSnake();
  
  // Only draw if still playing (updateSnake might have ended the game)
  if (snakeGameState === 'playing') {
    drawSnakeGame();
  }
}

function snakeGameOver() {
  // Stop the game immediately
  snakeGameState = 'gameover';
  
  // Clear the interval first
  if (snakeGameInterval) {
    clearInterval(snakeGameInterval);
    snakeGameInterval = null;
  }
  
  // Update high score
  if (snakeScore > snakeHighScore) {
    snakeHighScore = snakeScore;
    localStorage.setItem('snakeHighScore', snakeHighScore.toString());
  }
  
  // Draw final state and game over screen
  drawSnakeGame();
  drawSnakeGameOver();
  
  snakeStatusEl.textContent = 'Game Over! Click START to retry';
  snakeStartBtn.textContent = 'Play Again';
}

function startSnakeGame() {
  snakeGameState = 'playing';
  initSnake();
  snakeStatusEl.textContent = 'Playing...';
  snakeStartBtn.textContent = 'Restart';
  
  if (snakeGameInterval) {
    clearInterval(snakeGameInterval);
  }
  snakeGameInterval = setInterval(snakeGameLoop, SNAKE_SPEED);
}

// Snake controls
document.addEventListener('keydown', (e) => {
  if (snakeGameState !== 'playing') return;
  
  switch (e.key) {
    case 'ArrowUp':
      if (direction.y !== 1) {
        nextDirection = { x: 0, y: -1 };
      }
      e.preventDefault();
      break;
    case 'ArrowDown':
      if (direction.y !== -1) {
        nextDirection = { x: 0, y: 1 };
      }
      e.preventDefault();
      break;
    case 'ArrowLeft':
      if (direction.x !== 1) {
        nextDirection = { x: -1, y: 0 };
      }
      e.preventDefault();
      break;
    case 'ArrowRight':
      if (direction.x !== -1) {
        nextDirection = { x: 1, y: 0 };
      }
      e.preventDefault();
      break;
  }
});

// Snake start button
snakeStartBtn.addEventListener('click', startSnakeGame);

// Initialize snake game display
drawSnakeStartScreen();
