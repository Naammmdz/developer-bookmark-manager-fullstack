import React, { useState, useRef } from 'react';
import { ArrowRight, Bookmark, Search, FolderOpen, Sync, Zap, Globe, Code, Star, Database, FileText, Hash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AnimatedShinyText from '../components/ui/AnimatedShinyText';
import { Particles } from '../components/ui/particles';
import { Meteors } from '../components/ui/meteors';
import { RetroGrid } from '../components/magicui/retro-grid';
import { TextAnimate } from '../components/magicui/text-animate';
import { VelocityScroll } from '../components/magicui/scroll-based-velocity';
import { useInView } from '../hooks/useInView';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';
import { cn } from '../lib/utils';
import { AnimatedBeam } from '../components/magicui/animated-beam';
import { Marquee } from '../components/magicui/marquee';
import { AnimatedList } from '../components/magicui/animated-list';
import { BentoCard, BentoGrid } from '../components/magicui/bento-grid';

import heroDarkImg from '../imgs/hero-dark.png';
import heroLightImg from '../imgs/hero-light.png';
import BorderBeam from '../components/ui/BorderBeam';
import ClientSection from '../components/landing/ClientSection';
import PricingSection from '../components/landing/PricingSection';
import LandingHeader from '../components/landing/LandingHeader';
import Footer from '../components/landing/Footer';
import Logo from '../imgs/Logo.png';

interface HeroSectionProps {
  onLoginClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onLoginClick }) => {
  const { ref, inView } = useInView({
    unobserveOnEnter: true,
    rootMargin: '-100px'
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    if (user) {
      navigate('/app');
    } else {
      onLoginClick();
    }
  };

  return (
    <section className="relative mx-auto mt-32 max-w-7xl px-6 text-center md:px-8">
      {/* Particles background effect */}
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color="#ffffff"
        size={0.4}
      />
      {/* Meteors background effect */}
      <Meteors number={20} />
      
      <div
        className="group inline-flex h-7 -translate-y-4 animate-fade-in items-center justify-between gap-1 rounded-full border border-white/5 bg-white/2 backdrop-blur-sm px-3 text-xs text-white opacity-0 transition-all ease-in hover:cursor-pointer hover:bg-white/5 [--animation-delay:200ms]"
      >
        <AnimatedShinyText className="inline-flex items-center justify-center">
          <span>✨ Introducing DevPin - Your Dev Resource Hub</span>
          <ArrowRight className="ml-1 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" size={12} />
        </AnimatedShinyText>
      </div>
      
      <h1 className="-translate-y-4 text-balance bg-gradient-to-br from-white to-white/60 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent sm:text-6xl md:text-7xl lg:text-8xl animate-fade-in opacity-0 [--animation-delay:400ms]">
        Organize your <span className="whitespace-nowrap">dev resources</span><br />like never before.
      </h1>
      
      <TextAnimate 
        animation="blurIn" 
        as="p" 
        className="mb-12 text-lg tracking-tight text-gray-400 md:text-xl" 
        startOnView 
        once
        delay={0.2}
      >
The ultimate resource manager for developers. Save, organize, and access your favorite bookmarks and code snippets with beautiful UI and powerful features. Built with React, TypeScript, and Tailwind CSS.
      </TextAnimate>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button
          onClick={handleGetStartedClick}
          className="-translate-y-4 animate-fade-in gap-2 rounded-lg bg-primary hover:bg-primary/90 py-3 px-6 text-primary-foreground font-medium opacity-0 ease-in-out transition-colors group flex items-center [--animation-delay:800ms]"
        >
          Get Started for free 
          <ArrowRight className="ml-1 transition-transform duration-300 ease-in-out group-hover:translate-x-1" size={16} />
        </button>
        <button
          className="-translate-y-4 animate-fade-in gap-2 rounded-lg border border-white/20 hover:bg-white/5 py-3 px-6 text-white font-medium opacity-0 ease-in-out transition-colors [--animation-delay:1000ms]"
        >
          View Demo
        </button>
      </div>
      
      {/* Hero Image Section */}
      <div
        ref={ref}
        className="relative mt-32 animate-fade-up opacity-0 [--animation-delay:400ms] [perspective:2000px] after:absolute after:inset-0 after:z-50 after:[background:linear-gradient(to_top,hsl(var(--background))_30%,transparent)]"
      >
        <div
          className={`rounded-xl border border-white/10 bg-white bg-opacity-[0.01] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:size-full before:opacity-0 before:[background-image:linear-gradient(to_bottom,var(--color-one,#ffaa40),var(--color-one,#ffaa40),transparent_40%)] before:[filter:blur(180px)] ${
            inView ? 'before:animate-image-glow' : ''
          }`}
        >
          <BorderBeam
            size={200}
            duration={12}
            delay={0}
            borderWidth={2}
            colorFrom="#ff6b6b"
            colorTo="#4ecdc4"
          />
          
          <img
            src={heroDarkImg}
            alt="DevPin - Developer Resource Manager"
            className="relative size-full rounded-[inherit] border object-contain"
          />
        </div>
      </div>
    </section>
  );
};



interface CTASectionProps {
  onLoginClick: () => void;
}


const CTASection: React.FC<CTASectionProps> = ({ onLoginClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    if (user) {
      navigate('/app');
    } else {
      onLoginClick();
    }
  };

  return (
    <section id="cta">
      <div className="py-14">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden min-h-[700px]">
            <VelocityScroll
              defaultVelocity={1}
              numRows={8}
              className="text-center font-display text-4xl font-bold tracking-[-0.02em] text-white/20 drop-shadow-sm dark:text-white/20 md:text-7xl md:leading-[5rem]"
            >
              ORGANIZE • SEARCH • BOOKMARK • CODE • SYNC • SHARE • DISCOVER • SAVE • MANAGE •
            </VelocityScroll>
            
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
            <div className="absolute z-10 flex flex-col items-center justify-center">
              <div className="mx-auto p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl">
                <img src={Logo} alt="DevPin" className="size-32 lg:size-40 object-contain rounded-2xl" />
              </div>
              <div className="z-10 mt-4 flex flex-col items-center text-center text-primary">
                <TextAnimate 
                  animation="blurInUp" 
                  by="word" 
                  as="h1" 
                  className="text-3xl font-bold lg:text-4xl"
                  startOnView
                  once
                >
                  Stop losing your bookmarks and code snippets.
                </TextAnimate>
                <TextAnimate 
                  animation="slideUp" 
                  by="word" 
                  as="p" 
                  className="mt-2"
                  startOnView
                  once
                  delay={0.3}
                >
                  Organize all your bookmarks and code snippets in one place. Start free today.
                </TextAnimate>
                <button
                  onClick={handleGetStartedClick}
                  className="group mt-4 rounded-[2rem] px-6 inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 py-3 text-primary-foreground font-medium transition-colors"
                >
                  Get Started
                  <ArrowRight className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
                </button>
              </div>
              <div className="bg-background absolute inset-0 -z-10 rounded-full opacity-40 blur-xl dark:bg-background" />
            </div>
            <div className="to-background absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent to-70% dark:to-background" />
          </div>
        </div>
      </div>
    </section>
  );
};

const LandingPage: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    navigate('/app');
  };

  const handleRegisterSuccess = () => {
    setIsRegisterModalOpen(false);
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <HeroSection onLoginClick={handleLoginClick} />
      <ClientSection />
      <PricingSection />
      <CTASection onLoginClick={handleLoginClick} />
      <Footer />
      
      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        openRegisterModal={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        openLoginModal={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
        onRegisterSuccess={handleRegisterSuccess}
      />
    </div>
  );
};

export default LandingPage;

