import React, { useState, useEffect, useContext } from 'react';
import { Container, useTick } from '@pixi/react';
import { Cloud } from './components';
import { createXY } from '@/global/utils';
import { CLOUD_WIDTH, TOTAL_CLOUDS } from '@/global/constants';
import { ComponentBuilderProps } from '@/global/interfaces';
import { AppContext } from '@/global/context';

type CloudsProps = Omit<ComponentBuilderProps, 'key'>;

const lowestY = 200;

export const Clouds: React.FC<CloudsProps> = ({ xPos, update }) => {
	const [xContainer, setXContainer] = useState(xPos);
	const [clouds, setClouds] = useState<JSX.Element[]>([]);
	const [memory, setMemory] = useState<number[]>([]);

	const appContext = useContext(AppContext);
	const gameSpeed = appContext?.gameSpeed ?? 0;
	const cloudXPositions = appContext?.store.cloudXPositions || [];
	const latestCloudXPos = cloudXPositions.length > 0 ? cloudXPositions[cloudXPositions.length - 1] : xPos;

	useEffect(() => {
		const memoArrayX: number[] = [];
		const memoArrayY: number[] = [];

		const newClouds = Array.from({ length: TOTAL_CLOUDS }, (_, i) => {
			const x = createXY(memoArrayX, latestCloudXPos, latestCloudXPos + 100, CLOUD_WIDTH);
			const y =
				createXY(memoArrayY, 0, lowestY, CLOUD_WIDTH) > lowestY
					? lowestY
					: createXY(memoArrayY, 0, lowestY, CLOUD_WIDTH);

			if (i === TOTAL_CLOUDS - 1) {
				const sortedMemoArrayX = memoArrayX.sort((a, b) => a - b);
				if (appContext) {
					appContext.dispatch({ type: 'UPDATE_CLOUD_X_POSITIONS', payload: sortedMemoArrayX });
				}
				setMemory(sortedMemoArrayX);
			}

			return <Cloud key={x} x={x} y={y} />;
		});

		setClouds(newClouds.sort((a, b) => a.props.x - b.props.x));
	}, []);

	useTick(() => {
		setXContainer((prev) => prev - gameSpeed);
	}, gameSpeed > 0);

	useEffect(() => {
		if (memory.length === 0) return;

		// @ts-ignore
		const containerIsInViewport = xContainer + memory.at(-1) + CLOUD_WIDTH > 0;

		if (!containerIsInViewport) {
			update();
		}
	}, [xContainer]);

	return <Container position={[xContainer, 0]}>{clouds}</Container>;
};
