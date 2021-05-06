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
        bool HasEnoughPlayers();
        void AddPlayer(Player newPlayer);
        Dictionary<IGameClient, GameUpdate> Process(CharacterUpdate newCharacterMessage);
        void StartGame();
        void EndGame();
        bool ShouldEndGame(out Dictionary<IGameClient, bool> endGameResult);
        bool HasGameStarted();

        string GetTargetText();
    }

    public class GameManager : IGameManager
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public GameManager(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public Dictionary<string, Player> Players = new Dictionary<string, Player>();

        private bool _gameStarted { get; set; }

        private Player _winner { get; set; }

        private string _text { get; set; }

        public Dictionary<IGameClient, GameUpdate> Process(CharacterUpdate newCharacterMessage)
        {
            var currentPlayerIndex = Players[newCharacterMessage.PlayerId].Index;
            var shouldUpdateIndex = HasCorrectCharacter(currentPlayerIndex, newCharacterMessage.NewCharacter);

            var result = new Dictionary<IGameClient, GameUpdate>();
            if (shouldUpdateIndex)
            {
                var newIndex = Players[newCharacterMessage.PlayerId].Index + 1;
                Players[newCharacterMessage.PlayerId].Index = newIndex;

                if (newIndex >= _text.Length)
                {
                    _winner = Players[newCharacterMessage.PlayerId];
                }

                var allPlayersInGame = Players.Where(x => x.Value.InGame).Select(x => x.Value).ToList();

                foreach (var player in allPlayersInGame)
                {
                    Players.Remove(player.Id);

                    var othersIndex = Players.Values.Select(x => x.Index).First();
                    result.Add(player.Connection, new GameUpdate(player.Index, othersIndex));

                    Players.Add(player.Id, player);
                }
            }

            return result;
        }
        private bool HasCorrectCharacter(int currentIndex, char newCharacter)
        {
            return _text[currentIndex] == newCharacter;
        }

        public void AddPlayer(Player newPlayer)
        {
            if (!Players.ContainsKey(newPlayer.Id))
            {
                Players.Add(newPlayer.Id, newPlayer);
            }
        }

        public void StartGame()
        {
            _gameStarted = true;
            _text = SelectText();
            _winner = null;
            foreach (var player in Players.Values)
            {
                player.InGame = true;
                player.Index = 0;
            }
        }

        private string SelectText()
        {
            var path = Path.Combine(_webHostEnvironment.ContentRootPath, "Data/texts.json");
            var allTexts = JsonConvert.DeserializeObject<string[]>(File.ReadAllText(path));

            var random = new Random();
            return allTexts[random.Next(0, allTexts.Length - 1)];
        }

        public bool HasGameStarted()
        {
            return _gameStarted;
        }
        public void EndGame()
        {
            _gameStarted = false;
            _text = null;
            Players = null;
        }

        public bool ShouldEndGame(out Dictionary<IGameClient, bool> endGameResult)
        {
            endGameResult = new Dictionary<IGameClient, bool>();

            if (_winner == null) return false;

            var allPlayersInGame = Players.Where(x => x.Value.InGame).Select(x => x.Value).ToList();

            foreach (var player in allPlayersInGame)
            {
                endGameResult.Add(player.Connection, player == _winner);
            }

            return true;
        }

        public bool HasEnoughPlayers() { return Players.Keys.Count >= 2; }

        public string GetTargetText()
        {
            return _text;
        }
    }
}
