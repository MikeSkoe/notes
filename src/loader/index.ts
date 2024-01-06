export type Loading<_> = { status: "loading" };
export type Loaded<A> = { status: "loaded", data: A };
export type T<A> = Loaded<A> | Loading<A>

export type Unwrap<TA> = TA extends T<infer A> ? A : TA;

export function loading<A>(): Loading<A> {
    return ({ status: "loading" });
}

export function loaded<A>(data: A): Loaded<A> {
    return ({ status: "loaded", data });
}

export function isLoading<A>(t: T<A>): t is Loading<A> {
    return typeof t === "object"
        && t
        && "status" in t
        && t.status === "loading";
}

export function isLoaded<A>(t: T<A>): t is Loaded<A> {
    return typeof t === "object"
        && t
        && "status" in t
        && t.status === "loaded";
}

export function map<A, B>(t: T<A>, fn: (a: A) => B): T<B> {
    if (isLoading(t)) {
        return t;
    }

    return loaded(fn(t.data))
}

export function flatMap<A, B>(t: T<A>, fn: (a: A) => T<B>): T<B> {
    if (isLoading(t)) {
        return t;
    }

    return fn(t.data)
}

export function getWithDefault<A>(t: T<A>, defaultValue: A): A {
    if (isLoading(t)) {
        return defaultValue;
    }

    return t.data;
}

export function getMapWithDefault<A, B>(t: T<A>, fn: (a: A) => B, defaultValue: B): B {
    if (isLoading(t)) {
        return defaultValue;
    }

    return fn(t.data);
}
