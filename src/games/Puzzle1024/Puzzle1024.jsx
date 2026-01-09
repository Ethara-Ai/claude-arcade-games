import { useEffect, useState } from 'react';
import { GAMES, GAME_STATES } from '../../utils/constants';
import { useKeyboard } from '../../hooks/useKeyboard';
import { useControls } from '../../hooks/useControls';
import { use1024, getTileColor } from './use1024';
import StartMenu from '../../components/StartMenu';
import PauseMenu from '../../components/PauseMenu';
import GameOverMenu from '../../components/GameOverMenu';
import WinMenu from '../../components/WinMenu';
import HowToPlayModal from '../../components/HowToPlayModal';
import { formatNumber } from '../../utils/helpers';

/**
 * Tile Component
 */
const Tile = ({ tile, position, isMerged }) => {
  if (!tile) return null;

  return (
    <div
      className={`absolute inset-0 m-1 rounded-lg flex items-center justify-center font-bold transition-all duration-200 ${getTileColor(
        tile.value
      )} ${isMerged ? 'animate-bounce' : ''}`}
      style={{
        fontSize: tile.value >= 128 ? '2rem' : tile.value >= 16 ? '2.5rem' : '3rem',
      }}
    >
      {tile.value}
    </div>
  );
};

/**
 * 1024 Puzzle Game Component
 */
const Puzzle1024 = ({ onExit }) => {
  const game = use1024();
  const [showHelp, setShowHelp] = useState(false);

  // Keyboard controls
  useKeyboard(
    {
      ArrowLeft: () => game.moveTiles('left'),
      ArrowRight: () => game.moveTiles('right'),
      ArrowUp: () => game.moveTiles('up'),
      ArrowDown: () => game.moveTiles('down'),
      a: () => game.moveTiles('left'),
      A: () => game.moveTiles('left'),
      d: () => game.moveTiles('right'),
      D: () => game.moveTiles('right'),
      w: () => game.moveTiles('up'),
      W: () => game.moveTiles('up'),
      s: () => game.moveTiles('down'),
      S: () => game.moveTiles('down'),
      ' ': () => {
        if (game.gameState === GAME_STATES.PLAYING) {
          game.pauseGame();
        }
      },
    },
    game.gameState === GAME_STATES.PLAYING
  );

  // Touch/swipe controls
  const controls = useControls(game.gameState === GAME_STATES.PLAYING);

  useEffect(() => {
    controls.onSwipe((direction) => {
      game.moveTiles(direction);
    });
  }, [controls, game]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* HUD */}
      <div className="w-full max-w-md mb-6 space-y-4">
        <div className="glass-panel p-4">
          <div className="flex justify-between items-center text-white">
            <div>
              <div className="text-sm text-gray-400">Score</div>
              <div className="text-2xl font-bold text-accent-amber">
                {formatNumber(game.score)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Best</div>
              <div className="text-2xl font-bold text-white">
                {formatNumber(game.highScore)}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-400 text-sm">
          <p>Join the numbers to reach <span className="text-accent-cyan font-bold">1024</span>!</p>
        </div>
      </div>

      {/* Game Grid */}
      <div className="relative">
        <div
          className="glass-panel-dark p-2 md:p-4 select-none"
          {...controls}
          style={{ touchAction: 'none' }}
        >
          <div
            className="relative bg-black/30 rounded-lg"
            style={{
              width: '320px',
              height: '320px',
              maxWidth: '90vw',
              maxHeight: '90vw',
            }}
          >
            {/* Grid Background */}
            <div className="grid grid-cols-4 gap-1 h-full w-full p-1">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="bg-white/5 rounded-lg" />
              ))}
            </div>

            {/* Tiles */}
            <div className="absolute inset-0 grid grid-cols-4 gap-0 p-1">
              {game.grid.map((row, r) =>
                row.map((tile, c) => (
                  <div key={`${r}-${c}`} className="relative">
                    <Tile
                      tile={tile}
                      position={{ row: r, col: c }}
                      isMerged={tile && game.mergedTiles.has(tile.id)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Menus */}
        {game.gameState === GAME_STATES.START && (
          <StartMenu
            gameId={GAMES.PUZZLE_1024}
            gameName="1024"
            description="Slide and merge tiles to reach 1024!"
            onStart={game.handleStart}
            onShowHelp={() => setShowHelp(true)}
          />
        )}

        {game.gameState === GAME_STATES.PAUSED && (
          <PauseMenu
            gameId={GAMES.PUZZLE_1024}
            gameName="1024"
            onResume={game.resumeGame}
            onRestart={game.handleRestart}
            onMainMenu={() => {
              game.resetGame();
              onExit();
            }}
          />
        )}

        {game.gameState === GAME_STATES.GAME_OVER && (
          <GameOverMenu
            gameId={GAMES.PUZZLE_1024}
            gameName="1024"
            score={game.score}
            highScore={game.highScore}
            isNewHighScore={game.score === game.highScore && game.score > 0}
            onPlayAgain={game.handleRestart}
            onMainMenu={() => {
              game.resetGame();
              onExit();
            }}
          />
        )}

        {game.gameState === GAME_STATES.WON && (
          <WinMenu
            gameId={GAMES.PUZZLE_1024}
            gameName="1024"
            score={game.score}
            highScore={game.highScore}
            isNewHighScore={game.score === game.highScore && game.score > 0}
            onContinue={game.handleContinue}
            onPlayAgain={game.handleRestart}
            onMainMenu={() => {
              game.resetGame();
              onExit();
            }}
          />
        )}
      </div>

      {/* Controls Hint */}
      <div className="mt-6 text-gray-500 text-sm text-center">
        <p className="mb-2">Use arrow keys or WASD to move tiles</p>
        <p>Swipe on mobile devices</p>
      </div>

      {/* How to Play Modal */}
      {showHelp && <HowToPlayModal gameId={GAMES.PUZZLE_1024} onClose={() => setShowHelp(false)} />}
    </div>
  );
};

export default Puzzle1024;
