import PropTypes from 'prop-types';

/**
 * Animated gradient text component
 * Creates text with animated gradient that cycles through accent colors
 */
const GradientText = ({ children, className = '', animated = true }) => {
  const baseClass = animated ? 'gradient-text-animated' : 'gradient-text from-cyan-400 via-pink-500 to-amber-400';

  return (
    <h1 className={`${baseClass} ${className}`}>
      {children}
    </h1>
  );
};

GradientText.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  animated: PropTypes.bool,
};

export default GradientText;
