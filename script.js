// === VARIABLES GLOBALES ===
let transacciones = [];

// 🔹 CARGAR DATOS DESDE localStorage AL INICIO
window.addEventListener("DOMContentLoaded", () => {
    const dataGuardada = localStorage.getItem("transacciones");
    if (dataGuardada) {
        transacciones = JSON.parse(dataGuardada);
        actualizarBalance();
        actualizarHistorial();
        actualizarGraficos();
    }
});

// === FORMULARIO ===
document.getElementById("transactionForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const descripcion = document.getElementById("description").value.trim();
    const monto = parseFloat(document.getElementById("amount").value);
    const tipo = document.getElementById("type").value;
    const categoria = document.getElementById("category").value;
    const fecha = document.getElementById("date").value;

    if (!descripcion || isNaN(monto) || monto <= 0 || !fecha) {
        alert("Por favor completa todos los campos correctamente.");
        return;
    }

    transacciones.push({ descripcion, monto, tipo, categoria, fecha });

    actualizarBalance();
    actualizarHistorial();
    actualizarGraficos();

    // 🔹 GUARDAR DATOS EN localStorage
    localStorage.setItem("transacciones", JSON.stringify(transacciones));

    this.reset();
});

// === ACTUALIZAR BALANCES ===
function actualizarBalance() {
    const totalIncome = transacciones
        .filter(t => t.tipo === "income")
        .reduce((acc, t) => acc + t.monto, 0);

    const totalExpense = transacciones
        .filter(t => t.tipo === "expense")
        .reduce((acc, t) => acc + t.monto, 0);

    document.getElementById("totalIncome").textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById("totalExpense").textContent = `$${totalExpense.toFixed(2)}`;
    document.getElementById("totalBalance").textContent = `$${(totalIncome - totalExpense).toFixed(2)}`;
}

// === ACTUALIZAR HISTORIAL ===
function actualizarHistorial() {
    const contenedor = document.getElementById("transactionsList");
    if (transacciones.length === 0) {
        contenedor.innerHTML = `<p class="empty-state">No hay transacciones registradas.</p>`;
        return;
    }

    contenedor.innerHTML = transacciones
        .map(t => `
            <div class="transaction-item ${t.tipo}">
                <p><strong>${t.descripcion}</strong> — ${t.categoria}</p>
                <p>${t.fecha}</p>
                <span class="amount">${t.tipo === "income" ? "+" : "-"}$${t.monto.toFixed(2)}</span>
            </div>
        `)
        .join("");
}

// === GRÁFICOS ===
let expenseChart, comparisonChart;

function actualizarGraficos() {
    const gastosPorCategoria = {};
    const ingresosTotales = transacciones.filter(t => t.tipo === "income").reduce((a, t) => a + t.monto, 0);
    const gastosTotales = transacciones.filter(t => t.tipo === "expense").reduce((a, t) => a + t.monto, 0);

    transacciones
        .filter(t => t.tipo === "expense")
        .forEach(t => {
            gastosPorCategoria[t.categoria] = (gastosPorCategoria[t.categoria] || 0) + t.monto;
        });

    // Gráfico de gastos por categoría
    const ctx1 = document.getElementById("expenseChart").getContext("2d");
    if (expenseChart) expenseChart.destroy();
    expenseChart = new Chart(ctx1, {
        type: "pie",
        data: {
            labels: Object.keys(gastosPorCategoria),
            datasets: [{
                data: Object.values(gastosPorCategoria),
                backgroundColor: ["#52b788", "#74c69d", "#95d5b2", "#b7e4c7", "#d8f3dc", "#e9f5f0"]
            }]
        },
        options: {
            plugins: { legend: { position: "bottom" } }
        }
    });

    // Gráfico de comparación ingresos vs gastos
    const ctx2 = document.getElementById("comparisonChart").getContext("2d");
    if (comparisonChart) comparisonChart.destroy();
    comparisonChart = new Chart(ctx2, {
        type: "bar",
        data: {
            labels: ["Ingresos", "Gastos"],
            datasets: [{
                data: [ingresosTotales, gastosTotales],
                backgroundColor: ["#52b788", "#e76f51"]
            }]
        },
        options: {
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: false } }
        }
    });
}


// === REINICIAR SIMULACIÓN ===
document.getElementById("btnReiniciar").addEventListener("click", (e) => {
    e.preventDefault(); // Evita que el link haga scroll arriba
    if (confirm("¿Seguro querés reiniciar la simulación? Se borrarán todas las transacciones.")) {
        transacciones = [];
        localStorage.removeItem("transacciones");
        actualizarBalance();
        actualizarHistorial();
        actualizarGraficos();
    }
});
