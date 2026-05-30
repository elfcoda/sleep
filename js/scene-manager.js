/**
 * Scene Manager - handles scene lifecycle and switching
 * Each scene: { init(ctx), update(dt), render(ctx), handleInput(type, pos, state), destroy() }
 */

const SceneManager = {
  scenes: {},
  currentScene: null,
  currentSceneName: null,
  container: null,
  canvas: null,
  ctx: null,
  animFrameId: null,
  lastTime: 0,
  transitioning: false,

  // Input state
  pointerDown: false,
  pointerPos: { x: 0, y: 0 },
  prevPointerPos: { x: 0, y: 0 },

  /**
   * Initialize the scene manager
   */
  init(containerId) {
    this.container = document.getElementById(containerId);
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'sceneCanvas';
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this._resizeCanvas();

    // Resize observer
    const ro = new ResizeObserver(() => this._resizeCanvas());
    ro.observe(this.container);

    // Input handling
    this._bindInput();

    // Start animation loop
    this.lastTime = performance.now();
    this._loop = this._loop.bind(this);
    this.animFrameId = requestAnimationFrame(this._loop);
  },

  /**
   * Resize canvas to match container
   */
  _resizeCanvas() {
    const rect = this.container.getBoundingClientRect();
    const layoutWidth = this.container.clientWidth;
    const layoutHeight = this.container.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = layoutWidth * dpr;
    this.canvas.height = layoutHeight * dpr;
    this.canvas.style.width = layoutWidth + 'px';
    this.canvas.style.height = layoutHeight + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.width = layoutWidth;
    this.height = layoutHeight;
    this.visibleWidth = rect.width;
    this.visibleHeight = rect.height;
  },

  /**
   * Register a scene
   */
  register(name, scene) {
    this.scenes[name] = scene;
  },

  /**
   * Switch to a scene
   */
  switchTo(name) {
    if (this.transitioning || name === this.currentSceneName) return false;
    this.transitioning = true;

    // Fade out current scene
    if (this.currentScene && this.currentScene.destroy) {
      this.currentScene.destroy();
    }

    this.container.classList.add('scene-fade-out');

    setTimeout(() => {
      // Clear canvas
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Switch
      this.currentSceneName = name;
      this.currentScene = this.scenes[name];

      // Init new scene
      if (this.currentScene && this.currentScene.init) {
        this.currentScene.init(this.ctx, this.width, this.height);
      }

      // Fade in
      this.container.classList.remove('scene-fade-out');
      this.container.classList.add('scene-fade-in');
      setTimeout(() => {
        this.container.classList.remove('scene-fade-in');
        this.transitioning = false;
      }, 300);
    }, 300);

    return true;
  },

  /**
   * Animation loop
   */
  _loop(time) {
    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    // Update current scene
    if (this.currentScene && this.currentScene.update && !this.transitioning) {
      this.currentScene.update(dt);
    }

    // Render current scene
    if (this.currentScene && this.currentScene.render) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.currentScene.render(this.ctx);
    }

    this.animFrameId = requestAnimationFrame(this._loop);
  },

  /**
   * Bind pointer events
   */
  _bindInput() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const scaleX = this.width / rect.width;
      const scaleY = this.height / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    };

    this.canvas.addEventListener('pointerdown', (e) => {
      this.pointerDown = true;
      this.pointerPos = getPos(e);
      this.prevPointerPos = { ...this.pointerPos };
      if (this.currentScene && this.currentScene.handleInput) {
        this.currentScene.handleInput('down', this.pointerPos, this);
      }
    });

    this.canvas.addEventListener('pointermove', (e) => {
      this.prevPointerPos = { ...this.pointerPos };
      this.pointerPos = getPos(e);
      if (this.currentScene && this.currentScene.handleInput) {
        this.currentScene.handleInput(this.pointerDown ? 'drag' : 'move', this.pointerPos, this);
      }
    });

    this.canvas.addEventListener('pointerup', (e) => {
      this.pointerDown = false;
      if (this.currentScene && this.currentScene.handleInput) {
        this.currentScene.handleInput('up', this.pointerPos, this);
      }
    });

    this.canvas.addEventListener('pointerleave', () => {
      this.pointerDown = false;
    });

    // Prevent default touch behaviors
    this.canvas.addEventListener('touchstart', (e) => e.preventDefault());
    this.canvas.addEventListener('touchmove', (e) => e.preventDefault());
  },

  /**
   * Trigger screen shake
   */
  shakeScreen(intensity = 1) {
    const screen = document.getElementById('phoneScreen');
    screen.classList.add('shake');
    screen.style.setProperty('--shake-intensity', intensity);
    setTimeout(() => screen.classList.remove('shake'), 400);
  },

  /**
   * Get scene dimensions
   */
  getDimensions() {
    return { width: this.width, height: this.height };
  }
};
