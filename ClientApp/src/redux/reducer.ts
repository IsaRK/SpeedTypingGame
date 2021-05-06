import { combineReducers } from "redux";
import { GameState } from "../models/game";
import { PlayerState, PlayerStateEnum } from "../models/player";
import { initialPlayerState, action, actionTypes, initialGameState } from "./actions";

export function playerReducer(state = initialPlayerState, action: action): PlayerState {
    switch (action.type) {
        case actionTypes.WAITING_START:
            return { ...state, PlayerState: PlayerStateEnum.Waiting };
        case actionTypes.COUNTDOWN_START:
            return { ...state, PlayerState: PlayerStateEnum.CountingDown };
        case actionTypes.GAME_START:
            return { ...state, PlayerState: PlayerStateEnum.Playing };
        case actionTypes.GAME_END:
            return { ...state, PlayerState: PlayerStateEnum.Starting, HasWon: action.hasWon };
        default:
            return state;
    }
}

export function gameReducer(state = initialGameState, action: action): GameState {
    switch (action.type) {
        case actionTypes.COUNTDOWN_START:
            return { ...state, Countdown: 5, Text: action.text };
        case actionTypes.UPDATE_GAME:
            return { ...state, CurrentPlayerIndex: action.currentPlayerIndex, OtherPlayerIndex: action.otherPlayerIndex };
        default:
            return state;
    }
}

export const rootReducer = combineReducers({
    gameState: gameReducer,
    playerState: playerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;