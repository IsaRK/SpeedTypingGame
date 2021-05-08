import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayerStateEnum } from "../models/player";
import {
  endGameActionCreator,
  startCountdownActionCreator,
  updateGameActionCreator,
} from "../redux/actions";
import { RootState } from "../redux/reducer";
import { CountDown } from "./CountDown";
import { GameBoard } from "./GameBoard";
import Spinner from "./Spinner";

export const Game: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const playerState = useSelector((state: RootState) => state.playerState);
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    if (process.env.REACT_APP_GAME_HUB_URI === undefined) throw new Error();

    const newConnection = new HubConnectionBuilder()
      .withUrl("./hubs/game")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
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

    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected!");

          if (playerState.PlayerState === PlayerStateEnum.Waiting) {
            registerPlayer();
          }

          connection.on("StartGame", (text: string, id: string) =>
            dispatch(startCountdownActionCreator(text, id))
          );

          connection.on(
            "UpdateGame",
            (updateGame: {
              currentPlayerIndex: number;
              otherPlayersIndex: number;
            }) => {
              dispatch(
                updateGameActionCreator(
                  updateGame.currentPlayerIndex,
                  updateGame.otherPlayersIndex
                )
              );
            }
          );

          connection.on("EndGame", (hasWon: boolean) =>
            dispatch(endGameActionCreator(hasWon))
          );
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

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
  } else if (playerState.PlayerState === PlayerStateEnum.CountingDown) {
    return <CountDown />;
  } else if (playerState.PlayerState === PlayerStateEnum.Playing) {
    return <GameBoard sendUpdate={sendUpdate} />;
  } else {
    return <div />;
  }
};
