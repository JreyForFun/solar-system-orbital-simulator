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
let savedSpeed = speedMult;
let isPaused = false;
let realSpeedMode = false;

const pauseBtn

// The Planets
class Planet {
    constructor(data) {
        this.name = data.name;
        this.orbitFraction = data.orbitFraction;
        this.size = data.size;
        this.color = data.color;
        this.period = data.period;
        this.facts = data.facts;
        this.hasRings = data.hasRings || false;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = (Math.PI * 2) / (data.period * 600);
        this.x = 0;
        this.y = 0;
    }

    update(cx, cy, scale, mult) {
        const m = Number.isFinite(mult) ? mult : 1;
        this.angle += this.speed * m;
        if (!Number.isFinite(this.angle)) this.angle = Math.random() * Math.PI * 2;
        this.x = cx + Math.cos(this.angle) * this.orbitFraction * scale;
        this.y = cy + Math.sin(this.angle) * this.orbitFraction * scale;
    }

    drawOrbit(cx, cy, scale) {
        ctx.beginPath()
        ctx.arc(cx, cy, this.orbitFraction * scale, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
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
       if(this.hasRings) this.drawRings()

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
}

    isClicked(mx, my) {
        const dx = mx - this.x;
        const dy = my - this.y;
        return Math.sqrt(dx * dx + dy * dy) <= this.size + 8;
    };
}


// PLANET INSTANCES
const planets = [
    new Planet({
        name: 'Mercury', orbitFraction: 0.20, size: 4, color: '#b5b5b5', period: 0.241,
        facts: { 'Distance from Sun': '57.9M km', 'Orbital period': '88 days', 'Moons': '0', 'Surface temp': '−180 to 430°C', 'Diameter': '4,879 km' },
    }),
    new Planet({
        name: 'Venus', orbitFraction: 0.30, size: 7, color: '#e8cda0', period: 0.615,
        facts: { 'Distance from Sun': '108.2M km', 'Orbital period': '225 days', 'Moons': '0', 'Surface temp': '465°C', 'Diameter': '12,104 km' },
    }),
    new Planet({
        name: 'Earth', orbitFraction: 0.40, size: 8, color: '#4fc3f7', period: 1.0,
        facts: { 'Distance from Sun': '149.6M km', 'Orbital period': '365 days', 'Moons': '1', 'Surface temp': '−88 to 58°C', 'Diameter': '12,742 km' },
    }),
    new Planet({
        name: 'Mars', orbitFraction: 0.51, size: 5, color: '#ef5350', period: 1.881,
        facts: { 'Distance from Sun': '227.9M km', 'Orbital period': '687 days', 'Moons': '2', 'Surface temp': '−87 to −5°C', 'Diameter': '6,779 km' },
    }),
    new Planet({
        name: 'Jupiter', orbitFraction: 0.64, size: 18, color: '#c8a882', period: 11.86,
        facts: { 'Distance from Sun': '778.5M km', 'Orbital period': '11.9 yrs', 'Moons': '95', 'Surface temp': '−108°C', 'Diameter': '139,820 km' },
    }),
    new Planet({
        name: 'Saturn', orbitFraction: 0.75, size: 14, color: '#e4d5a0', period: 29.46, hasRings: true,
        facts: { 'Distance from Sun': '1.43B km', 'Orbital period': '29.5 yrs', 'Moons': '146', 'Surface temp': '−139°C', 'Diameter': '116,460 km' },
    }),
    new Planet({
        name: 'Uranus', orbitFraction: 0.87, size: 11, color: '#80deea', period: 84.01,
        facts: { 'Distance from Sun': '2.87B km', 'Orbital period': '84 yrs', 'Moons': '28', 'Surface temp': '−195°C', 'Diameter': '50,724 km' },
    }),
    new Planet({
        name: 'Neptune', orbitFraction: 1.00, size: 10, color: '#5c6bc0', period: 164.8,
        facts: { 'Distance from Sun': '4.5B km', 'Orbital period': '165 yrs', 'Moons': '16', 'Surface temp': '−201°C', 'Diameter': '49,244 km' },
    }),
];

// Moon attached to Earth
const earth = planets.find(p => p.name === 'Earth');
if (earth) {
  earth.moon = {
    angle: Math.random() * Math.PI * 2,
    speed: 0.10,            // tweak orbital speed
    distanceFraction: 0.06, // fraction of scale for moon distance
    size: 3,
    color: '#ddd'
  };
}

// Great Red Spot on Jupiter
if (this.name === 'Jupiter') {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.fillStyle = 'rgba(120, 30, 30, 0.9)';
  ctx.beginPath();
  ctx.ellipse(this.size * 0.35, -this.size * 0.15, this.size * 0.7, this.size * 0.45, 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// BACKGROUND
function drawBackground() {
    ctx.fillStyle = '#05080f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

// Sun Canvas

function drawSun(cx, cy) {
    const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 90)
    grad.addColorStop(0, 'rgba(255, 210, 80, 0.25)')
    grad.addColorStop(1, 'rgba(255,140,0,0)')
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx,cy,90,0,Math.PI * 2)
    ctx.fill();

    ctx.shadowBlur = 45;
    ctx.shadowColor = '#ffaa00';
    ctx.beginPath();
    ctx.arc (cx,cy,24,0,Math.PI * 2);
    ctx.fillStyle = '#ffd060';
    ctx.fill();
    ctx.shadowBlur = 0;
}

// Asteroid Belt
function drawAsteroidBelt(cx, cy, scale) {
  const inner = 0.56 * scale; // just outside Mars
  const outer = 0.62 * scale; // just inside Jupiter
  ctx.fillStyle = 'rgba(200, 200, 200, 0.6)';
  for (let i = 0; i < 300; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = inner + Math.random() * (outer - inner);
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    ctx.fillRect(x, y, 1, 1);
  }
}


// RIGHT SIDE PANEL - INFO PLANET
function showInfo(planet) {
    planetName.innerText = planet.name;
    planetFacts.innerHTML = Object.entries(planet.facts)
        .map(([key,val]) => `
        <div class="fact-row">
            <span class="fact-label">${key}</span>
            <span class="fact-value">${val}</span>
        </div>
        `)
        .join('')
        infoPanel.classList.remove('hidden')
        selectedPlanet = planet
}

function hideInfo() {
    infoPanel.classList.add('hidden');
    selectedPlanet = null;
}


// Canvas events
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let hit = false 
    planets.forEach(planet => {
        if(planet.isClicked(mx, my)) {
            selectedPlanet = planet
            showInfo(planet);
            hit = true;
        }
    })
    if(!hit) hideInfo();
})

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const hovering = planets.some(p => p.isClicked(mx, my));
    canvas.style.cursor = hovering ? 'pointer' : 'default';
})

closeBtn.addEventListener('click', hideInfo);
speedSlider.addEventListener('input', (e) =>{
   const v = parseFloat(e.target.value);
    speedMult = Number.isFinite(v) ? v : 1;
    speedReadout.innerText = `${speedMult.toFixed(1)}×`;
})

// Resize handler

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });

// Render
function render() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) * 0.44;

    drawBackground();
    drawSun(cx, cy);

    planets.forEach(p => p.drawOrbit(cx, cy, scale))
    drawAsteroidBelt(cx, cy, scale);
    planets.forEach(p => {
        p.update(cx,cy,scale,speedMult);
        p.draw(p === selectedPlanet);
        if (p === earth && p.moon) {
        const m = p.moon;
        m.angle += m.speed * speedMult;
        const md = m.distanceFraction * scale;
        // optional faint moon orbit
        ctx.beginPath();
        ctx.arc(p.x, p.y, md, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 1;
        ctx.stroke();

        const mx = p.x + Math.cos(m.angle) * md;
        const my = p.y + Math.sin(m.angle) * md;

        ctx.beginPath();
        ctx.fillStyle = m.color;
        ctx.arc(mx, my, m.size, 0, Math.PI * 2);
        ctx.fill();
        }
    })

    requestAnimationFrame(render)
}


render()