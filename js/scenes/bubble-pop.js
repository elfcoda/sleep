/**
 * Bubble Popping Scene - tap to pop bubble wrap
 */
const BubblePopScene = {
  bubbles: [],
  cols: 5,
  rows: 8,
  allPopped: false,
  particles: [],
  promptAlpha: 0,

  init(ctx, w, h) {
    this.width = w;
    this.height = h;
    this.bubbles = [];
    this.particles = [];
    this.allPopped = false;
    this.promptAlpha = 0;

    const marginX = 20;
    const marginY = 60;
    const spacingX = (w - marginX * 2) / this.cols;
    const spacingY = (h - marginY * 2) / this.rows;
    const bubbleR = Math.min(spacingX, spacingY) * 0.35;

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.bubbles.push({
          x: marginX + col * spacingX + spacingX / 2,
          y: marginY + row * spacingY + spacingY / 2,
          r: bubbleR,
          popped: false,
          popAnim: 0,
        });
      }
    }
  },

  _spawnParticles(x, y) {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.03 + Math.random() * 0.04,
        r: 1 + Math.random() * 2,
        color: Math.random() > 0.5 ? '180,220,255' : '220,200,255',
      });
    }
  },

  _allBubblesPopped() {
    return this.bubbles.every(b => b.popped);
  },

  update(dt) {
    // Update pop animations
    for (const b of this.bubbles) {
      if (b.popped && b.popAnim < 1) {
        b.popAnim = Math.min(1, b.popAnim + dt * 5);
      }
    }

    // Update particles
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03;
      p.life -= p.decay;
    }
    this.particles = this.particles.filter(p => p.life > 0);

    // Check all popped
    if (!this.allPopped && this._allBubblesPopped()) {
      this.allPopped = true;
    }
    if (this.allPopped && this.promptAlpha < 1) {
      this.promptAlpha = Math.min(1, this.promptAlpha + dt * 2);
    }
  },

  render(ctx) {
    const w = this.width;
    const h = this.height;

    // Background
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#f8f0ff');
    bg.addColorStop(1, '#f0e8ff');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Draw bubbles
    for (const b of this.bubbles) {
      if (b.popped) {
        // Popped: flat ring
        const scale = 1 - b.popAnim * 0.6;
        ctx.save();
        ctx.globalAlpha = 1 - b.popAnim * 0.6;
        ctx.fillStyle = '#ddd8e8';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ccc5d8';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      } else {
        // Unpopped: 3D bubble
        const grad = ctx.createRadialGradient(
          b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.1,
          b.x, b.y, b.r
        );
        grad.addColorStop(0, 'rgba(255,255,255,0.9)');
        grad.addColorStop(0.3, 'rgba(220,210,245,0.7)');
        grad.addColorStop(0.7, 'rgba(180,160,220,0.5)');
        grad.addColorStop(1, 'rgba(150,130,200,0.3)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.arc(b.x - b.r*0.25, b.y - b.r*0.25, b.r*0.3, 0, Math.PI*2);
        ctx.fill();

        // Border
        ctx.strokeStyle = 'rgba(200,180,230,0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Draw particles
    for (const p of this.particles) {
      ctx.fillStyle = `rgba(${p.color},${p.life})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // "Pop all over again?" prompt
    if (this.allPopped && this.promptAlpha > 0) {
      ctx.save();
      ctx.globalAlpha = this.promptAlpha;

      // Dim overlay
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, 0, w, h);

      // Button
      const bx = w / 2 - 80;
      const by = h / 2 - 25;
      ctx.fillStyle = '#6c5ce7';
      this._roundRect(ctx, bx, by, 160, 50, 25);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('再捏一次 ✨', w / 2, by + 32);

      this._resetBtn = { x: bx, y: by, w: 160, h: 50 };

      ctx.restore();
    }
  },

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  },

  handleInput(type, pos, manager) {
    if (type === 'down') {
      // Check reset button
      if (this.allPopped && this._resetBtn) {
        const b = this._resetBtn;
        if (pos.x >= b.x && pos.x <= b.x + b.w && pos.y >= b.y && pos.y <= b.y + b.h) {
          this.init(null, this.width, this.height);
          return;
        }
      }

      // Check bubble tap
      for (const b of this.bubbles) {
        if (b.popped) continue;
        const dx = pos.x - b.x;
        const dy = pos.y - b.y;
        if (Math.sqrt(dx*dx + dy*dy) < b.r) {
          b.popped = true;
          b.popAnim = 0;
          this._spawnParticles(b.x, b.y);
          AudioSystem.playSfx('pop');
          break;
        }
      }
    }
  },

  destroy() {
    this.bubbles = [];
    this.particles = [];
  }
};
