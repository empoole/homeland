import type { CSSProperties } from "react"

type Props = {
    x: number;
    y: number;
    text: string;
    isVisible: boolean;
    onToggle: () => void
}

const MapTooltip = ({x, y, text, isVisible, onToggle,} : Props) => {
    const style : CSSProperties = {
        position: "absolute",
        top: `${y}px`,
        left: `${x}px`,
        display: isVisible ? "block" : "none",
        backgroundColor: "#b8c2b9",
        color: "#382b26",
        padding: "0.5rem 0.25rem",
        fontSize: "12px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    }

    return (
        <span style={style} onClick={onToggle}>
            <span style={{
                border: "1px solid #382b26",
                padding: "0.25rem 0.125rem",
                display: "block"
            }}>{text}</span>
        </span>
    )
}

export default MapTooltip