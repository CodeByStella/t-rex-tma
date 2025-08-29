import { FC, useMemo, useContext, useRef } from 'react';
import { Sprite, useTick } from '@pixi/react';
import { Texture, Rectangle, BaseTexture } from 'pixi.js';
import SpriteImage from '@/assets/sprite.png';
import { TREE_STATUS } from '@/global/enums';
import { AppContext } from '@/global/context';
import { rectBuilder } from './rectBuilder';

interface BigTreeProps {
	x: number;
	y: number;
	treeType: number;
	isSmallTree: TREE_STATUS;
}

const baseTexture = new BaseTexture(SpriteImage);

export const AbstractTree: FC<BigTreeProps> = ({ x, y, treeType, isSmallTree }) => {
	const cropRect = useMemo(() => {
		const rect = rectBuilder(treeType, isSmallTree);

		return new Rectangle(rect.rectX, rect.rectY, rect.rectW, rect.rectH);
	}, [treeType, isSmallTree]);

	const croppedTexture = useMemo(() => {
		return new Texture(baseTexture, cropRect);
	}, [cropRect]);

	const treeRef = useRef(null);

	const appContext = useContext(AppContext);

	useTick(() => {
		if (treeRef.current && appContext) {
			appContext.detectCollision(treeRef.current);
		}
	});

	return <Sprite texture={croppedTexture} x={x} y={y} ref={treeRef} />;
};
