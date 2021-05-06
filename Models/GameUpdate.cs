namespace SpeedTypingGame
{
    public class GameUpdate
    {
        public int CurrentPlayerIndex { get; set; }

        public int OtherPlayersIndex { get; set; }

        public GameUpdate(int current, int others)
        {
            CurrentPlayerIndex = current;
            OtherPlayersIndex = others;
        }
    }
}