export class Player {
    identifier: "ONE" | "TWO"
    team: 1 | 2
    fishes: number

    constructor(identifier: "ONE" | "TWO", team: 1 | 2, fishes: number) {
        this.identifier = identifier
        this.team = team
        this.fishes = fishes
    }
}