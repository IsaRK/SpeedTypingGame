using System;

namespace SpeedTypingGame
{
    public class Player
    {
        public string Id { get; set; }

        public IGameClient Connection { get; set; }

        public int Index { get; set; }

        public bool InGame { get; set; }

        public Player(string id, IGameClient connection)
        {
            Id = id;
            Connection = connection;
        }
    }
}
