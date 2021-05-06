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
            _manager.AddPlayer(new Player(playerId, Clients.Caller));
            if (_manager.HasEnoughPlayers() && !_manager.HasGameStarted())
            {
                _manager.StartGame();
                await Clients.All.StartGame(_manager.GetTargetText());

                /*
                                var delayInterval = TimeSpan.FromMilliseconds(1000);
                                var text = _manager.GetTargetText();
                                for (var i = 5; i >= 0; i--)
                                {
                                    var runningTask = DoActionAfter(
                                        delayInterval,
                                        () => Clients.All.UpdateCountdown(new UpdateCountdown(i, i == 0 ? text : null)));
                                    runningTask.Wait();
                                }
                                */
            }
        }

        public async Task SendCharacter(CharacterUpdate newCharacterMessage)
        {
            var processResult = _manager.Process(newCharacterMessage);

            foreach (var kvp in processResult)
            {
                await kvp.Key.UpdateGame(kvp.Value);
            }

            if (_manager.ShouldEndGame(out Dictionary<IGameClient, bool> endGameResult))
            {
                _manager.EndGame();
                foreach (var kvp in endGameResult)
                {
                    await kvp.Key.EndGame(kvp.Value);
                }
            }
        }

        public void EndPreviousGame()
        {
            _manager.EndGame();
        }
    }
}