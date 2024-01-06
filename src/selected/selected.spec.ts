import { FP } from "..";

import { add, append, back, front, getCurrent, make } from "."

describe("selected", () => {
	it("should show currect selected pair", () => {
		expect(getCurrent(
			make("A"),
		)).toEqual(["A"]);

		expect(getCurrent(
			add(make("A"), "B")
		)).toEqual(["A", "B"]);

		expect(getCurrent(
			append(make("A"), "BC".split("")),
		)).toEqual(["B", "C"]);

		expect(getCurrent(
			append(make("A"), "BCD".split("")),
		)).toEqual(["C", "D"])
	});

	it("should go back in history", () => {
		expect(getCurrent(
			FP.pipe(
				back,
			)(add(make("A"), "B"))
		)).toEqual(["A", "B"]);

		expect(getCurrent(
			FP.pipe(
				back,
			)(append(make("A"), "BC".split("")))
		)).toEqual(["A", "B"]);

		expect(getCurrent(
			FP.pipe(
				back,
				back,
			)(append(make("A"), "BCD".split("")))
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
				front,
			)(add(make("A"), "B"))
		)).toEqual(["A", "B"]);

		expect(getCurrent(
			FP.pipe(
				back,
				back,
				front,
			)(append(make("A"), "BCD".split("")))
		)).toEqual(["B", "C"]);

		expect(getCurrent(
			FP.pipe(
				back,
				back,
				front,
				front,
			)(append(make("A"), "BCD".split("")))
		)).toEqual(["C", "D"]);
	});

	it("should slice history if append at the middle", () => {
		expect(getCurrent(
			add(back(append(make("A"), "BCD".split(""))), "X")
		)).toEqual(["C", "X"]);

		expect(getCurrent(
			add(back(back(append(make("A"), "BCD".split("")))), "X")
		)).toEqual(["B", "X"]);
	})
});
