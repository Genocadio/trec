import { useEffect, useRef } from 'react';
import { Building2, Droplets, Zap, Shield } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Draw animated dot pattern on right side
    const canvas = containerRef.current?.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    let animId: number;
    let time = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.01;
      ctx.clearRect(0, 0, w, h);

      const dotSize = 4;
      const spacing = 24;
      const cols = Math.ceil(w / spacing);
      const rows = Math.ceil(h / spacing);

      // Draw animated dot grid
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing + spacing / 2;
          const y = r * spacing + spacing / 2;

          const distance = Math.sqrt((x - w / 2) ** 2 + (y - h / 2) ** 2);
          const wave = Math.sin(distance * 0.01 - time) * 0.5 + 0.5;

          const opacity = 0.1 + wave * 0.2;
          ctx.fillStyle = `rgba(255, 77, 0, ${opacity})`;
          ctx.beginPath();
          ctx.arc(x, y, dotSize * (0.7 + wave * 0.3), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw accent circle
      const pulseRadius = 80 + Math.sin(time * 2) * 10;
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, pulseRadius);
      grad.addColorStop(0, 'rgba(255, 77, 0, 0.15)');
      grad.addColorStop(0.7, 'rgba(255, 77, 0, 0.05)');
      grad.addColorStop(1, 'rgba(255, 77, 0, 0)');
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    };

    animate();

    const handleResize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100vh', backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Background canvas for animated pattern */}
      <canvas
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0, opacity: 0.4 }}
      />

      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-end pointer-events-none select-none pr-[5vw]">
        <h1
          className="font-serif text-display animate-fade-in-right"
          style={{
            color: 'rgba(15, 139, 174, 0.06)',
            fontSize: 'clamp(4rem, 18vw, 20rem)',
            animationDelay: '0.1s',
            textAlign: 'right',
            lineHeight: 1,
          }}
        >
          Building
          <br />
          Excellence
        </h1>
      </div>

      <div className="relative flex items-center justify-center h-full px-[2vw]" style={{ zIndex: 10 }}>
        {/* Centered Content */}
        <div className="w-full flex flex-col justify-center items-center text-center max-w-3xl">
          <p
            className="text-ui mb-4 md:mb-6 animate-fade-in-up"
            style={{
              color: 'var(--text-secondary)',
              animationDelay: '0.2s',
              fontSize: '12px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Talent Real Estate Company Ltd
          </p>

          <h2
            className="font-serif mb-6 md:mb-8 animate-fade-in-up leading-tight"
            style={{
              color: 'var(--text-primary)',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              animationDelay: '0.3s',
              fontWeight: 300,
            }}
          >
            Architectural Execution &amp; Consultancy Services
          </h2>

          <p
            className="text-body mb-10 md:mb-14 animate-fade-in-up"
            style={{
              color: 'var(--text-secondary)',
              fontSize: '16px',
              lineHeight: 1.7,
              animationDelay: '0.4s',
              maxWidth: '700px',
            }}
          >
            TREC delivers comprehensive real estate and construction solutions across Rwanda. From visionary project execution to expert consultancy, we craft properties that define communities and inspire generations.
          </p>

          {/* Key highlights */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-10 md:mb-14 animate-fade-in-up w-full px-4 md:px-0"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="flex-shrink-0"
                style={{
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 77, 0, 0.1)',
                }}
              >
                <Building2 size={22} style={{ color: 'var(--accent-orange)' }} />
              </div>
              <p
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                Strategic Design
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div
                className="flex-shrink-0"
                style={{
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 77, 0, 0.1)',
                }}
              >
                <Shield size={22} style={{ color: 'var(--accent-orange)' }} />
              </div>
              <p
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                Quality Assured
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div
                className="flex-shrink-0"
                style={{
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 77, 0, 0.1)',
                }}
              >
                <Droplets size={22} style={{ color: 'var(--accent-orange)' }} />
              </div>
              <p
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                Expert Waterproofing
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div
                className="flex-shrink-0"
                style={{
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 77, 0, 0.1)',
                }}
              >
                <Zap size={22} style={{ color: 'var(--accent-orange)' }} />
              </div>
              <p
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                Modern Systems
              </p>
            </div>
          </div>

          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-pill btn-pill-primary animate-scale-in inline-block"
            style={{ animationDelay: '0.6s' }}
          >
            View Our Projects
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-6 md:bottom-8 left-[2vw] flex flex-col items-center gap-2 animate-float"
        style={{ zIndex: 20 }}
      >
        <span
          className="text-ui text-xs md:text-sm"
          style={{
            color: 'var(--text-secondary)',
            writingMode: 'vertical-rl',
            fontSize: '11px',
            letterSpacing: '0.05em',
          }}
        >
          Scroll to explore
        </span>
        <div
          className="w-[1px] h-8 md:h-12 animate-pulse"
          style={{ backgroundColor: 'var(--accent-orange)' }}
        />
      </div>
    </section>
  );
}
