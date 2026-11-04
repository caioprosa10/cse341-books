import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' with { type: 'json' };
import router from './src/router.js';

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * @openapi
 * /:
 *   get:
 *     summary: Health check for the service
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: The server is running
 */
app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Server is running' });
});

app.use(router);

export default app;
