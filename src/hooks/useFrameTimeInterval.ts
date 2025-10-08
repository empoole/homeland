import { useRef, useEffect, useCallback } from "react";
import useFrameTime from "./useFrameTime";

const useFrameTimeInterval = (
  checkIntervalMs: number,
  onIntervalElapsed: () => void
): void => {
  const frameTime = useFrameTime();
  const lastCheckTimeRef = useRef(0);

  const callback = useCallback(onIntervalElapsed, [onIntervalElapsed]);
  useEffect(() => {
    if (frameTime === 0) {
      return;
    }

    if (lastCheckTimeRef.current === 0) {
      lastCheckTimeRef.current = frameTime;
      return;
    }

    const elapsedTime = frameTime - lastCheckTimeRef.current;

    if (elapsedTime >= checkIntervalMs) {
      callback();

      lastCheckTimeRef.current += checkIntervalMs;
    }
  }, [frameTime, checkIntervalMs, callback]);
};

export default useFrameTimeInterval;
