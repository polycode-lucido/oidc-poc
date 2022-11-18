import React from 'react';
import { Component } from '../../lib/api/content';
import { EditorContextProvider } from './CodeEditorContext';

// Cycle looks inevitable since we can render a container in a container
// eslint-disable-next-line import/no-cycle
import Container from './Container';
import InlineEditor from './InlineEditor';
import Markdown from './Markdown';

// Renders the component according to the type
export default function PlaygroundComponent({
  component,
}: {
  component: Component;
}) {
  switch (component.type) {
    case 'container':
      return <Container component={component} />;
    case 'editor':
      return (
        <EditorContextProvider editorComponent={component}>
          <InlineEditor />
        </EditorContextProvider>
      );
    case 'markdown':
      return <Markdown content={component.data.markdown} />;
    default:
      return null;
  }
}
