/**
 * Sand Smoothing Scene - swipe to smooth rippled sand
 */
const SandSmoothScene = {
  sandData: null,
  ripples: [],
  smoothedAreas: [],
  dragPath: [],
  isDragging: false,
  inactivityTimer: 0,
  stopContinuousSfx: null,
  imageData: null,

  init(ctx, w, h) {
    this.width = w;
    this.height = h;

    // Create offscreen canvas for sand texture
    this.offscreen = document.createElement('canvas');
    this.offscreen.width = w;
    this.offscreen.height = h;
    this.offCtx = this.offscreen.getContext('2d');

    this._generateSandTexture();
    this.ripples = this._generateRipples(15);
    this.smoothedAreas = [];
    this.dragPath = [];
    this.isDragging = false;
    this.inactivityTimer = 0;
    this._renderToImageData();
  },

  _generateSandTexture() {
    const w = this.width;
    const h = this.height;
    const ctx = this.offCtx;

    // Base sand color
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#e8d5b7');
    bg.addColorStop(1, '#d4c4a8');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Grain texture using noise
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 12;
      data[i] += noise;
      data[i+1] += noise * 0.8;
      data[i+2] += noise * 0.5;
    }
    ctx.putImageData(imageData, 0, 0);
  },

  _generateRipples(count) {
    const ripples = [];
    for (let i = 0; i < count; i++) {
      ripples.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        angle: Math.random() * Math.PI,
        length: 30 + Math.random() * 60,
        amplitude: 2 + Math.random() * 3,
        frequency: 0.05 + Math.random() * 0.1,
        opacity: 0.3 + Math.random() * 0.4,
      });
    }
    return ripples;
  },

  _renderToImageData() {
    const w = this.width;
    const h = this.height;
    const ctx = this.offCtx;

    // Redraw base texture
    this._generateSandTexture();

    // Draw ripples
    ctx.strokeStyle = 'rgba(139,119,101,0.3)';
    for (const r of this.ripples) {
      ctx.save();
      ctx.globalAlpha = r.opacity;
      ctx.lineWidth = r.amplitude;
      ctx.beginPath();
      const cx = r.x;
      const cy = r.y;
      for (let t = -r.length/2; t < r.length/2; t++) {
        const waveY = Math.sin(t * r.frequency * Math.PI * 2) * r.amplitude;
        const px = cx + Math.cos(r.angle) * t;
        const py = cy + Math.sin(r.angle) * t + waveY;
        if (t === -r.length/2) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Draw smoothed areas
    for (const area of this.smoothedAreas) {
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = '#f0e6d2';
      ctx.beginPath();
      ctx.arc(area.x, area.y, area.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    this.imageData = true;
  },

  update(dt) {
    if (this.isDragging) {
      this.inactivityTimer = 0;
    } else {
      this.inactivityTimer += dt;
    }

    // Regenerate ripples after inactivity
    if (this.inactivityTimer > 5) {
      // Fade back ripples
      for (const r of this.ripples) {
        r.opacity = Math.min(r.opacity + dt * 0.1, 0.5);
      }
      // Shrink smoothed areas
      for (const area of this.smoothedAreas) {
        area.r = Math.max(0, area.r - dt * 5);
      }
      this.smoothedAreas = this.smoothedAreas.filter(a => a.r > 1);

      // Add new ripples if too few
      if (this.ripples.length < 15 && Math.random() < 0.1) {
        this.ripples.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          angle: Math.random() * Math.PI,
          length: 30 + Math.random() * 60,
          amplitude: 2 + Math.random() * 3,
          frequency: 0.05 + Math.random() * 0.1,
          opacity: 0.1,
        });
      }
    }

    // Periodically refresh image data
    if (Math.floor(performance.now() / 200) !== Math.floor((performance.now() - dt*1000) / 200) || this.isDragging) {
      this._renderToImageData();
    }
  },

  render(ctx) {
    const w = this.width;
    if (this.imageData) {
      ctx.drawImage(this.offscreen, 0, 0, this.width, this.height);
    }

    // Hint text at top
    ctx.fillStyle = 'rgba(139,119,101,0.5)';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('用手指轻抚沙面，抚平波纹', w / 2, 24);
  },

  handleInput(type, pos, manager) {
    if (type === 'down') {
      this.isDragging = true;
      this.dragPath = [pos];
      this.stopContinuousSfx = AudioSystem.playContinuousSfx('sweep');
    } else if (type === 'drag' && this.isDragging) {
      this.dragPath.push(pos);

      // Remove ripples near drag path
      for (const r of this.ripples) {
        const dx = pos.x - r.x;
        const dy = pos.y - r.y;
        if (Math.sqrt(dx*dx + dy*dy) < 30) {
          r.opacity = Math.max(0, r.opacity - 0.03);
        }
      }

      // Add smoothed area
      this.smoothedAreas.push({
        x: pos.x,
        y: pos.y,
        r: 15,
      });

      // Limit smoothed areas
      if (this.smoothedAreas.length > 80) {
        this.smoothedAreas.shift();
      }

      this._renderToImageData();
    } else if (type === 'up') {
      this.isDragging = false;
      this.dragPath = [];
      if (this.stopContinuousSfx) {
        this.stopContinuousSfx();
        this.stopContinuousSfx = null;
      }
    }
  },

  destroy() {
    if (this.stopContinuousSfx) {
      this.stopContinuousSfx();
      this.stopContinuousSfx = null;
    }
    this.sandData = null;
    this.ripples = [];
    this.smoothedAreas = [];
    this.imageData = null;
  }
};
