import React from 'react';
import { cn } from '../../utils/styles';
import { getImageSrc } from '../../utils/images';

interface LexicalNode {
  type: string;
  children?: LexicalNode[];
  text?: string;
  format?: number;
  tag?: string;
  listType?: string;
  url?: string;
  newTab?: boolean;
  direction?: string;
  indent?: number;
  version?: number;
  [key: string]: unknown;
}

interface RichTextContent {
  root?: {
    children?: LexicalNode[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface RichTextRendererProps {
  content?: RichTextContent | null;
  className?: string;
}

function renderTextFormat(text: string, format: number): React.ReactNode {
  let result: React.ReactNode = text;
  if (format & 1) result = <strong className="font-bold">{result}</strong>;
  if (format & 2) result = <em>{result}</em>;
  if (format & 4) result = <s>{result}</s>;
  if (format & 8) result = <u>{result}</u>;
  if (format & 16) result = <code className="rounded bg-meopta-bg-light px-1 py-0.5 text-14">{result}</code>;
  return result;
}

function renderNode(node: LexicalNode, index: number): React.ReactNode {
  if (node.type === 'text') {
    return <React.Fragment key={index}>{renderTextFormat(node.text ?? '', node.format ?? 0)}</React.Fragment>;
  }

  if (node.type === 'linebreak') {
    return <br key={index} />;
  }

  const children = node.children?.map((child, i) => renderNode(child, i));

  switch (node.type) {
    case 'paragraph':
      return <p key={index} className="mb-4 text-16 leading-relaxed last:mb-0">{children}</p>;
    case 'heading': {
      const Tag = (node.tag ?? 'h2') as keyof React.JSX.IntrinsicElements;
      const headingClasses: Record<string, string> = {
        h1: 'text-36 lg:text-48 font-bold mb-4',
        h2: 'text-26 lg:text-36 font-bold mb-3',
        h3: 'text-20 lg:text-24 font-bold mb-2',
        h4: 'text-18 lg:text-20 font-bold mb-2',
        h5: 'text-16 lg:text-18 font-bold mb-2',
        h6: 'text-14 lg:text-16 font-bold mb-2',
      };
      return <Tag key={index} className={headingClasses[node.tag ?? 'h2']}>{children}</Tag>;
    }
    case 'list': {
      const ListTag = node.listType === 'number' ? 'ol' : 'ul';
      return (
        <ListTag
          key={index}
          className={cn('mb-4 pl-6', node.listType === 'number'
            ? `list-decimal`
            : `list-disc`)}
        >
          {children}
        </ListTag>
      );
    }
    case 'listitem':
      return <li key={index} className="mb-1 text-16 leading-relaxed">{children}</li>;
    case 'link':
      return (
        <a
          key={index}
          href={node.url as string}
          target={node.newTab ? '_blank' : undefined}
          rel={node.newTab ? 'noopener noreferrer' : undefined}
          className="text-meopta-blue-dark underline hover:text-meopta-blue-hover"
        >
          {children}
        </a>
      );
    case 'table':
      return (
        <div key={index} className="mb-4 overflow-x-auto">
          <table className="w-full border-collapse text-14 lg:text-16">
            <tbody>{children}</tbody>
          </table>
        </div>
      );
    case 'tablerow':
      return <tr key={index} className="border-b border-meopta-border">{children}</tr>;
    case 'tablecell': {
      const isHeader = (node.headerState as number) === 1;
      const Tag = isHeader ? 'th' : 'td';
      return (
        <Tag
          key={index}
          className={cn(
            'px-3 py-[10px] text-left align-top',
            isHeader && 'font-medium text-meopta-text-primary',
            !isHeader && 'text-meopta-text-secondary',
          )}
        >
          {children}
        </Tag>
      );
    }
    case 'quote':
      return (
        <blockquote key={index} className="mb-4 border-l-4 border-meopta-blue pl-4 italic text-meopta-text-secondary">
          {children}
        </blockquote>
      );
    case 'upload': {
      const value = node.value as { url?: string; alt?: string; width?: number; height?: number } | undefined;
      if (!value?.url) return null;
      return (
        <figure key={index} className="my-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getImageSrc(value.url)}
            alt={value.alt ?? ''}
            width={value.width}
            height={value.height}
            className="w-full rounded-lg"
          />
        </figure>
      );
    }
    default:
      return children ? <span key={index}>{children}</span> : null;
  }
}

export const RichTextRenderer = ({ content, className }: RichTextRendererProps) => {
  if (!content?.root?.children?.length) return null;

  return (
    <div className={cn('rich-text', className)}>
      {content.root.children.map((node, i) => renderNode(node, i))}
    </div>
  );
};
