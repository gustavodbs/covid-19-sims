"use strict";

// Simulation parameters
let popSize = 200;
let infectedPop = 1;

// Graphic parameters
let width = 1200;
let height = 300;
let individualRadius = 5;
let individualSpeed = 2;

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
    individuals.forEach(j => {
      if (i.id != j.id) {
        i.collide(j);
      }
    })
    i.update();
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
