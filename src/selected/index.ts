export type T<A> = {
	history: A[],
	pointer: number,
};

export type Unwrap<TA> = TA extends T<infer A> ? A : TA;

export function make<A>(a: A): T<A> {
	return {
		history: [a],
		pointer: 0,
	}
}

export function getCurrent<A>({ history, pointer }: T<A>): [A] | [A, A] {
	return [
		history[pointer],
		...history.slice(pointer + 1, pointer + 2) as [A],
	];
}

export function getLast<A>(a: [A] | [A, A]): A {
	return a[a.length - 1];
}

export function add<A>(a: A): (t: T<A>) => T<A> {
	return function addFor({ history, pointer }) {
		const newHistory = history.slice(0, pointer + 2).concat(a);

		return {
			history: newHistory,
			pointer: Math.max(0, Math.min(newHistory.length - 2,
				pointer + 1,
			)),
		};
	};
}

export function update<A>(fn: (a: A) => A): (t: T<A>) => T<A> {
	return function updateFor({ history, pointer }) {
		return {
			history: history.map(
				(item, index) => index === (history.length - 1)
					? fn(item)
					: item,
			),
			pointer,
		}
	}
}

export function append<A>(as: A[]): (t: T<A>) => T<A> {
	return function appendFor(t) {
		return as.reduce((acc, a) => add(a)(acc), t);
	}
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
		pointer: Math.max(0, Math.min(history.length - 2, pointer + 1)),
	};
}
