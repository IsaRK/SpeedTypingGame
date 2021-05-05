using System;
using System.Collections.Generic;

namespace SpeedTypingGame
{
    public class GameUpdate
    {
        public int CurrentPlayerIndex { get; set; }

        public List<int> OtherPlayersIndex { get; set; }

        public GameUpdate(int current, List<int> others)
        {
            CurrentPlayerIndex = current;
            OtherPlayersIndex = others;
        }
    }
}