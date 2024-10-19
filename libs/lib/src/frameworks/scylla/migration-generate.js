const fs = require('fs');
const path = require('path');

const createMigration = (name) => {
  if (!name) {
    console.error('🚨 Migration name is required.');
    return;
  }

  const fileName = `${Date.now()}_${name}.js`;

  // Define the content of the migration file
  const migrationTemplate = `
  'use strict';

  module.exports = {
    up: async (client) => {
      const queries = [\`//Add migration queries here.\`]

      await executeBatchQueries(client, queries);
    },

    down: async (client) => {
      const queries = [\`//Add migration queries here.\`]

      await executeBatchQueries(client, queries);
    }
  };

  /**
    * Helper function to execute CQL queries and log success or error messages.
    * @param {Object} client - The Cassandra client.
    * @param {Array<string>} queries - Array of CQL queries to execute.
  */

  async function executeBatchQueries(client, queries) {
   for (const query of queries) {
    try {
      await client.execute(query);
      console.log(\`Query executed successfully: \${query}\`);
    } catch (error) {
      console.error(\`Error executing query: \${query}, Error: \${error.message}\`);
      throw error;
    }
  }
  }
  `;

  // Path to save the migration file
  const migrationsDir = path.join(__dirname, 'migrations');

  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir);
  }

  // Write the migration file to the migrations directory
  const filePath = path.join(migrationsDir, fileName);

  fs.writeFileSync(filePath, migrationTemplate.trim());
  console.log(`✅ Migration file created: ${fileName}`);
};

createMigration(process.argv[2]);
