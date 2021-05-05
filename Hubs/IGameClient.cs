using System.Threading.Tasks;

namespace SpeedTypingGame
{
    //Will be sent by the server
    public interface IGameClient
    {
        Task StartGame();

        Task UpdateGame(GameUpdate gameUpdateMessage);

        Task EndGame(bool hasWon);

        Task UpdateCountdown(UpdateCountdown updateCountdown);
    }
}