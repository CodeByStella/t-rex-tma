import { FC, useEffect, useState, useContext, useRef } from 'react';
import { AnimatedSprite, useTick } from '@pixi/react';
import { Texture, Resource, Assets } from 'pixi.js';
import { AppContext } from '@/global/context';

interface BirdProps {
	x: number;
	y: number;
	gameSpeed: number;
}

export const Bird: FC<BirdProps> = ({ x, y, gameSpeed }) => {
	const [frames, setFrames] = useState<Texture<Resource>[]>([]);
	const [animationSpeed, setAnimationSpeed] = useState<number>(-0.15);

	useEffect(() => {
		Assets.load('./flying-bird.json').then((data) => {
			const textures = data.textures;
			setFrames(
				Object.keys(textures).map((key: string) => {
					return textures[key];
				})
			);
		});
	}, []);

	const birdRef = useRef(null);

	const appContext = useContext(AppContext);

	useTick(() => {
		if (birdRef.current && appContext) {
			appContext.detectCollision(birdRef.current);
		}
	});

	useEffect(() => {
		if (appContext && appContext.gameOver) {
			setAnimationSpeed(0);
		}
	}, [appContext]);

	if (frames.length === 0) {
		return null;
	}

	return (
		<AnimatedSprite
			animationSpeed={animationSpeed}
			isPlaying={true}
			textures={frames}
			position={[x, y]}
			ref={birdRef}
		/>
	);
};
