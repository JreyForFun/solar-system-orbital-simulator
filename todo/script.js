// Canvas Setup
const canvas = document.getElementById('solar-canvas');
const ctx = canvas.getContext('2d');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

// UI Elements
const infoPanel = document.getElementById('info-panel');
const closeBtn = document.getElementById('close-btn');
const planetName = document.getElementById('planet-name');
const planetFacts = document.getElementById('planet-facts');
const speedSlider = document.getElementById('speed-slider');
const speedReadout = document.getElementById('speed-readout');

// State Variables
let selectedPlanet = null;
let speedMult = 1;



// -------------------------------------------------------------
// TODO 4 — The Planet class
//
// WHAT:  A class is a blueprint for creating objects.
//        Every planet is an instance of this class — same
//        structure, different data.
//
// NEW CONCEPT — class syntax:
//   class Planet {
//       constructor(data) {
//           // 'this' refers to the instance being created
//           this.name = data.name;
//           ...
//       }
//
//       methodName() {
//           // instance methods — called with planet.methodName()
//       }
//   }
//
// NEW CONCEPT — this:
//   Inside a class, 'this' refers to the specific instance.
//   If you do: const earth = new Planet({...})
//   then inside Planet's methods, 'this' = earth.
//   this.name = 'Earth' sets the name on that specific planet.
//
// WRITE THIS CLASS with the following:
//
// constructor(data):
//   this.name          = data.name
//   this.orbitFraction = data.orbitFraction  // 0–1 fraction of max orbit
//   this.size          = data.size            // visual radius in px
//   this.color         = data.color
//   this.period        = data.period          // orbital period (Earth = 1)
//   this.facts         = data.facts
//   this.hasRings      = data.hasRings || false   // || false = default if missing
//   this.angle         = Math.random() * Math.PI * 2  // random start position
//   this.speed         = (Math.PI * 2) / (data.period * 600)  // radians per frame
//   this.x             = 0    // updated each frame in update()
//   this.y             = 0
//
// update(cx, cy, scale, mult):
//   WHAT: Advance the angle, recalculate x and y.
//
//   NEW CONCEPT — circular motion with sin/cos:
//     A point on a circle of radius r at angle θ is:
//       x = centerX + r * Math.cos(θ)
//       y = centerY + r * Math.sin(θ)
//     Every frame we increase θ by this.speed — the planet orbits.
//
//   this.angle += this.speed * mult
//   this.x = cx + Math.cos(this.angle) * this.orbitFraction * scale
//   this.y = cy + Math.sin(this.angle) * this.orbitFraction * scale
//
// drawOrbit(cx, cy, scale):
//   Draw a faint circle at the orbit radius.
//   ctx.beginPath()
//   ctx.arc(cx, cy, this.orbitFraction * scale, 0, Math.PI * 2)
//   ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)'
//   ctx.lineWidth   = 1
//   ctx.stroke()
//
// drawRings():
//   NEW CONCEPT — ctx.translate():
//     Shifts the canvas coordinate origin to a new point.
//     After ctx.translate(this.x, this.y), drawing at (0, 0)
//     actually draws at the planet's position.
//     Always pair with ctx.save() before and ctx.restore() after.
//
//   ctx.save()
//   ctx.translate(this.x, this.y)     ← origin is now the planet center
//   ctx.beginPath()
//   ctx.ellipse(0, 0, this.size * 2.6, this.size * 0.65, 0.4, 0, Math.PI * 2)
//   ctx.strokeStyle = 'rgba(228, 210, 150, 0.55)'
//   ctx.lineWidth   = 5
//   ctx.stroke()
//   ctx.restore()
//
// draw(isSelected):
//   if (this.hasRings) this.drawRings()
//
//   ctx.shadowBlur  = isSelected ? 35 : 14
//   ctx.shadowColor = this.color
//   ctx.beginPath()
//   ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
//   ctx.fillStyle = this.color
//   ctx.fill()
//   ctx.shadowBlur = 0
//
//   // Name label
//   ctx.font      = '10px Georgia'
//   ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'
//   ctx.fillText(this.name, this.x + this.size + 5, this.y + 4)
//
//   // Selection ring (only if selected)
//   if (isSelected) {
//       ctx.beginPath()
//       ctx.arc(this.x, this.y, this.size + 6, 0, Math.PI * 2)
//       ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)'
//       ctx.lineWidth   = 1
//       ctx.stroke()
//   }
//
// isClicked(mx, my):
//   Same distance formula as the previous projects.
//   Return true if distance from (mx, my) to (this.x, this.y) <= this.size + 8
// -------------------------------------------------------------

class Planet {
    constructor(data) {
        this.name = data.name;
        this.orbitFraction = data.orbitFraction;
        this.size = data.size;
        this.color = data.color;
        this.period = data.period;
        this.facts = data.facts;
        this.hashings = data.hashings || false;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = (Math.PI * 2) / (data.period * 600);
        this.x = 0;
        this.y = 0;
    }

    update(cx, cy, scale, mult) {
        this.angle += this.speed * mult;
        this.x = cx + Math.cos(this.angle) * this.orbitFraction * scale;
        this.y = cy + Math.sin(this.angle) * this.orbitFraction * scale;
    }

    drawOrbit(cx, cy, scale) {
        ctx.beginPath()
        ctx.arc(cx, cy, this.orbitation * scale, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    drawRings() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 2.6, this.size * 0.65, 0.4, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(228, 210, 150, 0.55)';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.restore();
    }

    draw(isSelected) {
       if(this.hasRigns) this.drawRings()

        ctx.shadowBlur = isSelected ? 35 : 14;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.font= '10px Georgia';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fillText(this.name, this.x + this.size + 5, this.y + 4);

        if(isSelected) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size + 6, 0, Math.PI * 2);
        ctx.strokeStyle = ' rgba(255,255,255, 0.45)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    isClicked(mx, my) {
        this.x = mx;
        this.my = my;

        if(this.x <= this.size + 8 && this.y <= this.size + 8){
            return true;
        }
    }
}


// -------------------------------------------------------------
// TODO 5 — Create the planet instances
//
// WHAT:  Use 'new Planet({...})' to create one instance per planet.
//        Store all of them in a const array called planets.
//
// HOW:
//   const planets = [
//       new Planet({
//           name: 'Mercury', orbitFraction: 0.20, size: 4, color: '#b5b5b5',
//           period: 0.241,
//           facts: {
//               'Distance from Sun': '57.9M km',
//               'Orbital period':    '88 days',
//               'Moons':             '0',
//               'Surface temp':      '−180 to 430°C',
//               'Diameter':          '4,879 km',
//           },
//       }),
//       ... (one for each of the 8 planets)
//   ]
//
// PLANET DATA (copy these values exactly):
//   Mercury:  orbitFraction:0.20, size:4,  color:'#b5b5b5', period:0.241
//   Venus:    orbitFraction:0.30, size:7,  color:'#e8cda0', period:0.615
//   Earth:    orbitFraction:0.40, size:8,  color:'#4fc3f7', period:1.0
//   Mars:     orbitFraction:0.51, size:5,  color:'#ef5350', period:1.881
//   Jupiter:  orbitFraction:0.64, size:18, color:'#c8a882', period:11.86
//   Saturn:   orbitFraction:0.75, size:14, color:'#e4d5a0', period:29.46, hasRings:true
//   Uranus:   orbitFraction:0.87, size:11, color:'#80deea', period:84.01
//   Neptune:  orbitFraction:1.00, size:10, color:'#5c6bc0', period:164.8
//
// FACTS for each (feel free to look these up and add your own):
//   Mercury: distance '57.9M km', period '88 days',   moons '0',   temp '−180 to 430°C', diameter '4,879 km'
//   Venus:   distance '108.2M km',period '225 days',  moons '0',   temp '465°C',          diameter '12,104 km'
//   Earth:   distance '149.6M km',period '365 days',  moons '1',   temp '−88 to 58°C',    diameter '12,742 km'
//   Mars:    distance '227.9M km',period '687 days',  moons '2',   temp '−87 to −5°C',    diameter '6,779 km'
//   Jupiter: distance '778.5M km',period '11.9 yrs',  moons '95',  temp '−108°C',          diameter '139,820 km'
//   Saturn:  distance '1.43B km', period '29.5 yrs',  moons '146', temp '−139°C',          diameter '116,460 km'
//   Uranus:  distance '2.87B km', period '84 yrs',    moons '28',  temp '−195°C',          diameter '50,724 km'
//   Neptune: distance '4.5B km',  period '165 yrs',   moons '16',  temp '−201°C',          diameter '49,244 km'
//
// QUESTION: Why is 'new' required? What happens if you write
//   Planet({...}) without new?
// -------------------------------------------------------------

// your code here


// -------------------------------------------------------------
// TODO 6 — drawBackground()
// Fill the whole canvas with #05080f (near-black deep space).
// -------------------------------------------------------------

function drawBackground() {
    // your code here
}


// -------------------------------------------------------------
// TODO 7 — drawSun(cx, cy)
//
// WHAT:  Draw the sun at the canvas center with a radial glow.
//
// HOW:
//   // Outer glow
//   const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 90)
//   grad.addColorStop(0, 'rgba(255, 210, 80, 0.25)')
//   grad.addColorStop(1, 'rgba(255, 140, 0, 0)')
//   ctx.fillStyle = grad
//   ctx.beginPath()
//   ctx.arc(cx, cy, 90, 0, Math.PI * 2)
//   ctx.fill()
//
//   // Sun body
//   ctx.shadowBlur  = 45
//   ctx.shadowColor = '#ffaa00'
//   ctx.beginPath()
//   ctx.arc(cx, cy, 24, 0, Math.PI * 2)
//   ctx.fillStyle = '#ffd060'
//   ctx.fill()
//   ctx.shadowBlur = 0
// -------------------------------------------------------------

function drawSun(cx, cy) {
    // your code here
}


// -------------------------------------------------------------
// TODO 8 — showInfo(planet) and hideInfo()
//
// showInfo WHAT:
//   1. Set planetName.innerText to planet.name
//   2. Build fact rows HTML and set planetFacts.innerHTML
//   3. Remove 'hidden' from infoPanel
//
// NEW CONCEPT — Object.entries():
//   Object.entries(obj) returns an array of [key, value] pairs.
//   Example: Object.entries({ a: 1, b: 2 }) → [['a', 1], ['b', 2]]
//   Combined with .map() and .join('') you can build HTML from data.
//
// HOW for step 2:
//   planetFacts.innerHTML = Object.entries(planet.facts)
//       .map(([key, val]) => `
//           <div class="fact-row">
//               <span class="fact-label">${key}</span>
//               <span class="fact-value">${val}</span>
//           </div>
//       `)
//       .join('')
//
// The ([key, val]) in the arrow function is DESTRUCTURING —
//   it unpacks the [key, value] pair into two named variables.
//   [key, val] = ['Distance from Sun', '57.9M km']
//   → key = 'Distance from Sun', val = '57.9M km'
//
// hideInfo WHAT:
//   Add 'hidden' to infoPanel, set selectedPlanet = null
// -------------------------------------------------------------

function showInfo(planet) {
    // your code here
}

function hideInfo() {
    // your code here
}


// -------------------------------------------------------------
// TODO 9 — Canvas click event
//
// WHAT:  When the canvas is clicked, check if any planet was hit.
//        If yes: select it and call showInfo().
//        If no: call hideInfo().
//
// NEW CONCEPT — getBoundingClientRect():
//   e.clientX/Y gives coordinates relative to the browser window.
//   If the canvas is at position (0,0) this works fine.
//   But getBoundingClientRect() is the safe, correct way —
//   it gives the canvas's actual position on the page, and you
//   subtract it to get coordinates relative to the canvas itself.
//
// HOW:
//   canvas.addEventListener('click', (e) => {
//       const rect = canvas.getBoundingClientRect()
//       const mx   = e.clientX - rect.left
//       const my   = e.clientY - rect.top
//
//       let hit = false
//       planets.forEach(planet => {
//           if (planet.isClicked(mx, my)) {
//               selectedPlanet = planet
//               showInfo(planet)
//               hit = true
//           }
//       })
//       if (!hit) hideInfo()
//   })
// -------------------------------------------------------------

// your code here


// -------------------------------------------------------------
// TODO 10 — Canvas mousemove event (cursor change)
//
// WHAT:  Change canvas cursor to 'pointer' when hovering a planet.
//
// NEW CONCEPT — Array.some():
//   array.some(fn) returns true if AT LEAST ONE element satisfies fn.
//   Stops checking as soon as it finds the first match (more efficient
//   than forEach which always loops through everything).
//
// HOW:
//   canvas.addEventListener('mousemove', (e) => {
//       const rect     = canvas.getBoundingClientRect()
//       const mx       = e.clientX - rect.left
//       const my       = e.clientY - rect.top
//       const hovering = planets.some(p => p.isClicked(mx, my))
//       canvas.style.cursor = hovering ? 'pointer' : 'default'
//   })
// -------------------------------------------------------------

// your code here


// -------------------------------------------------------------
// TODO 11 — Close button and speed slider event listeners
//
// closeBtn click → call hideInfo()
//
// speedSlider input:
//   The 'input' event fires every time the slider moves (not just on release).
//   e.target.value is always a STRING — use parseFloat() to convert it.
//   parseFloat('3.5') → 3.5
//
//   speedSlider.addEventListener('input', (e) => {
//       speedMult              = parseFloat(e.target.value)
//       speedReadout.innerText = `${speedMult.toFixed(1)}×`
//   })
// -------------------------------------------------------------

// your code here


// -------------------------------------------------------------
// TODO 12 — Resize handler
// Same as previous projects: update canvas.width and canvas.height.
// -------------------------------------------------------------

// your code here


// -------------------------------------------------------------
// TODO 13 — The render loop
//
// WHAT:  Calculate center and scale, then draw everything in order.
//
// WHY scale = Math.min(canvas.width, canvas.height) * 0.44:
//   Neptune's orbitFraction is 1.0, so its orbit radius = scale.
//   Using the SMALLER of width/height ensures it fits on all screens.
//   0.44 gives a small margin around the outermost orbit.
//
// HOW:
//   function render() {
//       const cx    = canvas.width / 2
//       const cy    = canvas.height / 2
//       const scale = Math.min(canvas.width, canvas.height) * 0.44
//
//       drawBackground()
//       drawSun(cx, cy)
//
//       planets.forEach(p => p.drawOrbit(cx, cy, scale))
//       planets.forEach(p => {
//           p.update(cx, cy, scale, speedMult)
//           p.draw(p === selectedPlanet)
//       })
//
//       requestAnimationFrame(render)
//   }
//
// WHY two forEach loops:
//   All orbit rings must be drawn BEFORE any planet.
//   If you draw each planet right after its orbit, a later planet's
//   orbit ring would draw on top of earlier planets.
// -------------------------------------------------------------

function render() {
    // your code here
}


// -------------------------------------------------------------
// TODO 14 — Start
// Call render() once — it loops itself with requestAnimationFrame.
// No fetch(), no loadData() — everything is self-contained.
// -------------------------------------------------------------

// your code here
