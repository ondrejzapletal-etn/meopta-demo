import { DefaultNodeTypes, DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import { SerializedLexicalNode } from 'lexical';

/**
 * Recursively extracts plain text content from a Lexical node
 * @param node - The serialized Lexical node to extract text from
 * @returns The plain text content of the node and its children
 */
const extractTextFromNode = (node: SerializedLexicalNode | DefaultNodeTypes): string => {
  if (!node || typeof node !== 'object') {
    return '';
  }

  if (node.type === 'text' && 'text' in node) {
    return node.text;
  }

  if ('children' in node && Array.isArray(node.children)) {
    return node.children
      .map((child) => extractTextFromNode(child))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  return '';
};

/**
 * Extracts plain text from a Lexical editor state
 * @param content - The Lexical editor state to extract text from
 * @returns The plain text content without formatting or markup
 */
export const extractPlainText = (content?: DefaultTypedEditorState | null): string => {
  if (!content || typeof content !== 'object') {
    return '';
  }

  if (content.root && Array.isArray(content.root.children)) {
    return content.root.children
      .map((child) => extractTextFromNode(child))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  return '';
};
