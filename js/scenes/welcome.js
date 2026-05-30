/**
 * Welcome scene - calming animated gradient with app title
 */
const WelcomeScene = {
  gradientOffset: 0,
  particles: [],
  title: '情绪解压',
  subtitle: '选择一个场景，放松身心',

  init(ctx, w, h) {
    this.width = w;
    this.height = h;
    this.gradientOffset = 0;
    this.particles = [];

    // Create floating ambient particles
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3 - 0.2,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }
  },

  update(dt) {
    this.gradientOffset += dt * 0.3;
    for (const p of this.particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.height + 10;
      if (p.y > this.height + 10) p.y = -10;
    }
  },

  render(ctx) {
    const w = this.width;
    const h = this.height;

    // Animated gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    const hue1 = (220 + Math.sin(this.gradientOffset) * 20) % 360;
    const hue2 = (260 + Math.cos(this.gradientOffset * 1.3) * 20) % 360;
    gradient.addColorStop(0, `hsl(${hue1}, 40%, 85%)`);
    gradient.addColorStop(0.5, `hsl(${hue2}, 35%, 82%)`);
    gradient.addColorStop(1, `hsl(${hue1 + 20}, 45%, 80%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Floating particles
    for (const p of this.particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.fill();
    }

    // Title
    ctx.fillStyle = '#4a3f6b';
    ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.title, w / 2, h / 2 - 30);

    // Subtitle
    ctx.fillStyle = '#8a7fa8';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(this.subtitle, w / 2, h / 2 + 15);

    // Decorative line
    ctx.strokeStyle = 'rgba(108, 92, 231, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 50, h / 2 + 35);
    ctx.lineTo(w / 2 + 50, h / 2 + 35);
    ctx.stroke();

    // Down arrow hint
    const bounceY = Math.sin(this.gradientOffset * 2) * 5;
    ctx.fillStyle = 'rgba(108, 92, 231, 0.4)';
    ctx.font = '18px sans-serif';
    ctx.fillText('👇', w / 2, h / 2 + 70 + bounceY);
  },

  handleInput(type, pos, manager) {
    // Welcome scene has no specific interactions
  },

  destroy() {
    this.particles = [];
  }
};
