/* @refresh reload */
import { createRoot } from 'react-dom/client';
import './index.css'
import { NoteJSX, ParagraphJSX, Store } from '.';
// import { attachReduxDevTools } from "@effector/redux-devtools-adapter";

// attachReduxDevTools();
createRoot(document.getElementById('root')!)
    .render(
        <Store.Provider>
            <NoteJSX.List />
            <ParagraphJSX.List />
        </Store.Provider>
    );
