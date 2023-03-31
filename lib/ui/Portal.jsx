import { useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";

export const Portal = (props) => {
  const ref = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector("#portal");
    setMounted(true);
  }, []);

  return mounted && ref.current
    ? ReactDOM.createPortal(props.children, ref.current)
    : null;
};
