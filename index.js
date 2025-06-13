const express = require('express');
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

// Servir archivos estáticos desde el directorio public
app.use(express.static('public'));

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

// Endpoint que multiplica dos números
app.get('/multiply', (req, res) => {
  const { a, b } = req.query;
  if (!validateQueryParams([a, b])) {
    return res.status(400).send('Invalid query parameters');
  }
  res.send(math_utils_multiply(Number(a), Number(b)).toString());
});

// Endpoint que resta dos números
app.get('/subtract', (req, res) => {
  const { a, b } = req.query;
  if (!validateQueryParams([a, b])) {
    return res.status(400).send('Invalid query parameters');
  }
  res.send(math_utils_subtract(Number(a), Number(b)).toString());
});

// Endpoint que divide dos números
app.get('/divide', (req, res) => {
  const { a, b } = req.query;
  if (!validateQueryParams([a, b])) {
    return res.status(400).send('Invalid query parameters');
  }
  try {
    res.send(math_utils_divide(Number(a), Number(b)).toString());
  } catch (error) {
    res.status(400).send(error.message);
  }
});






