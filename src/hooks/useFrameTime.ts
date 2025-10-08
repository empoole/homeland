import { useEffect, useState, useRef } from "react";

const useFrameTime = () => {
  const [frameTime, setFrameTime] = useState(0);
  const isFirstFrameRef = useRef(true);
  useEffect(() => {
    let frameId: number;
    const frame = (time: number) => {
      if (isFirstFrameRef.current) {
        isFirstFrameRef.current = false;
      } else {
        setFrameTime(time);
      }
      frameId = requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, []);
  return frameTime;
};

export default useFrameTime;
