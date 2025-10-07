import { useState } from "react"
import { useDispatch } from "react-redux"

type ButtonProps = {
    text: string;
    cooldown: number,
    func: Function,
}

const Button = ({text, cooldown, func} : ButtonProps) => {
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const dispatch = useDispatch()

    const handleClick = () => {
        setIsButtonDisabled(true)
        dispatch(func())
        setTimeout(() => {
            setIsButtonDisabled(false)
        }, cooldown * 1000)
    }
    
    return (
        <button
            disabled={isButtonDisabled}
            onClick={handleClick}
        >
            {text}
        </button>
    )
}

export default Button