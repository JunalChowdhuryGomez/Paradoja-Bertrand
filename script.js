
function actualizarDescripcion(metodo) {
    let descripcion = '';
    let probabilidadTeorica = '';

    switch(metodo) {
        case '1':
            descripcion = 'Este método elige una cuerda perpendicular al diámetro de un círculo. Se selecciona un punto al azar en un diámetro y se dibuja una cuerda perpendicular a ese punto.';
            probabilidadTeorica = '1/2 (0.5000)';
            break;
        case '2':
            descripcion = 'Este método selecciona dos puntos en el borde del círculo al azar y dibuja una cuerda entre ellos. La selección es uniforme en términos de ángulos.';
            probabilidadTeorica = '1/3 (0.3333)';
            break;
        case '3':
            descripcion = 'Este método selecciona un punto aleatorio dentro del círculo y luego dibuja una cuerda perpendicular a la línea que conecta el centro del círculo con ese punto.';
            probabilidadTeorica = '1/4 (0.2500)';
            break;
        default:
            descripcion = 'Selecciona un método para ver su descripción.';
            probabilidadTeorica = '0';
    }

    // Actualizar el contenido HTML de la descripción y probabilidad teórica
    document.getElementById('descripcion-metodo').textContent = descripcion;
    document.getElementById('probabilidad-teorica').textContent = probabilidadTeorica;
}

// Evento para actualizar la descripción cuando se selecciona un método
document.getElementById('method').addEventListener('change', function() {
    const metodoSeleccionado = this.value;
    actualizarDescripcion(metodoSeleccionado);
});

// Actualizar la descripción y probabilidad teórica al cargar la página con el método seleccionado por defecto
window.onload = function() {
    const metodoSeleccionado = document.getElementById('method').value;
    actualizarDescripcion(metodoSeleccionado);
};









const width = 600, height = 600;
const R = 200;  // Radio del círculo
const centerX = width / 2, centerY = height / 2;
const svg = d3.select("#canvas");

let aciertos = 0;
let fallos = 0;
let total = 0;
let velocidad = 1000;  // Velocidad inicial
let intervalo;  // Para manejar el ciclo de simulación

// Dibujar el círculo grande
svg.append("circle")
    .attr("cx", centerX)
    .attr("cy", centerY)
    .attr("r", R)
    .attr("class", "circulo");

// Dibujar el triángulo equilátero inscrito de forma vertical
const theta = [-Math.PI / 2, Math.PI / 6, 5 * Math.PI / 6];
const trianglePoints = theta.map(t => [centerX + R * Math.cos(t), centerY + R * Math.sin(t)]);

svg.append("polygon")
    .attr("points", trianglePoints.map(p => p.join(",")).join(" "))
    .attr("class", "triangulo")
    .attr("fill", "none");

// Dibujar el círculo inscrito al triángulo equilátero
const rInscrito = R / 2;
svg.append("circle")
    .attr("cx", centerX)
    .attr("cy", centerY)
    .attr("r", rInscrito)
    .attr("class", "circulo-inscrito");

// Dibujar el diámetro I'I
svg.append("line")
    .attr("x1", centerX)
    .attr("y1", centerY - R)
    .attr("x2", centerX)
    .attr("y2", centerY + R)
    .attr("stroke", "black")
    .attr("stroke-width", 2);

// Solución (a): Selección de un punto en el diámetro I'I y cuerdas perpendiculares
function metodo_a() {
    
    const M = Math.random() * 2 * R - R;  // Punto M en el diámetro I'I
    const perpendicularY = centerY + M;
    const cuerdaLongitud = 2 * Math.sqrt(R * R - M * M);

    return {
        x1: centerX - cuerdaLongitud / 2,
        y1: perpendicularY,
        x2: centerX + cuerdaLongitud / 2,
        y2: perpendicularY,
        favorable: Math.abs(M) <= rInscrito
    };
}

// Solución (b): Selección de un ángulo al azar en la circunferencia desde un punto fijo
function metodo_b() {
    // Tomamos el primer vértice del triángulo equilátero como punto fijo
    const fixedPoint = trianglePoints[0];  // Punto fijo en la circunferencia (vértice del triángulo)
    
    // Generamos un ángulo aleatorio en el rango de 0 a 360 grados
    const theta = Math.random() * 360;  // Ángulo completo entre 0º y 360º
    const angleRad = theta * (Math.PI / 180);  // Convertimos a radianes

    // Calculamos el punto final de la cuerda en función del ángulo generado
    const x2 = centerX + R * Math.cos(angleRad);  // Coordenada X del punto final
    const y2 = centerY + R * Math.sin(angleRad);  // Coordenada Y del punto final

    // Determinamos si la cuerda es favorable (si cae entre 60° y 120° del triángulo equilátero)
    // Revisamos si el ángulo cae en los arcos correctos para que la cuerda sea mayor que el lado del triángulo
    let favorable = false;

    // Medimos el ángulo entre la cuerda y el vértice del triángulo
    const thetaFromFixedPoint = Math.atan2(y2 - fixedPoint[1], x2 - fixedPoint[0]) * (180 / Math.PI);
    
    // Ajustamos el ángulo para que siempre esté en el rango [0, 360]
    const adjustedTheta = (thetaFromFixedPoint + 360) % 360;

    // Evaluamos si el ángulo está en el rango favorable (entre 60° y 120° o entre 240° y 300°)
    if ((adjustedTheta >= 60 && adjustedTheta <= 120) || (adjustedTheta >= 240 && adjustedTheta <= 300)) {
        favorable = true;
    }

    return {
        x1: fixedPoint[0],  // Punto inicial de la cuerda (vértice del triángulo)
        y1: fixedPoint[1],
        x2: x2,  // Punto final de la cuerda en la circunferencia
        y2: y2,
        favorable: favorable  // Indica si la cuerda es favorable o no
    };
}








function metodo_c() {
// Generar un punto M aleatorio dentro del círculo de radio R
const angle = Math.random() * 2 * Math.PI; // Ángulo aleatorio
const radius = Math.sqrt(Math.random()) * R; // Radio aleatorio para mantener distribución uniforme
const Mx = centerX + radius * Math.cos(angle); // Coordenada x del punto M
const My = centerY + radius * Math.sin(angle); // Coordenada y del punto M

// Calcular la distancia OM (distancia del centro al punto M)
const OM = Math.sqrt((Mx - centerX) ** 2 + (My - centerY) ** 2);

// La cuerda será perpendicular a OM, por lo que podemos calcular los extremos de la cuerda
const perpSlope = -(Mx - centerX) / (My - centerY); // Pendiente de la perpendicular a OM
const perpAngle = Math.atan(perpSlope); // Ángulo de la perpendicular
const halfChord = Math.sqrt(R * R - OM * OM); // Longitud de la mitad de la cuerda

const x1 = Mx - halfChord * Math.cos(perpAngle); // Extremo de la cuerda en un lado
const y1 = My - halfChord * Math.sin(perpAngle);
const x2 = Mx + halfChord * Math.cos(perpAngle); // Extremo de la cuerda en el otro lado
const y2 = My + halfChord * Math.sin(perpAngle);

// Determinar si el punto M está dentro del círculo inscrito (acierto o fallo)
const favorable = OM <= rInscrito;

// Color del punto M: verde si es un acierto, rojo si es un fallo
const colorPuntoM = favorable ? "green" : "red";

// Mostrar el punto M con el color correspondiente
const puntoM = svg.append("circle")
    .attr("cx", Mx)
    .attr("cy", My)
    .attr("r", 5)
    .attr("class", "point")
    .attr("fill", colorPuntoM);

// Dibujar la línea OM
const lineaOM = svg.append("line")
    .attr("x1", centerX)
    .attr("y1", centerY)
    .attr("x2", Mx)
    .attr("y2", My)
    .attr("stroke", "grey")
    .attr("stroke-width", 1)
    .style("opacity", 0)  // Inicialmente invisible
    .transition()
    .duration(200)  // Duración de la transición según la velocidad
    .style("opacity", 1)
    .transition()
    .duration(300)
    .style("opacity", 0);  // Aparecer gradualmente

// Dibujar la cuerda perpendicular a OM
const cuerda = svg.append("line")
    .attr("x1", x1)
    .attr("y1", y1)
    .attr("x2", x2)
    .attr("y2", y2)
    .attr("stroke", "grey")
    .attr("stroke-width", 2)
    .style("opacity", 0)  // Inicialmente invisible
    .transition()
    .duration(200)  // Duración de la transición según la velocidad
    .style("opacity", 1)
    .transition()
    .duration(300)
    .style("opacity", 0);  // Aparecer gradualmente

// Actualizar el conteo de aciertos/fallos
//actualizarConteo(favorable);

// Eliminar la cuerda y la línea OM después de un tiempo proporcional a la velocidad
setTimeout(() => {
    cuerda.transition().duration(velocidad / 4).style("opacity", 0).remove();  // Eliminar la cuerda
    lineaOM.transition().duration(velocidad / 4).style("opacity", 0).remove();  // Eliminar la línea OM
}, velocidad);  // Eliminar después de un tiempo igual a la velocidad de la simulación

return {
    favorable: favorable
};
}

// Función para actualizar el conteo de aciertos y fallos
function actualizarConteo(favorable) {
if (favorable) {
    aciertos++;
} else {
    fallos++;
}
total++;
document.getElementById("aciertos").textContent = aciertos;
document.getElementById("fallos").textContent = fallos;
document.getElementById("total").textContent = total;
document.getElementById("probabilidad").textContent = (aciertos / total).toFixed(4);
}

// Función para generar cuerdas según el método seleccionado
function generarCuerda(metodo) {
let cuerda;

if (metodo === '1') {
    cuerda = metodo_a();
} else if (metodo === '2') {
    cuerda = metodo_b();
} else if (metodo === '3') {
    cuerda = metodo_c();
}

const color = cuerda.favorable ? "green" : "red";
actualizarConteo(cuerda.favorable);

svg.append("line")
    .attr("x1", cuerda.x1)
    .attr("y1", cuerda.y1)
    .attr("x2", cuerda.x2)
    .attr("y2", cuerda.y2)
    .attr("class", "cuerda")
    .attr("stroke", color)
    .style("opacity", 0)
    .transition()
    .duration(500)
    .style("opacity", 1)
    ;
}

// Limpiar las cuerdas y reiniciar el conteo
function limpiar() {
svg.selectAll(".circle.point").remove(); 
svg.selectAll("circle.point").remove(); 
svg.selectAll(".cuerda").remove();
svg.selectAll(".line").remove();
svg.selectAll("line").remove();
aciertos = 0;
fallos = 0;
total = 0;
document.getElementById("aciertos").textContent = 0;
document.getElementById("fallos").textContent = 0;
document.getElementById("total").textContent = 0;
document.getElementById("probabilidad").textContent = 0;
}

// Iniciar y detener el ciclo de simulación
function iniciarSimulacion() {
limpiar();
const metodoSeleccionado = document.getElementById("method").value;
clearInterval(intervalo);  // Limpiar cualquier simulación previa
intervalo = setInterval(() => generarCuerda(metodoSeleccionado), velocidad);
svg.selectAll("circle.point").remove(); 
}

// Obtener la velocidad seleccionada y actualizar
document.querySelectorAll("input[name='speed']").forEach(radio => {
radio.addEventListener("change", function () {
    velocidad = this.value;
    iniciarSimulacion();  // Reiniciar la simulación con la nueva velocidad
});
});

// Cambiar método de simulación
document.getElementById("method").addEventListener("change", iniciarSimulacion);

// Ejecutar la simulación al cargar la página
iniciarSimulacion();


















