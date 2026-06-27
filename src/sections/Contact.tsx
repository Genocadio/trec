import { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  useEffect(() => {
    const section = sectionRef.current;
    const form = formRef.current;
    const info = infoRef.current;
    if (!section || !form || !info) return;

    const triggers: ScrollTrigger[] = [];

    gsap.set([form, info], { opacity: 0, y: 50 });

    const st1 = ScrollTrigger.create({
      trigger: section,
      start: 'top 70%',
      onEnter: () => {
        gsap.to(form, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
        gsap.to(info, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.2 });
      },
    });
    triggers.push(st1);

    return () => {
      triggers.forEach((st) => st.kill());
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
    }, 4000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: 'Address',
      value: 'Anglican Building, 1st Floor\nKibagabaga, KG345st\nKigali City, Rwanda',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+250 788 123 456\n+250 789 987 654',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'info@trec-rwanda.com\nsales@trec-rwanda.com',
    },
    {
      icon: Clock,
      label: 'Working Hours',
      value: 'Monday - Friday: 8:00 - 18:00\nSaturday: 9:00 - 14:00',
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        backgroundColor: 'var(--bg-primary)',
        paddingTop: '15vh',
        paddingBottom: '10vh',
      }}
    >
      <div className="px-[2vw]">
        {/* Header */}
        <div className="mb-16">
          <p
            className="text-ui mb-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            Get In Touch
          </p>
          <h2
            className="font-serif text-h2 mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            Contact Us
          </h2>
          <p
            className="text-body max-w-xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            Ready to start your next project? Reach out to our team for
            consultations, quotes, or any inquiries about our services.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Form */}
          <div ref={formRef} className="lg:w-3/5">
            {submitted ? (
              <div
                className="flex flex-col items-center justify-center py-24"
                style={{
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'rgba(255, 77, 0, 0.03)',
                }}
              >
                <CheckCircle
                  size={48}
                  style={{ color: 'var(--accent-orange)', marginBottom: '16px' }}
                />
                <h3
                  className="font-serif text-h3 mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Message Sent!
                </h3>
                <p
                  className="text-body"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Thank you for reaching out. We will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label
                      className="text-ui block mb-2"
                      style={{ color: 'var(--text-secondary)', fontSize: '11px' }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent outline-none transition-colors"
                      style={{
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-primary)',
                        fontFamily: 'Manrope, sans-serif',
                      }}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      className="text-ui block mb-2"
                      style={{ color: 'var(--text-secondary)', fontSize: '11px' }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent outline-none transition-colors"
                      style={{
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-primary)',
                        fontFamily: 'Manrope, sans-serif',
                      }}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label
                      className="text-ui block mb-2"
                      style={{ color: 'var(--text-secondary)', fontSize: '11px' }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent outline-none transition-colors"
                      style={{
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-primary)',
                        fontFamily: 'Manrope, sans-serif',
                      }}
                      placeholder="+250 788 123 456"
                    />
                  </div>
                  <div>
                    <label
                      className="text-ui block mb-2"
                      style={{ color: 'var(--text-secondary)', fontSize: '11px' }}
                    >
                      Service Needed
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent outline-none transition-colors"
                      style={{
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-primary)',
                        fontFamily: 'Manrope, sans-serif',
                        backgroundColor: 'var(--bg-primary)',
                      }}
                    >
                      <option value="">Select a service</option>
                      <option value="execution">Project Execution</option>
                      <option value="consultancy">Consultancy</option>
                      <option value="valuation">Property Valuation</option>
                      <option value="waterproofing">Waterproofing</option>
                      <option value="lift">Lift Installation</option>
                      <option value="trade">General Trade</option>
                    </select>
                  </div>
                </div>
                <div className="mb-6">
                  <label
                    className="text-ui block mb-2"
                    style={{ color: 'var(--text-secondary)', fontSize: '11px' }}
                  >
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-transparent outline-none transition-colors resize-none"
                    style={{
                      border: '1px solid var(--border-light)',
                      color: 'var(--text-primary)',
                      fontFamily: 'Manrope, sans-serif',
                    }}
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn-pill btn-pill-primary flex items-center gap-3"
                >
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div ref={infoRef} className="lg:w-2/5">
            <div className="space-y-8">
              {contactInfo.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex gap-4">
                    <div
                      className="w-12 h-12 flex-shrink-0 flex items-center justify-center"
                      style={{
                        border: '1px solid var(--border-light)',
                      }}
                    >
                      <Icon size={20} style={{ color: 'var(--accent-orange)' }} />
                    </div>
                    <div>
                      <p
                        className="text-ui mb-1"
                        style={{ color: 'var(--text-secondary)', fontSize: '10px' }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="text-sm whitespace-pre-line"
                        style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}
                      >
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Motto */}
            <div
              className="mt-12 p-8"
              style={{
                border: '2px solid var(--accent-orange)',
                backgroundColor: 'rgba(255, 77, 0, 0.03)',
              }}
            >
              <p
                className="font-serif text-2xl italic text-center"
                style={{ color: 'var(--accent-orange)' }}
              >
                "Your Satisfaction Our Priority"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
