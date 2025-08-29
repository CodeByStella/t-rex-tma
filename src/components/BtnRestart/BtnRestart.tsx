import { FC } from 'react';
import { Sprite, Container } from '@pixi/react';
import { Texture, Rectangle, BaseTexture } from 'pixi.js';
import SpriteImage from '@/assets/sprite.png';
import { HALF_VIEW_PORT_WIDTH } from '@/global/constants';

interface BtnRestartProps {
	restartGame: () => void;
}

export const BtnRestart: FC<BtnRestartProps> = ({ restartGame }) => {
	const width = 70;
	const baseTexture = new BaseTexture(SpriteImage);
	const cropRect = new Rectangle(0, 0, width, 65);
	const croppedTexture = new Texture(baseTexture, cropRect);

	return (
		<Container position={[HALF_VIEW_PORT_WIDTH - width / 2, 50]}>
			<Sprite interactive texture={croppedTexture} cursor="pointer" onclick={restartGame} />
		</Container>
	);
};
