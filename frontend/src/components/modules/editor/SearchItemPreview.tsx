import React from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

import styles from '../../../styles/components/modules/Editor/SearchItemPreview.module.css';

interface Item {
  id?: string;
  name: string;
  description: string;
}

interface ShortItemPreviewProps {
  item: Item;
  onAdd: () => void;
}

export default function ShortItemPreview({
  item,
  onAdd,
}: ShortItemPreviewProps) {
  return (
    <ListItem disablePadding>
      <ListItemIcon className={styles.itemIcon}>
        <IconButton onClick={onAdd} color="primary">
          <AddCircleIcon />
        </IconButton>
      </ListItemIcon>
      <ListItemText className={styles.text}>
        <Typography className={styles.name} component="span">
          {item.name}
        </Typography>
        <Typography
          className={styles.id}
          component="span"
          color="text.secondary"
        >
          {item.description}
        </Typography>
      </ListItemText>
    </ListItem>
  );
}
