import { useState, useRef, useEffect, useCallback } from "react";
import useFrameTime from "./useFrameTime";

const useFrameButtonTimer = (durationMs: number, onComplete: () => void) => {
	const frameTime = useFrameTime();
	const [isActive, setIsActive] = useState(false);
	const startTimeRef = useRef(0);
	const progressRef = useRef(0);
	const onCompleteCallback = useCallback(onComplete, [onComplete]);

	const startTimer = useCallback(() => {
		if (!isActive) {
			startTimeRef.current = frameTime;
			setIsActive(true);
		}
	}, [frameTime, isActive]);

	useEffect(() => {
		if (!isActive) return;

		const elapsedTime = frameTime - startTimeRef.current;
		let progress = Math.min(elapsedTime / durationMs, 1);

		if (progress >= 1) {
			progress = 1;
			setIsActive(false);
			progressRef.current = 0;
			onCompleteCallback();
		} else {
			progressRef.current = progress;
		}
	}, [frameTime, isActive, durationMs, onCompleteCallback]);

	return {
		progress: progressRef.current,
		isActive,
		startTimer,
	};
};

export default useFrameButtonTimer;
