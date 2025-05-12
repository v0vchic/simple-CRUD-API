import cluster from 'cluster';
import os from 'os';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const BASE_PORT = parseInt(process.env.PORT) || 4000;
const numCPUs = Math.max(os.cpus().length - 1, 1);

if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork({ PORT: (BASE_PORT + i + 1).toString() });
    }
    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    const port = process.env.PORT || BASE_PORT;
    app.listen(port, () => {
        console.log(`Worker ${process.pid} started on port ${port}`);
    });
}
