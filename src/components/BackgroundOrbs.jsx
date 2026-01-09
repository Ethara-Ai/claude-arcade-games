import PropTypes from 'prop-types';

/**
 * Animated background gradient orbs
 * Creates subtle floating gradient spheres in the background
 */
const BackgroundOrbs = ({ count = 3 }) => {
  const orbs = Array.from({ length: count }, (_, i) => ({
    id: i,
    color: ['cyan', 'amber', 'green', 'pink'][i % 4],
    size: [400, 500, 450][i % 3],
    top: [10, 60, 30][i % 3],
    left: [10, 70, 40][i % 3],
    delay: i * 2,
  }));

  const getGradientClass = (color) => {
    const gradients = {
      cyan: 'from-cyan-500/20 to-transparent',
      amber: 'from-amber-500/20 to-transparent',
      green: 'from-green-500/20 to-transparent',
      pink: 'from-pink-500/20 to-transparent',
    };
    return gradients[color] || gradients.cyan;
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className={`absolute rounded-full blur-3xl bg-gradient-radial ${getGradientClass(orb.color)} animate-pulse-slow`}
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            top: `${orb.top}%`,
            left: `${orb.left}%`,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

BackgroundOrbs.propTypes = {
  count: PropTypes.number,
};

export default BackgroundOrbs;
