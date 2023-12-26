/* @refresh reload */
import { createRoot } from 'react-dom/client';
import './index.css'
import { Layout, NoteJSX, ParagraphJSX, Store } from '.';
// import { attachReduxDevTools } from "@effector/redux-devtools-adapter";

// attachReduxDevTools();
createRoot(document.getElementById('root')!)
    .render(
        <Store.Provider>
            <Layout.MainLayout
                noteList={<NoteJSX.List />}
                paragraphList={<ParagraphJSX.List />}
                addNote={<NoteJSX.addNew />}
                addParagraph={<ParagraphJSX.AddNew />}
            />
        </Store.Provider>
    );
