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

      <div className="relative flex items-center justify-between h-full px-[2vw]" style={{ zIndex: 10 }}>
        {/* Left Content */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center max-w-xl">
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
            className="text-body mb-8 md:mb-10 animate-fade-in-up"
            style={{
              color: 'var(--text-secondary)',
              fontSize: '15px',
              lineHeight: 1.6,
              animationDelay: '0.4s',
              maxWidth: '450px',
            }}
          >
            With over 15 years of experience, TREC delivers comprehensive real estate and construction solutions across Rwanda. From project execution to expert consultancy, we build properties that define communities.
          </p>

          {/* Key highlights */}
          <div
            className="grid grid-cols-2 gap-4 mb-8 md:mb-12 animate-fade-in-up"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 mt-1"
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 77, 0, 0.1)',
                }}
              >
                <Building2 size={14} style={{ color: 'var(--accent-orange)' }} />
              </div>
              <div>
                <p
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '2px',
                  }}
                >
                  200+ Projects
                </p>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                  }}
                >
                  Completed Successfully
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 mt-1"
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 77, 0, 0.1)',
                }}
              >
                <Shield size={14} style={{ color: 'var(--accent-orange)' }} />
              </div>
              <div>
                <p
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '2px',
                  }}
                >
                  98% Satisfaction
                </p>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                  }}
                >
                  Client Retention Rate
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 mt-1"
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 77, 0, 0.1)',
                }}
              >
                <Droplets size={14} style={{ color: 'var(--accent-orange)' }} />
              </div>
              <div>
                <p
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '2px',
                  }}
                >
                  Expert Waterproofing
                </p>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                  }}
                >
                  Advanced Solutions
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 mt-1"
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 77, 0, 0.1)',
                }}
              >
                <Zap size={14} style={{ color: 'var(--accent-orange)' }} />
              </div>
              <div>
                <p
                  style={{
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '2px',
                  }}
                >
                  Modern Infrastructure
                </p>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                  }}
                >
                  Elevator Systems
                </p>
              </div>
            </div>
          </div>

          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-pill btn-pill-primary animate-scale-in inline-block"
            style={{ animationDelay: '0.6s', width: 'fit-content' }}
          >
            View Our Projects
          </a>
        </div>

        {/* Right side visual - empty to show canvas pattern and background text */}
        <div className="hidden lg:flex w-1/2 h-full items-center justify-center" />
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
