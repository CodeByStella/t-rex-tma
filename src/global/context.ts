import { createContext } from 'react';
import { AppContextTypes } from './interfaces';

export const AppContext = createContext<AppContextTypes | undefined>(undefined);