/**
 * Lógica de calculadora web estilo app móvil
 * Maneja operaciones básicas y comunicación con el backend
 */

class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForNewValue = false;
        
        this.bindEvents();
    }

    /**
     * Vincula eventos de los botones
     */
    bindEvents() {
        // Botones de números
        document.querySelectorAll('.boton[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                this.inputNumber(button.dataset.number);
            });
        });

        // Botones de operaciones
        document.querySelectorAll('.boton[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                this.handleAction(button.dataset.action);
            });
        });

        // Teclado
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    /**
     * Maneja entrada de números
     * @param {string} number - Número presionado
     */
    inputNumber(number) {
        if (this.waitingForNewValue) {
            this.currentValue = number;
            this.waitingForNewValue = false;
        } else {
            this.currentValue = this.currentValue === '0' ? number : this.currentValue + number;
        }
        this.updateDisplay();
    }

    /**
     * Maneja acciones de botones
     * @param {string} action - Acción a ejecutar
     */
    async handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'toggle-sign':
                this.toggleSign();
                break;
            case 'percent':
                this.percent();
                break;
            case 'decimal':
                this.decimal();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.setOperation(action);
                break;
            case 'equals':
                await this.calculate();
                break;
        }
    }

    /**
     * Limpia la calculadora
     */
    clear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForNewValue = false;
        this.updateDisplay();
        this.clearOperatorStates();
    }

    /**
     * Cambia el signo del número actual
     */
    toggleSign() {
        if (this.currentValue !== '0') {
            this.currentValue = this.currentValue.startsWith('-') 
                ? this.currentValue.slice(1) 
                : '-' + this.currentValue;
            this.updateDisplay();
        }
    }

    /**
     * Convierte a porcentaje
     */
    percent() {
        this.currentValue = (parseFloat(this.currentValue) / 100).toString();
        this.updateDisplay();
    }

    /**
     * Añade punto decimal
     */
    decimal() {
        if (this.waitingForNewValue) {
            this.currentValue = '0.';
            this.waitingForNewValue = false;
        } else if (this.currentValue.indexOf('.') === -1) {
            this.currentValue += '.';
        }
        this.updateDisplay();
    }

    /**
     * Establece la operación a realizar
     * @param {string} nextOperation - Operación seleccionada
     */
    async setOperation(nextOperation) {
        if (this.previousValue === null) {
            this.previousValue = this.currentValue;
        } else if (this.operation) {
            await this.calculate();
        }

        this.waitingForNewValue = true;
        this.operation = nextOperation;
        this.updateOperatorStates();
    }

    /**
     * Realiza el cálculo usando el backend
     */
    async calculate() {
        if (this.previousValue === null || this.operation === null) {
            return;
        }

        try {
            const result = await this.performOperation(
                this.operation,
                parseFloat(this.previousValue),
                parseFloat(this.currentValue)
            );

            this.currentValue = result.toString();
            this.previousValue = null;
            this.operation = null;
            this.waitingForNewValue = true;
            this.updateDisplay();
            this.clearOperatorStates();
        } catch (error) {
            this.displayError(error.message);
        }
    }

    /**
     * Realiza operación mediante API del backend
     * @param {string} operation - Tipo de operación
     * @param {number} a - Primer operando
     * @param {number} b - Segundo operando
     * @returns {Promise<number>} Resultado de la operación
     */
    async performOperation(operation, a, b) {
        const endpoints = {
            'add': '/add',
            'subtract': '/subtract',
            'multiply': '/multiply',
            'divide': '/divide'
        };

        const endpoint = endpoints[operation];
        if (!endpoint) {
            throw new Error('Operación no soportada');
        }

        try {
            const response = await fetch(`${endpoint}?a=${a}&b=${b}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }
            
            const result = await response.text();
            return parseFloat(result);
        } catch (error) {
            if (error.message.includes('División por cero')) {
                throw new Error('Error');
            }
            throw new Error('Error de cálculo');
        }
    }

    /**
     * Actualiza la pantalla
     */
    updateDisplay() {
        const displayValue = this.formatDisplayValue(this.currentValue);
        this.display.textContent = displayValue;
    }

    /**
     * Formatea el valor para mostrar
     * @param {string} value - Valor a formatear
     * @returns {string} Valor formateado
     */
    formatDisplayValue(value) {
        const number = parseFloat(value);
        
        if (isNaN(number)) {
            return '0';
        }

        // Limitar decimales para evitar overflow
        if (value.includes('.')) {
            const parts = value.split('.');
            if (parts[1].length > 8) {
                return number.toFixed(8).replace(/\.?0+$/, '');
            }
        }

        // Formato para números grandes
        if (Math.abs(number) > 999999999) {
            return number.toExponential(2);
        }

        return value;
    }

    /**
     * Muestra error en pantalla
     * @param {string} message - Mensaje de error
     */
    displayError(message) {
        this.display.textContent = message;
        setTimeout(() => {
            this.clear();
        }, 2000);
    }

    /**
     * Actualiza estados visuales de operadores
     */
    updateOperatorStates() {
        this.clearOperatorStates();
        
        if (this.operation) {
            const operatorMap = {
                'add': '+',
                'subtract': '-',
                'multiply': '×',
                'divide': '÷'
            };
            
            const operatorSymbol = operatorMap[this.operation];
            const operatorButton = document.querySelector(`[data-action="${this.operation}"]`);
            
            if (operatorButton) {
                operatorButton.classList.add('activo');
            }
        }
    }

    /**
     * Limpia estados visuales de operadores
     */
    clearOperatorStates() {
        document.querySelectorAll('.boton.operador').forEach(button => {
            button.classList.remove('activo');
        });
    }

    /**
     * Maneja entrada de teclado
     * @param {KeyboardEvent} e - Evento de teclado
     */
    handleKeyboard(e) {
        e.preventDefault();
        
        const keyMap = {
            '0': () => this.inputNumber('0'),
            '1': () => this.inputNumber('1'),
            '2': () => this.inputNumber('2'),
            '3': () => this.inputNumber('3'),
            '4': () => this.inputNumber('4'),
            '5': () => this.inputNumber('5'),
            '6': () => this.inputNumber('6'),
            '7': () => this.inputNumber('7'),
            '8': () => this.inputNumber('8'),
            '9': () => this.inputNumber('9'),
            '.': () => this.handleAction('decimal'),
            '+': () => this.handleAction('add'),
            '-': () => this.handleAction('subtract'),
            '*': () => this.handleAction('multiply'),
            '/': () => this.handleAction('divide'),
            '=': () => this.handleAction('equals'),
            'Enter': () => this.handleAction('equals'),
            'Escape': () => this.handleAction('clear'),
            'Backspace': () => this.backspace()
        };

        const handler = keyMap[e.key];
        if (handler) {
            handler();
        }
    }

    /**
     * Función de retroceso (backspace)
     */
    backspace() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    }
}

// Inicializar calculadora cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});