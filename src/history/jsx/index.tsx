import { useContext } from "react";
import { Store } from "../..";

export function Router() {
	const actions = useContext(Store.ActionContext);

	return <div>
		<button onClick={() => actions.back()}>back</button>
		<button onClick={() => actions.front()}>front</button>
	</div>

}