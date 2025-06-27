import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import { TextSelection } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';

export interface TrailingParagraphOptions {
  parentNodeName: string | null;
  trailingParagraphClass: string;
}

export const TrailingParagraphExtension = Extension.create<TrailingParagraphOptions>({
  name: 'TrailingParagraphExtension',

  addOptions() {
    return {
      parentNodeName: null,
      trailingParagraphClass: 'trailing-paragraph',
    };
  },

  addProseMirrorPlugins() {
    const options = this.options;

    return [
      new Plugin({
        key: new PluginKey(this.name),
        props: {
          handleClick: (view: EditorView, pos: number, event: MouseEvent) => {
            if (
              !view.editable ||
              (event.target instanceof HTMLElement && !event.target.classList.contains(options.trailingParagraphClass))
            ) {
              return false;
            }

            const { state, dispatch } = view;
            const { doc } = state;
            let handled = false;
            let foundParentNode = false;

            // Skip doc.descendants traversal if parentNodeName is null for performance optimization
            if (options.parentNodeName) {
              doc.descendants((node, nodePos) => {
                if (node.type.name === options.parentNodeName) {
                  foundParentNode = true;
                  const lastChild = node.lastChild;

                  const shouldAddTrailing =
                    !lastChild || lastChild.type.name !== 'paragraph' || lastChild.textContent.length > 0;

                  if (shouldAddTrailing) {
                    const nodeAtPos = doc.nodeAt(nodePos);
                    if (nodeAtPos) {
                      const endPos = nodePos + nodeAtPos.nodeSize - 1;
                      const newParagraph = state.schema.nodes.paragraph.create();
                      const transaction = state.tr.insert(endPos, newParagraph);

                      const newPos = Math.min(endPos + 1, transaction.doc.content.size);
                      const selection = TextSelection.create(transaction.doc, newPos);
                      transaction.setSelection(selection);

                      dispatch(transaction);
                      handled = true;
                      return false;
                    }
                  }
                }
              });
            }

            if (!foundParentNode) {
              const lastChild = doc.lastChild;
              const shouldAddTrailing =
                !lastChild || lastChild.type.name !== 'paragraph' || lastChild.textContent.length > 0;

              if (lastChild && shouldAddTrailing) {
                const lastChildPos = doc.content.size - lastChild.nodeSize;
                const endPos = lastChildPos + lastChild.nodeSize;
                const newParagraph = state.schema.nodes.paragraph.create();
                const transaction = state.tr.insert(endPos, newParagraph);

                const newPos = Math.min(endPos + 1, transaction.doc.content.size);
                const selection = TextSelection.create(transaction.doc, newPos);
                transaction.setSelection(selection);

                dispatch(transaction);
                handled = true;
              }
            }

            return handled;
          },

          decorations: ({ doc }) => {
            const decorations: Decoration[] = [];

            const createWidget = () => {
              const element = document.createElement('p');
              element.classList.add(options.trailingParagraphClass);
              element.textContent = '';
              element.style.minHeight = '1em';
              return element;
            };

            let foundParentNode = false;

            // Skip doc.descendants traversal if parentNodeName is null for performance optimization
            if (options.parentNodeName) {
              doc.descendants((node, pos) => {
                if (node.type.name === options.parentNodeName) {
                  foundParentNode = true;
                  const lastChild = node.lastChild;

                  const shouldShowTrailing =
                    !lastChild || lastChild.type.name !== 'paragraph' || lastChild.textContent.length > 0;

                  if (shouldShowTrailing) {
                    const nodeAtPos = doc.nodeAt(pos);
                    if (nodeAtPos) {
                      decorations.push(
                        Decoration.widget(pos + nodeAtPos.nodeSize - 1, createWidget, {
                          side: 0,
                        }),
                      );
                    }
                  }
                }
              });
            }

            if (!foundParentNode) {
              const lastChild = doc.lastChild;
              if (lastChild) {
                const lastChildPos = doc.content.size - lastChild.nodeSize;
                const endPos = lastChildPos + lastChild.nodeSize;
                decorations.push(
                  Decoration.widget(endPos, createWidget, {
                    side: 0,
                  }),
                );
              }
            }

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
})