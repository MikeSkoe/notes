import { FP } from "..";

import { add, append, back, front, getCurrent, make } from "."

describe("selected", () => {
	it("should show currect selected pair", () => {
		expect(getCurrent(
			make("A"),
		)).toEqual(["A"]);

		expect(getCurrent(
			add("B")(make("A"))
		)).toEqual(["A", "B"]);

		expect(getCurrent(
			FP.pipe(
				append("BC".split("")),
			)(make("A"))
		)).toEqual(["B", "C"]);

		expect(getCurrent(
			FP.pipe(
				append("BCD".split("")),
			)(make("A"))
		)).toEqual(["C", "D"])
	});

	it("should go back in history", () => {
		expect(getCurrent(
			FP.pipe(
				add("B"),
				back,
			)(make("A"))
		)).toEqual(["A", "B"]);

		expect(getCurrent(
			FP.pipe(
				append("BC".split("")),
				back,
			)(make("A"))
		)).toEqual(["A", "B"]);

		expect(getCurrent(
			FP.pipe(
				append("BCD".split("")),
				back,
				back,
			)(make("A"))
		)).toEqual(["A", "B"])
	});

	it("goes back and fourth in history", () => {
		expect(getCurrent(
			FP.pipe(
				back,
				back,
			)(make("A"))
		)).toEqual(["A"])

		expect(getCurrent(
			FP.pipe(
				front,
				front,
			)(make("A"))
		)).toEqual(["A"])

		expect(getCurrent(
			FP.pipe(
				add("B"),
				front,
			)(make("A"))
		)).toEqual(["A", "B"]);

		expect(getCurrent(
			FP.pipe(
				append("BCD".split("")),
				back,
				back,
				front,
			)(make("A"))
		)).toEqual(["B", "C"]);

		expect(getCurrent(
			FP.pipe(
				append("BCD".split("")),
				back,
				back,
				front,
				front,
			)(make("A"))
		)).toEqual(["C", "D"]);
	});

	it("should slice history if append at the middle", () => {
		expect(getCurrent(
			FP.pipe(
				append("BCD".split("")),
				back,
				add("X"),
			)(make("A"))
		)).toEqual(["C", "X"]);
		
		expect(getCurrent(
			FP.pipe(
				append("BCD".split("")),
				back,
				back,
				add("X"),
			)(make("A"))
		)).toEqual(["B", "X"]);
	})
});
