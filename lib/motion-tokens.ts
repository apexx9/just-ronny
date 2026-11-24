import type { Transition } from "framer-motion";

export const motionTransitions = {
  springGentle: { type: "spring", stiffness: 170, damping: 26, mass: 0.9 } as Transition,
  springMorph: { type: "spring", stiffness: 220, damping: 32, mass: 1 } as Transition,
};
