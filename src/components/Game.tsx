import { useDispatch } from "react-redux"

import timing from "../configs/timing"
import Button from "./ui/Button"
import ResourceDisplay from "./ui/ResourceDisplay"
import { addWood, buildHouse, updatePopulation } from "../slices/GameState"

const Game = () => {
    const dispatch = useDispatch()

    setInterval(() => {
        dispatch(updatePopulation())
    }, 1000)

    return (
        <section>
            <ResourceDisplay resourceName="resources" />
            <ResourceDisplay resourceName="buildings" />
            <ResourceDisplay resourceName="populations" />
            <ul>
                <Button
                    text="Gather Wood"
                    cooldown={timing.cooldowns.gather.wood}
                    func={addWood} />
            </ul>
            <ul>
                <Button
                    text="Build House"
                    cooldown={timing.cooldowns.build.house}
                    func={buildHouse} />
            </ul>
        </section>
    )
}

export default Game