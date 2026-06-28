import { ArrowUp } from 'lucide-react';

const footerLinks = [
  {
    title: 'Services',
    links: [
      { label: 'Our Services', href: '#services' },
      { label: 'Our Projects', href: '#projects' },
      { label: 'About Us', href: '#about' },
    ],
  },
  {
    title: 'Quick Links',
    links: [
      { label: 'Contact', href: '#contact' },
      { label: 'Home', href: '#hero' },
    ],
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-light)',
      }}
    >
      {/* Large brand text */}
      <div className="px-[2vw] py-12 md:py-16 overflow-hidden">
        <h2
          className="font-serif select-none"
          style={{
            fontSize: 'clamp(3rem, 12vw, 14rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            opacity: 0.06,
          }}
        >
          TREC
        </h2>
      </div>

      {/* Footer content */}
      <div className="px-[2vw] pb-8 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Brand column */}
          <div>
            <h3
              className="font-serif text-xl md:text-2xl mb-3 md:mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              TREC
            </h3>
            <p
              className="text-xs md:text-sm mb-4 md:mb-6 max-w-sm"
              style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}
            >
              Talent Real Estate Company Ltd. Building Kigali&apos;s skyline
              with precision, expertise, and unwavering commitment to quality.
            </p>
            <p
              className="text-xs md:text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Anglican Building, 1st Floor
              <br />
              Kibagabaga, KG345st
              <br />
              Kigali City, Rwanda
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((group, i) => (
            <div key={`footer-group-${i}`}>
              <h4
                className="text-ui mb-4 md:mb-6"
                style={{ color: 'var(--text-primary)', fontSize: '10px' }}
              >
                {group.title}
              </h4>
              <ul className="space-y-2 md:space-y-3">
                {group.links.map((link, j) => (
                  <li key={`footer-link-${i}-${j}`}>
                    <a
                      href={link.href}
                      className="text-xs md:text-sm transition-colors duration-300 hover:translate-x-1 inline-block"
                      style={{ color: 'var(--text-secondary)' }}
                      onClick={(e) => {
                        e.preventDefault();
                        const target = document.querySelector(link.href);
                        if (target) {
                          target.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = 'var(--accent-orange)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = 'var(--text-secondary)';
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 pt-6 md:pt-8"
          style={{ borderTop: '1px solid var(--border-light)' }}
        >
          <p
            className="text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
            &copy; {new Date().getFullYear()} Talent Real Estate Company Ltd. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-ui transition-colors duration-300"
            style={{ color: 'var(--text-secondary)', fontSize: '10px' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--accent-orange)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            }}
          >
            Back to top
            <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}
