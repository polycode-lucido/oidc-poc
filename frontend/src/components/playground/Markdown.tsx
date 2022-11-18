import React from 'react';
import ReactMarkdown from 'react-markdown';
import MarkdownCode from './MarkdownCode';

interface MarkdownProps {
  content: string;
  className?: string;
}

export default function Markdown({ content, className }: MarkdownProps) {
  return (
    <ReactMarkdown
      components={{
        code: MarkdownCode,
      }}
      className={className}
    >
      {content}
    </ReactMarkdown>
  );
}
