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
    this.m = 1;
    this.status = infected ? 'infected' : 'healthy';
  }

  update() {
    this.pos.add(this.vel)
  }

  collide(i) {
    var dV = p5.Vector.sub(this.pos, i.pos);
    var dM = dV.mag();
    if (dM < this.r*2) {
      var d = dV.copy();
      var corV = d.normalize().mult(((this.r*2)-dM)/2.0);
      i.pos.add(corV);
      this.pos.sub(corV);

      // Angles
      var theta  = dV.heading();
      var sine = sin(theta);
      var cosine = cos(theta);

      /* bTemp will hold rotated ball poss. You 
       just need to worry about bTemp[1] pos*/
      var bTemp = [createVector(), createVector()];
      bTemp[1].x  = cosine * dV.x + sine * dV.y;
      bTemp[1].y  = cosine * dV.y - sine * dV.x;

      // rotate Temporary velocities
      var vTemp = [createVector(), createVector()];

      vTemp[0].x  = cosine * this.vel.x + sine * this.vel.y;
      vTemp[0].y  = cosine * this.vel.y - sine * this.vel.x;
      vTemp[1].x  = cosine * i.vel.x + sine * i.vel.y;
      vTemp[1].y  = cosine * i.vel.y - sine * i.vel.x;

      /* Now that velocities are rotated, you can use 1D
       conservation of momentum equations to calculate 
       the final velocity along the x-axis. */
      var vFinal = [createVector(), createVector()];

      // final rotated velocity for b[0]
      vFinal[0].x = ((this.m - i.m) * vTemp[0].x + 2 * i.m * vTemp[1].x) / (this.m + i.m);
      vFinal[0].y = vTemp[0].y;

      // final rotated velocity for b[0]
      vFinal[1].x = ((i.m - this.m) * vTemp[1].x + 2 * this.m * vTemp[0].x) / (this.m + i.m);
      vFinal[1].y = vTemp[1].y;

      // hack to avoid clumping
      bTemp[0].x += vFinal[0].x;
      bTemp[1].x += vFinal[1].x;

      /* Rotate ball poss and velocities back
       Reverse signs in trig expressions to rotate 
       in the opposite direction */
      // rotate balls
      var bFinal = [createVector(), createVector()];

      bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
      bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
      bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
      bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

      // update balls to screen pos
      i.pos.x = this.pos.x + bFinal[1].x;
      i.pos.y = this.pos.y + bFinal[1].y;

      this.pos.add(bFinal[0]);

      // update velocities
      this.vel.x = cosine * vFinal[0].x - sine * vFinal[0].y;
      this.vel.y = cosine * vFinal[0].y + sine * vFinal[0].x;
      i.vel.x = cosine * vFinal[1].x - sine * vFinal[1].y;
      i.vel.y = cosine * vFinal[1].y + sine * vFinal[1].x;
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