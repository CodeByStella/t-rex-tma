import { FC } from 'react';
import { Sprite, Container } from '@pixi/react';
import { Texture, Rectangle, BaseTexture } from 'pixi.js';
import SpriteImage from '@/assets/sprite.png';

interface DeadDinoProps {
	visible: boolean;
}

export const DeadDino: FC<DeadDinoProps> = ({ visible }) => {
	const baseTexture = new BaseTexture(SpriteImage);
	const cropRect = new Rectangle(1775, 0, 89, 94);
	const croppedTexture = new Texture(baseTexture, cropRect);

	return (
		<Container visible={visible}>
			<Sprite texture={croppedTexture} />
		</Container>
	);
};
