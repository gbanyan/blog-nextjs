import { visit } from 'unist-util-visit';

/**
 * Rehype plugin to transform GitHub-style blockquote alerts
 * Transforms: > [!NOTE] into styled callout boxes
 */
export function rehypeCallouts() {
  return (tree: any) => {
    visit(tree, 'element', (node, index, parent) => {
      // Only process blockquotes
      if (node.tagName !== 'blockquote') return;

      // Check if first child is a paragraph
      if (!node.children || node.children.length === 0) return;
      const firstChild = node.children[0];
      if (firstChild.tagName !== 'p') return;

      // Check if paragraph starts with [!TYPE]
      if (!firstChild.children || firstChild.children.length === 0) return;
      const firstText = firstChild.children[0];
      if (firstText.type !== 'text') return;

      const match = firstText.value.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/i);
      if (!match) return;

      const type = match[0].replace(/^\[!|\]\s*/g, '').toLowerCase();

      // Remove the [!TYPE] marker from the text
      firstText.value = firstText.value.replace(match[0], '');

      // If the text node is now empty, remove it
      if (!firstText.value.trim()) {
        firstChild.children.shift();
      }

      // Add callout data attributes and classes
      node.properties = node.properties || {};
      node.properties.className = ['callout', `callout-${type}`];
      node.properties['data-callout'] = type;

      // Add icon element at the beginning
      const iconMap: Record<string, string> = {
        note: '📝',
        tip: '💡',
        important: '❗',
        warning: '⚠️',
        caution: '🚨',
      };

      const icon = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['callout-icon'] },
        children: [{ type: 'text', value: iconMap[type] || '📝' }],
      };

      const title = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['callout-title'] },
        children: [{ type: 'text', value: type.toUpperCase() }],
      };

      const header = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['callout-header'] },
        children: [icon, title],
      };

      const content = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['callout-content'] },
        children: node.children,
      };

      node.children = [header, content];
    });
  };
}
