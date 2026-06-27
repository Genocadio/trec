import Navigation from '../sections/Navigation';
import Hero from '../sections/Hero';
import Manifesto from '../sections/Manifesto';
import OrangeCurve from '../sections/OrangeCurve';
import Services from '../sections/Services';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';
import Footer from '../sections/Footer';
import { useLenis } from '../hooks/useLenis';

export default function Home() {
  useLenis();

  return (
    <div className="relative">
      <Navigation />
      <Hero />
      {/* <Manifesto /> */}
      <OrangeCurve />
      <Services />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}
