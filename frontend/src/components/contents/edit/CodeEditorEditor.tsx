import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import React, { useEffect } from 'react';
import {
  CodeEditorComponent,
  EditorLanguage,
  EditorSettings,
  getLanguageNameFromEditorLanguage,
  getMonacoLanguageNameFromEditorLanguage,
  Validator,
} from '../../../lib/api/content';
import { useTranslation } from '../../../lib/translations';
import Select from '../../base/Select';

import stylesCommon from '../../../styles/components/contents/edit/common.module.css';
import {
  createItem,
  deleteItem,
  getItem,
  Item,
  updateItem,
} from '../../../lib/api/item';
import { useLoginContext } from '../../../lib/loginContext';
import { toastError } from '../../base/toast/Toast';

export type Props = {
  editor: CodeEditorComponent;
  onChange: (editor: CodeEditorComponent) => void;
  removeButton?: React.ReactNode;
};

export default function CodeEditorEditor({
  editor,
  onChange,
  removeButton,
}: Props) {
  const { i18n } = useTranslation();
  const { credentialsManager } = useLoginContext();

  const [currentLanguage, setCurrentLanguage] = React.useState<EditorLanguage>(
    (editor.data?.editorSettings?.languages[0]?.language ||
      EditorLanguage.Node) as EditorLanguage
  );

  // This is a temporary workaround, this should be more deeply integrated in the next versions of the front / api

  const [updateTimeout, setUpdateTimeout] = React.useState<number | null>(null);
  const [itemsData, setItemsData] = React.useState<(Item | null)[]>([]);
  const [itemsSaved, setItemsSaved] = React.useState<boolean>(true);

  const saveItems = React.useCallback(async () => {
    setUpdateTimeout(null);
    try {
      await Promise.all(
        itemsData.map((item) => {
          if (!item) return null;

          return updateItem(
            item.id,
            item.cost,
            item.type,
            item.data.text,
            credentialsManager
          );
        })
      );
      setItemsSaved(true);
    } catch (err) {
      toastError(
        <Typography>
          {i18n.t('components.contents.edit.codeEditorEditor.hints.errorSave')}
        </Typography>
      );
      return false;
    }
    return true;
  }, [credentialsManager, i18n, itemsData]);

  useEffect(() => {
    setItemsSaved(false);
    const timeout = setTimeout(() => {
      saveItems();
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [saveItems]);

  useEffect(() => {
    const fetchItems = async () => {
      const items = await Promise.all(
        editor.data.items.map(async (id) => {
          try {
            return await getItem(id, credentialsManager);
          } catch (e) {
            toastError(
              <Typography>
                {i18n.t('components.contents.edit.codeEditorEditor.hints.errorFetch')}
              </Typography>
            );
          }
          return null;
        })
      );
      setItemsData(items.filter((item) => item !== null));
    };

    if (credentialsManager.credentials) {
      fetchItems();
    }
  }, [credentialsManager, editor.data.items, i18n]);

  // --- Utils ---
  const hasLanguage = (language: EditorLanguage) =>
    editor.data.editorSettings?.languages?.find(
      (languageSettings) => languageSettings.language === language
    ) !== undefined;

  const getLanguages = () =>
    editor.data.editorSettings?.languages.map((languageSettings) => ({
      name: getLanguageNameFromEditorLanguage(
        languageSettings.language as EditorLanguage
      ),
      value: languageSettings.language,
    })) || [];

  // --- Handlers ---

  // validators
  const setValidators = (validators?: Validator[]) => {
    onChange({
      ...editor,
      data: {
        ...editor.data,
        validators: validators || [],
      },
    });
  };

  const handleValidatorInputChange = (
    validatorIndex: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValidators(
      editor.data.validators?.map((validator, index) => {
        if (index === validatorIndex) {
          return {
            ...validator,
            input: {
              stdin: event.target.value.split('\n'),
            },
          };
        }
        return validator;
      })
    );
  };

  const handleValidatorExpectedOutputChange = (
    validatorIndex: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValidators(
      editor.data.validators?.map((validator, index) => {
        if (index === validatorIndex) {
          return {
            ...validator,
            expected: {
              stdout: event.target.value.split('\n'),
            },
          };
        }
        return validator;
      })
    );
  };

  const handleValidatorHiddenChange = (
    validatorIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValidators(
      editor.data.validators?.map((validator, index) => {
        if (index === validatorIndex) {
          return {
            ...validator,
            isHidden: event.target.checked,
          };
        }
        return validator;
      })
    );
  };

  const handleAddValidator = () => {
    const validator = {
      input: {
        stdin: [''],
      },
      expected: {
        stdout: [''],
      },
      isHidden: false,
    } as Validator;
    setValidators([...(editor.data.validators || []), validator]);
  };

  const handleDeleteValidator = (validatorIndex: number) => {
    setValidators(
      editor.data.validators?.filter((_, index) => index !== validatorIndex)
    );
  };

  // editor settings
  const setEditorSettings = (editorSettings?: EditorSettings) => {
    onChange({
      ...editor,
      data: {
        ...editor.data,
        editorSettings: editorSettings || {
          languages: [],
        },
      },
    });
  };

  const handleEditorLanguageChange = (
    language: EditorLanguage,
    checked: boolean
  ) => {
    if (checked) {
      setEditorSettings({
        ...editor.data.editorSettings,
        languages: [
          ...(editor.data.editorSettings?.languages || []),
          {
            language,
            defaultCode: '',
            version: '',
          },
        ],
      });
    } else {
      const updatedLanguages =
        editor.data.editorSettings?.languages?.filter(
          (languageSettings) => languageSettings.language !== language
        ) || [];
      if (language === currentLanguage) {
        setCurrentLanguage(
          (updatedLanguages[0]?.language ||
            EditorLanguage.Node) as EditorLanguage
        );
      }
      setEditorSettings({
        ...editor.data.editorSettings,
        languages: updatedLanguages,
      });
    }
  };

  const handleEditorDefaultCodeChange = (value: string) => {
    const updatedLanguages =
      editor.data.editorSettings?.languages.map((languageSettings) => {
        if (languageSettings.language === currentLanguage) {
          return {
            ...languageSettings,
            defaultCode: value,
          };
        }
        return languageSettings;
      }) || [];
    setEditorSettings({
      languages: updatedLanguages,
    });
  };

  // handle hints here

  const handleAddHint = async () => {
    try {
      const hint = await createItem(10, 'hint', '', credentialsManager);

      // save hints before triggering a fetch

      if (updateTimeout !== null) clearTimeout(updateTimeout);
      await saveItems();

      // append hint to editor
      onChange({
        ...editor,
        data: {
          ...editor.data,
          items: [...(editor.data.items || []), hint.id],
        },
      });
    } catch (e) {
      toastError(
        <Typography>
          {i18n.t('components.contents.edit.codeEditorEditor.hints.errorNew')}
        </Typography>
      );
    }
  };

  const handleDeleteHint = async (hintId: string) => {
    try {
      // save hints before triggering a fetch
      if (updateTimeout !== null) clearTimeout(updateTimeout);
      await saveItems();

      try {
        await deleteItem(hintId, credentialsManager);
      } catch (e) {
        toastError(
          <Typography>
            {i18n.t(
              'components.contents.edit.codeEditorEditor.hints.errorDelete'
            )}
          </Typography>
        );
      }
      onChange({
        ...editor,
        data: {
          ...editor.data,
          items: editor.data.items.filter((id) => id !== hintId),
        },
      });
    } catch (e) {
      toastError(
        <Typography>
          {i18n.t(
            'components.contents.edit.codeEditorEditor.hints.errorDelete'
          )}
        </Typography>
      );
    }
  };

  const handleHintCostChange = (
    hintIndex: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setItemsData(
      itemsData.map((item, index) => {
        if (item === null) return null;
        if (index === hintIndex) {
          return {
            ...item,
            cost: parseInt(event.target.value, 10),
          };
        }
        return item;
      })
    );
  };

  const handleHintTextChange = (
    hintIndex: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setItemsData(
      itemsData.map((item, index) => {
        if (item === null) return null;
        if (index === hintIndex) {
          return {
            ...item,
            data: {
              text: event.target.value,
            },
          };
        }
        return item;
      })
    );
  };

  // --- Render ---

  const renderLanguageCheckbox = (language: EditorLanguage) => (
    <FormControlLabel
      control={
        <Checkbox
          checked={hasLanguage(language)}
          disabled={
            (editor.data.editorSettings?.languages?.length || 0) <= 1 &&
            hasLanguage(language)
          }
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleEditorLanguageChange(language, event.target.checked)
          }
        />
      }
      label={getLanguageNameFromEditorLanguage(language)}
    />
  );

  return (
    <Accordion className={stylesCommon.container}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        className={stylesCommon.headerContainer}
      >
        <Stack direction="row" className={stylesCommon.header}>
          <Typography>
            {i18n.t('components.contents.edit.codeEditorEditor.type')}
          </Typography>
          {removeButton || <div />}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="column" spacing={4}>
          <Stack direction="column" spacing={2}>
            <Divider textAlign="left">
              {i18n.t(
                'components.contents.edit.codeEditorEditor.allowedLanguages'
              )}
            </Divider>
            <FormGroup>
              {Object.values(EditorLanguage).map((language) =>
                renderLanguageCheckbox(language)
              )}
            </FormGroup>
          </Stack>
          <Divider textAlign="left">
            {i18n.t('components.contents.edit.codeEditorEditor.defaultCode')}
          </Divider>
          <Stack direction="column" spacing={2}>
            <Box>
              <Select
                value={currentLanguage}
                onChange={(event) => {
                  if (
                    Object.values(EditorLanguage).find(
                      (c) => c === event.target.value
                    )
                  ) {
                    setCurrentLanguage(event.target.value as EditorLanguage);
                  }
                }}
                label={i18n.t(
                  'components.contents.edit.codeEditorEditor.language'
                )}
                items={getLanguages()}
              />
            </Box>
            <Editor
              value={
                editor.data.editorSettings?.languages.find(
                  (languageSettings) =>
                    languageSettings.language === currentLanguage
                )?.defaultCode || ''
              }
              theme="vs-dark"
              onChange={(value) => handleEditorDefaultCodeChange(value || '')}
              language={getMonacoLanguageNameFromEditorLanguage(
                currentLanguage
              )}
              height="20vh"
              width="100%"
            />
          </Stack>
          <Divider textAlign="left">
            {i18n.t(
              'components.contents.edit.codeEditorEditor.validators.title'
            )}
          </Divider>
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    {i18n.t(
                      'components.contents.edit.codeEditorEditor.validators.input'
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {i18n.t(
                      'components.contents.edit.codeEditorEditor.validators.expectedOutput'
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {i18n.t(
                      'components.contents.edit.codeEditorEditor.validators.hidden'
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Button onClick={handleAddValidator} variant="outlined">
                      {i18n.t(
                        'components.contents.edit.codeEditorEditor.validators.new'
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {editor.data?.validators?.map((validator, index) => (
                  <TableRow key={validator.id}>
                    <TableCell align="center">
                      <TextField
                        multiline
                        value={validator.input?.stdin?.join('\n')}
                        onChange={(e) => handleValidatorInputChange(index, e)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        multiline
                        value={validator.expected?.stdout?.join('\n')}
                        onChange={(e) =>
                          handleValidatorExpectedOutputChange(index, e)
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={validator.isHidden}
                        onChange={(e) => handleValidatorHiddenChange(index, e)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handleDeleteValidator(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          <Divider textAlign="left">
            {i18n.t('components.contents.edit.codeEditorEditor.hints.title')}{' '}
            {itemsSaved
              ? i18n.t('components.contents.edit.codeEditorEditor.hints.saved')
              : i18n.t(
                  'components.contents.edit.codeEditorEditor.hints.saving'
                )}
          </Divider>
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    {i18n.t(
                      'components.contents.edit.codeEditorEditor.hints.text'
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {i18n.t(
                      'components.contents.edit.codeEditorEditor.hints.price'
                    )}
                  </TableCell>

                  <TableCell align="right">
                    <Button onClick={handleAddHint} variant="outlined">
                      {i18n.t(
                        'components.contents.edit.codeEditorEditor.hints.new'
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itemsData.map((item, index) => {
                  if (!item) return null;
                  return (
                    <TableRow key={item.id}>
                      <TableCell align="center">
                        <TextField
                          multiline
                          value={item.data.text}
                          onChange={(e) => handleHintTextChange(index, e)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          value={item.cost}
                          onChange={(e) => handleHintCostChange(index, e)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleDeleteHint(item.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
