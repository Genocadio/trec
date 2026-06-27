import { useEffect, useRef } from 'react';
import { LayoutGrid, Activity, ArrowUpRight, TrendingUp, Droplets, HardHat, Building2, Scale } from 'lucide-react';

const services = [
  { title: 'Project Execution', icon: HardHat, desc: 'End-to-end construction management with precision and quality.' },
  { title: 'Waterproofing', icon: Droplets, desc: 'Advanced waterproofing solutions for all building types.' },
  { title: 'Lift Systems', icon: Building2, desc: 'Installation and maintenance of modern elevator systems.' },
  { title: 'Consultancy', icon: LayoutGrid, desc: 'Expert real estate and construction consulting services.' },
  { title: 'Property Valuation', icon: Scale, desc: 'Accurate property assessment and market analysis.' },
  { title: 'General Trade', icon: Activity, desc: 'Comprehensive supply and logistics for construction needs.' },
  { title: 'Project Execution', icon: HardHat, desc: 'End-to-end construction management with precision and quality.' },
  { title: 'Waterproofing', icon: Droplets, desc: 'Advanced waterproofing solutions for all building types.' },
  { title: 'Lift Systems', icon: Building2, desc: 'Installation and maintenance of modern elevator systems.' },
  { title: 'Consultancy', icon: LayoutGrid, desc: 'Expert real estate and construction consulting services.' },
];

const chartData = [35, 42, 55, 48, 62, 75, 68, 82, 90, 85, 95, 100];

export default function Services() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);

  // Dot grid + pulsing circle animation
  useEffect(() => {
    const canvas = canvasRef.current;
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

    const dotSpacing = 30;
    const dotRadius = 3;
    const connectDist = 100;

    const draw = () => {
      animId = requestAnimationFrame(draw);
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      const cols = Math.ceil(w / dotSpacing);
      const rows = Math.ceil(h / dotSpacing);
      const dots: { x: number; y: number; active: boolean }[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * dotSpacing + dotSpacing / 2;
          const y = r * dotSpacing + dotSpacing / 2;
          const active = Math.random() < 0.1;
          dots.push({ x, y, active });
        }
      }

      // Draw connections
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDist) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (const dot of dots) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
        ctx.fillStyle = dot.active ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.08)';
        ctx.fill();
      }

      // Pulsing orange circle
      const pulseRadius = 50 + Math.sin(time * 2) * 5;
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, pulseRadius);
      grad.addColorStop(0, 'rgba(255, 77, 0, 0.6)');
      grad.addColorStop(1, 'rgba(255, 77, 0, 0)');
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    };

    draw();

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

  // Line chart
  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const padding = 20;
    const chartW = w - padding * 2;
    const chartH = h - padding * 2;
    const maxVal = Math.max(...chartData);

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartW, y);
      ctx.stroke();
    }

    // Area gradient
    const areaGrad = ctx.createLinearGradient(0, padding, 0, padding + chartH);
    areaGrad.addColorStop(0, 'rgba(255, 77, 0, 0.3)');
    areaGrad.addColorStop(1, 'rgba(255, 77, 0, 0.0)');

    // Build path
    const points = chartData.map((val, i) => ({
      x: padding + (i / (chartData.length - 1)) * chartW,
      y: padding + chartH - (val / maxVal) * chartH,
    }));

    // Fill area
    ctx.beginPath();
    ctx.moveTo(points[0].x, padding + chartH);
    for (const p of points) ctx.lineTo(p.x, p.y);
    ctx.lineTo(points[points.length - 1].x, padding + chartH);
    ctx.closePath();
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // Stroke line
    ctx.beginPath();
    for (const p of points) ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = '#ff4d00';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Data points
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ff4d00';
      ctx.fill();
    }
  }, []);

  return (
    <section
      id="services"
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-dark)',
        paddingTop: '15vh',
        paddingBottom: '15vh',
      }}
    >
      {/* Background dot grid canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      <div className="relative px-[2vw]" style={{ zIndex: 1 }}>
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left: Title */}
          <div className="lg:w-2/5 flex flex-col justify-center">
            <p
              className="text-ui mb-6"
              style={{ color: 'rgba(255, 255, 255, 0.5)' }}
            >
              Our Services
            </p>
            <h2
              className="font-serif text-h2 mb-8"
              style={{ color: 'white' }}
            >
              Comprehensive Property Services
            </h2>
            <p
              className="text-body mb-10 max-w-md"
              style={{ color: 'rgba(255, 255, 255, 0.6)' }}
            >
              From concept to completion, we deliver excellence across every
              aspect of real estate and construction services in Rwanda.
            </p>
            <a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="btn-pill btn-pill-primary self-start">
              Get a Quote
            </a>
          </div>

          {/* Right: Dashboard */}
          <div className="lg:w-3/5 relative">
            {/* 3D Carousel */}
            <div
              className="relative mb-12"
              style={{
                perspective: '900px',
                transformStyle: 'preserve-3d',
                height: '320px',
              }}
            >
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transformStyle: 'preserve-3d',
                  animation: 'carouselSpin 40s linear infinite',
                }}
              >
                {services.map((service, i) => {
                  const Icon = service.icon;
                  return (
                    <div
                      key={i}
                      className="absolute glass-panel"
                      style={{
                        width: '220px',
                        padding: '24px',
                        transform: `rotateY(${i * 36}deg) translateZ(320px)`,
                        transformOrigin: 'center',
                        backfaceVisibility: 'hidden',
                      }}
                    >
                      <Icon
                        size={28}
                        style={{ color: 'var(--accent-orange)', marginBottom: '12px' }}
                      />
                      <h4
                        className="font-sans text-sm font-semibold mb-2"
                        style={{ color: 'white' }}
                      >
                        {service.title}
                      </h4>
                      <p
                        className="text-xs"
                        style={{ color: 'rgba(255, 255, 255, 0.5)', lineHeight: 1.5 }}
                      >
                        {service.desc}
                      </p>
                      <ArrowUpRight
                        size={16}
                        className="mt-4"
                        style={{ color: 'var(--accent-orange)' }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Data panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Metrics */}
              <div className="glass-panel p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} style={{ color: 'var(--accent-orange)' }} />
                  <span
                    className="text-ui"
                    style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '11px' }}
                  >
                    Valuation Trends
                  </span>
                </div>
                <canvas
                  ref={chartCanvasRef}
                  style={{ width: '100%', height: '140px' }}
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-5 flex flex-col justify-center">
                  <span
                    className="text-3xl font-serif"
                    style={{ color: 'var(--accent-orange)' }}
                  >
                    200+
                  </span>
                  <span
                    className="text-xs mt-1"
                    style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    Projects Completed
                  </span>
                </div>
                <div className="glass-panel p-5 flex flex-col justify-center">
                  <span
                    className="text-3xl font-serif"
                    style={{ color: 'var(--accent-orange)' }}
                  >
                    15+
                  </span>
                  <span
                    className="text-xs mt-1"
                    style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    Years Experience
                  </span>
                </div>
                <div className="glass-panel p-5 flex flex-col justify-center">
                  <span
                    className="text-3xl font-serif"
                    style={{ color: 'var(--accent-orange)' }}
                  >
                    50+
                  </span>
                  <span
                    className="text-xs mt-1"
                    style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    Expert Team
                  </span>
                </div>
                <div className="glass-panel p-5 flex flex-col justify-center">
                  <span
                    className="text-3xl font-serif"
                    style={{ color: 'var(--accent-orange)' }}
                  >
                    98%
                  </span>
                  <span
                    className="text-xs mt-1"
                    style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    Client Satisfaction
                  </span>
                </div>
              </div>
            </div>

            {/* Centered tagline */}
            <div className="mt-8 text-center">
              <p
                className="text-ui"
                style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '11px', letterSpacing: '0.15em' }}
              >
                PROJECT EXECUTION / WATERPROOFING / LIFT SYSTEMS
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes carouselSpin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
      `}</style>
    </section>
  );
}
