import { useContext } from "solid-js";

import { Store } from "..";
import { T } from "./entity";

type Props = {
   paragraph: T;
}

export function JSX({ paragraph }: Props) {
   const actions = useContext(Store.ActionContext);

   return <p>
      <button onClick={() => actions.deleteParagraph(paragraph.id)}>x</button>
      {paragraph.title}
   </p>
}