import p5 from 'p5';
import { Ship } from './ship';
import { randomScreenPosition } from './utils';

export type AttractorKind = 'src' | 'dest';
export interface Attractor {
    pos: p5.Vector;
    phase: number;
    podCount: number;
    kind: AttractorKind;
    isDead: boolean;
}

export function createAttractor(kind: AttractorKind, p: p5): Attractor {
    return {
        pos: randomScreenPosition(p),
        phase: p.random(p.TWO_PI),
        podCount: kind === 'dest' ? 0 : 1 + p.int(p.random(7)),
        kind,
        isDead: false,
    };
}

export function createAttractors(p: p5): Attractor[] {
    const attractors = [];
    for (let i = 0; i < 20; i++) {
        const attr = createAttractor(i % 2 === 0 ? 'src' : 'dest', p);
        attractors.push(attr);
    }
    return attractors;
}

export function drawAttractors(attractors: Attractor[], p: p5) {
    for (let attractor of attractors) {
        drawAttractor(attractor, p);
    }
}

export function drawAttractor(attractor: Attractor, p: p5) {
    p.push();
    p.translate(attractor.pos);
    p.noFill();
    p.stroke(255, 100);
    const sz = 70;
    if (attractor.kind === 'src') {
        p.circle(0, 0, sz);
    } else {
        p.rectMode(p.CENTER);
        p.square(0, 0, sz);
    }
    p.textSize(20);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(attractor.podCount, 0, 0);
    p.pop();
}

export function updateAttractors(attractors: Attractor[], p: p5) {
    const attractorsToKeep = attractors.filter((a) => !a.isDead);
    attractors.length = 0;
    attractors.push(...attractorsToKeep);
}

export function addAttractorAtPosition(
    pos: p5.Vector,
    attractors: Attractor[],
    p: p5
) {
    const sLen = attractors.filter((a) => a.kind === 'src').length;
    const dLen = attractors.filter((a) => a.kind === 'dest').length;

    const a = createAttractor(sLen < dLen ? 'src' : 'dest', p);
    a.pos = pos.copy();
    attractors.push(a);
    const liveAttractors = attractors.filter((a) => !a.isDead);
    if (liveAttractors.length >= 10) {
        liveAttractors[0].isDead = true;
    }
}

export function removeAttractorNearestToPosition(
    pos: p5.Vector,
    attractors: Attractor[],
    p: p5
) {
    attractors.pop();
}

export function calcAttractorStrength(
    attractor: Attractor,
    ship: Ship,
    p: p5
): number {
    return attractor.kind === 'dest'
        ? p.map(ship.podCount, 0, 5, 0, 0.2, true)
        : p.map(attractor.podCount, 0, 5, 0, 0.2, true);
}

export function recycleAttractor(
    attractor: Attractor,
    attractors: Attractor[],
    p: p5
) {
    attractor.isDead = true;
    const newA = createAttractor(attractor.kind, p);
    attractors.push(newA);
}
