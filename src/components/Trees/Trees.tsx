import { FC, useState, useMemo, useEffect, useContext } from 'react';
import { AbstractTree } from './components';
import { Container, useTick } from '@pixi/react';
import { TREE_STATUS, TREE_TYPE, SMALL_TREE_WIDTH, BIG_TREE_WIDTH } from '@/global/enums';
import { ComponentBuilderProps } from '@/global/interfaces';
import { random, createXY } from '@/global/utils';
import { TOTAL_TREES } from '@/global/constants';
import { AppContext } from '@/global/context';

type TreesProps = Omit<ComponentBuilderProps, 'key'>;

export const Trees: FC<TreesProps> = ({ xPos, update }) => {
	const [isSmallTree] = useState(Math.floor(random(2)));
	const [xContainer, setXContainer] = useState(xPos);
	const [trees, setTrees] = useState<JSX.Element[]>([]);
	const [memory, setMemory] = useState<number[]>([]);

	const appContext = useContext(AppContext);
	const gameSpeed = appContext?.gameSpeed ?? 0;
	const treeXPositions = appContext?.store.treeXPositions || [];
	const latestTreeXPos = treeXPositions.length > 0 ? treeXPositions[treeXPositions.length - 1] : xPos;

	const treeType = useMemo(() => {
		if (isSmallTree === TREE_STATUS.SMALL) {
			return Math.floor(random(4));
		}
		return Math.floor(random(3));
	}, []);

	const treeWidth = useMemo(() => {
		if (isSmallTree === TREE_STATUS.SMALL) {
			if (treeType === TREE_TYPE.TYPE_0 || treeType === TREE_TYPE.TYPE_3) {
				return SMALL_TREE_WIDTH.WIDTH_37;
			}
			return SMALL_TREE_WIDTH.WIDTH_35;
		} else {
			if (treeType === TREE_TYPE.TYPE_2) {
				return BIG_TREE_WIDTH.WIDTH_104;
			}
			return BIG_TREE_WIDTH.WIDTH_50;
		}
	}, []);

	useEffect(() => {
		const memoArrayX: number[] = [];

		const newTrees = Array.from({ length: TOTAL_TREES }, (_, i) => {
			const x = createXY(memoArrayX, latestTreeXPos || 100, latestTreeXPos + 100, treeWidth);

			if (i === TOTAL_TREES - 1) {
				const sortedMemoArrayX = memoArrayX.sort((a, b) => a - b);
				if (appContext) {
					appContext.dispatch({ type: 'UPDATE_TREE_X_POSITIONS', payload: sortedMemoArrayX });
				}
				setMemory(sortedMemoArrayX);
			}

			return (
				<AbstractTree
					key={x}
					x={x}
					y={isSmallTree === TREE_STATUS.SMALL ? 250 : 225}
					treeType={treeType}
					isSmallTree={isSmallTree}
				/>
			);
		});

		setTrees(newTrees.sort((a, b) => a.props.x - b.props.x));
	}, []);

	useTick(() => {
		setXContainer((prev) => prev - gameSpeed * 2);
	}, gameSpeed > 0);

	useEffect(() => {
		if (memory.length === 0) return;

		// @ts-ignore
		const containerIsInViewport = xContainer + memory.at(-1) + treeWidth > 0;

		if (!containerIsInViewport) {
			update();
		}
	}, [xContainer]);

	return <Container position={[xContainer, 0]}>{trees}</Container>;
};
