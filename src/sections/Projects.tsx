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

    // Featured image animation
    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: featured,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        pin: true,
      },
    });

    tl1.to(imageEl, {
      scale: 1.05,
      duration: 1,
    }, 0);

    tl1.to(imageEl, {
      xPercent: 40,
      duration: 1,
      ease: 'power1.inOut',
    }, 0.5);

    tl1.to(imageEl, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: 1,
      ease: 'power1.inOut',
    }, 0.5);

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
        backgroundColor: 'var(--bg-primary)',
        paddingTop: '15vh',
      }}
    >
      {/* Section header */}
      <div className="px-[2vw] mb-16">
        <p
          className="text-ui mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          Featured Work
        </p>
        <h2
          className="font-serif text-h2"
          style={{ color: 'var(--text-primary)' }}
        >
          Our Projects
        </h2>
      </div>

      {/* Featured project */}
      <div
        ref={featuredRef}
        className="relative w-full overflow-hidden"
        style={{ height: '100vh' }}
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
          className="absolute bottom-12 left-[2vw] max-w-lg p-8"
          style={{
            backgroundColor: 'rgba(245, 245, 245, 0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 10,
          }}
        >
          <span
            className="text-ui"
            style={{ color: 'var(--accent-orange)', fontSize: '11px' }}
          >
            {projects[0].category}
          </span>
          <h3
            className="font-serif text-h3 mt-2 mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            {projects[0].title}
          </h3>
          <p
            className="text-body mb-6"
            style={{ color: 'var(--text-secondary)', fontSize: '16px' }}
          >
            {projects[0].description}
          </p>
          <div className="flex items-center gap-6">
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
        className="px-[2vw] py-24"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.slice(1).map((project, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden mb-6" style={{ aspectRatio: '16/10' }}>
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
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--accent-orange)' }}
                  >
                    <ArrowUpRight size={24} color="white" />
                  </div>
                </div>
                <div
                  className="absolute top-4 left-4 px-3 py-1"
                  style={{
                    backgroundColor: 'var(--accent-orange)',
                  }}
                >
                  <span className="text-ui" style={{ color: 'white', fontSize: '10px' }}>
                    {project.category}
                  </span>
                </div>
              </div>
              <h3
                className="font-serif text-xl mb-2 group-hover:translate-x-2 transition-transform duration-300"
                style={{ color: 'var(--text-primary)' }}
              >
                {project.title}
              </h3>
              <div className="flex items-center gap-4">
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
