import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

interface SyntaxHighlighterProps {
  code: string;
  language: string;
  className?: string;
}

const CustomSyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({
  code,
  language,
  className = '',
}) => {
  // Normalize language names
  const normalizeLanguage = (lang: string): string => {
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'ts': 'typescript',
      'py': 'python',
      'rb': 'ruby',
      'sh': 'bash',
      'shell': 'bash',
      'yml': 'yaml',
      'md': 'markdown',
    };
    return languageMap[lang.toLowerCase()] || lang.toLowerCase();
  };

  const normalizedLanguage = normalizeLanguage(language);

  // Dracula theme colors
  const draculaStyle = {
    'pre[class*="language-"]': {
      background: 'transparent',
      padding: '1rem',
      margin: '0',
      fontSize: '0.875rem',
      lineHeight: '1.5',
      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    },
    'code[class*="language-"]': {
      background: 'transparent',
      fontSize: '0.875rem',
      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      color: '#f8f8f2', // Dracula foreground
    },
    // Keywords - Dracula Pink
    'keyword': {
      color: '#ff79c6',
      fontWeight: 'bold',
    },
    // Strings - Dracula Yellow
    'string': {
      color: '#f1fa8c',
    },
    // Comments - Dracula Comment (gray)
    'comment': {
      color: '#6272a4',
      fontStyle: 'italic',
    },
    // Numbers - Dracula Purple
    'number': {
      color: '#bd93f9',
      fontWeight: 'bold',
    },
    // Functions - Dracula Green
    'function': {
      color: '#50fa7b',
      fontWeight: 'bold',
    },
    // Operators - Dracula Pink
    'operator': {
      color: '#ff79c6',
    },
    // Variables - Dracula Foreground
    'variable': {
      color: '#f8f8f2',
    },
    // Classes/Types - Dracula Cyan
    'class-name': {
      color: '#8be9fd',
      fontWeight: 'bold',
    },
    // Punctuation - Dracula Foreground
    'punctuation': {
      color: '#f8f8f2',
    },
    // Attributes - Dracula Green
    'attr-name': {
      color: '#50fa7b',
    },
    // Attribute values - Dracula Yellow
    'attr-value': {
      color: '#f1fa8c',
    },
    // Tags - Dracula Pink
    'tag': {
      color: '#ff79c6',
      fontWeight: 'bold',
    },
    // Namespace - Dracula Orange
    'namespace': {
      color: '#ffb86c',
    },
    // Boolean - Dracula Purple
    'boolean': {
      color: '#bd93f9',
      fontWeight: 'bold',
    },
    // Constants - Dracula Purple
    'constant': {
      color: '#bd93f9',
      fontWeight: 'bold',
    },
    // Property - Dracula Cyan
    'property': {
      color: '#8be9fd',
    },
    // Annotations (Java) - Dracula Yellow
    'annotation': {
      color: '#f1fa8c',
      fontWeight: 'bold',
    },
    // Important - Dracula Red
    'important': {
      color: '#ff5555',
      fontWeight: 'bold',
    },
    // Built-in types - Dracula Red
    'builtin': {
      color: '#ff5555',
    },
    // Deleted - Dracula Red
    'deleted': {
      color: '#ff5555',
    },
    // Inserted - Dracula Green
    'inserted': {
      color: '#50fa7b',
    },
    // Selector - Dracula Green
    'selector': {
      color: '#50fa7b',
    },
  };

  return (
    <SyntaxHighlighter
      language={normalizedLanguage}
      style={draculaStyle}
      className={className}
      showLineNumbers={false}
      wrapLines={true}
      wrapLongLines={true}
    >
      {code}
    </SyntaxHighlighter>
  );
};

export default CustomSyntaxHighlighter;
