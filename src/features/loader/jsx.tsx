import { Accessor, JSX, Show } from "solid-js";

import { Loader } from "..";
import { T } from "./loader";

interface LoaderCompProps<A> {
  loadable: Accessor<T<A>>,
  children: (item: A) => JSX.Element;
}

export default function <A>({ loadable, children }: LoaderCompProps<A>) {
  return <Show
    when={Loader.getWithDefault(loadable(), null)}
    fallback={<div>...loading</div>}
  >
    {data => children(data())}
  </Show>
}
