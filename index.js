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
    // Sun coordinates 
    var sunX = canvas.width / 6;
    var sunY = canvas.height / 8;
    var sunRadius = 0.2 * Math.pow(sunX * sunX + sunY * sunY, 0.5);
    let gradient = ctx.createLinearGradient(0, canvas.height / 4, 0, canvas.height);

    // Real life time in hours 
    var today = new Date().getHours();

    // Calculate canvas background depending on the hour of the day 
    if (today >= 18 || today < 6) {
        // Night
        gradient.addColorStop(0, '#02060e');
        gradient.addColorStop(.25, '#0e1724');
        gradient.addColorStop(.5, '#11233a');
        gradient.addColorStop(.75, '#132f51');
        gradient.addColorStop(1, '#143c6a');
    } else if ((today >= 6 && today <= 9) || (today > 15 && today < 18)){
        // Rising/setting
        sunX = canvas.width / 6;
        sunY = canvas.height / 2;
        sunRadius = 0.14 * Math.pow(sunX * sunX + sunY * sunY, 0.5);
        gradient.addColorStop(0, '#b44140');
        gradient.addColorStop(.25, '#c45a39');
        gradient.addColorStop(.5, '#cf7532');
        gradient.addColorStop(.75, '#d3912e');
        gradient.addColorStop(1, '#d2ae32');
    } else {
        // Peak sunny period
        gradient.addColorStop(0, '#32b3d1');
        gradient.addColorStop(.5, 'rgb(249, 253, 255)');
        gradient.addColorStop(1, '#fcc900');
    }
    
    ctx.fillStyle = gradient;
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    
    // Draw birds
    if (today > 9 && today <= 15) {
        // Bigger bird
        ctx.beginPath();
        ctx.arc(canvas.width / 1.5, canvas.height / 2.5, 12, Math.PI, 0);
        ctx.arc(canvas.width / 1.38, canvas.height / 2.5, 12, Math.PI, 0);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        
        // Smaller bird
        ctx.beginPath();
        ctx.arc(canvas.width / 1.58, canvas.height / 3.3, 9, Math.PI, 0);
        ctx.arc(canvas.width / 1.48, canvas.height / 3.3, 9, Math.PI, 0);
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }    

    generateSun(sunX, sunY, sunRadius);
    
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

generateSun = (x, y, radius) => {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  var rnd = 0.08 * Math.sin(1.1 * Date.now() / 1000);
  radius = radius * (1 + rnd);
  var radialGradient =
    createRadialGradient([x, y, 0, x , y , radius ], [
      0.0, '#992',
      0.15 + rnd, '#888',
      0.45 + rnd, '#330',
      0.55, '#110',
      1, '#000'
    ]);
  ctx.fillStyle = radialGradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * 3.14);
  ctx.fill();
  ctx.restore();
}

createRadialGradient = (circleCoords, stops) => {
    var gd = ctx.createRadialGradient.apply(ctx, circleCoords);
    for (var i = 0; i < stops.length; i += 2) {
        gd.addColorStop(stops[i], stops[i + 1]);
    }
    return gd;
}


landscape = new Landscape();
landscape.generateHill('rgba(193, 225, 242, .4)', 'rgba(212, 238, 252, 1)', 75, 3);
landscape.generateHill('rgba(86, 148, 181, .75)', 'rgba(111, 190, 232, 1)', 110, 10);
landscape.generateHill('#3f6b82', '#5694b5', 75, 20);
landscape.generateWater('#ddeaff', 20);
landscape.generateHill('#223843', '#3f6b82', 55, 5);

landscape.draw();