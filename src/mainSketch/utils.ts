import p5 from 'p5';

export function outOfBounds(pos: p5.Vector, p: p5) {
    return pos.x < 0 || pos.y < 0 || pos.x > p.width || pos.y > p.height;
}

export function randomVelocity(p: p5) {
    return p5.Vector.random2D().mult(2);
}

export function randomScreenPosition(p: p5) {
    return p.createVector(p.random(p.width), p.random(p.height));
}

export function centrePos(p: p5): p5.Vector {
    return p.createVector(p.width / 2, p.height / 2);
}

export function toggleFullscreen(p: p5) {
    let fsState = p.fullscreen();
    p.fullscreen(!fsState);
}
