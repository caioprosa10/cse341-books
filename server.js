import app from './app.js';
import { connectToDb } from './src/db/connect.js';

const PORT = process.env.PORT;

if (!PORT) {
    throw new Error('PORT is missing. Check that your npm scripts use --env-file=.env.');
}

const startServer = async () => {
    try {
        await connectToDb();

        app.listen(PORT, () => {
            console.log(`Server listening at 127.0.0.1:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start the server:', error.message);
        process.exit(1);
    }
};

startServer();
