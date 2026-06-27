import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

// Perlin noise implementation for GLSL
const perlinNoiseGLSL = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

  float pnoise(vec3 P, vec3 rep) {
    vec3 Pi0 = mod(floor(P), rep);
    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep);
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;
    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);
    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
    vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000), dot(g010,g010), dot(g100,g100), dot(g110,g110)));
    g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001), dot(g011,g011), dot(g101,g101), dot(g111,g111)));
    g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);
    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }
`;

const vertexShader = `
  ${perlinNoiseGLSL}

  varying float vDistort;
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uDensity;
  uniform float uStrength;

  mat3 rotation3dY(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(
      c, 0.0, -s,
      0.0, 1.0, 0.0,
      s, 0.0, c
    );
  }

  vec3 rotateY(vec3 v, float angle) {
    return rotation3dY(angle) * v;
  }

  void main() {
    float distort = pnoise(normal * uDensity, vec3(10.)) * uStrength;
    float offset = distort * uFrequency;
    vec3 pos = position + normal * offset;
    pos = rotateY(pos, distort * uAmplitude * 3.14);
    vDistort = distort;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying float vDistort;
  uniform float uDeepPurple;
  uniform float uOpacity;

  void main() {
    vec3 color;
    if (uDeepPurple == 1.0) {
      color = vec3(1.0 * vDistort, 0.6, 0.0);
    } else {
      color = vec3(1.0, 0.5 * vDistort, 0.0);
    }
    gl_FragColor = vec4(color, clamp(uOpacity, 0.0, 1.0));
  }
`;

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isPressedRef = useRef(false);
  const uniformsRef = useRef<{
    uFrequency: { value: number };
    uAmplitude: { value: number };
    uDensity: { value: number };
    uStrength: { value: number };
    uDeepPurple: { value: number };
    uOpacity: { value: number };
  } | null>(null);

  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.offsetWidth / container.offsetHeight,
      0.1,
      100
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // Geometry
    const geometry = new THREE.IcosahedronGeometry(1, 64);
    const uniforms = {
      uFrequency: { value: 0 },
      uAmplitude: { value: 4 },
      uDensity: { value: 1 },
      uStrength: { value: 0 },
      uDeepPurple: { value: 1.0 },
      uOpacity: { value: 0.1 },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      wireframe: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleMouseDown = () => {
      isPressedRef.current = true;
      gsap.to(uniforms.uFrequency, { value: 4, duration: 1, ease: 'expo.out' });
      gsap.to(uniforms.uAmplitude, { value: 4.5, duration: 1, ease: 'expo.out' });
      gsap.to(uniforms.uDensity, { value: 1.5, duration: 1, ease: 'expo.out' });
      gsap.to(uniforms.uStrength, { value: 1.1, duration: 1, ease: 'expo.out' });
    };

    const handleMouseUp = () => {
      isPressedRef.current = false;
      gsap.to(uniforms.uFrequency, { value: 0, duration: 1, ease: 'expo.out' });
      gsap.to(uniforms.uAmplitude, { value: 4, duration: 1, ease: 'expo.out' });
      gsap.to(uniforms.uDensity, { value: 1, duration: 1, ease: 'expo.out' });
      gsap.to(uniforms.uStrength, { value: 0, duration: 1, ease: 'expo.out' });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch handlers for mobile
    const handleTouchStart = () => {
      isPressedRef.current = true;
      gsap.to(uniforms.uFrequency, { value: 4, duration: 1, ease: 'expo.out' });
      gsap.to(uniforms.uAmplitude, { value: 4.5, duration: 1, ease: 'expo.out' });
      gsap.to(uniforms.uDensity, { value: 1.5, duration: 1, ease: 'expo.out' });
      gsap.to(uniforms.uStrength, { value: 1.1, duration: 1, ease: 'expo.out' });
    };

    const handleTouchEnd = () => {
      isPressedRef.current = false;
      gsap.to(uniforms.uFrequency, { value: 0, duration: 1, ease: 'expo.out' });
      gsap.to(uniforms.uAmplitude, { value: 4, duration: 1, ease: 'expo.out' });
      gsap.to(uniforms.uDensity, { value: 1, duration: 1, ease: 'expo.out' });
      gsap.to(uniforms.uStrength, { value: 0, duration: 1, ease: 'expo.out' });
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    // Animation loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Mouse rotation lerp
      mesh.rotation.x += (mouseRef.current.y * 0.5 - mesh.rotation.x) * 0.1;
      mesh.rotation.y += (mouseRef.current.x * 0.5 - mesh.rotation.y) * 0.1;

      // Wobble
      mesh.rotation.x += Math.cos(time) * 0.005;
      mesh.rotation.y += Math.sin(time) * 0.005;

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
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
      id="hero"
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Massive background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <h1
          className="font-serif text-display animate-fade-in-down"
          style={{
            color: 'rgba(15, 139, 174, 0.08)',
            fontSize: 'clamp(6rem, 22vw, 22rem)',
            animationDelay: '0.2s',
          }}
        >
          TREC
        </h1>
      </div>

      {/* 3D Canvas container */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 2 }}
      />

      {/* Content overlay */}
      <div
        className="absolute bottom-0 left-0 w-full px-[2vw] pb-12 md:pb-16 lg:pb-24"
        style={{ zIndex: 10 }}
      >
        <div className="max-w-4xl">
          <p
            className="font-sans text-ui mb-4 md:mb-6 animate-fade-in-up"
            style={{ 
              color: 'var(--text-secondary)',
              animationDelay: '0.4s',
            }}
          >
            Talent Real Estate Company Ltd
          </p>
          <h2
            className="font-sans text-xl md:text-3xl lg:text-4xl font-light mb-6 md:mb-8 animate-fade-in-up"
            style={{
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              animationDelay: '0.6s',
            }}
          >
            Architectural Execution &amp; Consultancy
          </h2>
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-pill btn-pill-primary animate-scale-in inline-block"
            style={{ animationDelay: '0.8s' }}
          >
            Explore Projects
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 md:bottom-8 right-[2vw] flex flex-col items-center gap-2 animate-float"
        style={{ zIndex: 10 }}
      >
        <span
          className="text-ui text-xs md:text-sm"
          style={{
            color: 'var(--text-secondary)',
            writingMode: 'vertical-rl',
          }}
        >
          Scroll
        </span>
        <div
          className="w-[1px] h-8 md:h-12 animate-pulse"
          style={{ backgroundColor: 'var(--accent-orange)' }}
        />
      </div>
    </section>
  );
}
