export type Loading<_> = { status: "loading" };
export type Loaded<A> = { status: "loaded", data: A };
export type T<A> = Loaded<A> | Loading<A>

export type Unwrap<TA> = TA extends T<infer A> ? A : TA;

export const loading = <A>(): Loading<A> => ({ status: "loading" });
export const loaded = <A>(data: A): Loaded<A> => ({ status: "loaded", data });

export const isLoading = <A>(t: T<A>): t is Loading<A> => 
    typeof t === "object" && t && "status" in t && t.status === "loading";

export const isLoaded = <A>(t: T<A>): t is Loaded<A> =>
    typeof t === "object" && t && "status" in t && t.status === "loaded"

export const map = <A, B>(t: T<A>, fn: (a: A) => B): T<B> =>
    isLoaded(t) ? loaded(fn(t.data)) : t;

export const flatMap = <A, B>(t: T<A>, fn: (a: A) => T<B>): T<B> =>
    isLoaded(t) ? fn(t.data) : t;

export const getWithDefault = <A>(t: T<A>, defaultValue: A): A =>
    isLoaded(t) ? t.data : defaultValue;

export const getMapWithDefault = <A, B>(t: T<A>, fn: (a: A) => B, defaultValue: B): B =>
    isLoaded(t) ? fn(t.data) : defaultValue;
