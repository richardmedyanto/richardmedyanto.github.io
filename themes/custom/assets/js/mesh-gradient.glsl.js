// Mesh gradient — warm palette (orange/pink). Light/dark swap + mouse follow + click pulses + rich idle animation.
window.SHADER_MESH = `
precision highp float;
uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_mouse;
uniform vec3  u_click0, u_click1, u_click2, u_click3;
uniform float u_theme;       // 0 light, 1 dark
uniform float u_intensity;   // 0..1

float blob(vec2 uv, vec2 c, float r) {
  float d = length(uv - c);
  return smoothstep(r, 0.0, d);
}

vec3 palette(float t, float theme, float hueShift) {
  // Dark: deep plum -> ember orange -> hot pink highlight
  vec3 dA = vec3(0.06, 0.03, 0.05);
  vec3 dB = vec3(0.94, 0.38, 0.15);
  vec3 dC = vec3(0.86, 0.18, 0.47);
  vec3 dD = vec3(0.98, 0.80, 0.45);
  // Light: warm cream -> apricot -> rose
  vec3 lA = vec3(0.985, 0.965, 0.940);
  vec3 lB = vec3(0.985, 0.760, 0.540);
  vec3 lC = vec3(0.960, 0.650, 0.700);
  vec3 lD = vec3(0.985, 0.870, 0.760);
  vec3 a = mix(lA, dA, theme);
  vec3 b = mix(lB, dB, theme);
  vec3 c = mix(lC, dC, theme);
  vec3 d = mix(lD, dD, theme);

  // Slow hue drift: subtle rotation between b and c
  float shift = 0.5 + 0.5 * sin(hueShift);
  vec3 b2 = mix(b, c, shift * 0.35);
  vec3 c2 = mix(c, b, shift * 0.35);

  vec3 col = a;
  col = mix(col, b2, smoothstep(0.0, 0.6, t));
  col = mix(col, c2, smoothstep(0.35, 0.9, t) * 0.85);
  col = mix(col, d, smoothstep(0.7, 1.0, t) * 0.6);
  return col;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float ar = u_resolution.x / u_resolution.y;
  vec2 p = uv; p.x *= ar;
  vec2 m = u_mouse; m.x *= ar;

  // Layered time scales for breathing + drift
  float t  = u_time * 0.18;
  float t2 = u_time * 0.07;       // slower secondary drift
  float t3 = u_time * 0.035;      // very slow hue shift
  float breathe = 0.5 + 0.5 * sin(u_time * 0.45);

  // 4 drifting blobs using Lissajous-ish paths with two frequencies each
  vec2 b1 = vec2(
    0.30*ar + 0.22*cos(t*0.9)  + 0.08*cos(t2*1.7),
    0.30    + 0.20*sin(t*1.1)  + 0.07*sin(t2*1.3)
  );
  vec2 b2 = vec2(
    0.75*ar + 0.24*cos(t*0.7+1.3) + 0.09*sin(t2*2.1),
    0.70    + 0.18*sin(t*0.8+0.4) + 0.08*cos(t2*1.6)
  );
  vec2 b3 = vec2(
    0.50*ar + 0.32*cos(t*0.5+2.1) + 0.11*cos(t2*1.1),
    0.45    + 0.24*sin(t*0.6+1.7) + 0.10*sin(t2*0.9)
  );
  vec2 b4 = vec2(
    0.20*ar + 0.20*cos(t*1.2+3.0) + 0.07*sin(t2*2.5),
    0.80    + 0.16*sin(t*1.0+2.2) + 0.06*cos(t2*2.0)
  );
  // 5th roaming highlight — slow figure-eight
  vec2 b5 = vec2(
    0.50*ar + 0.38*sin(t2*0.8),
    0.50    + 0.28*sin(t2*1.6)
  );

  // Radii breathe so blobs pulse in/out subtly
  float r1 = 0.55 + 0.05 * sin(u_time * 0.6);
  float r2 = 0.50 + 0.05 * sin(u_time * 0.5 + 1.2);
  float r3 = 0.60 + 0.06 * sin(u_time * 0.4 + 2.4);
  float r4 = 0.45 + 0.05 * sin(u_time * 0.7 + 0.8);
  float r5 = 0.35 + 0.05 * sin(u_time * 0.3);

  float f = 0.0;
  f += blob(p, b1, r1) * (0.85 + 0.15 * breathe);
  f += blob(p, b2, r2) * 0.90;
  f += blob(p, b3, r3) * (0.65 + 0.15 * breathe);
  f += blob(p, b4, r4) * 0.60;
  f += blob(p, b5, r5) * 0.55;
  f += blob(p, m,  0.40) * 1.10; // mouse follow

  // Click ripples
  #define CLK(C) { \
    if (C.z > -100.0) { \
      float age = u_time - C.z; \
      if (age >= 0.0 && age < 2.5) { \
        vec2 cp = vec2(C.x * ar, C.y); \
        float r  = age * 0.45; \
        float d  = length(p - cp); \
        float ring = exp(-pow((d - r) * 6.0, 2.0)) * (1.0 - age/2.5); \
        f += ring * 1.2; \
      } \
    } \
  }
  CLK(u_click0) CLK(u_click1) CLK(u_click2) CLK(u_click3)

  float fn = clamp(f * 0.55, 0.0, 1.0);
  vec3 col = palette(fn, u_theme, t3 * 6.2831);

  // Grain
  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233))) * 43758.5453);
  col += (g - 0.5) * 0.015;

  // Intensity
  vec3 base = mix(vec3(0.985, 0.970, 0.950), vec3(0.055, 0.050, 0.065), u_theme);
  col = mix(base, col, 0.35 + u_intensity * 0.65);

  gl_FragColor = vec4(col, 1.0);
}`;
