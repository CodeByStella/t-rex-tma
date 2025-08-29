import { FC } from 'react';
import { Sprite } from '@pixi/react';
import { Texture, Rectangle, BaseTexture } from 'pixi.js';
import SpriteImage from '@/assets/sprite.png';
import { CLOUD_WIDTH } from '@/global/constants';

interface CloudProps {
	x: number;
	y: number;
}

const baseTexture = new BaseTexture(SpriteImage);
const cropRect = new Rectangle(162, 0, CLOUD_WIDTH, 100);
const croppedTexture = new Texture(baseTexture, cropRect);

export const Cloud: FC<CloudProps> = ({ x, y }) => {
	return <Sprite texture={croppedTexture} x={x} y={y} />;
};
