import { animated, useTransition } from "react-spring";

export const TransitionAnimate = (props) => {
  const transitions = useTransition(props.active, props.with);
  return (
    <>
      {transitions(
        (styles, item) =>
          item && <animated.div style={styles}>{props.children}</animated.div>
      )}
    </>
  );
};
