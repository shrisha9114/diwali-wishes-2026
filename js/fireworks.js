// Lightweight canvas fireworks: rockets burst into fading glowing particles.
class FireworkParticle {
  constructor(x, y, color, angle, speed) {
    this.x = x; this.y = y; this.color = color;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 55 + Math.random() * 35;
    this.maxLife = this.life;
    this.size = 1 + Math.random() * 2;
  }
  update() {
    this.vx *= 0.985;
    this.vy = this.vy * 0.985 + 0.045;
    this.x += this.vx; this.y += this.vy;
    this.life--;
  }
  draw(ctx) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class FireworksDisplay {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.rockets = [];
    this.colors = ['#ffd166', '#ff6b6b', '#f7aef8', '#8ecae6', '#caffbf', '#ffffff'];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
    this.autoTimer = 0;
  }
  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(innerWidth * dpr);
    this.canvas.height = Math.floor(innerHeight * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.width = innerWidth;
    this.height = innerHeight;
  }
  launch(x = Math.random() * this.width, y = this.height * (.18 + Math.random() * .42)) {
    this.rockets.push({ x, y: this.height + 8, targetY: y, color: this.pickColor(), vy: -(8 + Math.random() * 2) });
  }
  pickColor() { return this.colors[Math.floor(Math.random() * this.colors.length)]; }
  burst(x, y, color) {
    const count = 65 + Math.floor(Math.random() * 35);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 1.5 + Math.random() * 4.1;
      this.particles.push(new FireworkParticle(x, y, color, angle, speed));
    }
  }
  loop(time) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(16, 13, 28, 0.20)';
    ctx.fillRect(0, 0, this.width, this.height);

    this.rockets.forEach(r => {
      r.y += r.vy;
      r.vy += 0.035;
      ctx.save();
      ctx.fillStyle = r.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = r.color;
      ctx.beginPath(); ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });
    const bursting = this.rockets.filter(r => r.y <= r.targetY || r.vy > -1);
    bursting.forEach(r => this.burst(r.x, r.y, r.color));
    this.rockets = this.rockets.filter(r => !bursting.includes(r));

    this.particles.forEach(p => { p.update(); p.draw(ctx); });
    this.particles = this.particles.filter(p => p.life > 0);

    if (this.autoTimer === 0 || time - this.autoTimer > 900) {
      if (Math.random() < 0.045) this.launch();
      this.autoTimer = time;
    }
    requestAnimationFrame(this.loop);
  }
}
