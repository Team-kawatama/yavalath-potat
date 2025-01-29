class Game {
    constructor(a) {
        this.winer = []
        this.loser = []
        this.map = JSON.parse(JSON.stringify(a ?? this.newMap()))
        this.Pmap = this.search(this.newMap(true))
    }

    newMap(p = false) {
        let map = []
        for (let i = 0; i < 9; i++) {
            let row = []
            for (let j = 0; j < 17; j++) {
                if (p) {
                    row.push(i + ":" + j)
                } else {
                    row.push("")
                }
            }
            map.push(row)
        }
        return map
    }

    search(map = this.map) {
        const map0 = []
        const map120 = []
        const map240 = []
        for (let y = 0; y < 9; y++) {
            let row = []
            for (let x = 0; x < 17; x++) {
                if (y < 5) {
                    if (x >= 4 - y && x <= 13 + y && y % 2 === x % 2) {
                        row.push(map[y][x])
                    }
                } else {
                    if (x >= -4 + y && x <= 21 - y && y % 2 === x % 2) {
                        row.push(map[y][x])
                    }
                }
            }
            map0.push(row)
        }

        for (let y = 4; y <= 8; y++) {
            let y2 = y
            let row = []
            for (let x = 16 - y2 + 4; y2 >= 0; x--) {
                row.push(map[y2][x])
                y2 -= 1
            }
            map120.push(row)
        }
        for (let x = 10; x >= 4; x -= 2) {
            let row = []
            let x2 = x
            for (let y = 8; y >= 6 - x / 2; y--) {
                row.push(map[y][x2])
                x2 -= 1
            }
            map120.push(row)
        }

        let xs = 12
        let ys = 8
        let max = 5
        let up = true
        for (let y = 0; y < 9; y++) {
            let row = []
            let x2 = xs
            let y2 = ys
            for (let x = 0; x < max; x++) {
                row.push(map[y2][x2])
                y2 -= 1
                x2 += 1
            }
            if (max === 9) {
                up = false
            }
            if (up) {
                max += 1
                xs -= 2
            } else {
                max -= 1
                xs -= 1
                ys -= 1
            }
            map240.push(row)
        }

        return { "map0": map0, "map120": map120, "map240": map240 }
    }

    show() {
        let map = this.search().map0
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y][x] === "") {
                    continue
                }
                place(map[y][x], [y, x])
            }
        }
    }

    set(a, b, name) {
        let position = this.Pmap.map0[a][b].split(":")
        this.map[parseInt(position[0])][parseInt(position[1])] = name
        this.show()
        let j = this.judge()
        if (j !== "none") {
            if (j[0] == "lose") {

            }
        }
    }

    judge() {
        let map2 = [this.search().map0, this.search().map120, this.search().map240]
        // console.log(map)
        for (let n = 0; n < 3; n++) {
            let map = map2[n].slice()
            for (let line = 0; line < map.length; line++) {
                let count = 0
                let name = ""
                map[line].push("")
                for (let i = 0; i < map[line].length; i++) {
                    console.log(map[line][i])
                    if (name === map[line][i]) {
                        count += 1
                    } else if (name !== "" && !this.winer.includes(name) && !this.loser.includes(name)) {
                        if (count === 2) {
                            this.loser.push(name)
                            return ["lose", name]
                        } else if (count >= 3) {
                            this.winer.push(name)
                            return ["win", name]
                        } else {
                            count = 0
                            name = map[line][i]
                        }
                    } else {
                        count = 0
                        name = map[line][i]
                    }
                }
            }
        }
        return "none"
    }
}

const game = new Game()