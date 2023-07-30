import p5 from 'p5';
import {
    Attractor,
    AttractorKind,
    calcAttractorStrength,
    recycleAttractor,
} from './attractor';
import { centrePos, randomScreenPosition } from './utils';
import { Bullet, fireBullet } from './bullet';
import { Trail, drawTrail } from './trail';

export interface Ship {
    pos: p5.Vector;
    vel: p5.Vector;
    podCount: number;
    colour1: p5.Color;
    lastPickupFrame: number;
    lastDropoffFrame: number;
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
        lastDropoffFrame: 0,
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
    recordToTrail(ship, p);

    teleportIfNecessary(ship, p);

    applyForcesFromAttractors(ship, attractors, p);

    handleCollisions(ship, attractors, p);

    const randomSteeringAmount = 0;

    ship.vel.rotate(p.random(-randomSteeringAmount, randomSteeringAmount));
    ship.vel.limit(5);
    ship.pos.add(ship.vel);

    if (p.random() < 0.1) {
        fireBullet(ship, bullets, p);
    }
}

function applyForcesFromAttractors(ship: Ship, attractors: Attractor[], p: p5) {
    for (const attractor of attractors) {
        // attractor.strength = map(sin(attractor.phase + frameCount / 100), -1, 1, 0, 0.2, true);
        const strength = calcAttractorStrength(attractor, ship, p);
        const distToAttractor = attractor.pos.dist(ship.pos);
        const accel = p5.Vector.sub(attractor.pos, ship.pos).setMag(
            strength * 1000
        );
        accel.mult(1 / p.pow(distToAttractor, 1.5)).limit(1);
        ship.vel.add(accel);
    }
}

function handleCollisions(ship: Ship, attractors: Attractor[], p: p5) {
    for (const attractor of attractors) {
        if (attractor.pos.dist(ship.pos) < 50) {
            if (attractor.kind === 'dest') {
                //drop-off
                if (
                    ship.podCount > 0 &&
                    p.frameCount - ship.lastDropoffFrame > 59
                ) {
                    attractor.podCount++;
                    ship.podCount--;
                    ship.lastDropoffFrame = p.frameCount;
                }
            } else {
                //pickup
                if (
                    attractor.podCount > 0 &&
                    ship.podCount < 5 &&
                    p.frameCount - ship.lastPickupFrame > 59
                ) {
                    attractor.podCount--;
                    ship.podCount++;
                    ship.lastPickupFrame = p.frameCount;
                    if (attractor.podCount <= 0) {
                        recycleAttractor(attractor, attractors, p);
                    }
                }
            }
        }
    }
}

function teleportIfNecessary(ship: Ship, p: p5): boolean {
    if (ship.pos.dist(centrePos(p)) > 4000) {
        ship.trail.length = 0;
        ship.pos = randomScreenPosition(p);
        ship.vel = p.createVector(0, 0);
        return true;
    }
    return false;
}

function recordToTrail(ship: Ship, p: p5) {
    ship.trail.push(ship.pos.copy());
    if (ship.trail.length > 60) {
        ship.trail.shift();
    }
}
