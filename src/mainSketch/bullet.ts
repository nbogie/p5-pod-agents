import p5 from 'p5';
import { outOfBounds } from './utils';

export type BulletSource = {
    pos: p5.Vector;
    vel: p5.Vector;
    colour1: p5.Color;
};

export interface Bullet {
    pos: p5.Vector;
    vel: p5.Vector;
    isDead: boolean;
    colour: p5.Color;
}

function createBullet(source: BulletSource, p: p5): Bullet {
    return {
        pos: source.pos.copy(),
        vel: source.vel.copy().setMag(15),
        isDead: false,
        colour: source.colour1,
    };
}

export function drawBullets(bullets: Bullet[], p: p5) {
    for (let b of bullets) {
        drawBullet(b, p);
    }
}

export function updateBullets(bullets: Bullet[], p: p5) {
    for (let b of bullets) {
        updateBullet(b, p);
    }
}

export function updateBullet(b: Bullet, p: p5) {
    b.pos.add(b.vel);
    if (outOfBounds(b.pos, p)) {
        b.isDead = true;
    }
}

export function drawBullet(b: Bullet, p: p5) {
    p.push();
    p.translate(b.pos);
    p.rotate(b.vel.heading());
    p.noStroke();
    p.fill(b.colour);
    p.rectMode(p.CENTER);
    p.rect(0, 0, 20, 3);
    p.pop();
}

export function fireBullet(source: BulletSource, bullets: Bullet[], p: p5) {
    const b = createBullet(source, p);
    bullets.push(b);
}
