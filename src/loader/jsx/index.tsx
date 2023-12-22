import { T, isLoaded } from "..";

interface LoaderCompProps<A> {
   loadable: T<A>,
   children: (item: A) => JSX.Element;
}

export function Show<A>({ loadable, children }: LoaderCompProps<A>): JSX.Element {
   if (isLoaded(loadable)) {
      return children(loadable.data);
   }

   return <div>...loading</div>
}