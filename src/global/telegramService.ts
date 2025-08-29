import WebApp from '@twa-dev/sdk';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramGameData {
  highScore: number;
  totalGames: number;
  lastPlayed: string;
}

class TelegramService {
  private webApp: typeof WebApp;
  private isInitialized: boolean = false;

  constructor() {
    this.webApp = WebApp;
  }

  init(): void {
    if (this.isInitialized) return;

    try {
      // Initialize Telegram Web App
      this.webApp.ready();
      
      // Expand the app to full height
      this.webApp.expand();
      
      // Set header color to match game theme
      this.webApp.setHeaderColor('#ffffff');
      
      // Set background color
      this.webApp.setBackgroundColor('#ffffff');
      
      this.isInitialized = true;
      console.log('Telegram Web App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Telegram Web App:', error);
    }
  }

  getUser(): TelegramUser | null {
    try {
      if (this.webApp.initDataUnsafe?.user) {
        return this.webApp.initDataUnsafe.user;
      }
      return null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  }

  async getHighScore(): Promise<number> {
    try {
      const user = this.getUser();
      if (!user) return 0;

      const key = `highScore_${user.id}`;
      
      return new Promise((resolve) => {
        this.webApp.CloudStorage.getItem(key, (error, result) => {
          if (error) {
            console.error('Failed to get high score:', error);
            resolve(0);
          } else {
            resolve(result ? parseInt(result) : 0);
          }
        });
      });
    } catch (error) {
      console.error('Failed to get high score:', error);
      return 0;
    }
  }

  async setHighScore(score: number): Promise<void> {
    try {
      const user = this.getUser();
      if (!user) return;

      const key = `highScore_${user.id}`;
      
      return new Promise((resolve, reject) => {
        this.webApp.CloudStorage.setItem(key, score.toString(), (error) => {
          if (error) {
            console.error('Failed to set high score:', error);
            reject(error);
          } else {
            // Also update game statistics
            this.updateGameStats(score).then(resolve).catch(reject);
          }
        });
      });
    } catch (error) {
      console.error('Failed to set high score:', error);
      throw error;
    }
  }

  private async updateGameStats(score: number): Promise<void> {
    try {
      const user = this.getUser();
      if (!user) return;

      const statsKey = `gameStats_${user.id}`;
      
      return new Promise((resolve, reject) => {
        this.webApp.CloudStorage.getItem(statsKey, (error, statsData) => {
          if (error) {
            console.error('Failed to get game stats:', error);
            reject(error);
            return;
          }

          let stats: TelegramGameData;
          if (statsData) {
            try {
              stats = JSON.parse(statsData);
            } catch (parseError) {
              stats = {
                highScore: 0,
                totalGames: 0,
                lastPlayed: new Date().toISOString()
              };
            }
          } else {
            stats = {
              highScore: 0,
              totalGames: 0,
              lastPlayed: new Date().toISOString()
            };
          }

          stats.highScore = Math.max(stats.highScore, score);
          stats.totalGames += 1;
          stats.lastPlayed = new Date().toISOString();

          this.webApp.CloudStorage.setItem(statsKey, JSON.stringify(stats), (setError) => {
            if (setError) {
              console.error('Failed to update game stats:', setError);
              reject(setError);
            } else {
              resolve();
            }
          });
        });
      });
    } catch (error) {
      console.error('Failed to update game stats:', error);
      throw error;
    }
  }

  async getGameStats(): Promise<TelegramGameData | null> {
    try {
      const user = this.getUser();
      if (!user) return null;

      const statsKey = `gameStats_${user.id}`;
      
      return new Promise((resolve) => {
        this.webApp.CloudStorage.getItem(statsKey, (error, statsData) => {
          if (error || !statsData) {
            console.error('Failed to get game stats:', error);
            resolve(null);
          } else {
            try {
              resolve(JSON.parse(statsData));
            } catch (parseError) {
              console.error('Failed to parse game stats:', parseError);
              resolve(null);
            }
          }
        });
      });
    } catch (error) {
      console.error('Failed to get game stats:', error);
      return null;
    }
  }

  showAlert(message: string): void {
    try {
      this.webApp.showAlert(message);
    } catch (error) {
      console.error('Failed to show alert:', error);
      // Fallback to browser alert
      alert(message);
    }
  }

  showConfirm(message: string, callback: (confirmed: boolean) => void): void {
    try {
      this.webApp.showConfirm(message, callback);
    } catch (error) {
      console.error('Failed to show confirm:', error);
      // Fallback to browser confirm
      const confirmed = confirm(message);
      callback(confirmed);
    }
  }

  isTelegramApp(): boolean {
    try {
      return this.webApp.isVersionAtLeast('6.1');
    } catch (error) {
      return false;
    }
  }

  getPlatform(): string {
    try {
      return this.webApp.platform;
    } catch (error) {
      return 'unknown';
    }
  }

  getViewportHeight(): number {
    try {
      return this.webApp.viewportHeight || window.innerHeight;
    } catch (error) {
      return window.innerHeight;
    }
  }

  getViewportWidth(): number {
    try {
      // Telegram Web App doesn't have viewportWidth, use window width
      return window.innerWidth;
    } catch (error) {
      return window.innerWidth;
    }
  }
}

export const telegramService = new TelegramService();
export default telegramService;
