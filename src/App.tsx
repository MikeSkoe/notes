import { ParagraphList, NoteList, Store } from "./features";

function App() {
  return <Store.Provider>
    <NoteList.JSX />
    <ParagraphList.JSX />
  </Store.Provider>
}

export default App
