import { useContext, useState } from "react";

import { Store } from "../..";

export function addNew() {
	const actions = useContext(Store.ActionContext);
	const [title, setTitle] = useState("");

    return <input
        onKeyDown={event => {
            if (event.key === "Enter" && event.metaKey) {
                actions.addNote(title);
                setTitle("");
            }
        }}
        onChange={event => setTitle(event.target.value)}
        value={title}
        placeholder="Enter your markdown here..."
    />;
}
