const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'evoriion_arna',
  port: process.env.DB_PORT || 3306,
  multipleStatements: true
};

async function runMigration() {
  let connection;
  
  try {
    console.log('🔄 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected successfully');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'create_missing_tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('🔄 Running missing tables migration...');
    
    // Split SQL content by semicolon and execute each statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      try {
        if (statement.trim()) {
          await connection.execute(statement);
          successCount++;
          console.log(`✅ Executed: ${statement.substring(0, 50)}...`);
        }
      } catch (error) {
        // Ignore "table already exists" errors
        if (error.code === 'ER_TABLE_EXISTS_ERROR' || error.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️ Skipped (already exists): ${statement.substring(0, 50)}...`);
          successCount++;
        } else {
          console.error(`❌ Error executing: ${statement.substring(0, 50)}...`);
          console.error(`   Error: ${error.message}`);
          errorCount++;
        }
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('🎉 All missing tables created successfully!');
    } else {
      console.log('⚠️ Some errors occurred, but migration completed.');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the migration
runMigration().catch(console.error);