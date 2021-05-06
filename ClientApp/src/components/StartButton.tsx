import React from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { startWaitingActionCreator } from "../redux/actions";
import { RootState } from "../redux/reducer";

export const StartButton: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const playerState = useSelector((state: RootState) => state.playerState);
  const gameState = useSelector((state: RootState) => state.gameState);

  const startHandler = () => {
    dispatch(startWaitingActionCreator());
  };

  let resultDisplay;
  if (gameState.Text !== null) {
    resultDisplay = (
      <Grid item>
        <Typography variant="h6">
          {playerState.HasWon ? "You won" : "You loose"}
        </Typography>
      </Grid>
    );
  } else {
    resultDisplay = <div />;
  }

  return (
    <Grid container direction="column" alignItems="center" spacing={3}>
      {resultDisplay}
      <Grid item>
        <Button variant="contained" onClick={startHandler} disabled={false}>
          <Typography variant="h6">Start</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};
