import { Box, Grid, TextField, Typography } from "@material-ui/core";
import React, { ChangeEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducer";
import { ColorRules } from "./Game";

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

  const regularText = {
    color: "darkGray",
  };

  const isSpaceCurrentPlayer =
    text.charAt(gameState.CurrentPlayerIndex) === " ";
  const isSpaceOtherPlayer = text.charAt(gameState.OtherPlayerIndex) === " ";

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
      <div contentEditable suppressContentEditableWarning={true}>
        <span style={regularText}>{firstSubString}</span>
        {isSpaceOtherPlayer ? (
          <span style={{ backgroundColor: "red" }}>{firstPlayer}</span>
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {firstPlayer}
          </span>
        )}
        <span style={regularText}>{betweenPlayers}</span>
        {isSpaceCurrentPlayer ? (
          <span style={{ backgroundColor: "green" }}>{secondPlayer}</span>
        ) : (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {secondPlayer}
          </span>
        )}
        <span style={regularText}>{lastSubString}</span>
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
      <div contentEditable suppressContentEditableWarning={true}>
        <span style={regularText}>{firstSubString}</span>
        {isSpaceCurrentPlayer ? (
          <span style={{ backgroundColor: "green" }}>{firstPlayer}</span>
        ) : (
          <span style={{ color: "green", fontWeight: "bold" }}>
            {firstPlayer}
          </span>
        )}
        <span style={regularText}>{betweenPlayers}</span>
        {isSpaceOtherPlayer ? (
          <span style={{ backgroundColor: "red" }}>{secondPlayer}</span>
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>
            {secondPlayer}
          </span>
        )}
        <span style={regularText}>{lastSubString}</span>
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
      <div contentEditable suppressContentEditableWarning={true}>
        <span style={regularText}>{firstSubString}</span>
        {isSpaceOtherPlayer ? (
          <span style={{ backgroundColor: "blue" }}>{players}</span>
        ) : (
          <span style={{ color: "blue", fontWeight: "bold" }}>{players}</span>
        )}
        <span style={regularText}>{lastSubString}</span>
      </div>
    );
  }

  const Rules = <div>Start Typing the below text as fast as you can !</div>;

  return (
    <Grid container direction="column" alignItems="center" spacing={3}>
      <Grid item>
        <Typography component={"span"} variant={"body1"}>
          {ColorRules}
          {Rules}
        </Typography>
      </Grid>
      <Grid item>
        <Box style={{ borderColor: "grey.500", borderRadius: "16" }}>
          <Typography variant="h6">
            <div contentEditable suppressContentEditableWarning={true}>
              {targetText}
            </div>
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <form autoComplete="off">
          <Typography variant="h5">
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
