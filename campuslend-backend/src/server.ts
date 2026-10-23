import app from './app';
import { config } from './config';
import { connectDatabase } from './config/database';

const startServer = async (): Promise<void> => {
  // Connect to MongoDB
  await connectDatabase();

  // Start Express server
  app.listen(config.port, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║        🎓 CampusLend API Server             ║
╠══════════════════════════════════════════════╣
║  Environment : ${config.nodeEnv.padEnd(28)}║
║  Port        : ${String(config.port).padEnd(28)}║
║  MongoDB     : Connected                    ║
║  API Base    : http://localhost:${config.port}/api      ║
╚══════════════════════════════════════════════╝
    `);
  });
};

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

