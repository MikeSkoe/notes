import { useContext } from "react";
import { Input, Store } from "../..";

export function addNew() {
	const actions = useContext(Store.ActionContext);

	return <Input.JSX onSubmit={title => actions.addNewNote(title)}/>
}