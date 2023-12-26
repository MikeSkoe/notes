export function pipe<A, B>(fn1: (a: A) => B): (a: A) => B;
export function pipe<A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C;
export function pipe(...fns: Function[]): unknown {
	return (value: any) => fns.reduce((acc, fn) => fn(acc), value);
}