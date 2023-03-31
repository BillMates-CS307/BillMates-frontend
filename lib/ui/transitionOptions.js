import bezier from "bezier-easing";

export const Linear = bezier(0, 0, 1, 1);

export const EaseOutCubic = bezier(0.33, 1, 0.68, 1);

export const EaseInCubic = bezier(0.32, 0, 0.67, 0);

export function opacityAnimation(options) {
  const {
    duration,
    maxOpacity,
    initialStyle = {},
    enterEasing = Linear,
    leaveEasing = Linear,
  } = options;
  return {
    from: { opacity: 0, ...initialStyle },
    enter: { opacity: maxOpacity },
    leave: { opacity: 0 },
    config: (item, _, state) => {
      switch (state) {
        case "enter":
          return { duration, easing: enterEasing };
        case "leave":
          return { duration, easing: leaveEasing };
      }
    },
  };
}
