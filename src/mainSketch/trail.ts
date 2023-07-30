import p5 from 'p5';
import { Ship } from './ship';
//git master copy - was in https://openprocessing.org/sketch/1979064
export type Trail = p5.Vector[];
export function drawTrail(ship: Ship, p: p5) {
    p.beginShape();
    p.noFill();
    p.stroke(ship.colour1);

    for (const tp of ship.trail) {
        p.vertex(tp.x, tp.y);
    }
    p.endShape();

    // drawTrailFunkySquares(ship)
    for (
        let ix = 0, podNum = 0;
        ix < ship.trail.length && podNum < ship.podCount;
        ix += 4, podNum++
    ) {
        p.push();
        const tp = ship.trail[ix];
        const next = ship.trail[ix + 1];

        p.translate(tp);
        if (next) {
            const angle = p5.Vector.sub(next, tp).heading();
            p.rotate(angle);
        }
        p.fill('red');
        p.rectMode(p.CENTER);
        if (ship.kind === 'src') {
            p.square(0, 0, 10);
        } else {
            p.circle(0, 0, 10);
        }
        p.pop();
    }
}

export function drawTrailFunky(ship: Ship, p: p5) {
    for (let ix = 0; ix < ship.trail.length; ix += 4) {
        p.push();
        const tp = ship.trail[ix];
        p.translate(tp);
        p.fill('red');
        p.circle(0, 0, 3);
        p.pop();
    }
}

export function drawTrailFunkySquares(ship: Ship, p: p5) {
    for (let ix = 0; ix < ship.trail.length; ix += 4) {
        p.push();
        const tp = ship.trail[ix];
        const next = ship.trail[ix + 1];

        p.translate(tp);
        if (next) {
            const angle = p5.Vector.sub(next, tp).heading();
            p.rotate(angle);
        }
        p.fill('red');
        p.rectMode(p.CENTER);
        p.square(0, 0, 10);
        p.pop();
    }
}
