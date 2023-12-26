import { useContext } from "react";

import { Store, Input } from "../..";

export function AddNew() {
	const actions = useContext(Store.ActionContext);

	return <Input.JSX onSubmit={title => actions.addNewParagraph(title)} />;
}
