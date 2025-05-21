// Manejo de eventos para el formulario de suma
document.getElementById('add-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const a = document.getElementById('add-a').value;
    const b = document.getElementById('add-b').value;
    const response = await fetch(`/add?a=${a}&b=${b}`);
    const result = await response.text();
    document.getElementById('result').innerText = `Resultado: ${result}`;
});

// Manejo de eventos para el formulario de potencia
document.getElementById('pow-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const a = document.getElementById('pow-a').value;
    const b = document.getElementById('pow-b').value;
    const response = await fetch(`/pow?a=${a}&b=${b}`);
    const result = await response.text();
    document.getElementById('result').innerText = `Resultado: ${result}`;
});