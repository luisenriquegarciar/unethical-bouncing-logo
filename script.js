const FPS_INTERVAL = 1000 / 144;
const SPEED = 1.25;

const logoContainer = document.getElementById("logo-container");
const logoImg = document.getElementById("logo");

let animationId;

let paused = false;
let lastUpdate = performance.now();

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let logoWidth = 0;
let logoHeight = 0;

let directionX = Math.random() < 0.5 ? "east" : "west";
let directionY = Math.random() < 0.5 ? "south" : "north";
let currentX = 0;
let currentY = 0;

let currentHueRotate = 0;

function animate() {
    animationId = requestAnimationFrame(animate);

    const now = performance.now();
    const elapsed = now - lastUpdate;

    if (elapsed <= FPS_INTERVAL) {
        return;
    }

    const [maxX, maxY] = getMaxXY();

    if (currentX >= maxX || currentX <= 0) {
        directionX = currentX <= 0 ? "east" : "west";
        setRandomLogoColor();
    }
    if (currentY >= maxY || currentY <= 0) {
        directionY = currentY <= 0 ? "south" : "north";
        setRandomLogoColor();
    }

    currentX += directionX === "east" ? SPEED : -SPEED;
    currentY += directionY === "south" ? SPEED : -SPEED;
    setLogoPosition(currentX, currentY);

    // Get ready for next frame by setting lastUpdate=now, but also adjust for
    // FPS_INTERVAL not being a multiple of RAF's interval (16.7ms)
    lastUpdate = now - (elapsed % FPS_INTERVAL);
}

function setLogoPosition(x, y) {
    logoImg.animate(
        {
            transform: `translate(${x}px, ${y}px)`
        },
        {
            duration: 0,
            fill: "forwards",
            easing: "ease"
        }
    );
}

function setRandomLogoColor() {
    let newHueRotate = Math.random() * 360;

    // Ensure that new color is different enough from the last one
    const hueOffset = Math.abs(currentHueRotate - newHueRotate);
    if (hueOffset < 90) {
        newHueRotate = currentHueRotate + 180;
    }

    logoContainer.style.filter = `invert(42%) sepia(93%) saturate(1352%) hue-rotate(${newHueRotate}deg) brightness(119%) contrast(119%)`;
    currentHueRotate = newHueRotate;
}

function getMaxXY() {
    return [windowWidth - logoWidth, windowHeight - logoHeight];
}

function updateDimensions() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    logoWidth = logoImg.clientWidth;
    logoHeight = logoImg.clientHeight;
}

// Event listeners

window.addEventListener("click", () => {
    paused = !paused;

    if (paused) {
        cancelAnimationFrame(animationId);
    } else {
        animationId = requestAnimationFrame(animate);
    }
});

window.addEventListener("resize", updateDimensions);

logoImg.addEventListener("load", () => {
    updateDimensions();

    const [maxX, maxY] = getMaxXY();
    currentX = Math.random() * maxX;
    currentY = Math.random() * maxY;

    setLogoPosition(currentX, currentY);
    setRandomLogoColor();
});
logoImg.addEventListener("error", () => alert("Error loading image"));

// Start animation
if (!paused) {
    animationId = requestAnimationFrame(animate);
}
