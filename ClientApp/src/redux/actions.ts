import { PlayerState } from "../models/player";
import { GameState } from "../models/game";
import { v4 as uuidv4 } from "uuid";

export enum actionTypes {
    WAITING_START = 'game/WAITING_START',
    GAME_START = 'game/GAME_START',
    COUNTDOWN_UPDATE = 'game/COUNTDOWN_UPDATE',
    GAME_END = 'game/GAME_END',
    UPDATE_GAME = 'game/UPDATE_GAME',
}

export type action =
    | { type: actionTypes.WAITING_START }
    | { type: actionTypes.GAME_START, text: string }
    //| { type: actionTypes.COUNTDOWN_UPDATE, countDown: number, text: string | null }
    | { type: actionTypes.GAME_END, hasWon: boolean }
    | { type: actionTypes.UPDATE_GAME, currentPlayerIndex: number, otherPlayerIndex: number }

export const startWaitingActionCreator = () => ({ type: actionTypes.WAITING_START });
export const startGameActionCreator = (text: string) => ({ type: actionTypes.GAME_START, text: text });

/*
export const updateCountdownUpdateActionCreator =
    (countdown: number, text: string | null) => ({ type: actionTypes.COUNTDOWN_UPDATE, countdown: countdown, text: text });
*/
export const updateGameActionCreator = (current: number, other: number) => (
    { type: actionTypes.UPDATE_GAME, currentPlayerIndex: current, otherPlayerIndex: other });

export const endGameActionCreator = (hasWon: boolean) => ({ type: actionTypes.GAME_END, hasWon: hasWon });

export const initialPlayerState: PlayerState = { PlayerState: null, HasWon: null, Id: uuidv4() };

export const initialGameState:
    GameState = { Text: null, CurrentPlayerIndex: undefined, OtherPlayerIndex: undefined, Countdown: undefined };

