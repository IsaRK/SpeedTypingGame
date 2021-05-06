export type GameState = {
    Text: string | null
    CurrentPlayerIndex: number
    OtherPlayerIndex: number
    Countdown: number | undefined
};

export type UpdateCountdown = {
    Countdown: number
    Text: string | null
};

export type newCharacterTypedMessage = {
    PlayerId: string
    Character: string
};