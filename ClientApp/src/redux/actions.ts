import { PlayerState } from "../models/player";
import { GameState } from "../models/game";
import { v4 as uuidv4 } from "uuid";

export enum actionTypes {
    WAITING_START = 'game/WAITING_START',
    GAME_START = 'game/GAME_START',
    COUNTDOWN_START = 'game/COUNTDOWN_START',
    GAME_END = 'game/GAME_END',
    UPDATE_GAME = 'game/UPDATE_GAME'
}

export type gameAction =
    | { type: actionTypes.WAITING_START }
    | { type: actionTypes.COUNTDOWN_START, text: string, id: string }
    | { type: actionTypes.GAME_START }
    | { type: actionTypes.GAME_END, hasWon: boolean }
    | { type: actionTypes.UPDATE_GAME, currentPlayerIndex: number, otherPlayerIndex: number }

export const startWaitingActionCreator = () => ({ type: actionTypes.WAITING_START });
export const startCountdownActionCreator = (text: string, id: string) => ({ type: actionTypes.COUNTDOWN_START, text: text, id: id });
export const startGameActionCreator = () => ({ type: actionTypes.GAME_START });

export const updateGameActionCreator = (current: number, other: number) => (
    { type: actionTypes.UPDATE_GAME, currentPlayerIndex: current, otherPlayerIndex: other });

export const endGameActionCreator = (hasWon: boolean) => ({ type: actionTypes.GAME_END, hasWon: hasWon });

export const initialPlayerState: PlayerState = { PlayerState: null, HasWon: null, Id: uuidv4() };

export const initialGameState:
    GameState = { Text: null, CurrentPlayerIndex: 0, OtherPlayerIndex: 0, Countdown: undefined, Id: null };

