/**
 * RESOURCE DISPLAY
 * 
 * Generic component for displaying resources in the game state.
 */

import { useSelector } from "react-redux"
import type { RootState } from "../../store"
import { toTitleCase } from "../../lib/strings"

type Props = {
    resourceName : string;
}

const ResourceDisplay = ({ resourceName }: Props) => {
    const resources = useSelector(
        (state: RootState) => 
            state.gameState[resourceName as keyof RootState["gameState"]]
    )

    return (
        <div>
            <h3>{toTitleCase(resourceName)}</h3>
            <ul>
                {
                    Object.entries(resources).map(([resource, count]) => (
                        <li key={resource}>{toTitleCase(resource)}: {count}</li>
                    ))
                }
            </ul>
        </div>
    )
}

export default ResourceDisplay