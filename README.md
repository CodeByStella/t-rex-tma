# Telegram Dino Game - Mini App

A Chrome Dinosaur game converted to a Telegram Mini App with high score storage and mobile optimization.

## Features

- 🦖 Classic Chrome Dinosaur gameplay
- 📱 Fully responsive for mobile devices
- 🏆 High score storage in Telegram Cloud Storage
- 🎮 Touch controls for mobile devices
- 📊 Game statistics tracking
- 🚀 Optimized for Telegram Mini App environment

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Telegram Bot Setup

1. Create a new bot using [@BotFather](https://t.me/botfather)
2. Use the `/newapp` command to create a Mini App
3. Set the Mini App URL to your deployed game URL
4. Configure the Mini App settings as needed

### 3. Development

```bash
npm run dev
```

The game will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## Telegram Mini App Integration

### High Score Storage
- High scores are automatically saved to Telegram Cloud Storage
- Each user's scores are stored separately using their Telegram user ID
- Game statistics are tracked and updated automatically

### Mobile Optimization
- Responsive viewport handling
- Touch controls for mobile devices
- Optimized canvas sizing for different screen sizes
- Prevents zoom and unwanted gestures during gameplay

### User Experience
- Automatic Telegram Web App initialization
- Custom header and background colors
- Native Telegram alerts and confirmations
- Seamless integration with Telegram's UI

## Game Controls

### Desktop
- **Spacebar**: Jump / Start game / Restart after game over
- **Arrow Down**: Run (crouch)

### Mobile
- **Tap**: Jump / Start game / Restart after game over
- **Long press**: Run (crouch)

## Technical Details

### Dependencies
- React 18
- PixiJS 7 with React bindings
- Telegram Web App SDK
- TypeScript

### Architecture
- Component-based architecture with PixiJS for rendering
- Responsive design with dynamic viewport calculations
- Telegram service layer for Mini App integration
- Mobile-first touch event handling

### Performance
- Optimized rendering with PixiJS
- Efficient collision detection
- Minimal re-renders with React hooks
- Mobile-optimized touch handling

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

### Custom Server
1. Run `npm run build`
2. Upload the `dist` folder to your web server
3. Ensure HTTPS is enabled (required for Telegram Mini Apps)

## Environment Variables

No environment variables are required for basic functionality. The game automatically detects if it's running in a Telegram Mini App environment.

## Browser Support

- Chrome (desktop and mobile)
- Safari (iOS)
- Firefox
- Edge
- Telegram in-app browser

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues related to:
- **Game functionality**: Check the issues tab
- **Telegram Mini App setup**: Refer to [Telegram Bot API documentation](https://core.telegram.org/bots/webapps)
- **Mobile optimization**: Test on various devices and screen sizes
