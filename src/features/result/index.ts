export type Success<A> = { status: "success", data: A };
export type Failure<A> = { status: "failure", data: A };

export type T<A, B> = Success<A> | Failure<B>;

export function success<A>(data: A): Success<A> {
    return { status: "success", data };
}

export function failure<A>(data: A): Failure<A> {
    return { status: "failure", data };
}

export function isSuccess<A, B>(t: T<A, B>): t is Success<A> {
    return t.status === "success";
}

export function isFailure<A, B>(t: T<A, B>): t is Failure<B> {
    return t.status === "failure";
}