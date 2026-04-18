// Liquid chrome — iridescent oil-slick sheen. Domain-warped bands, mouse warps flow, clicks deform surface.
window.SHADER_CHROME = `
precision highp float;
uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_mouse;
uniform vec3  u_click0, u_click1, u_click2, u_click3;
uniform float u_theme;
uniform float u_intensity;

// hash + value noise
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { s += a * vnoise(p); p *= 2.02; a *= 0.5; }
  return s;
}

// iridescent rainbow from phase
vec3 iridescent(float phase, float theme) {
  // phase in [0,1]
  vec3 c;
  c.r = 0.5 + 0.5 * cos(6.2831 * (phase + 0.00));
  c.g = 0.5 + 0.5 * cos(6.2831 * (phase + 0.33));
  c.b = 0.5 + 0.5 * cos(6.2831 * (phase + 0.67));
  // pull toward chrome grey then tint
  vec3 chrome = vec3(0.72, 0.74, 0.80);
  c = mix(chrome, c, 0.55);
  if (theme > 0.5) c *= 0.55; // dim in dark mode
  return c;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float ar = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0; p.x *= ar;

  float t = u_time * 0.12;
  vec2 m = u_mouse * 2.0 - 1.0; m.x *= ar;

  // Domain warp pulled toward mouse
  vec2 q = p;
  vec2 toM = m - p;
  float md = length(toM);
  q += normalize(toM + 1e-5) * exp(-md * 1.5) * 0.35;

  // Click deformations
  #define CLK(C) { \
    if (C.z > -100.0) { \
      float age = u_time - C.z; \
      if (age >= 0.0 && age < 2.0) { \
        vec2 cp = (vec2(C.x, C.y) * 2.0 - 1.0); cp.x *= ar; \
        vec2 d = q - cp; \
        float r = length(d); \
        float ring = sin(r*18.0 - age*10.0) * exp(-r*2.0) * (1.0 - age/2.0); \
        q += normalize(d + 1e-5) * ring * 0.12; \
      } \
    } \
  }
  CLK(u_click0) CLK(u_click1) CLK(u_click2) CLK(u_click3)

  // Flow field via fbm
  float n1 = fbm(q * 1.3 + vec2(t, -t*0.7));
  float n2 = fbm(q * 2.1 + vec2(-t*0.6, t*0.9) + n1);
  float bands = sin((q.x + q.y) * 2.2 + n2 * 6.2831 + t * 0.8);

  float phase = 0.5 + 0.5 * bands;
  // slight secondary iridescence layer
  float phase2 = fract(phase + n1 * 0.3);

  vec3 col = iridescent(phase2, u_theme);

  // Specular highlight near mouse
  float spec = pow(exp(-md * 2.2), 2.0) * 0.35;
  col += vec3(spec);

  // Vignette + tone toward theme base
  float vig = smoothstep(1.8, 0.2, length(p));
  col *= mix(0.85, 1.05, vig);

  vec3 base = mix(vec3(0.92, 0.92, 0.93), vec3(0.055, 0.058, 0.070), u_theme);
  col = mix(base, col, 0.40 + u_intensity * 0.60);

  // Grain
  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233))) * 43758.5453);
  col += (g - 0.5) * 0.02;

  gl_FragColor = vec4(col, 1.0);
}`;
