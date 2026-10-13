// Ambient flow — very subtle 3rd option. Slow-breathing soft gradient with a faint flow-field sheen.
window.SHADER_AMBIENT = `
precision highp float;
uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_mouse;
uniform vec3  u_click0, u_click1, u_click2, u_click3;
uniform float u_theme;
uniform float u_intensity;

float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5453); }
float vn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1,0));
  float c = hash(i + vec2(0,1)), d = hash(i + vec2(1,1));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float ar = u_resolution.x / u_resolution.y;
  vec2 p = uv; p.x *= ar;
  vec2 m = u_mouse; m.x *= ar;

  float t = u_time * 0.05;

  // soft radial glow around mouse
  float md = length(p - m);
  float glow = exp(-md * 2.2);

  // slow flow field
  float n = vn(p * 1.6 + vec2(t, -t*0.8));
  n = 0.5 + 0.5 * sin(n * 6.2831 + t * 2.0);

  // click gentle pulses
  float pulse = 0.0;
  #define CLK(C) { \
    if (C.z > -100.0) { \
      float age = u_time - C.z; \
      if (age >= 0.0 && age < 3.0) { \
        vec2 cp = vec2(C.x * ar, C.y); \
        float d = length(p - cp); \
        pulse += exp(-pow((d - age * 0.3) * 8.0, 2.0)) * (1.0 - age/3.0) * 0.5; \
      } \
    } \
  }
  CLK(u_click0) CLK(u_click1) CLK(u_click2) CLK(u_click3)

  // palette
  vec3 lightA = vec3(0.985, 0.975, 0.958);
  vec3 lightB = vec3(0.920, 0.900, 0.880);
  vec3 darkA  = vec3(0.050, 0.050, 0.060);
  vec3 darkB  = vec3(0.120, 0.110, 0.135);

  vec3 a = mix(lightA, darkA, u_theme);
  vec3 b = mix(lightB, darkB, u_theme);
  vec3 col = mix(a, b, n * 0.45 + glow * 0.55 + pulse);

  // grain
  float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9, 78.2))) * 43758.5);
  col += (g - 0.5) * 0.012;

  vec3 base = mix(lightA, darkA, u_theme);
  col = mix(base, col, 0.5 + u_intensity * 0.5);

  gl_FragColor = vec4(col, 1.0);
}`;
