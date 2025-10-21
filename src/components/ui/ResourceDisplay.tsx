/**
 * RESOURCE DISPLAY
 *
 * Generic component for displaying resources in the game state.
 */

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { toTitleCase } from "../../lib/strings";
import type { GameState, LockName } from "../../types/gameState";

type CategoryName = "resources" | "buildings" | "populations";
type CategoryObject<T extends CategoryName> = GameState[T];

type Props = {
	resourceName: CategoryName;
};

const ResourceDisplay = React.memo(({ resourceName }: Props) => {
	const categoryObject = useSelector(
		(state: RootState) =>
			state.gameState[resourceName] as CategoryObject<typeof resourceName>
	);

	const locks = useSelector((state: RootState) => state.gameState.locks);

	const listItems = useMemo(() => {
		return Object.entries(categoryObject).map(([itemKey, count]) => {
			if (locks[itemKey as LockName] === true) {
				return null;
			}

			return (
				<li key={itemKey}>
					{toTitleCase(itemKey)}: {Math.trunc(count) as number}
				</li>
			);
		});
	}, [categoryObject, locks]);

	return (
		<div>
			<h3>{toTitleCase(resourceName)}</h3>
			<ul>{listItems}</ul>
		</div>
	);
});

export default ResourceDisplay;
