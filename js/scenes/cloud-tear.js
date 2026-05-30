/**
 * Cloud Tearing Scene - drag to tear clouds apart
 */
const CloudTearScene = {
  clouds: [],
  tearingCloud: null,
  tearPath: [],
  particles: [],
  cloudRegenTimer: 0,

  init(ctx, w, h) {
    this.width = w;
    this.height = h;
    this.clouds = [];
    this.tearingCloud = null;
    this.tearPath = [];
    this.particles = [];
    this.cloudRegenTimer = 0;
    this._spawnClouds(3);
  },

  _spawnClouds(count) {
    for (let i = 0; i < count; i++) {
      this.clouds.push(this._createCloud());
    }
  },

  _createCloud() {
    const w = this.width;
    const h = this.height;
    const cx = 40 + Math.random() * (w - 80);
    const cy = 60 + Math.random() * (h * 0.5);
    return {
      cx, cy,
      baseR: 35 + Math.random() * 25,
      bubbles: [],
      torn: false,
      tornPieces: [],
      opacity: 0,
      targetOpacity: 1,
    };
  },

  _drawCloud(ctx, cloud) {
    if (cloud.torn) {
      // Draw torn pieces floating away
      for (const piece of cloud.tornPieces) {
        ctx.save();
        ctx.globalAlpha = piece.opacity;
        ctx.fillStyle = '#f0f0f5';
        ctx.beginPath();
        ctx.arc(piece.x, piece.y, piece.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      return;
    }

    if (cloud.opacity < 0.02) return;

    ctx.save();
    ctx.globalAlpha = cloud.opacity;

    // Draw cloud using overlapping circles
    if (!cloud.bubbles.length) {
      const count = 5 + Math.floor(Math.random() * 4);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const dist = cloud.baseR * (0.3 + Math.random() * 0.5);
        cloud.bubbles.push({
          x: cloud.cx + Math.cos(angle) * dist,
          y: cloud.cy + Math.sin(angle) * dist - cloud.baseR * 0.15,
          r: cloud.baseR * (0.4 + Math.random() * 0.5),
        });
      }
    }

    // Shadow
    ctx.fillStyle = 'rgba(180,180,200,0.3)';
    for (const b of cloud.bubbles) {
      ctx.beginPath();
      ctx.arc(b.x + 2, b.y + 2, b.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Main cloud
    for (const b of cloud.bubbles) {
      const grad = ctx.createRadialGradient(b.x - b.r*0.3, b.y - b.r*0.3, 0, b.x, b.y, b.r);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.6, '#e8e8f0');
      grad.addColorStop(1, '#d0d0dd');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },

  _spawnParticles(x, y, count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 1) * 2,
        life: 1,
        decay: 0.01 + Math.random() * 0.03,
        r: 1 + Math.random() * 2,
        color: `rgba(${200 + Math.random()*55}, ${200 + Math.random()*55}, ${220 + Math.random()*35}, `,
      });
    }
  },

  update(dt) {
    // Animate cloud opacity
    for (const c of this.clouds) {
      c.opacity += (c.targetOpacity - c.opacity) * dt * 3;
      if (c.torn) {
        for (const p of c.tornPieces) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.opacity -= dt * 0.5;
          p.r -= dt * 2;
        }
        c.tornPieces = c.tornPieces.filter(p => p.opacity > 0 && p.r > 0);
      }
    }

    // Regenerate clouds
    const activeClouds = this.clouds.filter(c => !c.torn);
    if (activeClouds.length < 2) {
      this.cloudRegenTimer += dt;
      if (this.cloudRegenTimer > 2) {
        this.cloudRegenTimer = 0;
        this.clouds.push(this._createCloud());
      }
    }

    // Remove fully faded torn clouds and replace
    this.clouds = this.clouds.filter(c => {
      if (c.torn && c.tornPieces.length === 0 && c.opacity < 0.01) {
        return false;
      }
      return true;
    });

    // Update particles
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.life -= p.decay;
    }
    this.particles = this.particles.filter(p => p.life > 0);
  },

  render(ctx) {
    const w = this.width;
    const h = this.height;

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#87CEEB');
    sky.addColorStop(0.6, '#B0E0E6');
    sky.addColorStop(1, '#E0F0FF');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Draw tear path
    if (this.tearPath.length > 1) {
      ctx.strokeStyle = 'rgba(100,100,120,0.3)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(this.tearPath[0].x, this.tearPath[0].y);
      for (let i = 1; i < this.tearPath.length; i++) {
        ctx.lineTo(this.tearPath[i].x, this.tearPath[i].y);
      }
      ctx.stroke();
    }

    // Draw clouds
    for (const c of this.clouds) {
      this._drawCloud(ctx, c);
    }

    // Draw particles
    for (const p of this.particles) {
      ctx.fillStyle = p.color + p.life + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  handleInput(type, pos, manager) {
    if (type === 'down') {
      this.tearPath = [pos];
      // Check if touching a cloud
      for (const c of this.clouds) {
        if (c.torn) continue;
        const dx = pos.x - c.cx;
        const dy = pos.y - c.cy;
        if (Math.sqrt(dx*dx + dy*dy) < c.baseR * 1.2) {
          this.tearingCloud = c;
          this._spawnParticles(pos.x, pos.y, 5);
          AudioSystem.playSfx('tear');
          break;
        }
      }
    } else if (type === 'drag' && this.tearingCloud) {
      this.tearPath.push(pos);
      // Check if dragged far enough to tear
      const start = this.tearPath[0];
      const dx = pos.x - start.x;
      const dy = pos.y - start.y;
      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist > 40) {
        // Tear the cloud!
        const c = this.tearingCloud;
        c.torn = true;

        // Create torn pieces from cloud bubbles
        const count = c.bubbles.length || 6;
        for (let i = 0; i < count; i++) {
          const b = c.bubbles[i] || { x: c.cx + (Math.random()-0.5)*c.baseR, y: c.cy + (Math.random()-0.5)*c.baseR, r: c.baseR * 0.4 };
          const side = (b.x - c.cx) * dx + (b.y - c.cy) * dy > 0 ? 1 : -1;
          c.tornPieces.push({
            x: b.x || c.cx,
            y: b.y || c.cy,
            r: b.r || c.baseR * 0.3,
            vx: side * (1 + Math.random() * 2),
            vy: -(1 + Math.random() * 3),
            opacity: 1,
          });
        }
        c.bubbles = [];
        c.targetOpacity = 0;
        this._spawnParticles(c.cx, c.cy, 15);
        AudioSystem.playSfx('tear');
        if (manager.shakeScreen) manager.shakeScreen(0.5);
        this.tearingCloud = null;
        this.tearPath = [];
      }
    } else if (type === 'up') {
      this.tearingCloud = null;
      this.tearPath = [];
    }
  },

  destroy() {
    this.clouds = [];
    this.tearingCloud = null;
    this.tearPath = [];
    this.particles = [];
  }
};
