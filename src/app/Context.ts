import {
  AppContext as AppContextType,
  DataContext as DataContextType,
  ModificationContext as ModificationContextType,
} from '@/types/BaseTypes';
import { createContext, useContext } from 'react';

const AppContext = createContext<AppContextType>({} as AppContextType);
export const useApp = () => useContext(AppContext);
export const AppProvider = AppContext.Provider;

const DataContext = createContext<DataContextType>({} as DataContextType);
export const useData = () => useContext(DataContext);
export const DataProvider = DataContext.Provider;

const ModificationContext = createContext<ModificationContextType>(
  {} as ModificationContextType
);
export const useModification = () => useContext(ModificationContext);
export const ModificationProvider = ModificationContext.Provider;
