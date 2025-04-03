let canvas, ctx;
let v0, angle, g, t;
let x, y;
let vx, vy;
let scale = 10;
let floorHeight = 20;
let backgroundImg = new Image();
backgroundImg.src = "fondo1.jpg"; // Asegúrate que esté en el mismo directorio

let width = 1300;
let height = 600;

let proyectilRadio = 6; // 🔽 Tamaño de la bola reducido

function setupCanvas() {
    canvas = document.getElementById("canvas");
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");

    drawBackground(); // Mostrar la imagen inicial
}

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    // Suelo
    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height - floorHeight, canvas.width, floorHeight);
}

function iniciarSimulacion() {
    v0 = parseFloat(document.getElementById("velocidad").value);
    angle = parseFloat(document.getElementById("angulo").value);

    if (isNaN(v0) || isNaN(angle) || angle < 0 || angle > 90 || v0 <= 0) {
        alert("Ingrese valores válidos: velocidad > 0 y ángulo entre 0° y 90°");
        return;
    }

    // Limpiar la sección de información
    document.getElementById("info").innerHTML = "";

    g = 9.81;
    let radians = angle * Math.PI / 180;
    vx = v0 * Math.cos(radians) * scale;
    vy = v0 * Math.sin(radians) * scale;

    x = proyectilRadio;
    y = proyectilRadio;
    t = 0;

    requestAnimationFrame(simular);
}

function simular() {
    drawBackground();

    x += vx * 0.016;
    vy += g * scale * 0.016;
    y += vy * 0.016;

    // Detectar y manejar rebote con el suelo
    if (y + proyectilRadio >= canvas.height - floorHeight) {
        vy = -vy;
        y = canvas.height - floorHeight - proyectilRadio;

        // 📌 Cálculos de los componentes del rebote
        let vx_final = vx / scale;
        let vy_final = vy / scale;
        let v_total = Math.sqrt(vx_final ** 2 + vy_final ** 2);
        let angle_rebote = Math.atan2(vy_final, vx_final) * (180 / Math.PI);

        // 📌 Mostrar datos en pantalla
        document.getElementById("info").innerHTML = `
            <strong>Después del rebote:</strong><br>
            Vx = ${vx_final.toFixed(2)} m/s<br>
            Vy = ${vy_final.toFixed(2)} m/s<br>
            V = ${v_total.toFixed(2)} m/s<br>
            θ = ${angle_rebote.toFixed(2)}°
        `;
    }

    // Dibujar proyectil
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, proyectilRadio, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(simular);
}

window.onload = setupCanvas;
