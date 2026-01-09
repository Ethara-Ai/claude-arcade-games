import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiCircle, FiGrid, FiActivity } from 'react-icons/fi';
import { GAMES } from '../utils/constants';
import GradientText from './GradientText';
import BackgroundOrbs from './BackgroundOrbs';
import GameCard from './GameCard';

/**
 * Game Selector Component
 * Main hub for choosing which game to play
 */
const GameSelector = ({ onSelectGame }) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '1') {
        onSelectGame(GAMES.BRICKRUSH);
      } else if (e.key === '2') {
        onSelectGame(GAMES.PUZZLE_1024);
      } else if (e.key === '3') {
        onSelectGame(GAMES.SNAKE);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onSelectGame]);

  const games = [
    { id: GAMES.BRICKRUSH, icon: FiCircle, shortcut: '1' },
    { id: GAMES.PUZZLE_1024, icon: FiGrid, shortcut: '2' },
    { id: GAMES.SNAKE, icon: FiActivity, shortcut: '3' },
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 md:p-8">
      <BackgroundOrbs count={3} />

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <GradientText className="text-5xl md:text-7xl font-black mb-4">
            ARCADE GAMES
          </GradientText>
          <p className="text-gray-400 text-lg md:text-xl">Choose your game</p>
        </div>

        {/* Game Cards Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          role="list"
          aria-label="Available games"
        >
          {games.map((game) => (
            <div key={game.id} role="listitem">
              <GameCard
                gameId={game.id}
                icon={game.icon}
                onSelect={onSelectGame}
                shortcut={game.shortcut}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Use number keys <kbd className="px-2 py-1 bg-white/10 rounded mx-1">1</kbd>
            <kbd className="px-2 py-1 bg-white/10 rounded mx-1">2</kbd>
            <kbd className="px-2 py-1 bg-white/10 rounded mx-1">3</kbd> for quick access
          </p>
        </div>
      </div>
    </div>
  );
};

GameSelector.propTypes = {
  onSelectGame: PropTypes.func.isRequired,
};

export default GameSelector;
