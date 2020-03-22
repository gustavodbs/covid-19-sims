// Graphic settings

HEALTHY_COLOR = [45, 123, 182];
INFECTED_COLOR = [237, 34, 93];
RECOVERED_COLOR = [187, 170, 204];
DEATH_COLOR = [51, 51, 51];

class Individual {
  constructor({id, x, y, r, vx, vy, infected}) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
    this.vx = vx;
    this.vy = vy;

    this.infected = infected
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > width) {
      this.x = this.x < 0 ? this.r : width - this.r;
      this.vx *= -1;
    } else if (this.y < 0 || this.y > height) {
      this.y = this.y < 0 ? this.r : height - this.r;
      this.vy *= -1;
    }
    this.color = this.infected ? INFECTED_COLOR : HEALTHY_COLOR;
  }

  collide() {
    individuals.forEach(ind => {
      let dx = this.x - ind.x;
      let dy = this.y - ind.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < this.r*2 && this.id != ind.id) {
        ind.infected = ind.infected || Math.random() < contP && this.infected
        this.vx *= -1;
        ind.vx *= -1;
      }
    })
  }

  display() {
    push();
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.r*2, this.r*2)
  }
}