namespace SpeedTypingGame
{
    public class UpdateCountdown
    {
        public int Countdown { get; set; }

        public string Text { get; set; }
        public UpdateCountdown(int countdown, string text)
        {
            Countdown = countdown;
            Text = text;
        }
    }
}