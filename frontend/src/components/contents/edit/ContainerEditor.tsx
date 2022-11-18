import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { Delete, ExpandMore } from '@mui/icons-material';
import { format, useTranslation } from '../../../lib/translations';
import {
  Component,
  ComponentType,
  ContainerComponent,
  EditorLanguage,
} from '../../../lib/api/content';
import CodeEditorEditor from './CodeEditorEditor';
import MarkdownEditor from './MarkdownEditor';
import NewComponentDialog from './NewComponentDialog';

import stylesCommon from '../../../styles/components/contents/edit/common.module.css';

export type Props = {
  container: ContainerComponent;
  onChange: (container: ContainerComponent) => void;
  currentDepth?: number;
  removeButton?: React.ReactNode;
};

export default function ContainerEditor({
  container,
  onChange,
  currentDepth = 0,
  removeButton,
}: Props) {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);

  // --- handlers ---

  // dialog
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  // sub components
  const setComponents = (components: Component[]) => {
    onChange({
      ...container,
      data: {
        ...container.data,
        components,
      },
    });
  };

  const handleComponentChange = (index: number, component: Component) => {
    const updatedComponents =
      container.data.components?.map((c, i) => (i === index ? component : c)) ||
      [];
    setComponents(updatedComponents);
  };

  const handleComponentAdd = (componentType?: ComponentType) => {
    setIsDialogOpen(false);
    switch (componentType) {
      case 'container':
        setComponents([
          ...(container.data.components || []),
          {
            type: componentType,
            data: {
              orientation: 'horizontal',
              components: [],
            },
          } as ContainerComponent,
        ]);
        break;
      case 'editor':
        setComponents([
          ...(container.data.components || []),
          {
            type: componentType,
            data: {
              items: [],
              validators: [],
              editorSettings: {
                languages: [
                  {
                    language: EditorLanguage.Node,
                    defaultCode: '',
                    version: '',
                  },
                ],
              },
            },
          } as Component,
        ]);
        break;
      case 'markdown':
        setComponents([
          ...(container.data.components || []),
          {
            type: componentType,
            data: {
              markdown: '',
            },
          } as Component,
        ]);
        break;
      default:
        break;
    }
  };

  const handleComponentRemove = (index: number) => {
    const updatedComponents =
      container.data.components?.filter((_, i) => i !== index) || [];
    setComponents(updatedComponents);
  };

  // orientation
  const handleOrientationChange = (orientation: string) => {
    if (orientation === 'horizontal' || orientation === 'vertical') {
      onChange({
        ...container,
        data: {
          ...container.data,
          orientation,
        },
      });
    }
  };

  // --- render ---

  return (
    <Accordion className={stylesCommon.container}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        className={stylesCommon.headerContainer}
      >
        <Stack direction="row" className={stylesCommon.header}>
          <Typography>
            {i18n.t('components.contents.edit.containerEditor.type')}
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary }}>
            {format(
              i18n.t('components.contents.edit.containerEditor.description'),
              '{0}',
              (container.data.components?.length || 0).toString(),
              '{1}',
              (container.data.components?.length || 0) > 1 ? 's' : ''
            )}
          </Typography>
          {removeButton || <div />}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack>
          <Typography>
            {i18n.t('components.contents.edit.containerEditor.orientation')}
          </Typography>
          <RadioGroup
            defaultValue="horizontal"
            onChange={(_, value: string) => handleOrientationChange(value)}
          >
            <FormControlLabel
              value="horizontal"
              label={i18n.t(
                'components.contents.edit.containerEditor.horizontal'
              )}
              control={<Radio />}
            />
            <FormControlLabel
              value="vertical"
              label={i18n.t(
                'components.contents.edit.containerEditor.vertical'
              )}
              control={<Radio />}
            />
          </RadioGroup>
        </Stack>
        <Stack direction="column" spacing={2}>
          {container.data.components?.map((component, index) => {
            switch (component.type) {
              case 'container':
                // We don't pass ContainerEditor directly to prevent dependency cycles
                return (
                  <Box key={component.id}>
                    <ContainerEditor
                      container={component}
                      onChange={(c: Component) =>
                        handleComponentChange(index, c)
                      }
                      currentDepth={currentDepth + 1}
                      removeButton={
                        <IconButton
                          onClick={() => handleComponentRemove(index)}
                        >
                          <Delete />
                        </IconButton>
                      }
                    />
                  </Box>
                );
              case 'editor':
                return (
                  <Box key={component.id}>
                    <CodeEditorEditor
                      editor={component}
                      onChange={(c: Component) =>
                        handleComponentChange(index, c)
                      }
                      removeButton={
                        <IconButton
                          onClick={() => handleComponentRemove(index)}
                        >
                          <Delete />
                        </IconButton>
                      }
                    />
                  </Box>
                );
              case 'markdown':
                return (
                  <Box key={component.id}>
                    <MarkdownEditor
                      key={component.id}
                      markdown={component}
                      onChange={(c: Component) =>
                        handleComponentChange(index, c)
                      }
                      removeButton={
                        <IconButton
                          onClick={() => handleComponentRemove(index)}
                        >
                          <Delete />
                        </IconButton>
                      }
                    />
                  </Box>
                );
              default:
                return null;
            }
          })}
          <Button onClick={handleOpenDialog} variant="contained">
            {i18n.t('components.contents.edit.containerEditor.new')}
          </Button>
          <NewComponentDialog
            isOpen={isDialogOpen}
            onChoose={handleComponentAdd}
            disableContainer={currentDepth >= 2}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
