import p5 from 'p5';
import { Attractor, AttractorKind } from './attractor';
import { centrePos, randomScreenPosition } from './utils';
import { Bullet, fireBullet } from './bullet';
import { Trail, drawTrail } from './trail';

export interface Ship {
    pos: p5.Vector;
    vel: p5.Vector;
    podCount: number;
    colour1: p5.Color;
    lastPickupFrame: number;
    trail: Trail;
    kind: ShipKind;
}
export type ShipKind = AttractorKind;

export function createShip(kind: ShipKind, p: p5): Ship {
    const c = p.color(kind === 'src' ? 'magenta' : 'dodgerblue');
    c.setAlpha(150);

    const ship: Ship = {
        pos: randomScreenPosition(p), //centrePos.copy(),
        vel: p.createVector(0, 0), //randomVelocity()
        podCount: 0,
        colour1: c,
        lastPickupFrame: 0,
        trail: [],
        kind,
    };
    return ship;
}

export function createShips(p: p5) {
    const ships: Ship[] = [];
    for (let i = 0; i < 5; i++) {
        const ship: Ship = createShip(i % 2 === 0 ? 'src' : 'dest', p);
        ships.push(ship);
    }
    return ships;
}

export function drawShips(ships: Ship[], p: p5) {
    for (const s of ships) {
        drawShip(s, p);
    }
}

export function drawShip(ship: Ship, p: p5) {
    p.push();
    p.stroke(255);
    p.translate(ship.pos);
    p.rotate(ship.vel.heading());
    p.rectMode(p.CENTER);
    if (ship.kind === 'src') {
        p.square(0, 0, 10);
    } else {
        p.circle(0, 0, 10);
    }
    p.pop();
    // drawTextLabel(ship, p);

    drawTrail(ship, p);
}

function drawTextLabel(ship: Ship, p: p5): void {
    p.push();
    p.noStroke();
    p.fill('white');
    p.translate(ship.pos);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(30);
    p.text(ship.podCount, 0, 0);
    p.pop();
}
export function updateShips(
    ships: Ship[],
    attractors: Attractor[],
    bullets: Bullet[],
    p: p5
) {
    for (const s of ships) {
        updateShip(s, attractors, bullets, p);
    }
}

export function updateShip(
    ship: Ship,
    attractors: Attractor[],
    bullets: Bullet[],
    p: p5
) {
    ship.trail.push(ship.pos.copy());
    if (ship.pos.dist(centrePos(p)) > 4000) {
        ship.trail.length = 0;
        ship.pos = randomScreenPosition(p);
        ship.vel = p.createVector(0, 0);
    }
    if (ship.trail.length > 60) {
        ship.trail.shift();
    }
    ship.pos.add(ship.vel);
    if (ship.pos.dist(centrePos(p)) > p.min(p.width, p.height) * 0.5) {
        // ship.pos = centrePos.copy()
        // ship.vel = randomVelocity()
    }
    for (const attractor of attractors) {
        if (attractor.pos.dist(ship.pos) < 20) {
            if (
                attractor.podCount > 0 &&
                ship.podCount < 5 &&
                p.frameCount - ship.lastPickupFrame > 59
            ) {
                attractor.podCount--;
                ship.podCount++;
                ship.lastPickupFrame = p.frameCount;
            }
        }
    }

    for (const attractor of attractors) {
        // attractor.strength = map(sin(attractor.phase + frameCount / 100), -1, 1, 0, 0.2, true);
        attractor.strength = p.map(attractor.podCount, 0, 5, 0, 0.2, true);
        const distToAttractor = attractor.pos.dist(ship.pos);
        const accel = p5.Vector.sub(attractor.pos, ship.pos).setMag(
            attractor.strength * 1000
        );
        accel.mult(1 / p.pow(distToAttractor, 1.5)).limit(1);
        ship.vel.add(accel);
    }
    const randomSteeringAmount = 0.1;
    ship.vel.rotate(p.random(-randomSteeringAmount, randomSteeringAmount));
    ship.vel.limit(10);

    if (p.random() < 0.001) {
        fireBullet(ship, bullets, p);
    }
}
