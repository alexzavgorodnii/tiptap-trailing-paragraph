# TrailingParagraph

A Tiptap extension that ensures there's always a trailing paragraph at the end of your document, making it easy for users to continue typing after any content block.

## Features

- 🎯 **Smart Trailing Paragraph**: Automatically adds an empty paragraph at the end of your document when needed
- 🖱️ **Click to Continue**: Users can click after the last content to start typing immediately
- ⚙️ **Customizable**: Configure the parent node and CSS class for the trailing paragraph
- 🪶 **Lightweight**: Minimal overhead with efficient ProseMirror integration
- 🎨 **Styleable**: Add custom styles to the trailing paragraph element

## Installation

```bash
npm install tiptap-trailing-paragraph
```

## Usage

### Basic Setup

```typescript
import { Editor } from '@tiptap/core'
import { TrailingParagraphExtension } from 'tiptap-trailing-paragraph'

const editor = new Editor({
  extensions: [
    // ... other extensions
    TrailingParagraphExtension,
  ],
})
```

### With Custom Options

```typescript
import { Editor } from '@tiptap/core'
import { TrailingParagraphExtension } from 'tiptap-trailing-paragraph'

const editor = new Editor({
  extensions: [
    // ... other extensions
    TrailingParagraphExtension.configure({
      parentNodeName: 'doc', // The parent node to add trailing paragraphs to
      trailingParagraphClass: 'my-trailing-paragraph', // Custom CSS class
    }),
  ],
})
```

### Using the Default Export

```typescript
import { Editor } from '@tiptap/core'
import TrailingParagraph from 'tiptap-trailing-paragraph'

const editor = new Editor({
  extensions: [
    // ... other extensions
    TrailingParagraph,
  ],
})
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `parentNodeName` | `string` | `'doc'` | The name of the parent node where trailing paragraphs should be added |
| `trailingParagraphClass` | `string` | `'trailing-paragraph'` | CSS class applied to the trailing paragraph element |

## Styling

You can style the trailing paragraph using CSS:

```css
.trailing-paragraph {
  min-height: 1em;
  margin: 0;
  padding: 0;
  opacity: 0.5; /* Make it subtle */
  border: 1px dashed #ccc; /* Optional: show a visual hint */
}
```

## How It Works

The extension works by:

1. **Monitoring the document**: Watches for changes in the document structure
2. **Detecting missing trailing paragraphs**: Checks if the last child of the parent node is an empty paragraph
3. **Adding visual hints**: Creates a decoration (widget) that shows where users can click to continue typing
4. **Handling clicks**: Intercepts clicks on the trailing area and automatically inserts a new paragraph
5. **Maintaining focus**: Automatically positions the cursor in the new paragraph for seamless typing

## Use Cases

- **Blog editors**: Ensure users can always add content after images, code blocks, or other elements
- **Documentation tools**: Make it easy to continue writing after inserting special blocks
- **Note-taking apps**: Provide a consistent writing experience regardless of the last content type
- **Content management systems**: Improve the authoring experience for content creators

## Browser Support

This extension supports all modern browsers that are compatible with Tiptap and ProseMirror.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT