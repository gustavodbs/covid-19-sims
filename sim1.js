// Simulation parameters
let popSize = 200;
let infectedPop = 2;
let contP = .6;

// Graphic parameters
let width = 650;
let height = 1150;
let indRadius = 4;

// Execution data
let individuals = []


function setup() {
  createCanvas(width, height);
  spawnIndividuals()
}

function spawnIndividuals() {
  for(let i = 0; i < popSize; i++) {
    let ind = new Individual({
      id:i+1,
      x:random(indRadius, width - indRadius),
      y:random(indRadius, height - indRadius),
      r: indRadius,
      vx: Math.cos(random(0, Math.PI*2)),
      vy: Math.sin(random(0, Math.PI*2)),
      infected: i < infectedPop,
    });
    individuals.push(ind)
  }
}

function draw() {
  background(255);
  individuals.forEach(i => {
    i.collide()
    i.update();
    i.display();
  })
}