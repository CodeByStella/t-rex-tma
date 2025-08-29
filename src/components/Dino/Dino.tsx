import { FC, useEffect, useState, useRef, useContext } from 'react';
import { Container, useTick } from '@pixi/react';
import { WalkingDino, DefaultDino, DeadDino, RunningDino } from './components';
import { PixiObject } from '@/global/interfaces';
import { AppContext } from '@/global/context';

interface DinoProps {
	gameSpeed: number;
	setRef: (ref: PixiObject) => void;
}

enum JUMP_STAGE {
	DEFAULT = 0,
	START = 1,
	END = 2,
}

// Physics constants for realistic gravity
const GRAVITY = 1;
const JUMP_VELOCITY = -18;
const GROUND_Y = 230;
const RUNNING_GROUND_Y = 265;

export const Dino: FC<DinoProps> = ({ gameSpeed, setRef }) => {
	const [jump, setJump] = useState<number>(JUMP_STAGE.DEFAULT);
	const [isDinoRunning, setIsDinoRunning] = useState<boolean>(false);
	const [dinoYPos, setDinoYPos] = useState(GROUND_Y);
	const [velocity, setVelocity] = useState<number>(0);

	const jumpRef = useRef<number>(jump);
	const isDinoRunningRef = useRef<boolean>(isDinoRunning);
	const gameSpeedRef = useRef<number>(gameSpeed);
	const containerRef = useRef<PixiObject>(null);

	const appContext = useContext(AppContext);
	const isGameOver = appContext?.gameOver || false;

	const handleKeyDown = (e: KeyboardEvent) => {
		const keyCode = e.code;
		if (jumpRef.current === JUMP_STAGE.DEFAULT) {
			if ((keyCode === 'Space' || keyCode === 'ArrowUp') && !isDinoRunningRef.current) {
				setJump(JUMP_STAGE.START);
				setVelocity(JUMP_VELOCITY);
			} else if (keyCode === 'ArrowDown' && gameSpeedRef.current > 0) {
				setIsDinoRunning(true);
			}
		}
	};

	const handleKeyUp = (e: KeyboardEvent) => {
		const keyCode = e.code;
		if (keyCode === 'ArrowDown') {
			setIsDinoRunning(false);
		}
	};

	useEffect(() => {
		jumpRef.current = jump;
	}, [jump]);

	useEffect(() => {
		isDinoRunningRef.current = isDinoRunning;
	}, [isDinoRunning]);

	useEffect(() => {
		gameSpeedRef.current = gameSpeed;
	}, [gameSpeed]);

	useEffect(() => {
		if (gameSpeed === 0) {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		}
	}, [gameSpeed]);

	useEffect(() => {
		if (containerRef.current) {
			setRef(containerRef.current);
		}
	}, [containerRef]);

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);
	}, []);

	useEffect(() => {
		if (jump == JUMP_STAGE.DEFAULT) {
			if (isDinoRunning) {
				setDinoYPos(RUNNING_GROUND_Y);
			} else {
				setDinoYPos(GROUND_Y);
			}
		}
	}, [isDinoRunning, jump]);

	useTick(() => {
		if (gameSpeed > 0) {
			if (jump === JUMP_STAGE.START) {
				// Apply gravity to velocity
				const newVelocity = velocity + GRAVITY;
				setVelocity(newVelocity);
				
				// Update position based on velocity
				const newYPos = dinoYPos + newVelocity;
				setDinoYPos(newYPos);
				
				// Check if we've reached the peak and started falling
				if (newVelocity >= 0) {
					setJump(JUMP_STAGE.END);
				}
			} else if (jump === JUMP_STAGE.END) {
				// Continue applying gravity during fall
				const newVelocity = velocity + GRAVITY;
				setVelocity(newVelocity);
				
				// Update position based on velocity
				const newYPos = dinoYPos + newVelocity;
				setDinoYPos(newYPos);
				
				// Check if we've hit the ground
				const targetGroundY = isDinoRunning ? RUNNING_GROUND_Y : GROUND_Y;
				if (newYPos >= targetGroundY) {
					setDinoYPos(targetGroundY);
					setJump(JUMP_STAGE.DEFAULT);
					setVelocity(0);
				}
			}
		}
	});

	return (
		<Container ref={containerRef} position={[50, dinoYPos]} zIndex={2}>
			<DefaultDino visible={gameSpeed === 0 || jump !== JUMP_STAGE.DEFAULT || !!isGameOver} />
			<WalkingDino
				visible={gameSpeed > 0 && jump === JUMP_STAGE.DEFAULT && !isDinoRunning}
				gameSpeed={gameSpeed}
			/>
			<RunningDino visible={isDinoRunning && jump === JUMP_STAGE.DEFAULT} gameSpeed={gameSpeed} />
			<DeadDino visible={isGameOver === true} />
		</Container>
	);
};
