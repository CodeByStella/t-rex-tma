import { FC } from 'react';
import { Sprite, Container } from '@pixi/react';
import { Texture, Rectangle, BaseTexture } from 'pixi.js';
import SpriteImage from '@/assets/sprite.png';

interface DefaultDinoProps {
	visible: boolean;
}

export const DefaultDino: FC<DefaultDinoProps> = ({ visible }) => {
	const baseTexture = new BaseTexture(SpriteImage);
	const cropRect = new Rectangle(1335, 0, 88, 94);
	const croppedTexture = new Texture(baseTexture, cropRect);

	return (
		<Container visible={visible}>
			<Sprite texture={croppedTexture} />
		</Container>
	);
};
