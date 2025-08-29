import { useEffect, useState, useCallback, FC, useRef } from 'react';
import { Stage, Container, Text } from '@pixi/react';
import { TextStyle } from 'pixi.js';
import { Ground, Clouds, Wrapper, Dino, Trees, GameOver, BtnRestart, Birds } from '@/components';
import { 
	VIEW_PORT_WIDTH, 
	HALF_VIEW_PORT_WIDTH, 
	GAME_HEIGHT, 
	SCORE_FONT_SIZE, 
	SCORE_Y_POSITION,
	IS_MOBILE,
	GLOBAL_SCALE
} from '@/global/constants';
import { ComponentBuilderProps, PixiObject } from '@/global/interfaces';
import { AppContext } from '@/global/context';
import {
	setGameSpeedToSessionStorage,
	getGameSpeedFromSessionStorage,
	removeGameSpeedFromSessionStorage,
} from '@/global/utils';
import { GAME_SPEED } from '@/global/enums';
import { useStore } from '@/hooks';
import telegramService from '@/global/telegramService';

interface GameProps {
	restartGame: () => void;
}

export const Game: FC<GameProps> = ({ restartGame }) => {
	const [gameSpeed, setGameSpeed] = useState(0);
	const [dinoRef, setDinoRef] = useState<PixiObject | null>(null);
	const [gameOver, setGameOver] = useState(false);
	const [score, setScore] = useState(0);
	const [highScore, setHighScore] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [treesEnabled, setTreesEnabled] = useState(false);
	const gameSpeedRef = useRef(gameSpeed);
	const treesTimerRef = useRef<number | null>(null);

	const appStore = useStore();
	const { state: store, dispatch } = appStore;

	// Update ref when gameSpeed changes
	useEffect(() => {
		gameSpeedRef.current = gameSpeed;
	}, [gameSpeed]);

	// Initialize Telegram Mini App
	useEffect(() => {
		telegramService.init();
		loadHighScore();
	}, []);

	const loadHighScore = async () => {
		try {
			const score = await telegramService.getHighScore();
			setHighScore(score);
		} catch (error) {
			console.error('Failed to load high score:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const cloudsBuilder = useCallback(({ key, xPos, update }: ComponentBuilderProps): JSX.Element => {
		return <Clouds key={key} xPos={xPos} update={update} />;
	}, []);

	const treesBuilder = useCallback(({ key, xPos, update }: ComponentBuilderProps): JSX.Element => {
		return <Trees key={key} xPos={xPos} update={update} />;
	}, []);
	const birdsBuilder = useCallback(({ key, xPos, update }: ComponentBuilderProps): JSX.Element => {
		return <Birds key={key} xPos={xPos} update={update} />;
	}, []);

	const detectCollision = useCallback(
		(treeRef: PixiObject) => {
			if (treeRef && dinoRef) {
				const bounds1 = treeRef.getBounds();
				const bounds2 = dinoRef.getBounds();

				if (
					bounds1.x < bounds2.x + bounds2.width &&
					bounds1.x + bounds1.width > bounds2.x &&
					bounds1.y < bounds2.y + bounds2.height - 30 &&
					bounds1.y + bounds1.height - 30 > bounds2.y
				) {
					setGameSpeed(GAME_SPEED.DEFAULT);
					removeGameSpeedFromSessionStorage();
					setGameOver(true);
				}
			}
		},
		[dinoRef]
	);

	const handleKeyDown = (e: KeyboardEvent) => {
		const keyCode = e.code;
		if (keyCode === 'Space') {
			if (!gameOver) {
				// Prevent the very first Space press from triggering other listeners (e.g., dino jump)
				if (gameSpeedRef.current === GAME_SPEED.DEFAULT) {
					e.preventDefault();
					// stopImmediatePropagation may not exist on all environments; guard its usage
					const evt: any = e as any;
					if (typeof evt.stopImmediatePropagation === 'function') {
						evt.stopImmediatePropagation();
					}
				}
				setGameSpeed(GAME_SPEED.START);
				setGameSpeedToSessionStorage(GAME_SPEED.START);
			} else {
				handleResetBtn();
			}
		}
	};

	const handleTouchStart = () => {
		if (!gameOver) {
			setGameSpeed(GAME_SPEED.START);
			setGameSpeedToSessionStorage(GAME_SPEED.START);
		} else {
			handleResetBtn();
		}
	};

	const handleResetBtn = () => {
		document.removeEventListener('keydown', handleKeyDown);
		restartGame();
	};

	// Helper to simulate keyboard events so existing listeners handle actions
	const dispatchKeyEvent = (code: string, type: 'keydown' | 'keyup' = 'keydown') => {
		const event = new KeyboardEvent(type, {
			code,
			bubbles: true,
			cancelable: true,
		});
		document.dispatchEvent(event);
	};

	// UI control handlers
	const handleUiStart = () => {
		// Mirrors Space key which starts or restarts
		dispatchKeyEvent('Space', 'keydown');
	};

	const handleUiJump = () => {
		// Mirrors ArrowUp/Space for jump
		dispatchKeyEvent('ArrowUp', 'keydown');
	};

	const handleUiDuckDown = () => {
		dispatchKeyEvent('ArrowDown', 'keydown');
	};

	const handleUiDuckUp = () => {
		dispatchKeyEvent('ArrowDown', 'keyup');
	};

	useEffect(() => {
		const gameSpeed = getGameSpeedFromSessionStorage();
		if (gameSpeed > GAME_SPEED.DEFAULT) {
			removeGameSpeedFromSessionStorage();
		}

		document.addEventListener('keydown', handleKeyDown);

		// Add touch event listener for mobile
		if (IS_MOBILE) {
			document.addEventListener('touchstart', handleTouchStart, { passive: true });
		}

		if (gameOver) {
			if (score > highScore) {
				setHighScore(score);
				telegramService.setHighScore(score);
				
				// Show congratulations message
				if (score > 100) {
					telegramService.showAlert(`🎉 New High Score: ${score}! Amazing job!`);
				}
			}
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			if (IS_MOBILE) {
				document.removeEventListener('touchstart', handleTouchStart);
			}
		};
	}, [gameOver, score, highScore]);

	useEffect(() => {
		if (score > 0 && score % 200 === 0) {
			const newGameSpeed = GAME_SPEED.START + score/200;
			setGameSpeed(newGameSpeed);
			setGameSpeedToSessionStorage(newGameSpeed);
		}
	}, [score, gameSpeed]);

	useEffect(() => {
		let intervalID: number;

		if (gameSpeed >= GAME_SPEED.START && !gameOver) {
			intervalID = window.setInterval(() => {
				const newScore = score + 1;
				setScore(newScore);
			}, 100);
		}

		return () => {
			if (intervalID) {
				window.clearInterval(intervalID);
			}
		};
	}, [gameSpeed, gameOver, score]);

	// Enable trees 5 seconds after the game starts
	useEffect(() => {
		// Clear any existing timer
		if (treesTimerRef.current) {
			window.clearTimeout(treesTimerRef.current);
			treesTimerRef.current = null;
		}

		if (gameSpeed >= GAME_SPEED.START && !gameOver) {
			setTreesEnabled(false);
			treesTimerRef.current = window.setTimeout(() => {
				setTreesEnabled(true);
			}, 5000);
		} else {
			setTreesEnabled(false);
		}

		return () => {
			if (treesTimerRef.current) {
				window.clearTimeout(treesTimerRef.current);
				treesTimerRef.current = null;
			}
		};
	}, [gameSpeed, gameOver]);

	if (isLoading) {
		return (
			<div style={{ 
				display: 'flex', 
				justifyContent: 'center', 
				alignItems: 'center', 
				height: '100vh',
				fontSize: '18px',
				color: '#333'
			}}>
				Loading game...
			</div>
		);
	}

	// Text styles
	const scoreTextStyle = new TextStyle({ fill: '#111111', fontSize: SCORE_FONT_SIZE, fontWeight: 'bold' });
	const promptTextStyle = new TextStyle({ fill: '#111111', fontSize: SCORE_FONT_SIZE + 6, fontWeight: 'bold' });

	return (
		<>
		<Stage width={VIEW_PORT_WIDTH} height={GAME_HEIGHT} options={{ antialias: true, background: '#ffffff' }}>
			<Container sortableChildren={true} scale={{ x: GLOBAL_SCALE, y: GLOBAL_SCALE }}>
				<AppContext.Provider
					value={{
						detectCollision,
						gameOver,
						store,
						dispatch,
						gameSpeed,
					}}
				>
					{score >= 100 && (
						<Wrapper
							componentBuilder={birdsBuilder}
							total={2}
							width={VIEW_PORT_WIDTH}
							skipFirstElement={true}
						/>
					)}
					<Wrapper componentBuilder={cloudsBuilder} total={3} width={HALF_VIEW_PORT_WIDTH} />
					<Dino gameSpeed={gameSpeed} setRef={setDinoRef} />
					{!treesEnabled && null}
					{treesEnabled && (
						<Wrapper
							componentBuilder={treesBuilder}
							total={2}
							width={VIEW_PORT_WIDTH}
							skipFirstElement={true}
						/>
					)}
					<Ground gameSpeed={gameSpeed} />
				</AppContext.Provider>
			</Container>
			<Container>
				<Text 
					text={`Score: ${score}`} 
					x={HALF_VIEW_PORT_WIDTH / 4} 
					y={SCORE_Y_POSITION}
					style={scoreTextStyle}
				/>
				<Text 
					text={`High Score: ${highScore}`} 
					x={HALF_VIEW_PORT_WIDTH} 
					y={SCORE_Y_POSITION}
					style={scoreTextStyle}
				/>
			</Container>
			<Container visible={gameOver}>
				<GameOver />
				<BtnRestart restartGame={handleResetBtn} />
			</Container>
			
			{/* Mobile touch instruction overlay */}
			{IS_MOBILE && !gameOver && gameSpeed === 0 && (
				<Container>
					<Text 
						text="Tap to start!" 
						x={VIEW_PORT_WIDTH / 2} 
						y={GAME_HEIGHT / 2}
						anchor={{ x: 0.5, y: 0.5 }}
						style={promptTextStyle}
					/>
				</Container>
			)}
		</Stage>

		{/* On-screen controls overlay */}
		<div
			style={{
				position: 'fixed',
				left: 0,
				right: 0,
				bottom: 16,
				display: 'flex',
				justifyContent: 'center',
				gap: 12,
				pointerEvents: 'auto',
			}}
		>
			<button
				aria-label="Start or Restart"
				onClick={handleUiStart}
				style={{
					padding: '10px 14px',
					fontSize: 16,
					borderRadius: 8,
					border: '1px solid #ccc',
					background: '#f8f8f8',
					cursor: 'pointer',
				}}
			>
				{gameOver ? 'Restart' : gameSpeed === 0 ? 'Start' : 'Running'}
			</button>
			<button
				aria-label="Jump"
				onClick={handleUiJump}
				style={{
					padding: '10px 14px',
					fontSize: 16,
					borderRadius: 8,
					border: '1px solid #ccc',
					background: '#f0f9ff',
					cursor: 'pointer',
				}}
			>
				Jump
			</button>
			<button
				aria-label="Duck"
				onMouseDown={handleUiDuckDown}
				onMouseUp={handleUiDuckUp}
				onMouseLeave={handleUiDuckUp}
				onTouchStart={handleUiDuckDown}
				onTouchEnd={handleUiDuckUp}
				style={{
					padding: '10px 14px',
					fontSize: 16,
					borderRadius: 8,
					border: '1px solid #ccc',
					background: '#fff7ed',
					cursor: 'pointer',
				}}
			>
				Duck
			</button>
		</div>
		</>
	);
};
