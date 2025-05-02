const swaggerConfig = {
    definition: {
      openapi: "3.0.1",
      info: {
        title: "Node Express Math API with Swagger",
        version: "1.0.1",
        description:
          "This demo contins a Node Express API that performs math operations. The API is tested with Mocha/Chai. New endpoints and tests are generated with Copilot.",
        contact: {
          name: "Copilot",
          url: "https://github.com/features/copilot/",
          email: "copilot@email.com",
        },
      },
      cors: false,
      servers: [
        {
          // Replace with codespace url if need be. Ex. https://bthomas2622-jubilant-chainsaw-x5pxrw4g55q2996x.github.dev/
          url: "http://localhost:3000",
        },
      ],
    },
    apis: ["index.js"],
  };
  
  module.exports = swaggerConfig;
  
  // Sample Swagger jsdoc for /add endpoint
  // Swagger is located at /api-docs
  
  /** 
   * @swagger
   * /add:
   *   get:
   *     summary: Use to request the sum of two numbers
   *     parameters:
   *       - name: a
   *         in: query
   *         description: The first number to add
   *         required: true
   *         type: integer
   *       - name: b
   *         in: query
   *         description: The second number to add
   *         required: true
   *         type: integer
   *     responses:
   *        '200':
   *           description: Successful response
   */