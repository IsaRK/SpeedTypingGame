using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;

namespace SpeedTypingGame
{
    public interface IGameManager
    {
        bool HasEnoughPlayers(string gameId);
        string AddPlayer(Player newPlayer);
        Dictionary<IGameClient, GameUpdate> Process(CharacterUpdate newCharacterMessage);
        void StartGame(string gameId);
        void EndGame(string gameId);
        bool ShouldEndGame(string gameId, out Dictionary<IGameClient, bool> endGameResult);
        Game GetGameByPlayerId(string playerId);
        string GetTargetText(string gameId);
        bool IsPlayerAlreadyInGame(string playerId, out string oldGameId, out Dictionary<IGameClient, bool> endGameResult);
    }

    public class GameManager : IGameManager
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public GameManager(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        private Dictionary<string, Player> _players = new Dictionary<string, Player>();

        private Dictionary<string, Game> _currentGames = new Dictionary<string, Game>();

        private Game _waitingPlayers = null;

        public Dictionary<IGameClient, GameUpdate> Process(CharacterUpdate newCharacterMessage)
        {
            var currentGame = GetGameByPlayerId(newCharacterMessage.PlayerId);

            if (currentGame == null)
                throw new Exception("No Game Found");

            var currentPlayerIndex = _players[newCharacterMessage.PlayerId].Index;
            var shouldUpdateIndex = HasCorrectCharacter(currentGame.Text, currentPlayerIndex, newCharacterMessage.NewCharacter);

            var result = new Dictionary<IGameClient, GameUpdate>();
            if (shouldUpdateIndex)
            {
                var newIndex = _players[newCharacterMessage.PlayerId].Index + 1;
                _players[newCharacterMessage.PlayerId].Index = newIndex;

                if (newIndex >= currentGame.Text.Length)
                {
                    currentGame.Winner = newCharacterMessage.PlayerId;
                }

                //Working only because there is a max of two players
                for (var i = 0; i < currentGame.Players.Count; i++)
                {
                    var playerId = currentGame.Players[i];
                    var otherPlayerId = i == 0 ? currentGame.Players[1] : currentGame.Players[0];
                    result.Add(_players[playerId].Connection, new GameUpdate(_players[playerId].Index, _players[otherPlayerId].Index));
                }
            }

            return result;
        }
        private bool HasCorrectCharacter(string text, int currentIndex, char newCharacter)
        {
            return text[currentIndex] == newCharacter;
        }

        public string GetTargetText(string gameId)
        {
            return _currentGames[gameId].Text;
        }

        public Game GetGameByPlayerId(string playerId)
        {
            foreach (var game in _currentGames.Values)
            {
                if (game.Players.Contains(playerId))
                {
                    return game;
                }
            }
            return null;
        }

        public bool IsPlayerAlreadyInGame(string playerId, out string oldGameId, out Dictionary<IGameClient, bool> endGameResult)
        {
            Game oldGame = null;
            endGameResult = null;

            foreach (var game in _currentGames.Values)
            {
                if (game.Players.Contains(playerId))
                {
                    oldGame = game;
                    break;
                }
            }

            if (_waitingPlayers != null && _waitingPlayers.Players.Contains(playerId))
            {
                oldGame = _waitingPlayers;
            }

            if (oldGame != null)
            {
                //Remove player
                oldGame.Players.Remove(playerId);

                foreach (var player in oldGame.Players)
                {
                    endGameResult.Add(_players[player].Connection, true);
                }
                oldGameId = oldGame.Id;
                return true;
            }

            oldGameId = null;
            return false;
        }

        public string AddPlayer(Player newPlayer)
        {
            if (!_players.ContainsKey(newPlayer.Id))
            {
                _players.Add(newPlayer.Id, newPlayer);
            }

            Game newGame = null;

            if (_waitingPlayers != null)
            {
                newGame = _waitingPlayers;
                newGame.Players.Add(newPlayer.Id);
                _waitingPlayers = null;
                _currentGames.Add(newGame.Id, newGame);
            }
            else
            {
                newGame = new Game(Guid.NewGuid().ToString());
                newGame.Players.Add(newPlayer.Id);
                _waitingPlayers = newGame;
            }

            return newGame.Id;
        }

        public void StartGame(string gameId)
        {
            _currentGames[gameId].Text = SelectText();
            _currentGames[gameId].Winner = null;
            foreach (var playerId in _currentGames[gameId].Players)
            {
                _players[playerId].Index = 0;
            }
        }

        private string SelectText()
        {
            var path = Path.Combine(_webHostEnvironment.ContentRootPath, "Data/texts.json");
            var allTexts = JsonConvert.DeserializeObject<string[]>(File.ReadAllText(path));

            var random = new Random();
            return allTexts[random.Next(0, allTexts.Length - 1)];
        }

        public void EndGame(string gameId)
        {
            _currentGames.Remove(gameId);

            if (_waitingPlayers != null && _waitingPlayers.Id == gameId)
            {
                _waitingPlayers = null;
            }
        }

        public bool ShouldEndGame(string gameId, out Dictionary<IGameClient, bool> endGameResult)
        {
            endGameResult = new Dictionary<IGameClient, bool>();

            if (_currentGames[gameId].Winner == null) return false;

            foreach (var player in _currentGames[gameId].Players)
            {
                endGameResult.Add(_players[player].Connection, _players[player].Id == _currentGames[gameId].Winner);
            }

            return true;
        }

        public bool HasEnoughPlayers(string gameId)
        {
            return _waitingPlayers == null && _currentGames[gameId].Players.Count == 2;
        }
    }
}
