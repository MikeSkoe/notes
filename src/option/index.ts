export type Some<A> = { status: "some", data: A };
export type None<A> = { status: "none" };

const NONE: None<unknown> = { status: "none" };

export type T<A> = Some<A> | None<A>;

export function some<A>(data: A): Some<A> {
    return { status: "some", data };
}

export function none<A>(): None<A> {
    return NONE;
}

export function isSome<A>(t: T<A>): t is Some<A> {
    return t.status === "some";
}

export function isNone<A>(t: T<A>): t is None<A> {
    return t.status === "none";
}

export function getWithDefault<A>(t: T<A>, fallback: A): A {
    return isNone(t) ? fallback : t.data;
}

export function map<A, B>(t: T<A>, fn: (a: A) => B): T<B> {
    return isNone(t) ? t : some(fn(t.data));
}
