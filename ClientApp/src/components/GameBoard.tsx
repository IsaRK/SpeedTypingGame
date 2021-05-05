import { Grid, TextField } from "@material-ui/core";
import React, { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducer";

interface IGameBoardProp {
  sendUpdate: (playerId: string, character: string) => Promise<void>;
}

export const GameBoard: React.FunctionComponent<IGameBoardProp> = (props) => {
  const gameState = useSelector((state: RootState) => state.gameState);
  const playerState = useSelector((state: RootState) => state.playerState);

  const inputChangeHandler = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    props.sendUpdate(playerState.Id, event.type.slice(event.type.length - 1));
  };

  if (
    gameState.CurrentPlayerIndex === undefined ||
    gameState.OtherPlayerIndex === undefined
  )
    throw new Error("Invalid indexes received");

  const text = gameState.Text;
  if (text === null) throw new Error("Invalid Text");

  let targetText,
    firstSubString,
    firstPlayer,
    betweenPlayers,
    secondPlayer,
    lastSubString,
    players;

  if (gameState.CurrentPlayerIndex > gameState.OtherPlayerIndex) {
    firstSubString = text.substring(0, gameState.OtherPlayerIndex);
    firstPlayer = text.substring(
      gameState.OtherPlayerIndex,
      gameState.OtherPlayerIndex + 1
    );
    betweenPlayers = text.substring(
      gameState.OtherPlayerIndex + 1,
      gameState.CurrentPlayerIndex
    );
    secondPlayer = text.substring(
      gameState.CurrentPlayerIndex,
      gameState.CurrentPlayerIndex + 1
    );
    lastSubString = text.substring(gameState.CurrentPlayerIndex + 1);
    targetText = (
      <div contentEditable>
        {firstSubString}
        <span style={{ color: "red" }}>{firstPlayer}</span>
        {betweenPlayers}
        <span style={{ color: "green" }}>{secondPlayer}</span>
        {lastSubString}
      </div>
    );
  } else if (gameState.CurrentPlayerIndex > gameState.OtherPlayerIndex) {
    firstSubString = text.substring(0, gameState.CurrentPlayerIndex);
    firstPlayer = text.substring(
      gameState.CurrentPlayerIndex,
      gameState.CurrentPlayerIndex + 1
    );
    betweenPlayers = text.substring(
      gameState.CurrentPlayerIndex + 1,
      gameState.OtherPlayerIndex
    );
    secondPlayer = text.substring(
      gameState.OtherPlayerIndex,
      gameState.OtherPlayerIndex + 1
    );
    lastSubString = text.substring(gameState.OtherPlayerIndex + 1);
    targetText = (
      <div contentEditable>
        {firstSubString}
        <span style={{ color: "green" }}>{firstPlayer}</span>
        {betweenPlayers}
        <span style={{ color: "red" }}>{secondPlayer}</span>
        {lastSubString}
      </div>
    );
  } else {
    //throw
    firstSubString = text.substring(0, gameState.CurrentPlayerIndex);
    players = text.substring(
      gameState.CurrentPlayerIndex,
      gameState.CurrentPlayerIndex + 1
    );
    lastSubString = text.substring(gameState.CurrentPlayerIndex + 1);
    targetText = (
      <div contentEditable>
        {firstSubString}
        <span style={{ color: "blue" }}>{players}</span>
        {lastSubString}
      </div>
    );
  }

  return (
    <Grid container direction="column" alignItems="center" spacing={3}>
      <Grid item>
        <div contentEditable>{targetText}</div>
      </Grid>

      <Grid item>
        <form>
          <TextField
            onChange={(e) => inputChangeHandler(e)}
            required
            id="playerText"
            label="Your input"
            defaultValue=""
            variant="outlined"
          />
        </form>
      </Grid>
    </Grid>
  );
};
