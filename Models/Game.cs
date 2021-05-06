using System.Collections.Generic;

namespace SpeedTypingGame
{
    public class Game
    {
        public string Id { get; set; }

        public List<string> Players { get; set; }

        public string Winner { get; set; }

        public string Text { get; set; }

        public Game(string id)
        {
            Id = id;
            Players = new List<string>();
        }
    }
}