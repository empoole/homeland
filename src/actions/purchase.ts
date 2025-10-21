/**
 * Reduces resources by the price of a given purchase
 */
import { createAction } from "@reduxjs/toolkit";

export const purchase = createAction(
  "GameState/Purchase",
  ({
    entityName,
    entityType,
    quantity,
  }: {
    entityName: string;
    entityType: string;
    quantity: number;
  }) => ({
    payload: { entityName, entityType, quantity },
  })
);
