import { FC, useState, useEffect } from 'react';
import { ComponentBuilderProps } from '@/global/interfaces';
import { v1 as uuidv1 } from 'uuid';

interface WrapperProps {
	componentBuilder: (args: ComponentBuilderProps) => JSX.Element;
	total: number;
	width: number;
	skipFirstElement?: boolean;
}

export const Wrapper: FC<WrapperProps> = ({ componentBuilder, total, width, skipFirstElement }) => {
	const [shouldUpdate, setUpdate] = useState(false);
	const [elements, setElements] = useState<JSX.Element[]>([]);

	useEffect(() => {
		setElements(
			Array.from({ length: total }, (_, i) => {
				let index = skipFirstElement ? i + 1 : i;

				return componentBuilder({
					key: uuidv1(),
					xPos: width * index,
					update: () => setUpdate(true),
				});
			})
		);
	}, [total, width, skipFirstElement]);

	useEffect(() => {
		if (shouldUpdate) {
			elements.shift();
			const newElements = elements;
			const element = componentBuilder({
				key: uuidv1(),
				// @ts-ignore
				xPos: width + elements.at(-1).props.xPos / 2,
				update: () => setUpdate(true),
			});
			newElements.push(element);

			setElements(newElements);
			setUpdate(false);
		}
	}, [shouldUpdate]);

	return <>{elements.map((element) => element)}</>;
};
