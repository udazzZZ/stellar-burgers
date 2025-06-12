import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { selectUser } from 'src/services/slices/userSlice';
import { useSelector } from 'src/services/store';

export const AppHeader: FC = () => {
  const userName = useSelector(selectUser)?.name || '';
  return <AppHeaderUI userName={userName} />;
};
