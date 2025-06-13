const express = require('express');
const path = require('path');
// Import math utils
const math_utils_add = require('./math-utils/math_utils_add');
const math_utils_pow = require('./math-utils/math_utils_pow');
const math_utils_multiply = require('./math-utils/math_utils_multiply');
const math_utils_subtract = require('./math-utils/math_utils_subtract');
const math_utils_divide = require('./math-utils/math_utils_divide');
// Import swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerConfig = require('./swagger-config');
const app = express();

app.use(express.json());

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Swagger setup
const specs = swaggerJsDoc(swaggerConfig);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// REQUEST HANDLERS

// Helper function to validate query parameters
function validateQueryParams(params) {
  for (const param of params) {
    if (isNaN(param)) {
      return false;
    }
  }
  return true;
}

// Endpoint that adds two numbers
app.get('/add', (req, res) => {
  const { a, b } = req.query;
  if (!validateQueryParams([a, b])) {
    return res.status(400).send('Invalid query parameters');
  }
  res.send(math_utils_add(Number(a), Number(b)).toString());
});

// Endpoint that raises one number to the power of another
app.get('/pow', (req, res) => {
  const { a, b } = req.query;
  if (!validateQueryParams([a, b])) {
    return res.status(400).send('Invalid query parameters');
  }
  res.send(math_utils_pow(Number(a), Number(b)).toString());
});

// API ENDPOINTS - Endpoints de API para la calculadora

// Endpoint de API para sumar dos números
app.post('/api/add', (req, res) => {
  const { a, b } = req.body;
  if (!validateQueryParams([a, b])) {
    return res.status(400).json({ error: 'Parámetros inválidos' });
  }
  const result = math_utils_add(Number(a), Number(b));
  res.json({ result });
});

// Endpoint de API para restar dos números
app.post('/api/subtract', (req, res) => {
  const { a, b } = req.body;
  if (!validateQueryParams([a, b])) {
    return res.status(400).json({ error: 'Parámetros inválidos' });
  }
  const result = math_utils_subtract(Number(a), Number(b));
  res.json({ result });
});

// Endpoint de API para multiplicar dos números
app.post('/api/multiply', (req, res) => {
  const { a, b } = req.body;
  if (!validateQueryParams([a, b])) {
    return res.status(400).json({ error: 'Parámetros inválidos' });
  }
  const result = math_utils_multiply(Number(a), Number(b));
  res.json({ result });
});

// Endpoint de API para dividir dos números
app.post('/api/divide', (req, res) => {
  const { a, b } = req.body;
  if (!validateQueryParams([a, b])) {
    return res.status(400).json({ error: 'Parámetros inválidos' });
  }
  try {
    const result = math_utils_divide(Number(a), Number(b));
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint de API para elevar un número a una potencia
app.post('/api/power', (req, res) => {
  const { a, b } = req.body;
  if (!validateQueryParams([a, b])) {
    return res.status(400).json({ error: 'Parámetros inválidos' });
  }
  const result = math_utils_pow(Number(a), Number(b));
  res.json({ result });
});






