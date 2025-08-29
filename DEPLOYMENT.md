# Telegram Mini App Deployment Guide

This guide will help you deploy your Dino Game as a Telegram Mini App.

## Prerequisites

1. **Telegram Bot**: You need a Telegram bot created via [@BotFather](https://t.me/botfather)
2. **Web Hosting**: A web server with HTTPS support (required for Telegram Mini Apps)
3. **Domain**: A domain name for your Mini App

## Step 1: Create Your Bot

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Use the `/newbot` command
3. Follow the instructions to create your bot
4. Save the bot token (you'll need this later)

## Step 2: Create the Mini App

1. Message [@BotFather](https://t.me/botfather) again
2. Use the `/newapp` command
3. Select your bot from the list
4. Choose a title for your Mini App (e.g., "Dino Game")
5. Provide a short description
6. Upload a photo for your Mini App (optional but recommended)

## Step 3: Build Your Game

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

The build will create a `dist` folder with your production files.

## Step 4: Deploy to Web Server

### Option A: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up
3. Import your GitHub repository
4. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Deploy

### Option B: Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and sign up
3. Import your GitHub repository
4. Configure the build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
5. Deploy

### Option C: Custom Server

1. Upload the contents of the `dist` folder to your web server
2. Ensure HTTPS is enabled
3. Configure your web server to serve `index.html` for all routes

## Step 5: Configure Your Mini App

1. Go back to [@BotFather](https://t.me/botfather)
2. Use the `/myapps` command to see your Mini Apps
3. Select your Dino Game Mini App
4. Use the `/setappurl` command
5. Enter your deployed URL (e.g., `https://yourdomain.com`)

## Step 6: Test Your Mini App

1. Open Telegram
2. Search for your bot
3. Start a chat with it
4. Look for the "Open App" button or use the `/start` command
5. Your Mini App should open within Telegram

## Step 7: Add Bot Commands

Configure your bot to show helpful commands:

```
/setcommands
start - Start the Dino Game
help - Get help about the game
stats - View your game statistics
```

## Important Configuration Notes

### HTTPS Requirement
Telegram Mini Apps **require HTTPS**. Make sure your hosting provider supports SSL certificates.

### Viewport Configuration
The game automatically detects if it's running in Telegram and adjusts the viewport accordingly.

### Cloud Storage
High scores and game statistics are automatically saved to Telegram's Cloud Storage for each user.

## Testing

### Local Testing
Use the provided `public/telegram-test.html` file to test the Telegram integration locally:

1. Open `public/telegram-test.html` in your browser
2. Click "Initialize Telegram App"
3. Test the high score and game stats functionality

### Production Testing
1. Deploy your app
2. Test on various devices (mobile and desktop)
3. Test the high score persistence
4. Verify touch controls work on mobile

## Troubleshooting

### Common Issues

1. **Mini App doesn't open**: Check that your URL is accessible and HTTPS is enabled
2. **High scores not saving**: Verify the Cloud Storage API is working
3. **Mobile responsiveness issues**: Test on actual mobile devices
4. **Build errors**: Ensure all dependencies are installed

### Debug Mode

Enable debug logging by checking the browser console when running the Mini App.

## Performance Optimization

1. **Image Optimization**: Ensure all game sprites are optimized
2. **Code Splitting**: Consider implementing lazy loading for non-critical components
3. **Caching**: Implement proper caching headers for static assets
4. **Mobile First**: Test performance on mobile devices

## Security Considerations

1. **HTTPS Only**: Never deploy without SSL
2. **Input Validation**: Validate all user inputs
3. **Rate Limiting**: Implement rate limiting if needed
4. **Data Privacy**: Only store necessary user data

## Monitoring

1. **Analytics**: Consider adding analytics to track usage
2. **Error Logging**: Monitor for JavaScript errors
3. **Performance**: Track load times and user experience
4. **User Feedback**: Collect feedback from players

## Updates and Maintenance

1. **Regular Updates**: Keep dependencies updated
2. **Bug Fixes**: Monitor and fix issues promptly
3. **Feature Additions**: Consider adding new features based on user feedback
4. **Performance Monitoring**: Continuously monitor and optimize performance

## Support Resources

- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [@BotFather](https://t.me/botfather) - For bot and Mini App management
- [Telegram Developers Community](https://t.me/TelegramDevelopers)

## Example Bot Commands

Here's a complete set of commands you can set for your bot:

```
/setcommands
start - 🎮 Start the Dino Game
play - 🦖 Play the game
stats - 📊 View your game statistics
help - ❓ Get help about the game
about - ℹ️ About this game
leaderboard - 🏆 View top players
```

## Final Checklist

- [ ] Bot created and configured
- [ ] Mini App created and configured
- [ ] Game built and deployed
- [ ] HTTPS enabled
- [ ] Mini App URL set
- [ ] Bot commands configured
- [ ] Tested on mobile and desktop
- [ ] High score functionality verified
- [ ] Touch controls working
- [ ] Performance optimized

Your Telegram Mini App is now ready to be enjoyed by players around the world! 🎉
