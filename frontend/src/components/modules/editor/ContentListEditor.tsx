import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { List } from '@mui/material';
import ContentListItem, { Item } from './ContentListItem';

interface EditorProps<T extends Item> {
  items: T[];
  setItems: (items: T[]) => void;
}

export default function ContentListEditor<T extends Item>({
  items,
  setItems,
}: EditorProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleContentDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldItems = [...items];

      setItems(arrayMove(oldItems, active.id as number, over.id as number));
    }
  };

  return (
    <List>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleContentDragEnd}
      >
        <SortableContext
          strategy={verticalListSortingStrategy}
          // string to remove a bug with the first element
          items={items.map((value, index) => `${index}`)}
        >
          {items.map((item, index) => (
            <ContentListItem
              key={item.id}
              id={`${index}`}
              item={item}
              onDelete={() => {
                setItems(items.filter((i) => item.id !== i.id));
              }}
            />
          ))}
        </SortableContext>
      </DndContext>
    </List>
  );
}
