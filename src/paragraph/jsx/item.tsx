import { useContext } from "react";

import { Store } from "../..";

import { T } from "..";

type Props = {
   paragraph: T;
}

export function Item({ paragraph }: Props) {
   const actions = useContext(Store.ActionContext);

   return <p>
      <button onClick={() => actions.deleteParagraph(paragraph.id)}>delete paragraph</button>
      {paragraph.title}
   </p>
}