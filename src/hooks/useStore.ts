import { useReducer } from "react";
import { State, Action } from '../global/interfaces';

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'UPDATE_CLOUD_X_POSITIONS':
            return {
                ...state,
                cloudXPositions: action.payload
            }
        case 'UPDATE_TREE_X_POSITIONS':
            return {
                ...state,
                treeXPositions: action.payload
            }
        case 'UPDATE_BIRD_X_POSITIONS':
            return {
                ...state,
                birdXPositions: action.payload
            }
        default:
            return state;
    }
}

const initialState = {
    cloudXPositions: [],
    treeXPositions: [],
    birdXPositions: []
}

export const useStore = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return {
        state,
        dispatch
    }
}