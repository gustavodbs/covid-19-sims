"use strict";

// Graphic settings
let statusColors = {
  'healthy': [45, 123, 182],
  'infected': [237, 34, 93],
  'recovered': [187, 170, 204],
  'death': [51, 51, 51],
}

class Individual {
  constructor({id, x, y, r, infected}) {
    this.id = id;
    this.pos = createVector(x, y)
    this.vel = p5.Vector.random2D()
    this.vel.mult(2)
    this.r = r;
    this.status = infected ? 'infected' : 'healthy';
  }

  update() {
    this.pos.add(this.vel)
  }

  collide(i) {
    var dV = p5.Vector.sub(this.pos, i.pos);
    var d = dV.mag();
    if (d < this.r*2) {
      var cor = (this.r*2)-d/2;
    }
  }

  display() {
    noStroke();
    fill(statusColors[this.status])
    ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2)

    // Check boundaries
    if(this.pos.x > width-this.r) {
      this.pos.x = width-this.r;
      this.vel.x *= -1;
    } else if (this.pos.x < this.r) {
      this.pos.x = this.r;
      this.vel.x *= -1;
    } else if (this.pos.y > height-this.r) {
      this.pos.y = height-this.r;
      this.vel.y *= -1;
    } else if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y *= -1;
    }
  }
}