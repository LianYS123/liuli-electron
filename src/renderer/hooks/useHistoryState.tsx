import { useLocation, useNavigate } from 'react-router-dom';
import { QueryData } from '../services/types';

export const useHistoryState = () => {
  const nav = useNavigate();
  const { pathname, state: s } = useLocation();
  const state = (s || {}) as QueryData;

  const setState = (data: QueryData) => {
    nav(pathname, {
      state: {
        ...state,
        ...data,
      },
    });
  };
  return { state, setState };
};
