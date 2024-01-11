export type T<A> = {
	history: A[],
	pointer: number,
};

export type Current<A> = [A] | [A, A];

export type Unwrap<TA> = TA extends T<infer A> ? A : never;
export type UnwrapCurrent<TA> = TA extends Current<infer A> ? A : never;

export function make<A>(a: A): T<A> {
	return {
		history: [a],
		pointer: 0,
	}
}

export function getCurrent<A>({ history, pointer }: T<A>): Current<A> {
	return [
		history[pointer],
		...history.slice(pointer + 1, pointer + 2) as [A],
	];
}

export function getLast<A>(a: Current<A>): A {
	return a[a.length - 1];
}

export function add<A>({ history, pointer }: T<A>, a: A, forward: boolean): T<A> {
	const shift = forward ? 1 : 0;
	const newPointer = Math.min(history.length - 1, pointer + shift);
	const newHistory = history.slice(0, newPointer + 1).concat(a);

	return {
		history: newHistory,
		pointer: newPointer,
	};
}

export function set<A>({ history, pointer }: T<A>, a: A): T<A> {
	const newHistory = history.slice(0, pointer).concat(a);

	return {
		history: newHistory,
		pointer: pointer,
	}
}

export function update<A>({ history, pointer }: T<A>, fn: (a: A) => A): T<A> {
	return {
		history: history.map(
			(item, index) => index === (history.length - 1)
				? fn(item)
				: item,
		),
		pointer,
	}
}

export function append<A>(t: T<A>, as: A[]): T<A> {
	return as.reduce((acc, a) => add(acc, a, true), t);
}

export function back<A>({ history, pointer }: T<A>): T<A> {
	return {
		history: history,
		pointer: Math.max(0, pointer - 1),
	};
}

export function front<A>({ history, pointer }: T<A>): T<A> {
	return {
		history: history,
		pointer: Math.max(0, Math.min(history.length - 1, pointer + 1)),
	};
}
