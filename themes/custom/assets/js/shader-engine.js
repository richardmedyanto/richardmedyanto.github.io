// shader-engine.js — lightweight WebGL runner for fullscreen fragment shaders.
// Handles: canvas sizing, uniforms (u_time, u_resolution, u_mouse, u_click, u_theme, u_intensity),
// mouse smoothing + idle drift, click bursts, pause-when-hidden, prefers-reduced-motion,
// mobile disable, 30fps cap on battery.

(function (global) {
  'use strict';

  const VERT = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  function compile(gl, src, type) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('[shader] compile error:', gl.getShaderInfoLog(s), '\n', src);
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function program(gl, frag) {
    const v = compile(gl, VERT, gl.VERTEX_SHADER);
    const f = compile(gl, frag, gl.FRAGMENT_SHADER);
    if (!v || !f) return null;
    const p = gl.createProgram();
    gl.attachShader(p, v);
    gl.attachShader(p, f);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.error('[shader] link error:', gl.getProgramInfoLog(p));
      return null;
    }
    return p;
  }

  const REDUCED_MOTION = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_MOBILE = global.matchMedia && global.matchMedia('(max-width: 720px)').matches;

  async function isOnBattery() {
    if (!navigator.getBattery) return false;
    try {
      const b = await navigator.getBattery();
      return !b.charging;
    } catch { return false; }
  }

  class ShaderEngine {
    constructor(canvas, opts = {}) {
      this.canvas = canvas;
      this.opts = Object.assign({
        intensity: 0.2,        // 0..1, how bold
        theme: 0,              // 0 = light, 1 = dark
        disableOnMobile: true,
        respectReducedMotion: true,
        pauseWhenHidden: true,
        capOnBattery: true,
      }, opts);

      this.gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false, alpha: true });
      if (!this.gl) { this.fallback(); return; }

      this.targetMouse = [0.5, 0.5];
      this.smoothMouse = [0.5, 0.5];
      this.lastMouseMove = performance.now();
      this.clicks = []; // {x, y, t}
      this.t0 = performance.now();
      this.paused = false;
      this.running = false;
      this.frameBudget = 1000 / 60;

      const gl = this.gl;
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

      this._bindEvents();
      this._checkGuards();
    }

    fallback() {
      // No WebGL — leave canvas with a simple CSS gradient applied by parent.
      this.canvas.style.background = this.opts.theme === 1
        ? 'radial-gradient(ellipse at 30% 40%, #2a1810 0%, #0a0606 70%)'
        : 'radial-gradient(ellipse at 30% 40%, #fff4ea 0%, #f6eee5 70%)';
    }

    _checkGuards() {
      if (this.opts.disableOnMobile && IS_MOBILE) { this.disabled = true; this.fallback(); return; }
      if (this.opts.respectReducedMotion && REDUCED_MOTION) { this.disabled = true; this.fallback(); return; }
      if (this.opts.capOnBattery) {
        isOnBattery().then(onBat => { if (onBat) this.frameBudget = 1000 / 30; });
      }
    }

    _bindEvents() {
      // Canvas is fixed 100vw×100vh — skip getBoundingClientRect() on every event.
      const onMove = (e) => {
        this.targetMouse[0] = e.clientX / window.innerWidth;
        this.targetMouse[1] = 1.0 - e.clientY / window.innerHeight;
        this.lastMouseMove = performance.now();
      };
      const onClick = (e) => {
        const x = e.clientX / window.innerWidth;
        const y = 1.0 - e.clientY / window.innerHeight;
        this.clicks.push({ x, y, t: (performance.now() - this.t0) / 1000 });
        if (this.clicks.length > 4) this.clicks.shift();
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onClick, { passive: true });
      if (this.opts.pauseWhenHidden) {
        document.addEventListener('visibilitychange', () => { this.paused = document.hidden; });
      }
      // Resize: update cached dimensions and GL viewport immediately.
      window.addEventListener('resize', () => this._resize());
    }

    _resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (this.canvas.width !== w || this.canvas.height !== h) {
        this.canvas.width = w; this.canvas.height = h;
        if (this.gl) this.gl.viewport(0, 0, w, h);
      }
    }

    load(fragSrc) {
      if (this.disabled || !this.gl) return false;
      const gl = this.gl;
      if (this.prog) gl.deleteProgram(this.prog);
      this.prog = program(gl, fragSrc);
      if (!this.prog) return false;
      gl.useProgram(this.prog);
      const loc = gl.getAttribLocation(this.prog, 'a_pos');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      this.u = {
        time: gl.getUniformLocation(this.prog, 'u_time'),
        res:  gl.getUniformLocation(this.prog, 'u_resolution'),
        mouse:gl.getUniformLocation(this.prog, 'u_mouse'),
        c0:   gl.getUniformLocation(this.prog, 'u_click0'),
        c1:   gl.getUniformLocation(this.prog, 'u_click1'),
        c2:   gl.getUniformLocation(this.prog, 'u_click2'),
        c3:   gl.getUniformLocation(this.prog, 'u_click3'),
        theme:gl.getUniformLocation(this.prog, 'u_theme'),
        intens:gl.getUniformLocation(this.prog, 'u_intensity'),
      };
      this._resize();
      return true;
    }

    setTheme(t) { this.opts.theme = t; }
    setIntensity(v) { this.opts.intensity = v; }

    start() {
      if (this.disabled || !this.gl || this.running) return;
      this.running = true;
      let lastDraw = 0;
      const loop = (now) => {
        if (!this.running) return;
        requestAnimationFrame(loop);
        if (this.paused) return;
        if (now - lastDraw < this.frameBudget - 1) return;
        lastDraw = now;
        this._draw(now);
      };
      requestAnimationFrame(loop);
    }

    stop() { this.running = false; }

    _draw(now) {
      const gl = this.gl;
      if (!this.prog) return;

      // Smooth mouse follow
      const k = 0.08;
      this.smoothMouse[0] += (this.targetMouse[0] - this.smoothMouse[0]) * k;
      this.smoothMouse[1] += (this.targetMouse[1] - this.smoothMouse[1]) * k;

      // Idle drift: after 2s of no movement, target drifts in a slow circle
      const idle = (now - this.lastMouseMove) / 1000;
      if (idle > 2.0) {
        const driftT = (now - this.t0) * 0.00015;
        const fade = Math.min(1, (idle - 2.0) / 2.0);
        const dx = 0.5 + Math.cos(driftT) * 0.25;
        const dy = 0.5 + Math.sin(driftT * 1.3) * 0.25;
        this.targetMouse[0] += (dx - this.targetMouse[0]) * 0.02 * fade;
        this.targetMouse[1] += (dy - this.targetMouse[1]) * 0.02 * fade;
      }

      const t = (now - this.t0) / 1000;
      gl.uniform1f(this.u.time, t);
      gl.uniform2f(this.u.res, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(this.u.mouse, this.smoothMouse[0], this.smoothMouse[1]);

      const emptyClick = [-1, -1, -999];
      const slots = [this.u.c0, this.u.c1, this.u.c2, this.u.c3];
      for (let i = 0; i < 4; i++) {
        const c = this.clicks[i];
        if (c) gl.uniform3f(slots[i], c.x, c.y, c.t);
        else gl.uniform3f(slots[i], emptyClick[0], emptyClick[1], emptyClick[2]);
      }
      gl.uniform1f(this.u.theme, this.opts.theme);
      gl.uniform1f(this.u.intens, this.opts.intensity);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }

  global.ShaderEngine = ShaderEngine;
})(window);
