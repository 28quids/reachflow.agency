import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
    rect.bottom >= 0
  );
}

// Animation variants for Framer Motion
export const fadeInUp = {
  hidden: { 
    opacity: 0, 
    transform: 'translate3d(0, 40px, 0)',
    willChange: 'transform, opacity'
  },
  visible: { 
    opacity: 1, 
    transform: 'translate3d(0, 0, 0)',
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8
    }
  }
};

// Add prefers-reduced-motion utility
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
