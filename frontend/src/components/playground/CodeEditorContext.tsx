import React, { useCallback, useEffect, useMemo } from 'react';
import {
  CodeEditorComponent,
  EditorLanguage,
  Validator,
} from '../../lib/api/content';

interface ICodeEditorContext {
  code: string;
  setCode: (code: string) => void;
  resetCode: () => void;

  componentId: string;

  // customInput: string;
  // setCustomInput: (input: string) => void;

  lastOutput: { stdout: string; stderr: string; testId: string | undefined };
  setLastOutput: (output: {
    stdout: string;
    stderr: string;
    testId: string | undefined;
  }) => void;

  language: EditorLanguage;
  setLanguage: (language: EditorLanguage) => void;
  availableLanguages: EditorLanguage[];

  validators: Validator[];

  items: string[];
}

const CodeEditorContext = React.createContext<ICodeEditorContext>(null as any);

// Returs the content of the code editor context
export function useEditorContext() {
  return React.useContext(CodeEditorContext);
}

// Provides the editor context, you need to pass the editor component as value
export function EditorContextProvider({
  editorComponent,
  children,
}: {
  editorComponent: CodeEditorComponent;
  children: React.ReactNode;
}) {
  // Code is stored per language
  const [codeMap, setCodeMap] = React.useState<{ [language: string]: string }>(
    {}
  );

  const [selectedLanguage, setSelectedLanguage] =
    React.useState<EditorLanguage>(
      editorComponent.data.editorSettings.languages[0].language
    ); /* pick the first language, when the var will be available use the preferred language */

  const [lastOutput, setLastOutput] = React.useState<{
    stdout: string;
    stderr: string;
    testId: string | undefined;
  }>({ stderr: '', stdout: '', testId: undefined });

  // const [customInput, setCustomInput] = React.useState<string>('');

  // scan default code snippet for each language
  const defaultCodes = useMemo(
    () =>
      editorComponent.data.editorSettings.languages.reduce(
        (
          acc: any,
          {
            language,
            defaultCode,
          }: { language: EditorLanguage; defaultCode: string }
        ) => ({
          ...acc,
          [language]: defaultCode,
        }),
        {} as { [language: string]: string }
      ),
    [editorComponent.data.editorSettings.languages]
  );

  // On load set default code snippets
  useEffect(() => {
    Object.keys(defaultCodes).forEach((language) => {
      setCodeMap((prev) => ({
        ...prev,
        [language]: defaultCodes[language],
      }));
    });
  }, [defaultCodes]);

  // set default code when called
  const resetCode = useCallback(() => {
    setCodeMap((old) => ({
      ...old,
      [selectedLanguage]: defaultCodes[selectedLanguage],
    }));
  }, [defaultCodes, selectedLanguage]);

  // filter available languages
  const availableLanguages = useMemo(
    () =>
      editorComponent.data.editorSettings.languages.map(
        (settings) => settings.language
      ),
    [editorComponent.data.editorSettings.languages]
  );

  // get code from codeMap
  const code = useMemo(
    () => codeMap[selectedLanguage] || '',
    [codeMap, selectedLanguage]
  );

  // set code in codeMap
  const setCode = useCallback(
    (newCode: string) => {
      setCodeMap((old) => ({
        ...old,
        [selectedLanguage]: newCode,
      }));
    },
    [selectedLanguage]
  );

  // set language if the language is available
  const setLanguage = useCallback(
    (newLanguage: string) => {
      if (availableLanguages.includes(newLanguage as EditorLanguage))
        setSelectedLanguage(newLanguage as EditorLanguage);
    },
    [availableLanguages]
  );

  // compile value for provider
  const value = useMemo(
    () => ({
      code,
      setCode,
      language: selectedLanguage,
      setLanguage,
      validators: editorComponent.data.validators,
      items: editorComponent.data.items,
      resetCode,
      availableLanguages,
      // setCustomInput,
      // customInput,
      lastOutput,
      setLastOutput,
      componentId: editorComponent.id || '',
    }),
    [
      availableLanguages,
      code,
      editorComponent.data.items,
      editorComponent.data.validators,
      editorComponent.id,
      lastOutput,
      resetCode,
      selectedLanguage,
      setCode,
      setLanguage,
    ]
  );

  return (
    <CodeEditorContext.Provider value={value}>
      {children}
    </CodeEditorContext.Provider>
  );
}
