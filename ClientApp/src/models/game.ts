export type GameState = {
    Text: string | null
    CurrentPlayerIndex: number | undefined
    OtherPlayerIndex: number | undefined
    Countdown: number | undefined
};

export type UpdateGameMessage = {
    CurrentPlayerIndex: number | undefined
    OtherPlayerIndex: number | undefined;
};

export type UpdateCountdown = {
    Countdown: number
    Text: string | null
};

export type newCharacterTypedMessage = {
    PlayerId: string
    Character: string
};