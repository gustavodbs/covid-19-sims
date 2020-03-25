"use strict";

// Graphic settings
let statusColors = {
  'healthy': [45, 123, 182],
  'infected': [255, 87, 34],
  'hospitalized': [237, 34, 93],
  'recovered': [187, 170, 204],
  'death': [51, 51, 51],
}

function proj(a, b) {
  return b.mult(a.dot(b) / b.dot(b))
}

class Individual {
  constructor({id, x, y, r, s, infected}) {
    this.id = id;
    this.pos = createVector(x, y)
    this.r = r;
    this.speed = s;

    this.vel = p5.Vector.random2D().normalize().mult(this.speed)
    this.status = infected ? 'infected' : 'healthy';
    this.daysInfected = 0;
  }

  update() {
    this.pos.add(this.vel)
    
    switch(this.status) {
    case 'infected':
      this.daysInfected += 0.05
      if(this.daysInfected > recoveryTime) {
        var p = Math.random();
        if (p > hospitalizationProb) {
          this.status = 'recovered';
        } else if (p > infectedDeathRate) {
          this.status = 'hospitalized';
        } else {
          this.status = 'death';
        }
      }
      break;
    case 'hospitalized':
      this.vel = createVector(0, 0);
      this.daysInfected += 0.05
      if(this.daysInfected > hospRecoveryTime) {
        this.status = Math.random() < hospDeathRate ? 'death' : 'recovered'
      }
      break;
    case 'death':
      this.vel = createVector(0, 0);
    }
  }

  expose() {
    if (this.status === 'healthy' && Math.random() < infectionProb) {
      this.status = 'infected'
    }
  }

  overlaps(i) {
    return p5.Vector.sub(this.pos, i.pos).mag() < this.r*2;
  }

  collide(i) {
    var dV = p5.Vector.sub(this.pos, i.pos)
    var d = dV.mag()
    if (d < this.r*2) {
      // Solve static collision first
      var overlap = .5 * (d - (this.r*2))
      if (this.status != "death" && this.status != "hospitalized") {
        this.pos.x -= overlap * dV.x / d;
        this.pos.y -= overlap * dV.y / d;
        i.pos.x += overlap * dV.x / d;
        i.pos.y += overlap * dV.y / d;
      }

      // Follows two-dimensional collision ignoring mass: https://en.wikipedia.org/wiki/Elastic_collision#Two-dimensional_collision_with_two_moving_objects
      var magSqr = dV.magSq()

      var v1 = this.vel.copy()
      var x1 = this.pos.copy()

      var v2 = i.vel.copy()
      var x2 = i.pos.copy()

      var nv1 = p5.Vector.sub(
        v1,
        p5.Vector.mult(
          p5.Vector.sub(x1, x2),
          p5.Vector.dot(
            p5.Vector.sub(v1, v2),
            p5.Vector.sub(x1, x2)
          )/magSqr
        )
      )
      var nv2 = p5.Vector.sub(
        v2,
        p5.Vector.mult(
          p5.Vector.sub(x2, x1),
          p5.Vector.dot(
            p5.Vector.sub(v2, v1),
            p5.Vector.sub(x2, x1)
          )/magSqr
        )
      )
      // Normalization is applied since we only care about direction
      this.vel = nv1.normalize().mult(this.speed);
      i.vel = nv2.normalize().mult(i.speed);
    }
  }

  display() {
    noStroke();
    fill(statusColors[this.status]);
    ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);

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
