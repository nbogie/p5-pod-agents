import p5 from 'p5';
import {
    Attractor,
    addAttractorAtPosition,
    createAttractors,
    drawAttractors,
    removeAttractorNearestToPosition,
    updateAttractors,
} from './attractor';
import { Bullet, drawBullets, updateBullets } from './bullet';
import { Ship, createShips, drawShips, updateShips } from './ship';
import { toggleFullscreen } from './utils';

new p5(createSketch);

function createSketch(p: p5) {
    let attractors: Attractor[] = [];
    let ships: Ship[] = [];
    let bullets: Bullet[] = [];

    function setup() {
        const myCanvas = p.createCanvas(p.windowWidth, p.windowHeight);
        ships = createShips(p);
        attractors = createAttractors(p);

        myCanvas.mousePressed(handleMousePressed);
    }

    function draw() {
        p.background(100);

        drawShips(ships, p);
        drawAttractors(attractors, p);
        drawBullets(bullets, p);

        updateShips(ships, attractors, bullets, p);
        updateBullets(bullets, p);
        updateAttractors(attractors, p);
    }

    function handleMousePressed() {
        // if (p.mouseButton === p.LEFT) {
        const mousePos = p.createVector(p.mouseX, p.mouseY);
        if (p.keyIsDown(p.SHIFT)) {
            removeAttractorNearestToPosition(mousePos, attractors, p);
        } else {
            addAttractorAtPosition(mousePos, attractors, p);
        }
    }
    function keyPressed() {
        if (p.key === 'f') {
            toggleFullscreen(p);
        }
    }
    //Crucially, assign the setup and draw functions for the p5 createSketch.
    p.setup = setup;
    p.draw = draw;
    p.keyPressed = keyPressed;

    p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
}
