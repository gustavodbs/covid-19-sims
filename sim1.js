"use strict";

// Simulation parameters
let popSize = 150;
let infectedPop = 1;
let infectionProb = 0.2;
let hospitalizationProb = 0.15;
let infectedDeathRate = 0.01;
let hospDeathRate = .3;
let recoveryTime = 14.2; // In days
let hospRecoveryTime = 30; // In days

// Graphic parameters
let width = 1200;
let height = 300;
let individualRadius = 5;
let individualSpeed = 1.5;

// Execution data
let individuals = [];

// Setup simulation (runs once)
function setup() {
  let canvas = createCanvas(width, height);
  canvas.parent("simulationContainer");
  spawnIndividuals();
}

// Renders the next simulation state
function draw() {
  background(255);
  individuals.forEach(i => {
    i.update();
    individuals.forEach(j => {
      if (i.id != j.id && i.overlaps(j)) {
        i.expose();
        i.collide(j);
      }
    })
    i.display();
  })
}

// Initialize individuals using simulation params
function spawnIndividuals(){
  for(let i = 0; i < popSize; i++) {
    let ind = new Individual({
      id:i+1,
      x:random(individualRadius, width - individualRadius),
      y:random(individualRadius, height - individualRadius),
      s: individualSpeed,
      r: individualRadius,
      infected: i < infectedPop,
    });
    var overlaps = false
    for(let j = 0; j < individuals.length; j++) {
      if(individuals[j].overlaps(ind)) {
        overlaps = true;
        break;
      }
    }
    if(!overlaps){
      individuals.push(ind)
    }
  }
}
