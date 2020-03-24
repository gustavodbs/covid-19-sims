"use strict";

// Simulation parameters
let popSize = 100;
let infectedPop = 2;
let contP = .6;

// Graphic parameters
let width = 1250;
let height = 300;
let indRadius = 5;

// Execution data
let individuals = [];


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
      infected: i < infectedPop,
    });
    individuals.push(ind)
  }
}

function draw() {
  background(255);
  individuals.forEach(i => {
    i.update();
    individuals.forEach(j => {
      if (i.id !== j.id) {
        i.collide(j)
      }
    })
    i.display();
  })
}