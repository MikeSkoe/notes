/* @refresh reload */
import { createRoot } from 'react-dom/client';
import './index.css'
import { LayoutJSX, NoteJSX, ParagraphJSX, HistoryJSX, Store, Paragraph, Note } from '.';
// import { attachReduxDevTools } from "@effector/redux-devtools-adapter";

// attachReduxDevTools();
createRoot(document.getElementById('root')!)
    .render(
        <Store.Provider>
            <LayoutJSX.Main
                router={<HistoryJSX.Router />}
                noteList={<NoteJSX.List />}
                paragraphList={<ParagraphJSX.List />}
                addNote={<NoteJSX.AddNew />}
                addParagraph={<ParagraphJSX.AddNew />}
            />
        </Store.Provider>
    );
