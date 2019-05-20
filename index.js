class Hill {
    constructor(stepsCount = 0, steps = [], maxHeight, colorTop, colorBottom) {
        this.stepsCount = stepsCount;
        this.steps = [...steps];
        this.startPoint = {
            x: 0,
            y: invertY(random(0, maxHeight))
        };
        this.endPoint = {
            x: canvas.width,
            y: invertY(random(0, maxHeight))
        };
        this.colorTop = colorTop;
        this.colorBottom = colorBottom;
        this.maxHeight = maxHeight;
    }
}

class Water {
    constructor(stepsCount = 0, steps = [], maxHeight, colorTop, colorBottom) {
        this.stepsCount = stepsCount;
        this.steps = [...steps];
        this.startPoint = {
            x: 0,
            y: invertY(maxHeight)
        };
        this.endPoint = {
            x: canvas.width,
            y: invertY(maxHeight)
        };
        this.colorTop = colorTop;
        this.colorBottom = colorBottom;
        this.maxHeight = maxHeight;
    }
}

class Landscape {

    constructor() {
        this.hills = [];
    }
}

Landscape.prototype.generateHill = function (colorTop, colorBottom, maxHeight, points) {
    let stepsCount = points;
    let steps = [];
    let x = 0;
    let spaceLeft = canvas.width;

    for (let i = 0; i < stepsCount; i++) {
        spaceLeft = spaceLeft / 2;
        x = random(x, x + random(20, 100) + spaceLeft);
        steps.push({
            x: x,
            y: invertY(random(0, maxHeight))
        });
    }

    this
        .hills
        .push(new Hill(stepsCount, steps, maxHeight, colorTop, colorBottom));
}

Landscape.prototype.generateWater = function (color, height) {
    let stepsCount = 0;
    let steps = [];
    let x = 0;
    let spaceLeft = canvas.width;

    this
        .hills
        .push(new Water(stepsCount, steps, height, color, color));
}

Landscape.prototype.draw = function () {

    let gradient = ctx.createLinearGradient(0, canvas.height / 4, 0, canvas.height);
            gradient.addColorStop(0, '#32b3d1');
            gradient.addColorStop(.5, 'rgb(249, 253, 255)');
            gradient.addColorStop(1, '#fcc900');
            ctx.fillStyle = gradient;
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    this
        .hills
        .map(hill => {

            let gradient = ctx.createLinearGradient(0, hill.maxHeight + 50, 0, canvas.height);
            gradient.addColorStop(0, hill.colorTop);
            gradient.addColorStop(1, hill.colorBottom);
            ctx.fillStyle = gradient;

            ctx.beginPath();
            ctx.moveTo(hill.startPoint.x, hill.startPoint.y);

            for (let i = 0; i < hill.steps.length; i++) {
                if (i + 1 < hill.steps.length) {
                    let xc = (hill.steps[i].x + hill.steps[i + 1].x) / 2
                    let yc = (hill.steps[i].y + hill.steps[i + 1].y) / 2 - random(1, 10)
                    ctx.quadraticCurveTo(hill.steps[i].x, hill.steps[i].y, xc, yc);
                } else {
                    let xc = (hill.steps[i].x + hill.endPoint.x) / 2
                    let yc = (hill.steps[i].y + hill.endPoint.y) / 2
                    ctx.quadraticCurveTo(hill.steps[i].x, hill.steps[i].y, xc, yc);
                }
            }

            ctx.lineTo(hill.endPoint.x, hill.endPoint.y);

            ctx.lineTo(440, invertY(0));
            ctx.lineTo(0, invertY(0));
            ctx.lineTo(hill.startPoint.x, hill.startPoint.y);
            ctx.fill();

            // for (let i = 0; i < hill.steps.length; i++) {
            //     let step = hill.steps[i];
            //     ctx.rect(step.x, 50, 5, 5);
            //     ctx.fill();
            // }

            // ctx.beginPath();
            // if (hill.steps[0]) {
            //     let tempX = hill.steps[0].x - 20;
            //     let tempY = hill.steps[0].y + 15;
            //     ctx.moveTo(tempX, tempY);
            //     ctx.lineTo(tempX - 10, tempY - 10);
            //     ctx.lineTo(tempX + 10, tempY);
            //     ctx.lineTo(tempX + 10, tempY + 5);
            //     ctx.lineTo(tempX, tempY + 30);
            //     ctx.lineTo(tempX, tempY);
            // }

            // ctx.fill();

        })
}

let canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    brushX = 0,
    brushY = 0,
    hills = [];

random = (min, max) => {
    return Math.random() * (max - min) + min;
}

invertY = (number) => {
    return canvas.height - number;
}

landscape = new Landscape();
landscape.generateHill('rgba(193, 225, 242, .4)', 'rgba(212, 238, 252, 1)', 75, 3);
landscape.generateHill('rgba(86, 148, 181, .75)', 'rgba(111, 190, 232, 1)', 110, 10);
landscape.generateHill('#3f6b82', '#5694b5', 75, 20);
landscape.generateWater('#ddeaff', 20);
landscape.generateHill('#223843', '#3f6b82', 55, 5);

landscape.draw();