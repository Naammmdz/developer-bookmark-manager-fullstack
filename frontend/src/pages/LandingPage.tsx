import React from 'react';
import { ArrowRight, BarChart, File, Globe, HeartHandshake, Rss, Shield, Bookmark, Code, Database, Terminal, Github, Folder } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedShinyText from '../components/ui/AnimatedShinyText';
import { TextAnimate } from '../components/ui/text-animate';
import { Particles } from '../components/ui/particles';
import { Meteors } from '../components/ui/meteors';
import BorderBeam from '../components/ui/BorderBeam';
import Marquee from '../components/ui/Marquee';
import CtaCard from '../components/ui/CtaCard';
import { useInView } from '../hooks/useInView';

// Import hero images
import heroDarkImg from '../imgs/hero-dark.png';
import heroLightImg from '../imgs/hero-light.png';
import ClientSection from '../components/landing/ClientSection';
import PricingSection from '../components/landing/PricingSection';
import LandingHeader from '../components/landing/LandingHeader';
import Footer from '../components/landing/Footer';

const HeroSection: React.FC = () => {
  const { ref, inView } = useInView({
    unobserveOnEnter: true,
    rootMargin: '-100px'
  });

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
          <span>✨ Introducing Developer Bookmark Manager</span>
          <ArrowRight className="ml-1 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" size={12} />
        </AnimatedShinyText>
      </div>
      
      <TextAnimate 
        animation="slideUp" 
        by="word"
        as="h1"
        className="-translate-y-4 text-balance bg-gradient-to-br from-white to-white/60 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent sm:text-6xl md:text-7xl lg:text-8xl"
        startOnView
        once
      >
        Organize your dev resources like never before.
      </TextAnimate>
      
      <TextAnimate 
        animation="blurIn" 
        as="p" 
        className="mb-12 text-lg tracking-tight text-gray-400 md:text-xl" 
        startOnView 
        once
        delay={0.2}
      >
        The ultimate bookmark manager for developers. Save, organize, and access your favorite coding resources with beautiful UI and powerful features. Built with React, TypeScript, and Tailwind CSS.
      </TextAnimate>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          to="/"
          className="-translate-y-4 animate-fade-in gap-2 rounded-lg bg-primary hover:bg-primary/90 py-3 px-6 text-primary-foreground font-medium opacity-0 ease-in-out transition-colors group flex items-center [--animation-delay:800ms]"
        >
          Get Started for free 
          <ArrowRight className="ml-1 transition-transform duration-300 ease-in-out group-hover:translate-x-1" size={16} />
        </Link>
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
          />
          
          {/* Dark mode image */}
          <img
            src={heroDarkImg}
            alt="Developer Bookmark Manager - Dark Theme"
            className="relative hidden size-full rounded-[inherit] border object-contain dark:block"
          />
          
          {/* Light mode image */}
          <img
            src={heroLightImg}
            alt="Developer Bookmark Manager - Light Theme"
            className="relative block size-full rounded-[inherit] border object-contain dark:hidden"
          />
        </div>
      </div>
    </section>
  );
};


// Helper function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  let currentIndex = shuffled.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }
  return shuffled;
};

const CTASection: React.FC = () => {
  const tiles = [
    {
      icon: Code,
      bg: 'pointer-events-none absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-orange-600 via-rose-600 to-violet-600 opacity-70 blur-[20px]'
    },
    {
      icon: Terminal,
      bg: 'pointer-events-none absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-70 blur-[20px]'
    },
    {
      icon: Github,
      bg: 'pointer-events-none absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-green-500 via-teal-500 to-emerald-600 opacity-70 blur-[20px]'
    },
    {
      icon: Database,
      bg: 'pointer-events-none absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 opacity-70 blur-[20px]'
    },
    {
      icon: Folder,
      bg: 'pointer-events-none absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-orange-600 via-rose-600 to-violet-600 opacity-70 blur-[20px]'
    },
    {
      icon: File,
      bg: 'pointer-events-none absolute left-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 opacity-70 blur-[20px]'
    }
  ];

  const randomTiles1 = shuffleArray(tiles);
  const randomTiles2 = shuffleArray(tiles);
  const randomTiles3 = shuffleArray(tiles);
  const randomTiles4 = shuffleArray(tiles);

  return (
    <section id="cta">
      <div className="py-14">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <Marquee reverse className="-delay-[200ms] [--duration:10s]" repeat={5}>
              {randomTiles1.map(({ icon: Icon, bg }, id) => (
                <CtaCard key={id}>
                  <Icon className="size-full" />
                  <div className={bg} />
                </CtaCard>
              ))}
            </Marquee>
            <Marquee reverse className="[--duration:25s]" repeat={5}>
              {randomTiles2.map(({ icon: Icon, bg }, id) => (
                <CtaCard key={id}>
                  <Icon className="size-full" />
                  <div className={bg} />
                </CtaCard>
              ))}
            </Marquee>
            <Marquee reverse className="-delay-[200ms] [--duration:20s]" repeat={5}>
              {randomTiles1.map(({ icon: Icon, bg }, id) => (
                <CtaCard key={id}>
                  <Icon className="size-full" />
                  <div className={bg} />
                </CtaCard>
              ))}
            </Marquee>
            <Marquee reverse className="[--duration:30s]" repeat={5}>
              {randomTiles2.map(({ icon: Icon, bg }, id) => (
                <CtaCard key={id}>
                  <Icon className="size-full" />
                  <div className={bg} />
                </CtaCard>
              ))}
            </Marquee>
            <Marquee reverse className="-delay-[200ms] [--duration:20s]" repeat={5}>
              {randomTiles3.map(({ icon: Icon, bg }, id) => (
                <CtaCard key={id}>
                  <Icon className="size-full" />
                  <div className={bg} />
                </CtaCard>
              ))}
            </Marquee>
            <Marquee reverse className="[--duration:30s]" repeat={5}>
              {randomTiles4.map(({ icon: Icon, bg }, id) => (
                <CtaCard key={id}>
                  <Icon className="size-full" />
                  <div className={bg} />
                </CtaCard>
              ))}
            </Marquee>
            <div className="absolute z-10">
              <div className="mx-auto size-24 rounded-[2rem] border bg-white/10 p-3 shadow-2xl backdrop-blur-md dark:bg-black/10 lg:size-32">
                <Bookmark className="mx-auto size-16 text-white lg:size-24" />
              </div>
              <div className="z-10 mt-4 flex flex-col items-center text-center text-primary">
                <h1 className="text-3xl font-bold lg:text-4xl">Stop losing your dev resources.</h1>
                <p className="mt-2">Organize all your coding bookmarks in one place. Start free today.</p>
                <Link
                  to="/"
                  className="group mt-4 rounded-[2rem] px-6 inline-flex items-center gap-2 rounded-lg bg-primary hover:bg-primary/90 py-3 text-primary-foreground font-medium transition-colors"
                >
                  Get Started
                  <ArrowRight className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
                </Link>
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
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <HeroSection />
      <ClientSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;

