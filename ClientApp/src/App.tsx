import { useSelector } from "react-redux";
import { RootState } from "./redux/reducer";
import { PlayerStateEnum } from "./models/player";
import { StartButton } from "./components/StartButton";
import { Game } from "./components/Game";
import React from "react";
import { Box, Grid, ThemeProvider, Typography } from "@material-ui/core";
import { theme } from "./styles";

function MainTitleStyled() {
  return <Typography variant="h4">Speed Typing Game</Typography>;
}

function App() {
  const playerState = useSelector((state: RootState) => state.playerState);

  function SingleApp() {
    switch (playerState.PlayerState) {
      case PlayerStateEnum.Starting:
        return <StartButton />;
      case PlayerStateEnum.Waiting:
      case PlayerStateEnum.Playing:
      case PlayerStateEnum.CountingDown:
        return <Game />;
      default:
        return <StartButton />;
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box mt={8}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={3}
        >
          <Grid item>
            <MainTitleStyled />
          </Grid>
          <Grid item>
            <SingleApp />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;
