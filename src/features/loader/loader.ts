type Loading<_> = { status: "loading" };
type Failed<_> = { status: "fail" };
type Loaded<A> = { status: "loaded", data: A };
export type T<A> = Loaded<A> | Loading<A> | Failed<A>

export const loading = <A>(): Loading<A> => ({ status: "loading" });
export const fail = <A>(): Failed<A> => ({ status: "fail" });
export const loaded = <A>(data: A): Loaded<A> => ({ status: "loaded", data });

export const isLoading = <A>(t: T<A>): t is Loading<A> => 
    typeof t === "object" && t && "status" in t && t.status === "loading";

export const isFailed = <A>(t: T<A>): t is Failed<A> =>
    typeof t === "object" && t && "status" in t && t.status === "fail";

export const isLoaded = <A>(t: T<A>): t is Loaded<A> =>
    typeof t === "object" && t && "status" in t && t.status === "loaded"

export const map = <A, B>(t: T<A>, fn: (a: A) => B): T<B> =>
    isLoaded(t) ? loaded(fn(t.data)) : t;

export const flatMap = <A, B>(t: T<A>, fn: (a: A) => T<B>): T<B> =>
    isLoaded(t) ? fn(t.data) : t;

export const getWithDefault = <A>(t: T<A>, defaultValue: A): A =>
    isLoaded(t) ? t.data : defaultValue;
