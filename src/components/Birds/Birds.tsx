import React, { useState, useEffect, useContext } from 'react';
import { Container, useTick } from '@pixi/react';
import { Bird } from './components';
import { createXY } from '@/global/utils';
import { BIRD_WIDTH, TOTAL_BIRDS } from '@/global/constants';
import { ComponentBuilderProps } from '@/global/interfaces';
import { AppContext } from '@/global/context';

type BirdsProps = Omit<ComponentBuilderProps, 'key'>;

const lowestY = 250;

export const Birds: React.FC<BirdsProps> = ({ xPos, update }) => {
	const [xContainer, setXContainer] = useState(xPos);
	const [birds, setBirds] = useState<JSX.Element[]>([]);
	const [memory, setMemory] = useState<number[]>([]);

	const appContext = useContext(AppContext);
	const gameSpeed = appContext?.gameSpeed ?? 0;
	const birdXPositions = appContext?.store.birdXPositions || [];
	const latestBirdXPos = birdXPositions.length > 0 ? birdXPositions[birdXPositions.length - 1] : xPos;

	useEffect(() => {
		const memoArrayX: number[] = [];
		const memoArrayY: number[] = [];

		const newBirds = Array.from({ length: TOTAL_BIRDS }, (_, i) => {
			const x = createXY(memoArrayX, latestBirdXPos, latestBirdXPos + 100, BIRD_WIDTH);
			const y =
				createXY(memoArrayY, 0, lowestY, BIRD_WIDTH) > lowestY
					? lowestY
					: createXY(memoArrayY, 0, lowestY, BIRD_WIDTH);

			if (i === TOTAL_BIRDS - 1) {
				const sortedMemoArrayX = memoArrayX.sort((a, b) => a - b);
				if (appContext) {
					appContext.dispatch({ type: 'UPDATE_BIRD_X_POSITIONS', payload: sortedMemoArrayX });
				}
				setMemory(sortedMemoArrayX);
			}

			return <Bird key={x} x={x} y={y} gameSpeed={gameSpeed} />;
		});

		setBirds(newBirds.sort((a, b) => a.props.x - b.props.x));
	}, []);

	useTick(() => {
		setXContainer(xContainer - gameSpeed * 3);
	}, gameSpeed > 0);

	useEffect(() => {
		if (memory.length === 0) return;

		// @ts-ignore
		const containerIsInViewport = xContainer + memory.at(-1) + BIRD_WIDTH > 0;

		if (!containerIsInViewport) {
			update();
		}
	}, [xContainer]);

	return <Container position={[xContainer, 0]}>{birds}</Container>;
};
