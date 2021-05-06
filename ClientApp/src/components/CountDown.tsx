import { Grid, Typography } from "@material-ui/core";
import React from "react";
import Countdown from "react-countdown";
import { useDispatch, useSelector } from "react-redux";
import { startGameActionCreator } from "../redux/actions";
import { RootState } from "../redux/reducer";

export const CountDown: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.gameState);

  const Ready = () => <span>Ready!</span>;

  const renderer = ({
    hours,
    minutes,
    seconds,
    completed,
  }: {
    hours: any;
    minutes: any;
    seconds: any;
    completed: any;
  }) => {
    if (completed) {
      // Render a complete state
      dispatch(startGameActionCreator());
      return <Ready />;
    } else {
      // Render a countdown
      return <span>{seconds}</span>;
    }
  };

  if (gameState.Countdown === undefined) throw new Error();

  return (
    <Grid container direction="column" alignItems="center" spacing={3}>
      <Grid item>
        <Typography variant="h6">{"Starts in "}</Typography>
      </Grid>

      <Grid item>
        <Typography variant="h6">
          <Countdown
            date={Date.now() + gameState.Countdown * 1000}
            renderer={renderer}
          ></Countdown>
        </Typography>
      </Grid>
    </Grid>
  );
};
