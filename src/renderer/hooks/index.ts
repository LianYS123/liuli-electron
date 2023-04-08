import { parse } from 'query-string';
import { useLocation } from 'react-use';

export const useSearchParams = () => {
  const { search } = useLocation();
  if (!search) {
    return {};
  }
  return parse(search);
};
