const { initializeDatabase } = require('./config/database');

async function initDatabase() {
  try {
    console.log('🚀 Initializing database...');
    await initializeDatabase();
    console.log('✅ Database initialization completed!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    process.exit(0);
  }
}

initDatabase();
