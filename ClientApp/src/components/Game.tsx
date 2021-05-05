import { Grid } from "@material-ui/core";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateCountdown, UpdateGameMessage } from "../models/game";
import { PlayerStateEnum } from "../models/player";
import {
  endGameActionCreator,
  startGameActionCreator,
  //updateCountdownUpdateActionCreator,
  updateGameActionCreator,
} from "../redux/actions";
import { RootState } from "../redux/reducer";
import { CountDown } from "./CountDown";
import { GameBoard } from "./GameBoard";
import Spinner from "./Spinner";

export const Game: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  const playerState = useSelector((state: RootState) => state.playerState);
  const gameState = useSelector((state: RootState) => state.gameState);

  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:5001/hubs/game")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected!");
          registerPlayer();

          connection.on("StartGame", (text: string) =>
            dispatch(startGameActionCreator(text))
          );

          /*
          connection.on(
            "UpdateCountdown",
            (updateCountdown: UpdateCountdown) => {
              dispatch(
                updateCountdownUpdateActionCreator(
                  updateCountdown.Countdown,
                  updateCountdown.Text
                )
              );
            }
          );
          */

          connection.on("UpdateGame", (updateGame: UpdateGameMessage) => {
            if (updateGame.CurrentPlayerIndex && updateGame.OtherPlayerIndex) {
              dispatch(
                updateGameActionCreator(
                  updateGame.CurrentPlayerIndex,
                  updateGame.OtherPlayerIndex
                )
              );
            } else {
              console.log("Invalid indexes received");
            }
          });

          connection.on("EndGame", (hasWon: boolean) =>
            dispatch(endGameActionCreator(hasWon))
          );
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection]);

  const registerPlayer = async () => {
    if (connection) {
      try {
        await connection.send("AddPlayer", playerState.Id);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("No connection to server yet.");
    }
  };

  const sendUpdate = async (playerId: string, character: string) => {
    const characterUpdateMessage = {
      PlayerId: playerId,
      NewCharacter: character,
    };

    if (connection) {
      try {
        await connection.send("SendCharacter", characterUpdateMessage);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("No connection to server yet.");
    }
  };

  if (playerState.PlayerState === PlayerStateEnum.Waiting) {
    return <Spinner />;
  } else if (playerState.PlayerState === PlayerStateEnum.Playing) {
    if (gameState.Text) {
      return <GameBoard sendUpdate={sendUpdate} />;
    } else {
      return <CountDown />;
    }
  } else {
    return <div />;
  }
};
