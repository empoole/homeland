import { useDispatch } from "react-redux";
import useFrameButtonTimer from "../../hooks/useFrameTimerButton";
import type { CSSProperties } from "react";
import type { Action } from "@reduxjs/toolkit";

type ButtonProps = {
  text: string;
  cooldown: number;
  func: () => Action | null;
};

const Button = ({ text, cooldown, func }: ButtonProps) => {
  const dispatch = useDispatch();

  const action = func()
  if (!action) return <button disabled>Not enough resources</button>

  const { progress, isActive, startTimer } = useFrameButtonTimer(
    cooldown,
    () => {
      if (action) dispatch(action);
    }
  );

  const buttonStyle: CSSProperties = {
    position: "relative",
    background: "#382b26",
    color: "#b8c2b9",
    cursor: isActive ? "not-allowed" : "pointer",
    overflow: "hidden",
  };

  const progressStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: `${progress * 100}%`,
    backgroundColor: "#b8c2b9",
    transition: "none",
    zIndex: 0,
  };

  const handleClick = () => {
    if (!isActive) {
      startTimer();
    }
  };

  const remainingTime = (((1 - progress) * cooldown) / 1000).toFixed(1);

  return (
    <button disabled={isActive} onClick={handleClick} style={buttonStyle}>
      <div style={progressStyle} />
      <span
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        {isActive ? `Wait (${remainingTime}s)` : <>{text}</>}
      </span>
    </button>
  );
};

export default Button;
