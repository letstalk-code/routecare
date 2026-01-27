'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { mockData } from '@routecare/shared';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { tripsToday, activeDrivers, onTimeRateScheduled } = mockData.kpis;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-x-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 opacity-30">
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex flex-col items-center justify-center px-6"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-5xl"
          style={{ y: y1 }}
        >
          {/* Logo/Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-slate-300">
              Next-Generation NEMT Dispatch
            </span>
          </motion.div>

          {/* Main Headline with Gradient Animation */}
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradient 8s ease infinite',
            }}
          >
            RouteCare
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Real-time fleet tracking, intelligent dispatch, and seamless
            coordination for medical transportation excellence
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              href="/login"
              className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Dispatcher App</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity blur" />
            </Link>

            <Link
              href="/driver"
              className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              Driver App →
            </Link>
          </motion.div>
        </motion.div>

        {/* Animated Stats */}
        <motion.div
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full"
          style={{ y: y2 }}
        >
          <StatCard
            value={tripsToday}
            label="Trips Today"
            delay={1}
            suffix=""
          />
          <StatCard
            value={activeDrivers}
            label="Active Drivers"
            delay={1.2}
            suffix=""
          />
          <StatCard
            value={onTimeRateScheduled}
            label="On-Time Rate"
            delay={1.4}
            suffix="%"
          />
        </motion.div>

        {/* Animated Map Motif */}
        <MapMotif />

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.5, y: { repeat: Infinity, duration: 2 } }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full p-1">
            <motion.div
              className="w-1 h-2 bg-white/50 rounded-full mx-auto"
              animate={{ y: [0, 16, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Built for{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Efficiency
            </span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Real-Time Tracking"
              description="Monitor your entire fleet with live GPS updates and route optimization"
              icon="📍"
              delay={0.1}
            />
            <FeatureCard
              title="Smart Dispatch"
              description="AI-powered driver suggestions based on location, skills, and availability"
              icon="🤖"
              delay={0.2}
            />
            <FeatureCard
              title="STAT Priority"
              description="Automatic escalation for urgent hospital discharges and time-sensitive trips"
              icon="⚡"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}

function StatCard({
  value,
  label,
  delay,
  suffix,
}: {
  value: number;
  label: string;
  delay: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        setHasAnimated(true);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, hasAnimated]);

  return (
    <motion.div
      className="glass-panel p-6 rounded-2xl text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-slate-400 text-sm font-medium">{label}</div>
    </motion.div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
  delay,
}: {
  title: string;
  description: string;
  icon: string;
  delay: number;
}) {
  return (
    <motion.div
      className="glass-panel p-8 rounded-2xl hover:scale-105 transition-transform"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

function MapMotif() {
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  return (
    <motion.div
      className="absolute bottom-32 right-12 w-64 h-48 opacity-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.1 }}
      transition={{ delay: 2 }}
    >
      <svg viewBox="0 0 200 150" className="w-full h-full">
        {/* Route lines */}
        <motion.path
          d="M20,30 Q80,20 120,50 T180,80"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: prefersReducedMotion ? 1 : 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 3,
            repeat: prefersReducedMotion ? 0 : Infinity,
            repeatDelay: 1,
          }}
        />
        <motion.path
          d="M30,100 Q90,110 140,90 T190,120"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: prefersReducedMotion ? 1 : 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 3,
            delay: prefersReducedMotion ? 0 : 0.5,
            repeat: prefersReducedMotion ? 0 : Infinity,
            repeatDelay: 1,
          }}
        />

        {/* Animated dots */}
        {!prefersReducedMotion && (
          <>
            <motion.circle
              cx="0"
              cy="0"
              r="4"
              fill="currentColor"
              animate={{
                offsetDistance: ['0%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 1,
                ease: 'linear',
              }}
              style={{ offsetPath: 'path("M20,30 Q80,20 120,50 T180,80")' }}
            />
          </>
        )}

        {/* STAT badge */}
        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 2.5, duration: 0.5 }}
        >
          <circle cx="140" cy="70" r="12" fill="currentColor" opacity="0.8" />
          <motion.circle
            cx="140"
            cy="70"
            r="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            animate={{ r: [12, 18], opacity: [0.8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.g>
      </svg>
    </motion.div>
  );
}
