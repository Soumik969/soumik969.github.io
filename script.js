// Wait for DOM to be fully loaded before running any code
document.addEventListener('DOMContentLoaded', () => {
  // Custom Cursor
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');

  if (cursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      
      setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
      }, 80);
    });

    // Hover effect on interactive elements
    const hoverElements = document.querySelectorAll('a, button, .btn, .project-card, .skill-item, .game-tab, .contact-card');
    
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorFollower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorFollower.classList.remove('hover');
      });
    });

    // Click effect
    document.addEventListener('mousedown', () => cursor.classList.add('click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('click'));
  }

  // Theme toggle with animation
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('portfolio-theme') || 'light';
  document.documentElement.setAttribute('data-theme', storedTheme);

  const themeTransition = document.createElement('div');
  themeTransition.className = 'theme-transition';
  document.body.appendChild(themeTransition);

  themeToggle.addEventListener('click', () => {
    themeTransition.classList.add('active');
    
    setTimeout(() => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
    }, 300);
    
    setTimeout(() => {
      themeTransition.classList.remove('active');
    }, 600);
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

  // Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Projects data
  const projects = [
    {
      title: "Klein Tunneling in Graphene",
      description: "Study of the relativistic quantum mechanical phenomenon where electrons in graphene can pass through potential barriers with 100% transmission probability, demonstrating the unique properties of Dirac fermions.",
      reportUrl: "https://github.com/Soumik969/All_at_once/blob/main/Klein%20Tunneling%20in%20Graphene.pdf",
      category: "Physics",
      icon: "⚛️"
    },
    {
      title: "Orbital Hall Effect",
      description: "Investigation of the orbital Hall effect - a transport phenomenon where an orbital angular momentum current flows perpendicular to an applied electric field, exploring its role in spintronics.",
      reportUrl: "https://github.com/Soumik969/All_at_once/blob/main/Orbital%20Hall%20Effect.pdf",
      category: "Physics",
      icon: "🌀"
    },
    {
      title: "Supervised Learning Project (SLP)",
      description: "Comprehensive machine learning project implementing and analyzing various supervised learning algorithms for classification and regression tasks with detailed performance evaluation.",
      reportUrl: "https://github.com/Soumik969/All_at_once/blob/main/SLP_final_report.pdf",
      category: "Machine Learning",
      icon: "🤖"
    },
    {
      title: "AIDS Data Analysis Project",
      description: "Data science project involving statistical analysis and predictive modeling on AIDS-related datasets, utilizing machine learning techniques for pattern recognition and insights extraction.",
      reportUrl: "https://github.com/Soumik969/All_at_once/blob/main/AIDS%20PROJECT.pdf",
      category: "Data Science",
      icon: "📊"
    },
    {
      title: "C++ Programming Project",
      description: "Object-oriented programming project in C++ demonstrating core concepts including classes, inheritance, polymorphism, and efficient algorithm implementation.",
      reportUrl: "https://github.com/Soumik969/All_at_once/blob/main/CPP-23b1825.pdf",
      category: "Programming",
      icon: "💻"
    }
  ];

  // Render projects
  const carouselTrack = document.getElementById('projectsCarousel');
  const carouselDots = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  function renderProjects() {
    if (!carouselTrack) return;
    
    carouselTrack.innerHTML = '';
    
    projects.forEach((project, index) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <div class="project-icon">${project.icon}</div>
        <div class="project-content">
          <div class="project-header">
            <h3>${project.title}</h3>
            <span class="project-tag">${project.category}</span>
          </div>
          <p>${project.description}</p>
          <a href="${project.reportUrl}" target="_blank" rel="noopener" class="project-link">
            <span>View Report</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </a>
        </div>
        <div class="project-glow"></div>
      `;
      carouselTrack.appendChild(card);
    });
  }

  renderProjects();

  // Project Carousel
  let currentSlide = 0;

  function initCarousel() {
    if (!carouselDots) return;
    
    const totalSlides = projects.length;
    
    // Create dots
    carouselDots.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(i));
      carouselDots.appendChild(dot);
    }
    
    updateCarousel();
  }

  function updateCarousel() {
    if (!carouselTrack) return;
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % projects.length;
    updateCarousel();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + projects.length) % projects.length;
    updateCarousel();
  }

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Auto-play carousel
  setInterval(nextSlide, 5000);

  // Initialize after rendering projects
  initCarousel();

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
      
      gameTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
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

  const GRAVITY = 0.35;
  const JUMP_FORCE = -7;
  const PIPE_SPEED = 1.8;
  const PIPE_GAP = 170;
  const PIPE_WIDTH = 55;
  const GROUND_HEIGHT = 40;

  let gameState = 'idle';
  let score = 0;
  let highScore = parseInt(localStorage.getItem('flappyHighScore')) || 0;
  let pipeTimer = 0;
  const PIPE_INTERVAL = 100;

  let bgOffset = 0;
  let cloudOffset = 0;
  let groundOffset = 0;

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
      
      const angle = Math.min(Math.max(this.vy * 3, -25), 90) * Math.PI / 180;
      ctx.rotate(angle);
      
      const wingY = Math.sin(this.frame * 0.3) * 3;
      
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = isDark ? '#d97706' : '#b45309';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.ellipse(0, 0, this.width / 2, this.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = isDark ? '#f59e0b' : '#d97706';
      ctx.beginPath();
      ctx.ellipse(-2, 4 + wingY, 10, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(8, -4, 7, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(10, -4, 3, 0, Math.PI * 2);
      ctx.fill();
      
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
    
    const pipeGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
    pipeGrad.addColorStop(0, '#22c55e');
    pipeGrad.addColorStop(0.5, '#4ade80');
    pipeGrad.addColorStop(1, isDark ? '#16a34a' : '#15803d');
    
    ctx.fillStyle = pipeGrad;
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 3;
    
    ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight - 25);
    ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight - 25);
    
    ctx.fillRect(pipe.x - 6, pipe.topHeight - 30, PIPE_WIDTH + 12, 30);
    ctx.strokeRect(pipe.x - 6, pipe.topHeight - 30, PIPE_WIDTH + 12, 30);
    
    const bottomStart = pipe.bottomY + 25;
    ctx.fillRect(pipe.x, bottomStart, PIPE_WIDTH, canvas.height - bottomStart - GROUND_HEIGHT);
    ctx.strokeRect(pipe.x, bottomStart, PIPE_WIDTH, canvas.height - bottomStart - GROUND_HEIGHT);
    
    ctx.fillRect(pipe.x - 6, pipe.bottomY, PIPE_WIDTH + 12, 30);
    ctx.strokeRect(pipe.x - 6, pipe.bottomY, PIPE_WIDTH + 12, 30);
  }

  function drawBackground() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
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
    
    if (gameState === 'playing') {
      cloudOffset = (cloudOffset + 0.5) % (canvas.width + 200);
    }
    
    ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(255, 255, 255, 0.9)';
    
    const c1x = (canvas.width - cloudOffset + 100) % (canvas.width + 200) - 100;
    ctx.beginPath();
    ctx.ellipse(c1x, 70, 50, 25, 0, 0, Math.PI * 2);
    ctx.ellipse(c1x + 40, 65, 35, 20, 0, 0, Math.PI * 2);
    ctx.ellipse(c1x - 30, 75, 30, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    
    const c2x = (canvas.width - cloudOffset + 350) % (canvas.width + 200) - 100;
    ctx.beginPath();
    ctx.ellipse(c2x, 130, 40, 20, 0, 0, Math.PI * 2);
    ctx.ellipse(c2x + 35, 125, 30, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    
    const c3x = (canvas.width - cloudOffset * 0.7 + 500) % (canvas.width + 300) - 100;
    ctx.beginPath();
    ctx.ellipse(c3x, 50, 45, 22, 0, 0, Math.PI * 2);
    ctx.ellipse(c3x + 30, 48, 28, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    
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
    
    if (gameState === 'playing') {
      groundOffset = (groundOffset + PIPE_SPEED) % 60;
    }
    
    ctx.fillStyle = isDark ? '#854d0e' : '#a3e635';
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
    
    ctx.fillStyle = isDark ? '#a16207' : '#84cc16';
    ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, 10);
    
    ctx.fillStyle = isDark ? '#713f12' : '#65a30d';
    for (let i = -1; i < canvas.width / 60 + 2; i++) {
      const x = i * 60 - groundOffset;
      ctx.fillRect(x, canvas.height - GROUND_HEIGHT + 10, 30, GROUND_HEIGHT - 10);
    }
  }

  function drawUI() {
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
    
    ctx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.92)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = isDark ? '#fbbf24' : '#f59e0b';
    ctx.font = 'bold 36px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FLAPPY BIRD', canvas.width / 2, 100);
    
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
    
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.font = '18px Inter, Arial, sans-serif';
    ctx.fillText('Press SPACE or Click to Flap', canvas.width / 2, 280);
    
    ctx.fillStyle = isDark ? '#fbbf24' : '#d97706';
    ctx.font = 'bold 22px Inter, Arial, sans-serif';
    ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, 340);
    
    ctx.fillStyle = isDark ? '#3b82f6' : '#2563eb';
    ctx.font = 'bold 24px Inter, Arial, sans-serif';
    ctx.fillText('Click START to Play', canvas.width / 2, 420);
  }

  function drawGameOver() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    const roastMessages = [
      { max: 0, msg: "You didn't even try!", emoji: '🤡' },
      { max: 3, msg: 'My grandma plays better!', emoji: '👵' },
      { max: 5, msg: 'Are you a baby bird?', emoji: '😅' },
      { max: 10, msg: 'Skill issue detected!', emoji: '📉' },
      { max: 20, msg: 'Almost decent... almost', emoji: '🫠' },
      { max: 50, msg: "Ok you're getting there", emoji: '🔥' },
      { max: Infinity, msg: "Respect! You're a legend!", emoji: '👑' }
    ];
    
    const roast = roastMessages.find(r => score <= r.max);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const panelWidth = 300;
    const panelHeight = 290;
    const panelX = (canvas.width - panelWidth) / 2;
    const panelY = (canvas.height - panelHeight) / 2 - 20;
    
    ctx.fillStyle = isDark ? '#1e293b' : '#ffffff';
    ctx.strokeStyle = isDark ? '#3b82f6' : '#2563eb';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelWidth, panelHeight, 16);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 32px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, panelY + 45);
    
    ctx.fillStyle = isDark ? '#fbbf24' : '#f59e0b';
    ctx.font = '16px Inter, Arial, sans-serif';
    ctx.fillText(roast.msg, canvas.width / 2, panelY + 80);
    
    ctx.font = '40px Arial';
    ctx.fillText(roast.emoji, canvas.width / 2, panelY + 130);
    
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.font = '16px Inter, Arial, sans-serif';
    ctx.fillText('Your Score', canvas.width / 2, panelY + 165);
    
    ctx.font = 'bold 42px Inter, Arial, sans-serif';
    ctx.fillStyle = isDark ? '#f1f5f9' : '#1e293b';
    ctx.fillText(score.toString(), canvas.width / 2, panelY + 210);
    
    ctx.font = '16px Inter, Arial, sans-serif';
    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.fillText(`Best: ${highScore}`, canvas.width / 2, panelY + 240);
    
    if (score >= highScore && score > 0) {
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 16px Inter, Arial, sans-serif';
      ctx.fillText('🎉 NEW BEST!', canvas.width / 2, panelY + 268);
    }
    
    ctx.fillStyle = isDark ? '#3b82f6' : '#2563eb';
    ctx.font = 'bold 18px Inter, Arial, sans-serif';
    ctx.fillText('Click START to Play Again', canvas.width / 2, panelY + panelHeight + 40);
  }

  function checkCollision() {
    if (bird.y + bird.height / 2 > canvas.height - GROUND_HEIGHT) {
      return true;
    }
    
    if (bird.y - bird.height / 2 < 0) {
      return true;
    }
    
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
    
    pipeTimer++;
    if (pipeTimer >= PIPE_INTERVAL) {
      pipes.push(createPipe());
      pipeTimer = 0;
    }
    
    for (const pipe of pipes) {
      pipe.x -= PIPE_SPEED;
      
      if (!pipe.scored && pipe.x + PIPE_WIDTH < bird.x) {
        pipe.scored = true;
        score++;
        scoreEl.textContent = score;
      }
    }
    
    pipes = pipes.filter(p => p.x + PIPE_WIDTH + 20 > 0);
    
    if (checkCollision()) {
      gameState = 'gameover';
      statusEl.textContent = 'Game Over!';
      
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

  startBtn.addEventListener('click', () => {
    if (gameState === 'idle' || gameState === 'gameover') {
      startGame();
    }
  });

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

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (gameState === 'playing') {
        bird.jump();
      }
    }
    if (e.code === 'Enter') {
      if (gameState === 'idle' || gameState === 'gameover') {
        startGame();
      }
    }
  });

  statusEl.textContent = 'Click START to begin!';
  requestAnimationFrame(gameLoop);

  // ========== SNAKE GAME ==========
  const snakeCanvas = document.getElementById('snakeCanvas');
  const snakeCtx = snakeCanvas.getContext('2d');
  const snakeStartBtn = document.getElementById('snakeStartBtn');
  const snakeScoreEl = document.getElementById('snakeScore');
  const snakeStatusEl = document.getElementById('snakeStatus');

  const GRID_SIZE = 20;
  const TILE_COUNT = snakeCanvas.width / GRID_SIZE;
  const SNAKE_SPEED = 100;

  let snake = [];
  let food = { x: 0, y: 0 };
  let direction = { x: 0, y: 0 };
  let nextDirection = { x: 0, y: 0 };
  let snakeScore = 0;
  let snakeHighScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
  let snakeGameState = 'idle';
  let snakeGameInterval = null;

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
    
    snakeCtx.fillStyle = colors.bg;
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    
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
    
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      const x = segment.x * GRID_SIZE;
      const y = segment.y * GRID_SIZE;
      
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
      
      const radius = 4;
      snakeCtx.beginPath();
      snakeCtx.roundRect(x + 1, y + 1, GRID_SIZE - 2, GRID_SIZE - 2, radius);
      snakeCtx.fill();
      snakeCtx.stroke();
      
      snakeCtx.globalAlpha = 1;
      
      if (isHead) {
        snakeCtx.fillStyle = 'white';
        const eyeSize = 4;
        const eyeOffset = 5;
        
        if (direction.x === 1) {
          snakeCtx.beginPath();
          snakeCtx.arc(x + GRID_SIZE - eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
          snakeCtx.arc(x + GRID_SIZE - eyeOffset, y + GRID_SIZE - eyeOffset, eyeSize, 0, Math.PI * 2);
          snakeCtx.fill();
        } else if (direction.x === -1) {
          snakeCtx.beginPath();
          snakeCtx.arc(x + eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
          snakeCtx.arc(x + eyeOffset, y + GRID_SIZE - eyeOffset, eyeSize, 0, Math.PI * 2);
          snakeCtx.fill();
        } else if (direction.y === -1) {
          snakeCtx.beginPath();
          snakeCtx.arc(x + eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
          snakeCtx.arc(x + GRID_SIZE - eyeOffset, y + eyeOffset, eyeSize, 0, Math.PI * 2);
          snakeCtx.fill();
        } else {
          snakeCtx.beginPath();
          snakeCtx.arc(x + eyeOffset, y + GRID_SIZE - eyeOffset, eyeSize, 0, Math.PI * 2);
          snakeCtx.arc(x + GRID_SIZE - eyeOffset, y + GRID_SIZE - eyeOffset, eyeSize, 0, Math.PI * 2);
          snakeCtx.fill();
        }
        
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
    
    snakeCtx.fillStyle = colors.bg;
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    
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
    
    snakeCtx.fillStyle = colors.text;
    snakeCtx.font = 'bold 36px Inter, sans-serif';
    snakeCtx.textAlign = 'center';
    snakeCtx.fillText('🐍 SNAKE', snakeCanvas.width / 2, 100);
    
    snakeCtx.fillStyle = colors.textMuted;
    snakeCtx.font = '16px Inter, sans-serif';
    snakeCtx.fillText('Use Arrow Keys to move', snakeCanvas.width / 2, 300);
    snakeCtx.fillText('Eat food to grow!', snakeCanvas.width / 2, 325);
    
    if (snakeHighScore > 0) {
      snakeCtx.fillStyle = colors.accent;
      snakeCtx.font = 'bold 18px Inter, sans-serif';
      snakeCtx.fillText(`🏆 Best: ${snakeHighScore}`, snakeCanvas.width / 2, 365);
    }
  }

  function drawSnakeGameOver() {
    const colors = getSnakeColors();
    
    const roastMessages = [
      { max: 0, msg: 'You ate yourself instantly!', emoji: '🤦' },
      { max: 20, msg: 'More like a worm than a snake', emoji: '😂' },
      { max: 50, msg: 'Cold blooded failure!', emoji: '🫣' },
      { max: 100, msg: 'Skill issue! Try harder!', emoji: '📉' },
      { max: 150, msg: "Now we're talking!", emoji: '👀' },
      { max: 200, msg: 'Snek master loading...', emoji: '💪' },
      { max: Infinity, msg: 'You ARE the snake king!', emoji: '🏆' }
    ];
    
    const roast = roastMessages.find(r => snakeScore <= r.max);
    
    snakeCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    
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
    
    snakeCtx.fillStyle = '#ef4444';
    snakeCtx.font = 'bold 28px Inter, sans-serif';
    snakeCtx.textAlign = 'center';
    snakeCtx.fillText('GAME OVER', snakeCanvas.width / 2, panelY + 40);
    
    snakeCtx.fillStyle = '#fbbf24';
    snakeCtx.font = '14px Inter, sans-serif';
    snakeCtx.fillText(roast.msg, snakeCanvas.width / 2, panelY + 70);
    
    snakeCtx.font = '36px Arial';
    snakeCtx.fillText(roast.emoji, snakeCanvas.width / 2, panelY + 115);
    
    snakeCtx.fillStyle = colors.text;
    snakeCtx.font = '18px Inter, sans-serif';
    snakeCtx.fillText(`Score: ${snakeScore}`, snakeCanvas.width / 2, panelY + 155);
    
    snakeCtx.fillStyle = colors.accent;
    snakeCtx.font = 'bold 16px Inter, sans-serif';
    snakeCtx.fillText(`🏆 Best: ${snakeHighScore}`, snakeCanvas.width / 2, panelY + 185);
    
    if (snakeScore === snakeHighScore && snakeScore > 0) {
      snakeCtx.fillStyle = '#22c55e';
      snakeCtx.font = 'bold 14px Inter, sans-serif';
      snakeCtx.fillText('🎉 NEW HIGH SCORE!', snakeCanvas.width / 2, panelY + 215);
    }
    
    snakeCtx.fillStyle = colors.textMuted;
    snakeCtx.font = '14px Inter, sans-serif';
    snakeCtx.fillText('Click START to play again', snakeCanvas.width / 2, panelY + 245);
  }

  function updateSnake() {
    direction = { ...nextDirection };
    
    const head = { 
      x: snake[0].x + direction.x, 
      y: snake[0].y + direction.y 
    };
    
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
      snakeGameOver();
      return;
    }
    
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      snakeGameOver();
      return;
    }
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
      snakeScore += 10;
      snakeScoreEl.textContent = snakeScore;
      spawnFood();
    } else {
      snake.pop();
    }
  }

  function snakeGameLoop() {
    if (snakeGameState !== 'playing') return;
    
    updateSnake();
    
    if (snakeGameState === 'playing') {
      drawSnakeGame();
    }
  }

  function snakeGameOver() {
    snakeGameState = 'gameover';
    
    if (snakeGameInterval) {
      clearInterval(snakeGameInterval);
      snakeGameInterval = null;
    }
    
    if (snakeScore > snakeHighScore) {
      snakeHighScore = snakeScore;
      localStorage.setItem('snakeHighScore', snakeHighScore.toString());
    }
    
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

  snakeStartBtn.addEventListener('click', startSnakeGame);
  drawSnakeStartScreen();
  
  // Mobile Touch Controls for Snake Game
  const snakeBtnUp = document.getElementById('snakeBtnUp');
  const snakeBtnDown = document.getElementById('snakeBtnDown');
  const snakeBtnLeft = document.getElementById('snakeBtnLeft');
  const snakeBtnRight = document.getElementById('snakeBtnRight');

  function handleSnakeDirection(dir) {
    if (snakeGameState !== 'playing') return;
    
    switch (dir) {
      case 'up':
        if (direction. y !== 1) nextDirection = { x: 0, y: -1 };
        break;
      case 'down':
        if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
        break;
      case 'left':
        if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
        break;
      case 'right': 
        if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
        break;
    }
  }

  // Click events for buttons
  snakeBtnUp. addEventListener('click', () => handleSnakeDirection('up'));
  snakeBtnDown.addEventListener('click', () => handleSnakeDirection('down'));
  snakeBtnLeft.addEventListener('click', () => handleSnakeDirection('left'));
  snakeBtnRight.addEventListener('click', () => handleSnakeDirection('right'));

  // Touch events for better mobile responsiveness
  snakeBtnUp.addEventListener('touchstart', (e) => { e.preventDefault(); handleSnakeDirection('up'); });
  snakeBtnDown.addEventListener('touchstart', (e) => { e.preventDefault(); handleSnakeDirection('down'); });
  snakeBtnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); handleSnakeDirection('left'); });
  snakeBtnRight. addEventListener('touchstart', (e) => { e.preventDefault(); handleSnakeDirection('right'); });

  // ========== TIC TAC TOE GAME ==========
  const tttBoard = document.getElementById('tttBoard');
  const tttCells = document.querySelectorAll('.ttt-cell');
  const tttStatus = document.getElementById('tttStatus');
  const tttResetBtn = document.getElementById('tttResetBtn');

  let tttState = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let tttGameActive = true;

  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  function checkTTTWinner() {
    for (const condition of winConditions) {
      const [a, b, c] = condition;
      if (tttState[a] && tttState[a] === tttState[b] && tttState[a] === tttState[c]) {
        return { winner: tttState[a], line: condition };
      }
    }
    if (!tttState.includes('')) {
      return { winner: 'tie', line: null };
    }
    return null;
  }

  function aiMove() {
    if (!tttGameActive || currentPlayer !== 'O') return;

    const emptyIndices = tttState.map((cell, idx) => cell === '' ? idx : null).filter(idx => idx !== null);
    
    if (emptyIndices.length === 0) return;

    // Simple AI: Try to win, then block, then random
    let move = null;

    // Try to win
    for (const idx of emptyIndices) {
      tttState[idx] = 'O';
      if (checkTTTWinner()?.winner === 'O') {
        tttState[idx] = '';
        move = idx;
        break;
      }
      tttState[idx] = '';
    }

    // Try to block
    if (move === null) {
      for (const idx of emptyIndices) {
        tttState[idx] = 'X';
        if (checkTTTWinner()?.winner === 'X') {
          tttState[idx] = '';
          move = idx;
          break;
        }
        tttState[idx] = '';
      }
    }

    // Take center if available
    if (move === null && tttState[4] === '') {
      move = 4;
    }

    // Random move
    if (move === null) {
      move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    setTimeout(() => {
      if (!tttGameActive) return;
      
      tttState[move] = 'O';
      tttCells[move].textContent = 'O';
      tttCells[move].classList.add('o');

      const result = checkTTTWinner();
      if (result) {
        tttGameActive = false;
        if (result.winner === 'tie') {
          tttStatus.textContent = "It's a tie!";
        } else {
          tttStatus.textContent = `${result.winner} wins!`;
          result.line.forEach(idx => tttCells[idx].classList.add('winner'));
        }
      } else {
        currentPlayer = 'X';
        tttStatus.textContent = "Your turn (X)";
      }
    }, 500);
  }

  function handleTTTClick(e) {
    const cell = e.target;
    const index = parseInt(cell.dataset.index);

    if (tttState[index] !== '' || !tttGameActive || currentPlayer !== 'X') return;

    tttState[index] = 'X';
    cell.textContent = 'X';
    cell.classList.add('x');

    const result = checkTTTWinner();
    if (result) {
      tttGameActive = false;
      if (result.winner === 'tie') {
        tttStatus.textContent = "It's a tie!";
      } else {
        tttStatus.textContent = `${result.winner} wins!`;
        result.line.forEach(idx => tttCells[idx].classList.add('winner'));
      }
    } else {
      currentPlayer = 'O';
      tttStatus.textContent = "AI is thinking...";
      aiMove();
    }
  }

  function resetTTT() {
    tttState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    tttGameActive = true;
    tttStatus.textContent = 'You are X. Your turn!';
    tttCells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('x', 'o', 'winner');
    });
  }

  tttCells.forEach(cell => cell.addEventListener('click', handleTTTClick));
  tttResetBtn.addEventListener('click', resetTTT);

  // ========== MEMORY GAME ==========
  const memoryBoard = document.getElementById('memoryBoard');
  const memoryMovesEl = document.getElementById('memoryMoves');
  const memoryStatusEl = document.getElementById('memoryStatus');
  const memoryResetBtn = document.getElementById('memoryResetBtn');

  const memoryEmojis = ['🎮', '🎯', '🎨', '🎪', '🎭', '🎰', '🎲', '🎸'];
  let memoryCards = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let memoryMoves = 0;
  let memoryLocked = false;

  function createMemoryGame() {
    const cardPairs = [...memoryEmojis, ...memoryEmojis];
    memoryCards = cardPairs.sort(() => Math.random() - 0.5);
    
    memoryBoard.innerHTML = '';
    matchedPairs = 0;
    memoryMoves = 0;
    flippedCards = [];
    memoryLocked = false;
    memoryMovesEl.textContent = '0';
    memoryStatusEl.textContent = 'Match all the pairs!';

    memoryCards.forEach((emoji, index) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.index = index;
      card.dataset.emoji = emoji;
      card.innerHTML = `<span class="memory-card-content">${emoji}</span>`;
      card.addEventListener('click', handleMemoryClick);
      memoryBoard.appendChild(card);
    });
  }

  function handleMemoryClick(e) {
    if (memoryLocked) return;
    
    const card = e.currentTarget;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      memoryMoves++;
      memoryMovesEl.textContent = memoryMoves;
      memoryLocked = true;

      const [card1, card2] = flippedCards;
      
      if (card1.dataset.emoji === card2.dataset.emoji) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        flippedCards = [];
        memoryLocked = false;

        if (matchedPairs === memoryEmojis.length) {
          memoryStatusEl.textContent = `🎉 You won in ${memoryMoves} moves!`;
        }
      } else {
        setTimeout(() => {
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          flippedCards = [];
          memoryLocked = false;
        }, 1000);
      }
    }
  }

  memoryResetBtn.addEventListener('click', createMemoryGame);
  createMemoryGame();

  // ========== TYPING TEST GAME ==========
  const typingText = document.getElementById('typingText');
  const typingInput = document.getElementById('typingInput');
  const typingWpm = document.getElementById('typingWpm');
  const typingAccuracy = document.getElementById('typingAccuracy');
  const typingTime = document.getElementById('typingTime');
  const typingStatus = document.getElementById('typingStatus');
  const typingStartBtn = document.getElementById('typingStartBtn');

  const typingParagraphs = [
    "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet.",
    "Physics is the natural science that studies matter and energy. It explores the fundamental laws of the universe.",
    "Machine learning enables computers to learn from data. It is transforming industries around the world.",
    "Programming is the art of telling a computer what to do. Good code is both efficient and readable.",
    "Quantum mechanics describes nature at the smallest scales. Particles behave as both waves and particles.",
    "Data science combines statistics and programming. It helps us find patterns in complex datasets.",
    "The universe is vast and mysterious. Scientists continue to explore its many wonders every day."
  ];

  let typingGameActive = false;
  let typingStartTime = null;
  let typingInterval = null;
  let currentParagraph = '';
  let typingTimeLeft = 30;

  function startTypingTest() {
    currentParagraph = typingParagraphs[Math.floor(Math.random() * typingParagraphs.length)];
    typingText.innerHTML = currentParagraph.split('').map((char, i) => 
      `<span class="${i === 0 ? 'current' : ''}">${char}</span>`
    ).join('');
    
    typingInput.value = '';
    typingInput.disabled = false;
    typingInput.focus();
    
    typingGameActive = true;
    typingStartTime = null;
    typingTimeLeft = 30;
    typingTime.textContent = typingTimeLeft;
    typingWpm.textContent = '0';
    typingAccuracy.textContent = '100';
    typingStatus.textContent = 'Start typing!';
    typingStartBtn.textContent = 'Restart';

    if (typingInterval) clearInterval(typingInterval);
  }

  function endTypingTest() {
    typingGameActive = false;
    typingInput.disabled = true;
    if (typingInterval) clearInterval(typingInterval);
    typingStatus.textContent = 'Time\'s up! Click START to try again.';
    typingStartBtn.textContent = 'Start Test';
  }

  function updateTypingStats() {
    const typed = typingInput.value;
    const elapsed = (Date.now() - typingStartTime) / 1000 / 60; // minutes
    const words = typed.length / 5; // standard word = 5 chars
    const wpm = Math.round(words / elapsed) || 0;
    
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === currentParagraph[i]) correct++;
    }
    const accuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
    
    typingWpm.textContent = wpm;
    typingAccuracy.textContent = accuracy;
  }

  typingInput.addEventListener('input', () => {
    if (!typingGameActive) return;

    if (!typingStartTime) {
      typingStartTime = Date.now();
      typingInterval = setInterval(() => {
        typingTimeLeft--;
        typingTime.textContent = typingTimeLeft;
        if (typingTimeLeft <= 0) {
          endTypingTest();
        }
      }, 1000);
    }

    const typed = typingInput.value;
    const chars = typingText.querySelectorAll('span');

    chars.forEach((char, i) => {
      char.classList.remove('correct', 'incorrect', 'current');
      
      if (i < typed.length) {
        if (typed[i] === currentParagraph[i]) {
          char.classList.add('correct');
        } else {
          char.classList.add('incorrect');
        }
      } else if (i === typed.length) {
        char.classList.add('current');
      }
    });

    updateTypingStats();

    if (typed === currentParagraph) {
      typingGameActive = false;
      typingInput.disabled = true;
      if (typingInterval) clearInterval(typingInterval);
      typingStatus.textContent = '🎉 Perfect! You completed the text!';
    }
  });

  typingStartBtn.addEventListener('click', startTypingTest);
  // Fix:  Prevent space bar from triggering page scroll while typing
  typingInput.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.stopPropagation();
    }
  });

  // ========== SCROLL PROGRESS BAR ==========
  const scrollProgress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = scrolled + '%';
    }
  });

  // ========== TYPEWRITER EFFECT FOR HERO SECTION ==========
  function typeWriter(element, text, speed = 100, callback) {
    let i = 0;
    element.textContent = '';
    element.style.visibility = 'visible';
    
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    }
    type();
  }

  // Apply typing animation to name first, then title
  const nameElement = document.querySelector('.name');
  const titleElement = document.querySelector('.title');

  if (nameElement && titleElement) {
    const nameText = nameElement.textContent;
    const titleText = titleElement.textContent;
    
    // Hide initially
    nameElement.style.visibility = 'hidden';
    titleElement.style.visibility = 'hidden';
    
    // Type name first, then title
    setTimeout(() => {
      typeWriter(nameElement, nameText, 80, () => {
        nameElement.classList.add('typed');
        setTimeout(() => {
          typeWriter(titleElement, titleText, 80, () => {
            titleElement.classList.add('typed');
          });
        }, 300);
      });
    }, 500);
  }

  // ========== ANIMATE SKILL BARS ON SCROLL ==========
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const animateSkillBars = () => {
    skillBars.forEach(bar => {
      const percent = bar.getAttribute('data-percent');
      // Validate percentage is within valid range
      const numPercent = Number(percent);
      const validPercent = isNaN(numPercent) ? 0 : Math.min(Math.max(numPercent, 0), 100);
      bar.style.width = validPercent + '%';
    });
  };

  // Trigger animation when skills section is visible
  const skillsSection = document.getElementById('skills');
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillBars();
        skillsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (skillsSection) {
    skillsObserver.observe(skillsSection);
  }
}); // End of DOMContentLoaded
