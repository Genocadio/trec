import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Calendar, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    image: '/images/building-hero.jpg',
    title: 'Kigali Heights Tower',
    location: 'Nyarugenge, Kigali',
    year: '2023',
    category: 'Commercial',
    description: 'A 12-story modern commercial complex featuring retail spaces, offices, and underground parking.',
  },
  {
    image: '/images/residential-project.jpg',
    title: 'Green Valley Residences',
    location: 'Kibagabaga, Kigali',
    year: '2022',
    category: 'Residential',
    description: 'Luxury apartment complex with 48 units, swimming pool, and landscaped gardens overlooking the city.',
  },
  {
    image: '/images/waterproofing.jpg',
    title: 'Kigali Convention Centre',
    location: 'Kigali City Centre',
    year: '2021',
    category: 'Waterproofing',
    description: 'Complete waterproofing solution for Rwanda\'s premier convention and exhibition facility.',
  },
  {
    image: '/images/lift-installation.jpg',
    title: 'Anglican Business Plaza',
    location: 'Kibagabaga, Kigali',
    year: '2023',
    category: 'Lift Systems',
    description: 'Installation of 6 high-speed elevator systems serving 8 floors of premium office space.',
  },
  {
    image: '/images/consultancy.jpg',
    title: 'Nyarutarama Villas',
    location: 'Nyarutarama, Kigali',
    year: '2022',
    category: 'Consultancy',
    description: 'Property valuation and development consultancy for 24 luxury waterfront villas.',
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const featuredImageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const featured = featuredRef.current;
    const imageEl = featuredImageRef.current;
    const overlay = overlayRef.current;
    if (!featured || !imageEl || !overlay) return;

    const triggers: ScrollTrigger[] = [];

    // Featured image animation - smooth entrance without scaling
    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: featured,
        start: 'top 70%',
        end: 'top 20%',
        scrub: false,
      },
    });

    tl1.from(imageEl, {
      opacity: 0,
      scale: 0.98,
      duration: 1.2,
      ease: 'power2.out',
    }, 0);

    tl1.to(imageEl, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: 0.8,
      ease: 'power2.out',
    }, 0.2);

    if (tl1.scrollTrigger) triggers.push(tl1.scrollTrigger);

    // Overlay text animation
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: featured,
        start: '90% bottom',
        toggleActions: 'play reverse play reverse',
      },
    });

    tl2.from(overlay, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    });

    if (tl2.scrollTrigger) triggers.push(tl2.scrollTrigger);

    // Card animations
    cardsRef.current.filter(Boolean).forEach((card) => {
      gsap.set(card, { opacity: 0, y: 60 });
      const st = ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
          });
        },
      });
      triggers.push(st);
    });

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{
        background: 'linear-gradient(135deg, #f0f6fb 0%, #e8f2f9 15%, #f5f9fc 30%, #eef4fa 45%, #f2f8fb 60%, #eff6fb 75%, #f5f9fc 90%, #eef6fa 100%)',
        paddingTop: '12vh',
        position: 'relative',
      }}
    >
      {/* Top fade from dark section */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '18vh',
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.15), transparent)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      {/* Section header */}
      <div className="px-[2vw] mb-12 md:mb-16 animate-fade-in-down relative" style={{ animationDelay: '0.2s', zIndex: 2 }}>
        <p
          className="text-ui mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          Featured Work
        </p>
        <h2
          className="font-serif text-h2 text-3xl md:text-5xl lg:text-6xl"
          style={{ color: 'var(--text-primary)' }}
        >
          Our Projects
        </h2>
      </div>

      {/* Featured project */}
      <div
        ref={featuredRef}
        className="relative w-full overflow-hidden"
        style={{ height: '60vh', minHeight: '500px', zIndex: 2 }}
      >
        <div
          ref={featuredImageRef}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${projects[0].image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Overlay card */}
        <div
          ref={overlayRef}
          className="absolute bottom-4 md:bottom-12 left-[2vw] max-w-lg p-5 md:p-8"
          style={{
            backgroundColor: 'rgba(245, 245, 245, 0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 10,
          }}
        >
          <span
            className="text-ui text-xs md:text-sm"
            style={{ color: 'var(--accent-orange)', fontSize: '10px' }}
          >
            {projects[0].category}
          </span>
          <h3
            className="font-serif text-h3 mt-2 md:mt-3 mb-3 md:mb-4 text-lg md:text-2xl lg:text-3xl"
            style={{ color: 'var(--text-primary)' }}
          >
            {projects[0].title}
          </h3>
          <p
            className="text-body mb-4 md:mb-6 text-sm md:text-base"
            style={{ color: 'var(--text-secondary)', fontSize: '14px' }}
          >
            {projects[0].description}
          </p>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: 'var(--text-secondary)' }} />
              <span
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                {projects[0].location}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} style={{ color: 'var(--text-secondary)' }} />
              <span
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                {projects[0].year}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Project grid */}
      <div
        className="px-[2vw] py-16 md:py-24 relative"
        style={{ zIndex: 2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.slice(1).map((project, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className="group cursor-pointer"
              style={{ opacity: 0 }}
            >
              <div className="relative overflow-hidden mb-4 md:mb-6" style={{ aspectRatio: '16/10' }}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                >
                  <div
                    className="w-12 md:w-14 h-12 md:h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--accent-orange)' }}
                  >
                    <ArrowUpRight size={20} color="white" />
                  </div>
                </div>
                <div
                  className="absolute top-3 md:top-4 left-3 md:left-4 px-2 md:px-3 py-1"
                  style={{
                    backgroundColor: 'var(--accent-orange)',
                  }}
                >
                  <span className="text-ui text-xs" style={{ color: 'white', fontSize: '9px' }}>
                    {project.category}
                  </span>
                </div>
              </div>
              <h3
                className="font-serif text-lg md:text-xl mb-2 group-hover:translate-x-2 transition-transform duration-300"
                style={{ color: 'var(--text-primary)' }}
              >
                {project.title}
              </h3>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <div className="flex items-center gap-1">
                  <MapPin size={12} style={{ color: 'var(--text-secondary)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {project.location}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={12} style={{ color: 'var(--text-secondary)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {project.year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
