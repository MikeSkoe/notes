import { Accessor, Show, JSXElement } from "solid-js";

import { Loader } from "..";
import { T } from "./loader";

interface LoaderCompProps<A> {
  loadable: Accessor<T<A>>,
  children: (item: Accessor<A>) => JSXElement;
}

export function JSX<A>({ loadable, children }: LoaderCompProps<A>) {
  return <Show
    when={Loader.getWithDefault(loadable(), null)}
    fallback={<div>...loading</div>}
  >
    {children}
  </Show>
}
