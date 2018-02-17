var title = new CenteredText(
	300, "Roboto", [177, 141, 67, 0], "S L T", 0, -50
);
var subTitle = new CenteredText(
	100, "Roboto", [177, 141, 67, 0], "Smart Law Tech", 0, -250
);

function CenteredText(fontSize, fontFamily, fill, text, x, y) {
	this.fontSize = fontSize;
	this.fontFamily = fontFamily;
	this.fill = fill;
	this.rgba = 'rgba(' + fill[0] + ',' + fill[1] + ',' + fill[2] + ',' + fill[3] + ')';
	this.text = text;
	this.x = x;
	this.y = y;

	this.draw = function () {
		if (fill[0] < 255 && fill[1] < 255 && fill[2] < 255 && fill[3] < 1) {
			this.rgba = 'rgba(' + fill[0] + ',' + fill[1] + ',' + fill[2] + ',' + fill[3] + ')';
		}
		drawArea.font = this.fontSize + "px " + this.fontFamily;
		drawArea.fillStyle = this.rgba;
		drawArea.textAlign = "center";
		drawArea.fillText(this.text, centerX(x), centerY(y));
	}
	this.update = function () {
		this.draw();
	}
}

function centerX(size) {
	return window.innerWidth / 2 - size / 2;
}

function centerY(size) {
	return window.innerHeight / 2 - size / 2;
}

// --------------------------------------------------------------

let resizeReset = function () {
	w = canvasBody.width = window.innerWidth;
	h = canvasBody.height = window.innerHeight;
}

const opts = {
	particleColor: "rgb(177,141,67)",
	lineColor: "rgb(177,141,67)",
	particleAmount: 50,
	defaultSpeed: 1,
	variantSpeed: 1,
	defaultRadius: 3,
	variantRadius: 0,
	linkRadius: 200,
	lineWidth: 3,
};

window.addEventListener("resize", function () {
	deBouncer();
});

let deBouncer = function () {
	clearTimeout(tid);
	tid = setTimeout(function () {
		resizeReset();
	}, delay);
};

let checkDistance = function (x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

let linkPoints = function (point1, hubs) {
	for (let i = 0; i < hubs.length; i++) {
		let distance = checkDistance(point1.x, point1.y, hubs[i].x, hubs[i].y);
		let opacity = 1 - distance / opts.linkRadius;
		let lineWidth = (1 - distance / opts.linkRadius) * opts.lineWidth;
		if (opacity > 0) {
			drawArea.lineWidth = 0.5;
			drawArea.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
			drawArea.beginPath();
			drawArea.moveTo(point1.x, point1.y);
			drawArea.lineWidth = lineWidth;
			drawArea.lineTo(hubs[i].x, hubs[i].y);
			drawArea.closePath();
			drawArea.stroke();
		}
	}
}

Particle = function (xPos, yPos) {
	this.x = Math.random() * w;
	this.y = Math.random() * h;
	this.speed = opts.defaultSpeed + Math.random() * opts.variantSpeed;
	this.directionAngle = Math.floor(Math.random() * 360);
	this.color = opts.particleColor;
	this.radius = opts.defaultRadius + Math.random() * opts.variantRadius;
	this.vector = {
		x: Math.cos(this.directionAngle) * this.speed,
		y: Math.sin(this.directionAngle) * this.speed
	};
	this.update = function () {
		this.border();
		this.x += this.vector.x;
		this.y += this.vector.y;
	};
	this.border = function () {
		if (this.x >= w || this.x <= 0) {
			this.vector.x *= -1;
		}
		if (this.y >= h || this.y <= 0) {
			this.vector.y *= -1;
		}
		if (this.x > w) this.x = w;
		if (this.y > h) this.y = h;
		if (this.x < 0) this.x = 0;
		if (this.y < 0) this.y = 0;
	};
	this.draw = function () {
		drawArea.beginPath();
		drawArea.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		drawArea.closePath();
		drawArea.fillStyle = this.color;
		drawArea.fill();
	};
};

function setup() {
	particles = [];
	resizeReset();
	for (let i = 0; i < opts.particleAmount; i++) {
		particles.push(new Particle());
	}
	window.requestAnimationFrame(loop);
}

function loop() {
	window.requestAnimationFrame(loop);
	drawArea.clearRect(0, 0, w, h);
	for (let i = 0; i < particles.length; i++) {
		particles[i].update();
		particles[i].draw();
	}
	for (let i = 0; i < particles.length; i++) {
		linkPoints(particles[i], particles);
	}

	subTitle.fill[3] += 0.01;
        subTitle.update();
        title.fill[3] += 0.01;
        title.update();
}

const canvasBody = document.getElementById("canvas"),
	drawArea = canvasBody.getContext("2d");
let delay = 200, tid,
	rgb = opts.lineColor.match(/\d+/g);
resizeReset();
setup();