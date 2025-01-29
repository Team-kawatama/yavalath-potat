class PotatminGame {
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

    set(a, b, name) {
        let position = this.Pmap.map0[a][b].split(":")
        this.map[parseInt(position[0])][parseInt(position[1])] = name
    }
}
class PotatAI {
    constructor() {
        this.tolose = [[],[]]
        this.ewin ={'n':[],'n2':[]}
        this.elose ={'n':[],'n2':[]}
        this.c = {'d': true, 'p': 5, 'n': 4, 'i': document.getElementById('ailog')}
        this.mp = {'map0':[
            ["0:0","0:1","0:2","0:3","0:4"],
            ["1:0","1:1","1:2","1:3","1:4","1:5"],
            ["2:0","2:1","2:2","2:3","2:4","2:5","2:6"],
            ["3:0","3:1","3:2","3:3","3:4","3:5","3:6","3:7"],
            ["4:0","4:1","4:2","4:3","4:4","4:5","4:6","4:7","4:8"],
            ["5:0","5:1","5:2","5:3","5:4","5:5","5:6","5:7"],
            ["6:0","6:1","6:2","6:3","6:4","6:5","6:6"],
            ["7:0","7:1","7:2","7:3","7:4","7:5"],
            ["8:0","8:1","8:2","8:3","8:4"]
        ],'map120':[
            ["4:8","3:7","2:6","1:5","0:4"],
            ["5:7","4:7","3:6","2:5","1:4","0:3"],
            ["6:6","5:6","4:6","3:5","2:4","1:3","0:2"],
            ["7:5","6:5","5:5","4:5","3:4","2:3","1:2","0:1"],
            ["8:4","7:4","6:4","5:4","4:4","3:3","2:2","1:1","0:0"],
            ["8:3","7:3","6:3","5:3","4:3","3:2","2:1","1:0"],
            ["8:2","7:2","6:2","5:2","4:2","3:1","2:0"],
            ["8:1","7:1","6:1","5:1","4:1","3:0"],
            ["8:0","7:0","6:0","5:0","4:0"]
        ],'map240':[
            ["8:4","7:5","6:6","5:7","4:8"],
            ["8:3","7:4","6:5","5:6","4:7","3:7"],
            ["8:2","7:3","6:4","5:5","4:6","3:6","2:6"],
            ["8:1","7:2","6:3","5:4","4:5","3:5","2:5","1:5"],
            ["8:0","7:1","6:2","5:3","4:4","3:4","2:4","1:4","0:4"],
            ["7:0","6:1","5:2","4:3","3:3","2:3","1:3","0:3"],
            ["6:0","5:1","4:2","3:2","2:2","1:2","0:2"],
            ["5:0","4:1","3:1","2:1","1:1","0:1"],
            ["4:0","3:0","2:0","1:0","0:0"]
        ]}
        this.circle = [
            ["4:4"],
            ["3:3","3:4","4:5","5:4","4:3","5:3"],
            ["2:2","2:3","2:4","4:6","5:5","6:4","4:2","5:2","6:2","3:2","3:5","6:3"],
            ["1:1","1:2","1:3","1:4","4:7","5:6","6:5","7:4","4:1","5:1","6:1","7:1","2:1","3:1","7:2","7:3","2:5","3:6"],
            ["0:0","0:1","0:2","0:3","0:4","4:8","5:7","6:6","7:5","8:4","4:0","5:0","6:0","7:0","8:0","1:0","2:0","3:0","1:5","2:6","3:7","8:1","8:2","8:3"]
        ]
        this.core = []
    }
    dc(o){
        return JSON.parse(JSON.stringify(o))
    }
    print(...a){
        if (this.c.d){
            if (a.length){
                for(var i of a){
                    if (i == '-b'){
                        this.c.i.innerHTML += '<br>'
                    } else {
                        this.c.i.innerHTML += i
                    }
                }
            } else {
                this.c.i.innerHTML = ''
            }
        }
    }
    format(li,next){
        var nl = {'map0':[[],[],[],[],[],[],[],[],[]],'map120':[[],[],[],[],[],[],[],[],[]],'map240':[[],[],[],[],[],[],[],[],[]]}
        for (var i in li) for (var l in li[i]) for (var k of li[i][l]){
            if (k) nl[i][l].push((['white','black','red'].indexOf(k)-['white','black','red'].indexOf(next)+3)%3+1)
            else nl[i][l].push(0)
        }
        return nl
    }
    toriage(li){
        for (var i in this.core){
            if (![0,1].includes(li.map0[this.core[i][0]][this.core[i][1]])) {
                this.core.splice(this.core.indexOf(i),1,undefined)
                continue
            }
            var aa = 0
            for (var j in li){
                var a = [0,0]
                for (var k in this.mp[j]){
                    a = this.mp[j][k].indexOf(i.join(':')) == -1 ? a : [k,this.mp[j][k].indexOf(i.join(':'))]
                }
                li[a[0]][a[1]] = 4
                if (this.any(li[j],'10021') || this.any(li[j],'10201') || this.any(li[j],'12001') || 
                    this.any(li[j],'1021') || this.any(li[j],'1201') || 
                    (this.any(li[j],'102001') && li[j].join("").includes('411')) ||
                    (this.any(li[j],'100201') && li[j].join("").includes('114'))
                ) a+=1
            }
            if (a > 3-3/*ここに人数*/) this.core.splice(this.core.indexOf(i),1,undefined)
        }
    this.core = this.core.filter(Boolean)
    }
    find(x,y,map){
        var a = [0,0]
        for (var k in this.mp[map]){
            a = this.mp[map][k].indexOf([x,y].join(':')) == -1 ? a : [k,this.mp[map][k].indexOf([x,y].join(':'))]
        }
        return a
    }
    any(li,a){
        if (a == 2) return li.join('').includes('1104') || li.join('').includes('1401') || li.join('').includes('4101') || li.join('').includes('1014') || li.join('').includes('1041') || li.join('').includes('4011')
        else if (a == -2) return li.join('').includes('224') || li.join('').includes('242') || li.join('').includes('422') || li.join('').includes('334') || li.join('').includes('343') || li.join('').includes('433')
        else {
            var c = [[]]
            for(var i in a){
                var temp = []
                for (var j of [[0,1],[2,3],[4]][a[i]]){
                    for (var k of c){
                        temp.push([...k,j])
                    }
                }
                c = temp
            }
            for (var i of c) if (li.join("").includes(i.join(""))) return true
            return false
        }
    }
    defence(li){
        var a = [{'k':[],'p':[],'n':[]},{'k':[],'p':[],'n':[]}]
        var s = []
        for (var i in li.map0) for (var j in li.map0[i]) if (li.map0[i][j] == 0){
            var z = [[i,j],[...this.find(i,j,'map120')],[...this.find(i,j,'map240')]]
            var p = [this.dc(li.map0[i]),this.dc(li.map120[z[1][0]]),this.dc(li.map120[z[2][0]])]
            var n = [[0,0,0],[0,0,0],[0,0,0]]
            for (var k in p){
                var t = [p[k].join('').includes('2202') || p[k].join('').includes('2022'),p[k].join('').includes('3303') || p[k].join('').includes('3033'),p[k].join('').includes('11')]
                p[k][z[k][1]] = 1
                if (p[k].join('').includes('1111')) n[3][0] += 1
                else if (p[k].join('').includes('111')) n[3][1] += 1
                else if (p[k].join('').includes('011') || p[k].join('').includes('101') && !t[2] || p[k].join('').includes('110')) n[3][2] += 1
                p[k][z[k][1]] = 2
                if (p[k].join('').includes('2222')) n[0][0] += 1
                else if (p[k].join('').includes('222')) {n[0][2] += 1; if(!this.elose.n.includes([i,j])) this.elose.n.push([i,j])}
                else if ((p[k].join('').includes('2202') || p[k].join('').includes('2022')) && !t[0]) {n[0][1] += 1; if(!this.ewin.n.includes([i,j])) this.ewin.n.push([i,j])}
                p[k][z[k][1]] = 3
                if (p[k].join('').includes('3333')) n[1][0] += 1
                else if (p[k].join('').includes('333')) {n[1][2] += 1; if(!this.elose.n2.includes([i,j])) this.elose.n2.push([i,j])}
                else if (p[k].join('').includes('3303') || p[k].join('').includes('3033') && !t[1]) {n[1][1] += 1; if(!this.ewin.n2.includes([i,j])) this.ewin.n2.push([i,j])}
                p[k][z[k][1]] = 0
            }
            for (var k in a) {
                if (n[k][0] != 0) a[k].k.push([[i,j],n[k][0]])
                if (n[k][1] != 0) a[k].p.push([[i,j],n[k][1]])
                if (n[k][2] != 0) a[k].p.push([i,j])
            }
            if (n[3][0]) return [i,j]
            else if (n[3][1]) {s.push([i,j]);this.tolose[0].push([i,j])}
            else if (n[3][2]) this.tolose[1].push([i,j])
        }
    //もし生きてるなら
        if (a[0].k.length != 0 && !s.includes(a[0].k[0][0])) return a[0].k[0][0]
        if (a[0].p.length != 0) for (var i of a[0].p) {
            if (i[1] >= 3 && !s.includes(i[0])) return i[0]
            else if (i[1] == 2 && a[1].n.includes(i[0]) && !s.includes(i[0])) return i[0]
        }
    //もし生きてるなら
        if (a[1].k.length != 0) for (var i of a[1].k) {
            if (i[1] >= 2 && !s.includes(i[0])) return i[0]
            else if (a[0].n.includes(i[0]) && !s.includes(i[0])) return i[0]
        }
        if (a[1].p.length != 0) for (var i of a[1].p) {
            if (i[1] >= 3 && a[0].n.includes(i[0]) && !s.includes(i[0])) return i[0]
        }
        return false
    }
    like(li,x,y){
        var t = []
        if (li.join("").includes("0041")) t.push([[x,y-2],1])
        if (li.join("").includes("1400")) t.push([[x,y+2],1])
        if (li.join("").includes("0014")) t.push([[x,y-3],0.8])
        if (li.join("").includes("4100")) t.push([[x,y+3],0.8])
        if (li.join("").includes("0401")) t.push([[x,y-1],1])
        if (li.join("").includes("1040")) t.push([[x,y+1],1])
        if (li.join("").includes("4001")) t.push([[x,y+1],0.8])
        if (li.join("").includes("1004")) t.push([[x,y-1],0.8])
        if (li.join("").includes("4010")) t.push([[x,y+3],0.2])
        if (li.join("").includes("0104")) t.push([[x,y-3],0.2])
        if (t.length == 0) {
            if (li.join("").includes("40")) t.push([[x,y+1],0.2])
            if (li.join("").includes("04")) t.push([[x,y-1],0.2])
        }
        return t
    }
    make(li,b = true,nord = 0){
        var xy = []
        if (b){
            var p = 0
            var q = []
            for (var i of core) {
                var z = {'map0':this.find(...i,'map0'),'map120':this.find(...i,'map120'),'map240':this.find(...i,'map240')}
                var m = {'map0':this.dc(li.map0[z.map0[0]]),'map120':this.dc(li.map120[z.map120[0]]),'map240':this.dc(li.map240[z.map240[0]])}
                for (var j in z){
                    m[j][z[j][1]] = 4
                    if (this.any(m[j],2) || this.any(m[j],-2)) p += 1
                    if (p > 2) return i
                    else q.push(...this.like(m[j],i,j))
                }
            }
            for (var i in q) {
                if (this.tolose[0].includes(q[i][0])) q[i][1] -= 10
                if (this.tolose[1].includes(q[i][0])) q[i][1] -= 0.2
                if (this.ewin.n.includes(q[i][0])) q[i][1] += 0.4
                if (this.ewin.n2.includes(q[i][0])) q[i][1] += 0.2
                if (this.elose.n.includes(q[i][0])) q[i][1] -= 0.4
                if (this.elose.n2.includes(q[i][0])) q[i][1] -= 0.4
            }
            var s = [["s",0],0]
            for (var i of q) {
                if (i[1] > s[1]) s = this.dc(i)
            }
            if (s[0][0] == "s" || s[0][1] < 0) return this.make(li,false,nord+1)
            return s[0]
        } else {
            var a = []
            for (var i in this.circle) for (var j of this.circle[i]) if (li.map0[j.split(":").map(Number)[0]][j.split(":").map(Number)[1]] == 0 || !this.core.includes(j.split(":").map(Number))) {
                var z = {'map0':this.find(...j.split(":").map(Number),'map0'),'map120':this.find(...j.split(":").map(Number),'map120'),'map240':this.find(...j.split(":").map(Number),'map240')}
                var m = {'map0':this.dc(li.map0[z.map0[0]]),'map120':this.dc(li.map120[z.map120[0]]),'map240':this.dc(li.map240[z.map240[0]])}
                var w = 0
                for (var k in z){
                    m[k][z[k]] = 4

                }
            }
            if (nord > 5) for (var i in li.map0) for (var j in li.map0[i]) if (li.map0[i][j] == 0) return [i,j]
            else return this.make(li,true,nord+1)
        }
    }
    put(game,next){
        var copy = new PotatminGame(game.map)
        var ban = this.format(copy.search(),next)
        this.toriage(ban)
        if(this.defence(ban)) return this.defence(ban)
        if (this.core.length == 0) return this.make(ban,false)
        else return this.make(ban)
    }
}
const potat = new PotatAI()