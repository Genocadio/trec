import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const manifestoText = `We build spaces that define the skyline of Kigali. From ground-breaking foundations to waterproofing precision, our mission is structural excellence.`;

export default function Manifesto() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const pinWrapper = pinRef.current;
    const lines = linesRef.current.filter(Boolean);
    if (!section || !pinWrapper || lines.length === 0) return;

    // Set initial state
    gsap.set(lines, { opacity: 0.08 });

    const triggers: ScrollTrigger[] = [];

    lines.forEach((line, i) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: '+=200%',
          pin: pinWrapper,
          scrub: 1,
        },
      });

      tl.to(
        line,
        {
          opacity: 1,
          duration: 0.3,
          ease: 'none',
        },
        i * 0.15
      );

      if (tl.scrollTrigger) {
        triggers.push(tl.scrollTrigger);
      }
    });

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, []);

  // Split text into lines (roughly 4-6 words per line)
  const words = manifestoText.split(' ');
  const lines: string[] = [];
  let currentLine: string[] = [];
  words.forEach((word) => {
    currentLine.push(word);
    if (currentLine.length >= 4) {
      lines.push(currentLine.join(' '));
      currentLine = [];
    }
  });
  if (currentLine.length > 0) {
    lines.push(currentLine.join(' '));
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{ minHeight: '200vh', backgroundColor: 'var(--bg-primary)' }}
    >
      <div
        ref={pinRef}
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="px-[2vw] max-w-[70vw] md:max-w-[60vw]">
          <div
            className="font-serif"
            style={{
              fontSize: 'clamp(2rem, 6vh, 5rem)',
              lineHeight: 1.2,
              color: 'var(--text-primary)',
            }}
          >
            {lines.map((line, i) => (
              <span
                key={i}
                ref={(el) => {
                  if (el) linesRef.current[i] = el;
                }}
                className="block"
                style={{ opacity: 0.08 }}
              >
                {line}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
