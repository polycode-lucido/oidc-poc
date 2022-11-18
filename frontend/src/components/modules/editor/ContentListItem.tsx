import {
  Box,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Delete } from '@mui/icons-material';

import styles from '../../../styles/components/modules/Editor/ContentListItem.module.css';

export interface Item {
  id?: string;
  name: string;
  description: string;
}

interface ItemProps {
  id: string;
  item: Item;
  onDelete: () => void;
}

export default function ContentListItem({ id, item, onDelete }: ItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <ListItem
        secondaryAction={
          <IconButton onClick={onDelete}>
            <Delete />
          </IconButton>
        }
      >
        <ListItemIcon
          {...attributes}
          {...listeners}
          className={styles.grabIcon}
        >
          <DragIndicatorIcon />
        </ListItemIcon>

        <ListItemText>
          <Box className={styles.listContent}>
            <Typography
              variant="body1"
              component="span"
              className={styles.name}
            >
              {item.name}
            </Typography>
            <Box className={styles.spacer} />
            <Typography
              variant="body1"
              component="span"
              color="text.secondary"
              fontSize="small"
            >
              {item.description}
            </Typography>
          </Box>
        </ListItemText>
      </ListItem>
    </div>
  );
}
