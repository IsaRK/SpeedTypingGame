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

export const ColorRules = (
  <div>
    <div>Color definitions : </div>
    <ul>
      <li style={{ color: "green", fontWeight: "bold" }}>Your mark in green</li>
      <li style={{ color: "red", fontWeight: "bold" }}>
        Your opponent mark in red
      </li>
      <li style={{ color: "blue", fontWeight: "bold" }}>
        A blue mark if there is a tie
      </li>
    </ul>
    <div>The game is case sensitive.</div>
  </div>
);

export const Game: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const playerState = useSelector((state: RootState) => state.playerState);
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    if (process.env.REACT_APP_GAME_HUB_URI === undefined) throw new Error();

    let gameHubUri;
    if (process.env.NODE_ENV !== "production") {
      gameHubUri = process.env.REACT_APP_GAME_HUB_URI;
    } else {
      gameHubUri = "./hubs/game";
    }

    const newConnection = new HubConnectionBuilder()
      .withUrl(gameHubUri)
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
