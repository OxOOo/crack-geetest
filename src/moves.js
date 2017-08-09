
let _ = require('lodash');

function getTracks(length) {
    let tracks = [];
    let current = 0;
    let mid = _.floor(length * 4 / 5);
    const t = 0.2;
    let v = 0;

    while(current < length) {
        let a;
        if (current < mid)
            a = 2;
        else a = -3;
        let v0 = v;
        v = v0 + a * t;
        let move = v0 * t + 1/2*a*t*t;
        current += move;
        tracks.push(_.round(move));
    }

    return tracks;
}

module.exports = function genMoves(length) {
    let moves = [];

    moves.push({
        x: -_.random(15, 30),
        y: -_.random(15, 30),
        time: 0
    });
    moves.push({
        x: 0,
        y: 0,
        time: 0
    });

    let tracks = getTracks(length);
    let x = 0;
    let y = 0;
    let t = 0;
    tracks.forEach((step) => {
        t += _.random(3, 8);
        x += step;
        moves.push({x: x, y: y, time: t});
    });

    t += _.random(100, 500);
    moves.push({x: x, y: y, time: t});

    return moves;
}