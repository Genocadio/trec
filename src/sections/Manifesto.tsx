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
      style={{ 
        minHeight: 'auto',
        background: 'linear-gradient(135deg, #f0f6fb 0%, #e8f2f9 25%, #f5f9fc 50%, #eef6fa 75%, #f2f8fb 100%)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        ref={pinRef}
        className="h-auto py-16 md:py-24 flex items-center justify-center overflow-visible px-[2vw]"
      >
        <div className="max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw]">
          <div
            className="font-serif"
            style={{
              fontSize: 'clamp(1.25rem, 4vw, 2.5rem)',
              lineHeight: 1.5,
              color: 'var(--text-primary)',
              textAlign: 'center',
              fontWeight: 400,
            }}
          >
            {lines.map((line, i) => (
              <span
                key={i}
                ref={(el) => {
                  if (el) linesRef.current[i] = el;
                }}
                className="block"
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
