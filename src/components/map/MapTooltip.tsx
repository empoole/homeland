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
        color: "#000000",
        padding: "0.5rem 0.25rem",
        fontSize: "12px"
    }

    return (
        <span style={style} onClick={onToggle}>
            <span style={{
                border: "1px solid black",
                padding: "0.25rem 0.125rem",
                display: "block"
            }}>{text}</span>
        </span>
    )
}

export default MapTooltip