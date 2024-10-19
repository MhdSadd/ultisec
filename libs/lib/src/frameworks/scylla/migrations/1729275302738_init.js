'use strict';

module.exports = {
  up: async (client) => {
    const queries = [
      `
    CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,                
    first_name text,                   
    last_name text,
    email text,                         
    phone_number text,
    password_hash text,            
    role text,
    created_at timestamp,
    updated_at timestamp,
    deleted_at timestamp                        
    )`,
    ];

    await executeBatchQueries(client, queries);
  },

  down: async (client) => {
    const queries = [`DROP TABLE IF EXISTS users`];

    await executeBatchQueries(client, queries);
  },
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
      console.log(`Query executed successfully: ${query}`);
    } catch (error) {
      console.error(`Error executing query: ${query}, Error: ${error.message}`);
      throw error;
    }
  }
}
