import { Grid, TextField, Typography } from "@material-ui/core";
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
    props.sendUpdate(
      playerState.Id,
      event.target.value.slice(event.target.value.length - 1)
    );
  };

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
  } else if (gameState.CurrentPlayerIndex < gameState.OtherPlayerIndex) {
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
    //tie
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
        <div contentEditable>
          <Typography variant="h2">{targetText}</Typography>
        </div>
      </Grid>

      <Grid item xs={12}>
        <form autoComplete="off">
          <Typography variant="h2">
            <TextField
              onChange={(e) => inputChangeHandler(e)}
              id="playerText"
              label="Your input"
              defaultValue=""
              variant="outlined"
              autoFocus
              fullWidth={true}
            />
          </Typography>
        </form>
      </Grid>
    </Grid>
  );
};
