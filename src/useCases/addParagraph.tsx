import { Unit, createEffect, sample } from "effector";

import { Service, Loader, Note, Paragraph } from "..";

import { Root, Actions } from "./root";

// Add paragraph

export function action(root: Root, newParagraph: Paragraph.T): Root | void {
    if (!newParagraph.title || Loader.isLoading(root)) {
        return;
    }

    return Loader.loaded({
        ...root.data,
        paragraphs: root.data.paragraphs.concat(newParagraph),
    });
}

/**
 * Takes string, so that effect generates a new paragraph based on it and use it with both action and service
 */
export function preAction(root: Root, _: string): Root | void {
    return root;
} 

/**
 * Add a new paragraph to the service and load the new list of paragraphs
 */
export function FX(
    actions: Actions,
    root$: Unit<Root>,
    paragraphService: Service.RelationalService<Note.T, Paragraph.T>,
) {
    return sample({
        clock: actions.addNewParagraph,
        source: root$,
        fn: (root: Root, title: string) => [root, title] as const,
        target: createEffect(effect),
    });

    async function effect([root, title]: [Root, string]) {
        if (!title || Loader.isLoading(root)) {
            return;
        }

        const { paragraphs, selected } = root.data;

        const newParagraph = Paragraph.setPosition(
            Paragraph.make(title),
            Paragraph.getNextPosition(paragraphs, selected),
            selected,
        );

        actions.addParagraph(newParagraph);
        paragraphService.set(newParagraph);
        const newParagraphs = await paragraphService.getByParentId(selected);
        actions.paragraphsLoaded(newParagraphs)
    }
}
