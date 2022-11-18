import React, { ComponentPropsWithoutRef, ReactNode } from 'react';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

type CodeProps = ComponentPropsWithoutRef<'code'> & {
  node: unknown;
  children: ReactNode[];
  inline?: boolean;
};

export default function MarkdownCode({
  node,
  inline,
  className,
  children,
  ...codeProps
}: CodeProps) {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighter
      language={match[1]}
      PreTag="div"
      customStyle={{ flexGrow: 1 }}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className={className} {...codeProps}>
      {children}
    </code>
  );
}

MarkdownCode.defaultProps = {
  inline: false,
};
