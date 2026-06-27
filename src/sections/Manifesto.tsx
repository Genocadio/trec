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
    // Animation is handled by CSS class, no GSAP needed
    return () => {};
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
      style={{ minHeight: 'auto', backgroundColor: 'var(--bg-primary)' }}
    >
      <div
        ref={pinRef}
        className="h-auto py-20 md:py-32 flex items-center justify-center overflow-hidden px-[2vw]"
      >
        <div className="max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw]">
          <div
            className="font-serif animate-fade-in-up"
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 3rem)',
              lineHeight: 1.4,
              color: 'var(--text-primary)',
              textAlign: 'center',
            }}
          >
            {lines.map((line, i) => (
              <span
                key={i}
                ref={(el) => {
                  if (el) linesRef.current[i] = el;
                }}
                className="block transition-all duration-700"
                style={{ 
                  opacity: 1,
                  letterSpacing: '-0.01em',
                }}
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
