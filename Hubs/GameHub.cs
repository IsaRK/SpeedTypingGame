using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using System;

namespace SpeedTypingGame
{
    //Will be called by the browser
    public class GameHub : Hub<IGameClient>
    {
        private IGameManager _manager;


        public GameHub(IGameManager service)
        {
            _manager = service;
        }

        public async Task AddPlayer(string playerId)
        {
            if (_manager.IsPlayerAlreadyInGame(playerId, out string oldGameId, out Dictionary<IGameClient, bool> endGameResult))
            {
                _manager.EndGame(oldGameId);
                foreach (var kvp in endGameResult)
                {
                    await kvp.Key.EndGame(kvp.Value);
                }
            }

            var gameId = _manager.AddPlayer(new Player(playerId, Clients.Caller));
            if (_manager.HasEnoughPlayers(gameId))
            {
                _manager.StartGame(gameId);
                await Clients.All.StartGame(_manager.GetTargetText(gameId));
            }
        }

        public async Task SendCharacter(CharacterUpdate newCharacterMessage)
        {
            var processResult = _manager.Process(newCharacterMessage);

            foreach (var kvp in processResult)
            {
                await kvp.Key.UpdateGame(kvp.Value);
            }

            var game = _manager.GetGameByPlayerId(newCharacterMessage.PlayerId);

            if (_manager.ShouldEndGame(game.Id, out Dictionary<IGameClient, bool> endGameResult))
            {
                _manager.EndGame(game.Id);
                foreach (var kvp in endGameResult)
                {
                    await kvp.Key.EndGame(kvp.Value);
                }
            }
        }
    }
}