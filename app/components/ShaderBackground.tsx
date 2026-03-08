'use client';

import { useEffect, useRef } from 'react';

// ─── Arcigy purple shader (WebGL2, Matthias Hurrle base, recoloured) ─────────
const PURPLE_SHADER = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
uniform float uScroll;

#define FC gl_FragCoord.xy
#define T  time
#define R  resolution
#define MN min(R.x, R.y)

/* ── noise stack ── */
float rnd(vec2 p) {
  p = fract(p * vec2(12.9898, 78.233));
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}
float noise(in vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  return mix(
    mix(rnd(i), rnd(i + vec2(1,0)), u.x),
    mix(rnd(i + vec2(0,1)), rnd(i + 1.), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float t = .0, a = 1.;
  mat2 m = mat2(1., -.5, .2, 1.2);
  for (int i = 0; i < 5; i++) { t += a * noise(p); p *= 2. * m; a *= .5; }
  return t;
}
float clouds(vec2 p) {
  float d = 1., t = .0;
  for (float i = .0; i < 3.; i++) {
    float a = d * fbm(i * 10. + p.x * .2 + .2 * (1. + i) * p.y + d + i * i + p);
    t = mix(t, d, a); d = a; p *= 2. / (i + 1.);
  }
  return t;
}

void main(void) {
  float scroll = uScroll * 0.0004;
  vec2 uv = (FC - .5 * R) / MN;
  vec2 st = uv * vec2(2., 1.);

  /* Intro animation progress (SLOWER: ~3.3 seconds) */
  float uIntro = clamp(T * 0.3, 0.0, 1.0);
  float uIntroSmooth = smoothstep(0.0, 1.0, uIntro);

  /* organic cloud layer — scroll shifts the field (Always visible) */
  float bg = clouds(vec2(st.x + T * .35 + scroll, -st.y));

  uv *= 1. - .3 * (sin(T * .15) * .5 + .5);

  vec3 col = vec3(0.);

  for (float i = 1.; i < 11.; i++) {
    /* 
       Independent Star Offsets: 
       Each star (i) flies in with its own speed and slightly different trajectory 
    */
    float iFactor = fract(sin(i * 123.456) * 43758.5453);
    float individualIntro = clamp((T - iFactor * 0.8) * 0.25, 0.0, 1.0);
    float indSmooth = smoothstep(0.0, 1.0, individualIntro);
    
    vec2 starOffset = vec2(10.0 + i * 2.0, -6.0 - i) * pow(1.0 - indSmooth, 2.0);

    uv += .1 * cos(i * vec2(.1 + .01 * i, .8) + i * i + T * .4 + .1 * uv.x);
    
    /* Star calculation with its own independent offset */
    vec2 p = uv + starOffset;
    float d = length(p);

    /* Arcigy colour: violet/magenta glow */
    vec3 hue = cos(sin(i) * vec3(3.0, 0.5, 1.6)) * 0.5
             + vec3(0.50, 0.04, 0.78); 
    
    col += .00135 / d * hue;

    /* secondary glow */
    float b = noise(i + p + bg * 1.731);
    col += .002 * b / length(max(p, vec2(b * p.x * .02, p.y))) * vec3(0.75, 0.08, 0.82);
  }

  /* Deep Background Atmosphere — constant */
  vec3 bgCol = vec3(bg * 0.15, bg * 0.01, bg * 0.25);
  col = bgCol + col * (uIntroSmooth * 0.8 + 0.2); 

  /* global colour grade: suppress green heavily, boost R+B richness */
  col.g *= 0.05;
  col.rb = pow(col.rb, vec2(0.85));

  /* vignette */
  vec2 vig = uv;
  col *= 1.0 - dot(vig, vig) * 0.55;

  /* overall brightness — keep it moody/dark */
  col *= 0.75;

  O = vec4(col, 1.);
}`;

// ─── Quad vertex shader ───────────────────────────────────────────────────────
const VERT = `#version 300 es
precision highp float;
in vec4 position;
void main() { gl_Position = position; }`;

// ─── WebGL2 renderer ──────────────────────────────────────────────────────────
class Renderer {
  gl: WebGL2RenderingContext;
  prog: WebGLProgram | null = null;
  private vs: WebGLShader | null = null;
  private fs: WebGLShader | null = null;
  private buf: WebGLBuffer | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    this.gl = canvas.getContext('webgl2')!;
  }

  private compile(type: number, src: string): WebGLShader {
    const s = this.gl.createShader(type)!;
    this.gl.shaderSource(s, src);
    this.gl.compileShader(s);
    if (!this.gl.getShaderParameter(s, this.gl.COMPILE_STATUS))
      console.error(this.gl.getShaderInfoLog(s));
    return s;
  }

  build() {
    const gl = this.gl;
    this.vs = this.compile(gl.VERTEX_SHADER, VERT);
    this.fs = this.compile(gl.FRAGMENT_SHADER, PURPLE_SHADER);
    this.prog = gl.createProgram()!;
    gl.attachShader(this.prog, this.vs);
    gl.attachShader(this.prog, this.fs);
    gl.linkProgram(this.prog);

    this.buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,1,-1,-1,1,1,1,-1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(this.prog, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
  }

  draw(t: number, scroll: number) {
    const gl = this.gl;
    const p  = this.prog;
    if (!p) return;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(p);
    gl.uniform2f(gl.getUniformLocation(p, 'resolution'), this.canvas.width, this.canvas.height);
    gl.uniform1f(gl.getUniformLocation(p, 'time'), t);
    gl.uniform1f(gl.getUniformLocation(p, 'uScroll'), scroll);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  destroy() {
    const gl = this.gl;
    if (this.prog) {
      if (this.vs) { gl.detachShader(this.prog, this.vs); gl.deleteShader(this.vs); }
      if (this.fs) { gl.detachShader(this.prog, this.fs); gl.deleteShader(this.fs); }
      gl.deleteProgram(this.prog);
    }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.max(1, 0.5 * window.devicePixelRatio);
    const renderer = new Renderer(canvas);
    renderer.build();

    const resize = () => {
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    const onScroll = () => { scrollRef.current = window.scrollY; };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });

    const start = performance.now();
    let raf: number;
    const loop = () => {
      renderer.draw((performance.now() - start) / 1000, scrollRef.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      renderer.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    />
  );
}
