/**
 * Calculadora Simple - Lógica Frontend
 * Maneja las operaciones de la calculadora y la comunicación con la API
 */

// Estado de la calculadora
let currentInput = '0';
let previousInput = null;
let operation = null;
let waitingForNewInput = false;

// Elementos del DOM
const display = document.getElementById('display');

/**
 * Actualiza la pantalla de la calculadora
 * @param {string} value - Valor a mostrar
 */
function updateDisplay(value = currentInput) {
    display.textContent = value;
    display.classList.remove('display-error');
}

/**
 * Muestra un error en la pantalla
 * @param {string} message - Mensaje de error
 */
function showError(message = 'Error') {
    display.textContent = message;
    display.classList.add('display-error');
    setTimeout(() => {
        clearAll();
    }, 2000);
}

/**
 * Añade un número al input actual
 * @param {string} number - Número a añadir
 */
function appendNumber(number) {
    if (waitingForNewInput) {
        currentInput = number;
        waitingForNewInput = false;
    } else {
        currentInput = currentInput === '0' ? number : currentInput + number;
    }
    updateDisplay();
}

/**
 * Añade un punto decimal
 */
function appendDecimal() {
    if (waitingForNewInput) {
        currentInput = '0.';
        waitingForNewInput = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

/**
 * Limpia toda la calculadora (AC)
 */
function clearAll() {
    currentInput = '0';
    previousInput = null;
    operation = null;
    waitingForNewInput = false;
    updateDisplay();
}

/**
 * Limpia la entrada actual (CE)
 */
function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

/**
 * Calcula el porcentaje del número actual
 */
function calculatePercentage() {
    const num = parseFloat(currentInput);
    currentInput = (num / 100).toString();
    updateDisplay();
}

/**
 * Establece la operación a realizar
 * @param {string} op - Operación (+, -, *, /)
 */
function setOperation(op) {
    if (operation && !waitingForNewInput) {
        calculate();
    }
    
    previousInput = currentInput;
    operation = op;
    waitingForNewInput = true;
}

/**
 * Realiza el cálculo usando la API del backend
 */
async function calculate() {
    if (!operation || previousInput === null) {
        return;
    }

    const a = parseFloat(previousInput);
    const b = parseFloat(currentInput);
    
    // Validar números
    if (isNaN(a) || isNaN(b)) {
        showError('Número inválido');
        return;
    }

    // Mapear operaciones a endpoints de API
    const operationMap = {
        '+': 'add',
        '-': 'subtract',
        '*': 'multiply',
        '/': 'divide'
    };

    const endpoint = operationMap[operation];
    if (!endpoint) {
        showError('Operación inválida');
        return;
    }

    try {
        // Realizar la petición a la API
        const response = await fetch(`/api/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ a, b })
        });

        const data = await response.json();

        if (response.ok) {
            // Formatear el resultado
            let result = data.result;
            
            // Redondear a 10 decimales para evitar problemas de precisión
            if (typeof result === 'number') {
                result = Math.round(result * 10000000000) / 10000000000;
            }
            
            currentInput = result.toString();
            updateDisplay();
        } else {
            showError(data.error || 'Error de cálculo');
        }
    } catch (error) {
        console.error('Error en la petición:', error);
        showError('Error de conexión');
    }

    // Resetear estado para la siguiente operación
    operation = null;
    previousInput = null;
    waitingForNewInput = true;
}

/**
 * Maneja eventos de teclado para la calculadora
 * @param {KeyboardEvent} event - Evento de teclado
 */
function handleKeyboard(event) {
    const key = event.key;
    
    // Prevenir comportamiento por defecto para ciertas teclas
    if (['Enter', 'Escape', 'Backspace'].includes(key)) {
        event.preventDefault();
    }
    
    // Números
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    }
    // Operadores
    else if (['+', '-', '*', '/'].includes(key)) {
        setOperation(key);
    }
    // Punto decimal
    else if (key === '.' || key === ',') {
        appendDecimal();
    }
    // Calcular
    else if (key === 'Enter' || key === '=') {
        calculate();
    }
    // Limpiar todo
    else if (key === 'Escape') {
        clearAll();
    }
    // Borrar último carácter (implementación simple)
    else if (key === 'Backspace') {
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }
}

// Event listeners
document.addEventListener('keydown', handleKeyboard);

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
    
    // Agregar efecto visual a los botones cuando se presionan con teclado
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        let buttonSelector = null;
        
        if (key >= '0' && key <= '9') {
            buttonSelector = `button[onclick="appendNumber('${key}')"]`;
        } else if (key === '+') {
            buttonSelector = `button[data-operation="add"]`;
        } else if (key === '-') {
            buttonSelector = `button[data-operation="subtract"]`;
        } else if (key === '*') {
            buttonSelector = `button[data-operation="multiply"]`;
        } else if (key === '/') {
            buttonSelector = `button[data-operation="divide"]`;
        } else if (key === 'Enter' || key === '=') {
            buttonSelector = '.btn-equals';
        } else if (key === 'Escape') {
            buttonSelector = '.btn-clear';
        }
        
        if (buttonSelector) {
            const button = document.querySelector(buttonSelector);
            if (button) {
                button.classList.add('active');
                setTimeout(() => button.classList.remove('active'), 150);
            }
        }
    });
});

// Agregar estilo para el estado activo de los botones
const style = document.createElement('style');
style.textContent = `
    .btn.active {
        transform: translateY(1px) !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;
    }
`;
document.head.appendChild(style);