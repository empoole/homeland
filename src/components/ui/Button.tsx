import { useDispatch } from "react-redux";
import useFrameButtonTimer from "../../hooks/useFrameTimerButton";
import type { CSSProperties } from "react";
import type { Action } from "@reduxjs/toolkit";

type ButtonProps = {
  text: string;
  cooldown: number;
  func: () => Action;
};

const Button = ({ text, cooldown, func }: ButtonProps) => {
  const dispatch = useDispatch();

  const { progress, isActive, startTimer } = useFrameButtonTimer(
    cooldown,
    () => {
      dispatch(func());
    }
  );

  const buttonStyle: CSSProperties = {
    position: "relative",
    background: "#b8c2b9",
    color: "#382b26",
    cursor: isActive ? "not-allowed" : "pointer",
    overflow: "hidden",
  };

  const progressStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: `${progress * 100}%`,
    backgroundColor: "#382b26",
    transition: "none",
    opacity: 0.5,
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
        {isActive ? (
          // Show countdown message when active
          `Wait (${remainingTime}s)`
        ) : (
          // Show children (e.g., icon) and text when ready
          <>{text}</>
        )}
      </span>
    </button>
  );
};

export default Button;
