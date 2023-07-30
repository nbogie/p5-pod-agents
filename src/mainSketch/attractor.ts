import p5 from 'p5';
import { randomScreenPosition } from './utils';

export type AttractorKind = 'src' | 'dest';
export interface Attractor {
    pos: p5.Vector;
    strength: number;
    phase: number;
    podCount: number;
    kind: AttractorKind;
}

export function createAttractor(kind: AttractorKind, p: p5) {
    return {
        pos: randomScreenPosition(p),
        strength: p.random(0.01, 0.1),
        phase: p.random(p.TWO_PI),
        podCount: 1 + p.int(p.random(5)),
        kind,
    };
}

export function createAttractors(p: p5): Attractor[] {
    const attractors = [];
    for (let i = 0; i < 10; i++) {
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
    const sz = p.map(attractor.strength, 0, 0.2, 10, 100, true);
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
    for (let attractor of attractors) {
    }
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
    if (attractors.length >= 10) {
        attractors.shift();
    }
}

export function removeAttractorNearestToPosition(
    pos: p5.Vector,
    attractors: Attractor[],
    p: p5
) {
    attractors.pop();
}
