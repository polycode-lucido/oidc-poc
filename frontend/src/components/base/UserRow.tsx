import {
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React from 'react';
import { User } from '../../lib/api/user';
import styles from '../../styles/components/base/UserRow.module.css';
import Polypoints from '../Polypoints';
import ContextualMenu from './ContextualMenu';

type Props = {
  user?: User;
  rank?: number;
  classOverride?: string;
  isMe?: boolean;
  contextualMenuContent?: React.ReactNode;
};

export default function PlayerRow({
  user,
  rank,
  classOverride,
  isMe = false,
  contextualMenuContent,
}: Props) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [target, setTarget] = React.useState<Element | null>(null);

  const handleClick = (event: any) => {
    setTarget(event.currentTarget);
    setIsOpen(true);
  };

  /* eslint-disable no-nested-ternary */
  const rankColor =
    rank === 1
      ? '#FFD700' // gold
      : rank === 2
      ? '#C0C0C0' // silver
      : rank === 3
      ? '#CD7F32' // bronze
      : 'inherit';

  return (
    <Stack
      direction="row"
      className={`${styles.container} ${classOverride}`}
      style={{
        borderColor: isMe ? theme.palette.primary.main : 'inherit',
      }}
    >
      {rank && (
        <Typography color={rankColor} className={styles.column}>
          {`#${rank}`}
        </Typography>
      )}

      {user ? (
        <Typography color="inherit" className={styles.column}>
          {user.username}
        </Typography>
      ) : (
        <Skeleton width={100} />
      )}

      <Stack direction="row" spacing={2} className={styles.column}>
        <Polypoints color="inherit" points={user?.points} size="normal" />
        {contextualMenuContent ? (
          <>
            <IconButton size="medium" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <ContextualMenu
              target={target}
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              direction="right"
            >
              {contextualMenuContent}
            </ContextualMenu>
          </>
        ) : (
          <div />
        )}
      </Stack>
    </Stack>
  );
}

PlayerRow.defaultProps = {
  classOverride: '',
};
