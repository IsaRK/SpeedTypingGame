import { useSelector } from "react-redux";
import { RootState } from "./redux/reducer";
import { PlayerStateEnum } from "./models/player";
import { StartButton } from "./components/StartButton";
import { Game } from "./components/Game";
import React from "react";

function App() {
  const playerState = useSelector((state: RootState) => state.playerState);

  function SingleApp() {
    switch (playerState.PlayerState) {
      case PlayerStateEnum.Starting:
        return <StartButton />;
      case PlayerStateEnum.Waiting:
      case PlayerStateEnum.Playing:
        return <Game />;
      default:
        return <StartButton />;
    }
  }

  return (
    <div className="App">
      <SingleApp />
    </div>
  );
}

export default App;
