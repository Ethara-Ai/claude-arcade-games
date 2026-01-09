# 🚀 Quick Start Guide

Get up and running with Arcade Games Collection in under 5 minutes!

## Prerequisites

- **Node.js** 16 or higher ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd claude-arcade-games
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 18
- Vite
- Tailwind CSS
- Testing libraries
- And more...

### 3. Start Development Server

```bash
npm run dev
```

The app will automatically open in your browser at `http://localhost:3000`

If it doesn't open automatically, click the link in your terminal.

## 🎮 Try the Games!

1. **Wait for loading screen** (3.5 seconds)
2. **Select a game**:
   - Click on a game card, OR
   - Press `1` for Brickrush
   - Press `2` for 1024
   - Press `3` for Snake
3. **Start playing!**

## 🔧 Available Commands

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Check for linting errors
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Testing
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
```

## 📱 Testing on Mobile

### Using Your Phone/Tablet

1. **Find your local IP**:
   - Windows: Run `ipconfig` in terminal
   - Mac/Linux: Run `ifconfig` in terminal
   - Look for your local IP (e.g., 192.168.1.100)

2. **Start dev server**:
   ```bash
   npm run dev -- --host
   ```

3. **Access from mobile**:
   - Open browser on your mobile device
   - Navigate to `http://YOUR_IP:3000`
   - Example: `http://192.168.1.100:3000`

### Browser DevTools

Use Chrome DevTools device emulation:
1. Press `F12` to open DevTools
2. Click the device icon (Toggle device toolbar)
3. Select a mobile device from dropdown

## 🎯 First Time Setup Tips

### If `npm install` fails:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### If port 3000 is in use:

The dev server will automatically use the next available port (3001, 3002, etc.)

Or specify a custom port:
```bash
npm run dev -- --port 4000
```

### If you see TypeScript errors:

This project uses PropTypes instead of TypeScript. Any TS-related errors can be ignored.

## 🎨 Customization

### Change Loading Duration

Edit `src/components/LoadingScreen.jsx`:
```javascript
<LoadingScreen duration={2000} onComplete={handleLoadingComplete} />
```

### Modify Game Colors

Edit `src/utils/constants.js`:
```javascript
export const GAME_COLORS = {
  [GAMES.BRICKRUSH]: {
    primary: '#your-color-here',
    // ...
  },
  // ...
};
```

### Add Your Own High Score

Open browser DevTools (F12) and run:
```javascript
localStorage.setItem('arcade_highscore_brickrush', '999999');
```

## 🐛 Troubleshooting

### Issue: Blank screen after build
**Solution**: Check browser console for errors. Likely a routing issue.

### Issue: Games not responding to input
**Solution**: Click on the game canvas to give it focus.

### Issue: Touch controls not working
**Solution**: Ensure you're testing on an actual touch device or using proper emulation.

### Issue: Styles not applying
**Solution**: 
```bash
# Rebuild Tailwind
npm run dev
```

## 📚 Next Steps

- ✅ Read the [README.md](README.md) for full documentation
- ✅ Check [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- ✅ See [DEPLOYMENT.md](DEPLOYMENT.md) for hosting options
- ✅ Review [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for technical details

## 🎉 That's It!

You're ready to play and develop! Have fun! 🎮

## 💡 Pro Tips

1. **Keep terminal open** to see real-time logs and errors
2. **Use browser DevTools** to inspect and debug
3. **Test on multiple browsers** for compatibility
4. **Check mobile responsiveness** early and often
5. **Read game instructions** by clicking "How to Play"

## 🆘 Need Help?

- Check existing [GitHub Issues](https://github.com/yourusername/arcade-games/issues)
- Create a new issue with details
- Include:
  - What you were trying to do
  - What actually happened
  - Error messages
  - Browser/OS info

Happy Gaming! 🚀
