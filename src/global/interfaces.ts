import { Container as PixiContainer, DisplayObject as PixiDisplayObject } from '@pixi/display';

export interface ComponentBuilderProps {
    key: string;
    xPos: number;
    update: () => void;
}

export interface AppContextTypes {
    detectCollision: (ref: PixiObject) => void;
    gameOver: boolean;
    store: State;
    dispatch: (action: Action) => void;
    gameSpeed: number;
}

export type PixiObject = PixiContainer<PixiDisplayObject>

export interface State {
    cloudXPositions: number[];
    treeXPositions: number[];
    birdXPositions: number[];
}

export interface Action {
    type: string;
    payload: number[];
}