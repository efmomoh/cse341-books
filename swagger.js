import { writeFileSync } from 'node:fs';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Books and Author API',
            version: '2.0.0',
            description: 'Rest API for managing books and authors. This API allows you to perform CRUD operations on books and authors, including creating, reading, updating, and deleting records. It also provides endpoints to retrieve all books or authors, as well as specific records by their unique identifiers.'
        },
        servers: [
            {
                url: '/',
                description: 'Current server'
            }
        ]
    },
    apis: ['./src/router.js', './app.js']
};

const swaggerSpec = swaggerJsdoc(options);

writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('Swagger documentation generated.');