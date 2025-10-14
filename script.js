let registros = [];

document.getElementById("formRegistro").addEventListener("submit", function(e) {
    e.preventDefault();

    const descripcion = document.getElementById("descripcion").value;
    const monto = parseFloat(document.getElementById("monto").value);
    const tipo = document.getElementById("tipo").value;

    if (!descripcion || isNaN(monto) || monto <= 0) return alert("Por favor, ingrese datos válidos.");

    registros.push({ descripcion, monto, tipo });
    actualizarRegistros();
    actualizarGrafico();

    this.reset();
});

function actualizarRegistros() {
    const lista = document.getElementById("listaRegistros");
    const ingresos = registros.filter(r => r.tipo === "ingreso").reduce((acc, r) => acc + r.monto, 0);
    const gastos = registros.filter(r => r.tipo === "gasto").reduce((acc, r) => acc + r.monto, 0);
    const balance = ingresos - gastos;

    lista.innerHTML = registros.map(r => `
        <p>${r.descripcion} — <strong>${r.tipo}</strong>: $${r.monto}</p>
    `).join("");

    document.getElementById("totalIngresos").textContent = ingresos;
    document.getElementById("totalGastos").textContent = gastos;
    document.getElementById("balance").textContent = balance;
}

let grafico;
function actualizarGrafico() {
    const ingresos = registros.filter(r => r.tipo === "ingreso").reduce((acc, r) => acc + r.monto, 0);
    const gastos = registros.filter(r => r.tipo === "gasto").reduce((acc, r) => acc + r.monto, 0);

    const ctx = document.getElementById("graficoFinanzas").getContext("2d");

    if (grafico) grafico.destroy();

    grafico = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Ingresos", "Gastos"],
            datasets: [{
                data: [ingresos, gastos],
                backgroundColor: ["#3ca374", "#e57373"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}
