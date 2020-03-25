"use strict";

// Simulation parameters
let popSize = 500;
let infectedPop = 1;
let infectionProb = 0.3;
let hospitalizationProb = 0.2;
let infectedDeathRate = 0.02;
let hospDeathRate = .6;
let recoveryTime = 20; // In days
let hospRecoveryTime = 30; // In days
let frameDayProportion = 0.05 // 20 frames makes a second

// Graphic parameters
let width = 1200;
let height = 800;
let individualRadius = 5;
let individualSpeed = 1.6;

// Execution data
let individuals = [];
let dayCount = 0.0;
let healthyCount = 0;
let infectedCount = 0;
let hospitalizedCount = 0;
let deathCount = 0;
let recoveredCount = 0;

// Setup simulation (runs once)
function setup() {
  let canvas = createCanvas(width, height);
  canvas.parent("simulationContainer");
  spawnIndividuals();
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


// Renders the next simulation state
function draw() {
  dayCount += frameDayProportion;
  healthyCount = 0;
  infectedCount = 0;
  hospitalizedCount = 0;
  deathCount = 0;
  recoveredCount = 0;

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
    switch(i.status) {
    case 'healthy':
      healthyCount += 1;
    case 'infected':
      infectedCount += 1;
    case 'hospitalized':
      hospitalizedCount += 1;
    case 'death':
      deathCount += 1;
    case 'recovered':
      recoveredCount += 1;
    }
  })

  document.getElementById("popSize").innerHTML = popSize;
  document.getElementById("healthyCount").innerHTML = healthyCount;
  document.getElementById("infectedCount").innerHTML = infectedCount;
  document.getElementById("hospitalizedCount").innerHTML = hospitalizedCount;
}
