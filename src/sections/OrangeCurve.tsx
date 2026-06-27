import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform float uAspect;
  uniform vec2 u_resolution;

  #define MAX_STEPS 100
  #define MAX_DIST 100.0
  #define SURF_DIST 0.001

  mat2 rot2(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
  }

  float sdSphere(vec3 p, float r) {
    return length(p) - r;
  }

  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  float scene(vec3 p) {
    float t = uTime;
    float angle = t * 0.2;
    p.xz = rot2(angle) * p.xz;

    float base = sdSphere(p, 2.5);
    float displacement = 0.0;
    displacement += sin(p.x * 1.2 + t * 0.5) * 0.3;
    displacement += sin(p.y * 1.5 - t * 0.3) * 0.3;
    displacement += sin(p.z * 1.1 + t * 0.4) * 0.3;
    displacement += sin(p.x * 3.0 + p.y * 2.5 + p.z * 2.8 + t) * 0.1;
    float shape = base + displacement;

    float s1 = sdSphere(p - vec3(sin(t * 0.7) * 1.5, cos(t * 0.5) * 1.2, sin(t * 0.3) * 1.8), 0.8);
    float s2 = sdSphere(p - vec3(cos(t * 0.4) * 1.8, sin(t * 0.6) * 1.5, cos(t * 0.8) * 1.2), 0.6);
    float s3 = sdSphere(p - vec3(sin(t * 0.5 + 1.0) * 1.2, cos(t * 0.4 + 2.0) * 1.8, sin(t * 0.7 + 3.0) * 1.5), 0.7);

    float blob = smin(shape, s1, 1.2);
    blob = smin(blob, s2, 1.0);
    blob = smin(blob, s3, 1.0);

    return blob;
  }

  vec3 getNormal(vec3 p) {
    float d = scene(p);
    vec2 e = vec2(0.001, 0.0);
    vec3 n = d - vec3(
      scene(p - e.xyy),
      scene(p - e.yxy),
      scene(p - e.yyx)
    );
    return normalize(n);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
    uv.x *= uAspect;

    vec3 ro = vec3(0.0, 0.0, 6.0);
    vec3 rd = normalize(vec3(uv, -1.0));

    float swayX = sin(uTime * 0.3) * 0.2;
    float swayY = cos(uTime * 0.2) * 0.15;
    rd = normalize(rd + vec3(swayX, swayY, 0.0));

    float d0 = 0.0;
    bool hit = false;

    for (int i = 0; i < MAX_STEPS; i++) {
      vec3 p = ro + rd * d0;
      float ds = scene(p);
      d0 += ds;
      if (ds < SURF_DIST || d0 > MAX_DIST) {
        if (ds < SURF_DIST) hit = true;
        break;
      }
    }

    if (hit) {
      vec3 p = ro + rd * d0;
      vec3 n = getNormal(p);
      vec3 lightDir = normalize(vec3(1.0, 2.0, 2.0));
      float diff = max(dot(n, lightDir), 0.0);
      float ambient = 0.3;
      float lighting = ambient + diff * 0.7;
      vec3 col = vec3(0.06, 0.55, 0.68) * lighting;
      float fresnel = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
      col += vec3(0.06, 0.55, 0.68) * fresnel * 0.5;
      gl_FragColor = vec4(col, 1.0);
    } else {
      gl_FragColor = vec4(0.95, 0.95, 0.95, 1.0);
    }
  }
`;

export default function OrangeCurve() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    const animTime = { value: 0 };
    const uniforms = {
      uTime: { value: 0 },
      uAspect: { value: container.offsetWidth / container.offsetHeight },
      u_resolution: {
        value: new THREE.Vector2(
          container.offsetWidth * Math.min(window.devicePixelRatio, 2),
          container.offsetHeight * Math.min(window.devicePixelRatio, 2)
        ),
      },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      uniforms.uTime.value = elapsed;
      animTime.value += 0.004;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h);
      uniforms.uAspect.value = w / h;
      uniforms.u_resolution.value.set(
        w * Math.min(window.devicePixelRatio, 2),
        h * Math.min(window.devicePixelRatio, 2)
      );
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: '120vh', backgroundColor: 'var(--bg-primary)' }}
    >
      {/* WebGL Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0"
        style={{ zIndex: 1 }}
      />

      {/* Overlay text */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-fade-in-up"
        style={{ zIndex: 2, animationDelay: '0.3s' }}
      >
        <h2
          className="font-serif text-h2 text-center text-2xl md:text-4xl lg:text-6xl px-[2vw]"
          style={{
            color: 'var(--text-primary)',
            textShadow: '0 0 40px rgba(245, 245, 245, 0.8)',
          }}
        >
          DEFINING LANDMARKS
        </h2>
        <p
          className="font-sans text-ui mt-4 md:mt-6 text-xs md:text-sm"
          style={{
            color: 'var(--text-secondary)',
            textShadow: '0 0 20px rgba(245, 245, 245, 0.8)',
          }}
        >
          Since 2008
        </p>
      </div>
    </section>
  );
}
