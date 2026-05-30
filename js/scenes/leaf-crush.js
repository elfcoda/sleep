/**
 * Leaf Crushing Scene - drag over autumn leaves to crush them
 */
const LeafCrushScene = {
  leaves: [],
  particles: [],
  dragPath: [],
  isDragging: false,
  stopContinuousSfx: null,
  crushedCount: 0,
  totalCount: 0,

  init(ctx, w, h) {
    this.width = w;
    this.height = h;
    this.leaves = [];
    this.particles = [];
    this.dragPath = [];
    this.isDragging = false;
    this.crushedCount = 0;

    const colors = ['#e17055', '#d63031', '#fdcb6e', '#e17055', '#fab1a0', '#ff7675', '#f0932b'];
    const leafCount = 18 + Math.floor(Math.random() * 10);

    for (let i = 0; i < leafCount; i++) {
      this.leaves.push({
        x: 15 + Math.random() * (w - 30),
        y: 40 + Math.random() * (h - 80),
        angle: Math.random() * Math.PI * 2,
        scale: 0.4 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        crushed: false,
      });
    }
    this.totalCount = this.leaves.length;
  },

  _drawLeaf(ctx, leaf) {
    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate(leaf.angle);
    ctx.scale(leaf.scale, leaf.scale);

    // Leaf shape (ellipse + stem)
    ctx.fillStyle = leaf.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stem
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(10, -3);
    ctx.stroke();

    // Vein
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(8, 0);
    ctx.stroke();

    ctx.restore();
  },

  _spawnFragments(x, y, color) {
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
        decay: 0.02 + Math.random() * 0.03,
        r: 0.5 + Math.random() * 1.5,
        color,
      });
    }
  },

  update(dt) {
    // Update particles
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04;
      p.life -= p.decay;
    }
    this.particles = this.particles.filter(p => p.life > 0);
  },

  render(ctx) {
    const w = this.width;
    const h = this.height;

    // Ground background
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#d4c5b2');
    bg.addColorStop(1, '#c4b5a2');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Ground texture dots
    ctx.fillStyle = 'rgba(0,0,0,0.03)';
    for (let i = 0; i < 50; i++) {
      const gx = (i * 137.5) % w;
      const gy = (i * 97.3) % h;
      ctx.beginPath();
      ctx.arc(gx, gy, 1, 0, Math.PI*2);
      ctx.fill();
    }

    // Draw leaves
    for (const leaf of this.leaves) {
      if (!leaf.crushed) {
        this._drawLeaf(ctx, leaf);
      }
    }

    // Draw drag trail
    if (this.dragPath.length > 1 && this.isDragging) {
      ctx.strokeStyle = 'rgba(139,119,101,0.3)';
      ctx.lineWidth = 16;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(this.dragPath[0].x, this.dragPath[0].y);
      for (let i = 1; i < this.dragPath.length; i++) {
        ctx.lineTo(this.dragPath[i].x, this.dragPath[i].y);
      }
      ctx.stroke();
    }

    // Draw fragments
    for (const p of this.particles) {
      ctx.fillStyle = p.color.replace(')', `,${p.life})`).replace('rgb', 'rgba');
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Progress bar
    const progress = this.crushedCount / this.totalCount;
    const barY = h - 20;
    const barW = w - 40;
    const barH = 4;
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    this._roundRect(ctx, 20, barY, barW, barH, 2);
    ctx.fill();
    ctx.fillStyle = '#6c5ce7';
    this._roundRect(ctx, 20, barY, barW * progress, barH, 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`已碎 ${this.crushedCount}/${this.totalCount} 片叶子`, w/2, barY - 8);
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
      this.isDragging = true;
      this.dragPath = [pos];
      this.stopContinuousSfx = AudioSystem.playContinuousSfx('crunch');
    } else if (type === 'drag' && this.isDragging) {
      this.dragPath.push(pos);

      // Check leaf overlap with drag path
      const trailW = 12;
      for (const leaf of this.leaves) {
        if (leaf.crushed) continue;
        const dx = pos.x - leaf.x;
        const dy = pos.y - leaf.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < trailW + 12 * leaf.scale) {
          leaf.crushed = true;
          this.crushedCount++;
          this._spawnFragments(leaf.x, leaf.y, leaf.color);
        }
      }
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
    this.leaves = [];
    this.particles = [];
  }
};
