import { FC } from 'react';
import { Sprite, Container } from '@pixi/react';
import { Texture, Rectangle, BaseTexture } from 'pixi.js';
import SpriteImage from '@/assets/sprite.png';
import { HALF_VIEW_PORT_WIDTH } from '@/global/constants';

interface GameOverProps {}

export const GameOver: FC<GameOverProps> = ({}) => {
	const width = 385;
	const baseTexture = new BaseTexture(SpriteImage);
	const cropRect = new Rectangle(950, 25, width, 30);
	const croppedTexture = new Texture(baseTexture, cropRect);

	return (
		<Container position={[HALF_VIEW_PORT_WIDTH - width / 2, 0]}>
			<Sprite texture={croppedTexture} />
		</Container>
	);
};
