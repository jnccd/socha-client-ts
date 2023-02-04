export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
	}

	addInP(p: Point) {
		this.x = p.x + this.x
		this.y = p.y + this.y
	}
	add(p: Point) {
		return new Point(p.x + this.x, p.y + this.y)
	}

	arrayToHexCoords() {
		return new Point(this.x * 2 + (this.y % 2 == 1 ? 1 : 0), this.y)
	}
	hexToArrayCoords() {
		return new Point(this.x / 2 - (this.y % 2 == 1 ? 1 : 0), this.y)
	}
}