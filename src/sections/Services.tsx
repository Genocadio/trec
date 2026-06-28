import { useEffect, useRef } from 'react';
import { LayoutGrid, Activity, ArrowUpRight, Droplets, HardHat, Building2, Scale } from 'lucide-react';

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

export default function Services() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef({ isDragging: false, startX: 0, currentRotation: 0 });

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

  // Carousel drag handler
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleMouseDown = (e: MouseEvent) => {
      dragStateRef.current.isDragging = true;
      dragStateRef.current.startX = e.clientX;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStateRef.current.isDragging || !carousel) return;

      const delta = e.clientX - dragStateRef.current.startX;
      const rotationDelta = (delta / window.innerWidth) * 180;
      dragStateRef.current.currentRotation += rotationDelta;

      const inner = carousel.querySelector('[style*="animation"]') as HTMLElement;
      if (inner) {
        inner.style.animation = 'none';
        inner.style.transform = `rotateY(${dragStateRef.current.currentRotation}deg)`;
      }

      dragStateRef.current.startX = e.clientX;
    };

    const handleMouseUp = () => {
      dragStateRef.current.isDragging = false;
      const inner = carousel.querySelector('[style*="animation"]') as HTMLElement;
      if (inner) {
        inner.style.animation = 'carouselSpin 60s linear infinite';
        inner.style.transform = 'none';
      }
    };

    carousel.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch support
    const handleTouchStart = (e: TouchEvent) => {
      dragStateRef.current.isDragging = true;
      dragStateRef.current.startX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragStateRef.current.isDragging || !carousel) return;

      const delta = e.touches[0].clientX - dragStateRef.current.startX;
      const rotationDelta = (delta / window.innerWidth) * 180;
      dragStateRef.current.currentRotation += rotationDelta;

      const inner = carousel.querySelector('[style*="animation"]') as HTMLElement;
      if (inner) {
        inner.style.animation = 'none';
        inner.style.transform = `rotateY(${dragStateRef.current.currentRotation}deg)`;
      }

      dragStateRef.current.startX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      dragStateRef.current.isDragging = false;
      const inner = carousel.querySelector('[style*="animation"]') as HTMLElement;
      if (inner) {
        inner.style.animation = 'carouselSpin 60s linear infinite';
        inner.style.transform = 'none';
      }
    };

    carousel.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      carousel.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      carousel.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);



  return (
    <section
      id="services"
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f1419 0%, #1a1f28 20%, #151a23 50%, #0d1117 80%, #0a0c10 100%)',
        paddingTop: '8vh',
        paddingBottom: '10vh',
      }}
    >
      {/* Background dot grid canvas - responsive */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0, overflow: 'hidden' }}
      />

      {/* Top fade gradient from light section */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          zIndex: 0.5,
          height: '12vh',
          background: 'linear-gradient(to bottom, rgba(245,245,245,0.1), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom fade gradient to projects section */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          zIndex: 0.5,
          height: '15vh',
          background: 'linear-gradient(to top, rgba(245,245,245,0.08), transparent)',
          pointerEvents: 'none',
        }}
      />

      <div className="relative px-[2vw]" style={{ zIndex: 1 }}>
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left: Title */}
          <div className="lg:w-2/5 flex flex-col justify-center animate-fade-in-left" style={{ animationDelay: '0.2s' }}>
            <p
              className="text-ui mb-4 md:mb-6"
              style={{ color: 'rgba(255, 255, 255, 0.5)' }}
            >
              Our Services
            </p>
            <h2
              className="font-serif text-h2 mb-6 md:mb-8 text-3xl md:text-5xl lg:text-6xl"
              style={{ color: 'white' }}
            >
              Comprehensive Property Services
            </h2>
            <p
              className="text-body mb-8 md:mb-10 max-w-md text-sm md:text-base"
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
          <div className="lg:w-3/5 relative animate-fade-in-right" style={{ animationDelay: '0.4s' }}>
            {/* 3D Carousel */}
            <div
              ref={carouselRef}
              className="relative mb-12 cursor-grab active:cursor-grabbing"
              style={{
                perspective: '900px',
                transformStyle: 'preserve-3d',
                height: '320px',
                userSelect: 'none',
              }}
            >
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transformStyle: 'preserve-3d',
                  animation: 'carouselSpin 60s linear infinite',
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

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel p-5 flex flex-col justify-start">
                  <h4
                    className="font-sans text-sm font-semibold mb-2"
                    style={{ color: 'white' }}
                  >
                    Proven Excellence
                  </h4>
                  <p
                    className="text-xs"
                    style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.5 }}
                  >
                    Trusted expertise delivering premium results across Rwanda
                  </p>
                </div>
                <div className="glass-panel p-5 flex flex-col justify-start">
                  <h4
                    className="font-sans text-sm font-semibold mb-2"
                    style={{ color: 'white' }}
                  >
                    Quality Focus
                  </h4>
                  <p
                    className="text-xs"
                    style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.5 }}
                  >
                    Every project meets rigorous standards and specifications
                  </p>
                </div>
                <div className="glass-panel p-5 flex flex-col justify-start">
                  <h4
                    className="font-sans text-sm font-semibold mb-2"
                    style={{ color: 'white' }}
                  >
                    On Time Delivery
                  </h4>
                  <p
                    className="text-xs"
                    style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.5 }}
                  >
                    Reliable completion with transparent project timelines
                  </p>
                </div>
                <div className="glass-panel p-5 flex flex-col justify-start">
                  <h4
                    className="font-sans text-sm font-semibold mb-2"
                    style={{ color: 'white' }}
                  >
                    Innovation Driven
                  </h4>
                  <p
                    className="text-xs"
                    style={{ color: 'rgba(255, 255, 255, 0.6)', lineHeight: 1.5 }}
                  >
                    Modern solutions and cutting-edge techniques in construction
                  </p>
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
