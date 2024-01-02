/* @refresh reload */
import { createRoot } from 'react-dom/client';
import './index.css'
import { LayoutJSX, NoteJSX, ParagraphJSX, SelectedJSX, Store } from '.';
// import { attachReduxDevTools } from "@effector/redux-devtools-adapter";

// attachReduxDevTools();
createRoot(document.getElementById('root')!)
    .render(
        <Store.Provider>
            <LayoutJSX.MainLayout
                router={<SelectedJSX.Router />}
                noteList={<NoteJSX.List />}
                paragraphList={<ParagraphJSX.List />}
                addNote={<NoteJSX.addNew />}
                addParagraph={<ParagraphJSX.AddNew />}
            />
        </Store.Provider>
    );
