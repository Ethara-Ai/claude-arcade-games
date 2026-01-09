import { useState, lazy, Suspense } from 'react';
import { GAMES } from './utils/constants';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import GameSelector from './components/GameSelector';
import BackgroundOrbs from './components/BackgroundOrbs';

// Lazy load games for better performance
const Brickrush = lazy(() => import('./games/Brickrush/Brickrush'));
const Puzzle1024 = lazy(() => import('./games/Puzzle1024/Puzzle1024'));
const Snake = lazy(() => import('./games/Snake/Snake'));

/**
 * Main App Component
 */
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentGame, setCurrentGame] = useState(null);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleSelectGame = (gameId) => {
    setCurrentGame(gameId);
  };

  const handleExitGame = () => {
    setCurrentGame(null);
  };

  const renderGame = () => {
    const gameProps = { onExit: handleExitGame };

    switch (currentGame) {
      case GAMES.BRICKRUSH:
        return <Brickrush {...gameProps} />;
      case GAMES.PUZZLE_1024:
        return <Puzzle1024 {...gameProps} />;
      case GAMES.SNAKE:
        return <Snake {...gameProps} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <ErrorBoundary
      onGoHome={handleExitGame}
      onReset={() => window.location.reload()}
      fallbackMessage="Something went wrong with the game. Please try restarting."
    >
      <div className="min-h-screen bg-black relative overflow-hidden">
        <BackgroundOrbs count={3} />

        {!currentGame ? (
          <GameSelector onSelectGame={handleSelectGame} />
        ) : (
          <ErrorBoundary
            onGoHome={handleExitGame}
            fallbackMessage="This game encountered an error. Please try another game."
          >
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="glass-panel-dark p-8">
                    <div className="w-16 h-16 border-4 border-accent-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-center">Loading game...</p>
                  </div>
                </div>
              }
            >
              {renderGame()}
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
