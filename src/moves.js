
let _ = require('lodash');

// function getTracks(length) {
//     let tracks = [];
//     let current = 0;
//     let mid = _.floor(length * 4 / 5);
//     const t = 0.2;
//     let v = 0;

//     while(current < length) {
//         let a;
//         if (current < mid)
//             a = 2;
//         else a = -3;
//         let v0 = v;
//         v = v0 + a * t;
//         let move = v0 * t + 1/2*a*t*t;
//         current += move;
//         tracks.push(_.round(move));
//     }

//     return tracks;
// }

// module.exports = function genMoves(length) {
//     let moves = [];

//     moves.push({
//         x: -_.random(15, 30),
//         y: -_.random(15, 30),
//         time: 0
//     });
//     moves.push({
//         x: 0,
//         y: 0,
//         time: 0
//     });

//     let tracks = getTracks(length);
//     let x = 0;
//     let y = 0;
//     let t = 0;
//     tracks.forEach((step) => {
//         t += _.random(3, 8);
//         x += step;
//         moves.push({x: x, y: y, time: t});
//     });

//     t += _.random(100, 500);
//     moves.push({x: x, y: y, time: t});

//     return moves;
// }

module.exports = function genMoves(length) {
    let x = [[-21,-21,0],[0,0,0],[1,0,214],[4,-1,230],[8,-1,249],[12,-1,263],[17,-1,281],[20,-2,297],[23,-2,314],[26,-2,331],[30,-2,347],[32,-2,362],[36,-2,380],[40,-2,397],[44,-2,415],[47,-2,431],[51,-2,447],[57,-2,462],[60,-2,480],[62,-2,496],[65,-2,514],[66,-1,530],[68,-1,547],[71,-1,563],[74,-1,579],[77,-1,596],[80,-1,613],[82,-1,629],[86,0,646],[89,0,663],[94,1,679],[97,1,696],[101,2,712],[105,3,729],[108,3,746],[109,4,763],[111,4,780],[114,5,796],[115,5,813],[116,6,830],[117,6,847],[118,6,865],[119,6,911],[119,6,1035],[120,6,1058],[121,6,1113],[121,6,1206],[122,6,1221],[122,6,1247],[123,6,1267],[123,6,1359],[124,6,1391],[124,6,1606]];
    let moves = [];
    let x_total_time = _.last(x)[2];
    let x_total_length = _.last(x)[0];
    let time = _.random(1000, 2000);

    moves.push({
        x: x[0][0],
        y: x[0][1],
        time: x[0][2],
    });
    for(let i = 1; i < x.length; i ++) {
        moves.push({
            x: Math.round(x[i][0]/x_total_length*length),
            y: x[i][1],
            time: Math.round(x[i][2]/x_total_time*time),
        });
    }

    return moves;
}
