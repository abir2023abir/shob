import type { Variants, Transition } from "motion/react";

/** Shared easing — one curve across the whole product so motion feels authored. */
export const EASE: [number, number, number, number] = [0.2, 0.7, 0.3, 1];

export const spring: Transition = { type: "spring", stiffness: 380, damping: 34, mass: 0.9 };
export const softSpring: Transition = { type: "spring", stiffness: 180, damping: 26 };

/** Parent that releases its children one after another. */
export const stagger = (delayChildren = 0, staggerChildren = 0.06): Variants => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
});

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.42, ease: EASE } },
};

/** Display headings that assemble line by line. */
export const lineUp: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.72, ease: EASE } },
};

export const cardIn: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.18, ease: EASE } },
};

export const page: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.34, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: EASE } },
};

export const overlay: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

export const drawer: Variants = {
  hidden: { x: "100%" },
  show: { x: 0, transition: spring },
  exit: { x: "100%", transition: { duration: 0.24, ease: EASE } },
};

export const sheet: Variants = {
  hidden: { y: "100%" },
  show: { y: 0, transition: spring },
  exit: { y: "100%", transition: { duration: 0.22, ease: EASE } },
};

export const modal: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring },
  exit: { opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.18, ease: EASE } },
};

export const toastIn: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring },
  exit: { opacity: 0, y: 12, scale: 0.96, transition: { duration: 0.18 } },
};
