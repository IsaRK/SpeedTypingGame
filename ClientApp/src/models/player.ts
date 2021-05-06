
export type PlayerState = {
    PlayerState: PlayerStateEnum | null
    HasWon: boolean | null
    Id: string
};

export enum PlayerStateEnum {
    Starting,
    Waiting,
    CountingDown,
    Playing
}