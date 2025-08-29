import { FC, useEffect, useState } from 'react';
import { AnimatedSprite, Container } from '@pixi/react';
import { Texture, Resource, Assets } from 'pixi.js';

interface WalkingDinoProps {
	visible: boolean;
	gameSpeed: number;
}

export const WalkingDino: FC<WalkingDinoProps> = ({ visible, gameSpeed }) => {
	const [frames, setFrames] = useState<Texture<Resource>[]>([]);
	const [animationSpeed, setAnimationSpeed] = useState<number>(-0.1);

	useEffect(() => {
		Assets.load('./walking-dino.json').then((data) => {
			const textures = data.textures;
			setFrames(
				Object.keys(textures).map((key: string) => {
					return textures[key];
				})
			);
		});
	}, []);

	useEffect(() => {
		if (gameSpeed % 2 === 0) {
			setAnimationSpeed(animationSpeed + 0.1);
		}
	}, [gameSpeed]);

	if (frames.length === 0) {
		return null;
	}

	return (
		<Container visible={visible}>
			<AnimatedSprite animationSpeed={animationSpeed} isPlaying={true} textures={frames} />
		</Container>
	);
};
