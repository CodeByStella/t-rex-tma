import { FC, useState } from 'react';
import { TilingSprite, Container, useTick } from '@pixi/react';
import SpriteImage from '@/assets/sprite.png';
import { VIEW_PORT_WIDTH } from '@/global/constants';

interface GroundProps {
	gameSpeed: number;
}

export const Ground: FC<GroundProps> = ({ gameSpeed }) => {
	const [xBackground, setXBackground] = useState(-1);

	useTick(() => {
		setXBackground(xBackground - gameSpeed * 2);
	}, gameSpeed > 0);

	return (
		<Container position={[0, 300]}>
			<TilingSprite
				width={VIEW_PORT_WIDTH}
				height={25}
				image={SpriteImage}
				tilePosition={{ x: xBackground, y: 158 }}
			/>
		</Container>
	);
};
