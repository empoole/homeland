import { configureStore } from "@reduxjs/toolkit"
import gameStateReducer from "./slices/GameState"


const store = configureStore({
    reducer: {
        gameState: gameStateReducer,
    }
})

export default store
export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']