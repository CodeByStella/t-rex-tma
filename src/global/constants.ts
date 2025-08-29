import telegramService from './telegramService';

// Get viewport dimensions from Telegram Mini App or fallback to browser
export const VIEW_PORT_WIDTH = telegramService.isTelegramApp() 
  ? telegramService.getViewportWidth() 
  : (window.innerWidth || document.documentElement.clientWidth);

export const VIEW_PORT_HEIGHT = telegramService.isTelegramApp() 
  ? telegramService.getViewportHeight() 
  : (window.innerHeight || document.documentElement.clientHeight);

export const HALF_VIEW_PORT_WIDTH = VIEW_PORT_WIDTH / 2;
export const HALF_VIEW_PORT_HEIGHT = VIEW_PORT_HEIGHT / 2;

// Responsive dimensions based on viewport
export const CLOUD_WIDTH = Math.min(95, VIEW_PORT_WIDTH * 0.15);
export const BIRD_WIDTH = Math.min(92, VIEW_PORT_WIDTH * 0.12);
export const TOTAL_CLOUDS = Math.max(1, Math.floor(VIEW_PORT_WIDTH / 300));
export const TOTAL_TREES = Math.max(1, Math.floor(VIEW_PORT_WIDTH / 1000));
export const TOTAL_BIRDS = Math.max(1, Math.floor(VIEW_PORT_WIDTH / 2000));

// Mobile-specific adjustments
export const IS_MOBILE = VIEW_PORT_WIDTH < 768;
export const GAME_HEIGHT = IS_MOBILE ? VIEW_PORT_HEIGHT * 0.8 : 400;
export const SCORE_FONT_SIZE = IS_MOBILE ? 16 : 20;
export const SCORE_Y_POSITION = IS_MOBILE ? VIEW_PORT_HEIGHT * 0.85 : 370;