let canvas, ctx;
let v0, angle, g, t;
let x, y;
let vx, vy;
let scale = 10;
let floorHeight = 20;
let backgroundImg = new Image();
backgroundImg.src = "fondo1.jpg";

let width = 1300;
let height = 600;
let proyectilRadio = 6;
let reboteRegistrado = false;
let rebotes = 0;
let animationId = null;

function setupCanvas() {
    canvas = document.getElementById("canvas");
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");

    drawBackground();
}

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height - floorHeight, canvas.width, floorHeight);
}

function iniciarSimulacion() {
    // Detener simulaciones previas
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    v0 = parseFloat(document.getElementById("velocidad").value);
    angle = parseFloat(document.getElementById("angulo").value);

    if (isNaN(v0) || isNaN(angle) || angle < 0 || angle > 90 || v0 <= 0) {
        alert("Ingrese valores válidos: velocidad > 0 y ángulo entre 0° y 90°");
        return;
    }

    document.getElementById("info").innerHTML = "";
    document.getElementById("estado").innerHTML = "";

    reboteRegistrado = false;
    rebotes = 0;
    g = 9.81;
    let radians = angle * Math.PI / 180;
    vx = v0 * Math.cos(radians) * scale;
    vy = v0 * Math.sin(radians) * scale;

    x = proyectilRadio;
    y = proyectilRadio;
    t = 0;

    animationId = requestAnimationFrame(simular);
}

function simular() {
    drawBackground();

    x += vx * 0.016;
    vy += g * scale * 0.016;
    y += vy * 0.016;

    // Detectar rebote
    if (y + proyectilRadio >= canvas.height - floorHeight) {
        rebotes++;

        if (rebotes === 1) {
            vy = -vy;
            y = canvas.height - floorHeight - proyectilRadio;

            if (!reboteRegistrado) {
                let vx_final = vx / scale;
                let vy_final = vy / scale;
                let v_total = Math.sqrt(vx_final ** 2 + vy_final ** 2);
                let angle_rebote = Math.atan2(vy_final, vx_final) * (180 / Math.PI);

                document.getElementById("info").innerHTML = `
                    <strong>Después del primer rebote:</strong><br>
                    Vx = ${vx_final.toFixed(2)} m/s<br>
                    Vy = ${vy_final.toFixed(2)} m/s<br>
                    V = ${v_total.toFixed(2)} m/s<br>
                    θ = ${angle_rebote.toFixed(2)}°
                `;
                reboteRegistrado = true;
            }

        } else if (rebotes === 2) {
            // Detener simulación
            cancelAnimationFrame(animationId);
            animationId = null;
            return;
        }
    }

    // Dibujar proyectil
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, proyectilRadio, 0, Math.PI * 2);
    ctx.fill();

    // Mostrar info en tiempo real
    t += 0.016;
    document.getElementById("estado").innerHTML = `
        <strong>Tiempo:</strong> ${t.toFixed(2)} s<br>
        <strong>Posición X:</strong> ${(x / scale).toFixed(2)} m<br>
        <strong>Posición Y:</strong> ${(y / scale).toFixed(2)} m<br>
        <strong>Velocidad X:</strong> ${(vx / scale).toFixed(2)} m/s<br>
        <strong>Velocidad Y:</strong> ${(vy / scale).toFixed(2)} m/s
    `;

    animationId = requestAnimationFrame(simular);
}

window.onload = setupCanvas;
