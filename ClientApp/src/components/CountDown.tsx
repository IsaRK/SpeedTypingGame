import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducer";

export const CountDown: React.FunctionComponent = () => {
  const gameState = useSelector((state: RootState) => state.gameState);

  return (
    <Grid container direction="column" alignItems="center" spacing={3}>
      <Grid item>
        <Typography variant="h6">{"Start in "}</Typography>
      </Grid>

      <Grid item>
        <Typography variant="h6">{gameState.Countdown}</Typography>
      </Grid>
    </Grid>
  );
};
