import { useState, useEffect } from 'react';
import { Game } from '@/components';
import telegramService from '@/global/telegramService';

function App() {
	const [shouldRestart, setShouldRestart] = useState(false);
	const [isTelegramReady, setIsTelegramReady] = useState(false);

	useEffect(() => {
		// Initialize Telegram Mini App
		telegramService.init();
		setIsTelegramReady(true);
	}, []);

	useEffect(() => {
		if (shouldRestart) {
			setShouldRestart(false);
		}
	}, [shouldRestart]);

	if (!isTelegramReady) {
		return (
			<div style={{ 
				display: 'flex', 
				justifyContent: 'center', 
				alignItems: 'center', 
				height: '100vh',
				fontSize: '18px',
				color: '#333',
				backgroundColor: '#ffffff'
			}}>
				Initializing Telegram Mini App...
			</div>
		);
	}

	return !shouldRestart ? <Game restartGame={() => setShouldRestart(true)} /> : null;
}

export default App;
