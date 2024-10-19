// migrations/index.js
const cassandra = require('cassandra-driver');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new cassandra.Client({
  contactPoints: process.env.CONTACT_POINTS.split(','),
  localDataCenter: process.env.DATACENTER,
  keyspace: process.env.KEYSPACE,
});

const runMigrations = async (direction = 'up') => {
  try {
    // Create the migrations table if it doesn't already exit
    await client.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
      id UUID,
      migration_name text PRIMARY KEY,
      applied_at timestamp,
    )`);

    // Fetch the migrations that have already been applied
    const appliedMigrations = await client.execute(
      'SELECT migration_name FROM migrations',
    );

    const appliedMigrationNames = appliedMigrations.rows.map(
      (row) => row.migration_name,
    );

    // Get all migration files in the current directory
    const migrationFiles = fs
      .readdirSync(path.join(__dirname + '/migrations'))
      .filter((file) => file.endsWith('.js'));

    if (direction === 'up') {
      // Log the total number of migration files
      console.log(`total migration files is: ${migrationFiles.length}`);

      // Filter new migrations that haven't been applied yet
      const newMigrations = migrationFiles.filter(
        (file) => !appliedMigrationNames.includes(file.split('.')[0]),
      );

      if (!newMigrations.length > 0) {
        console.log(` Database up to date, no new migration(s) to apply`);
        return;
      }

      // Log the number of new migrations
      console.log(`${newMigrations.length} new migrations to apply`);
      // Apply each new migration
      for (const file of newMigrations) {
        const migrationName = file.split('.')[0];
        console.log(`Running migration: ${migrationName}`);

        const migration = require(path.join(__dirname + '/migrations/' + file));
        await migration.up(client);
        await client.execute(
          'INSERT INTO migrations (id, migration_name, applied_at) VALUES (uuid(), ?, toTimestamp(now()))',
          [migrationName],
        );
        console.log(`Migration ${migrationName} applied.`);
      }
      console.log('All new migrations have been applied.');
    } else if (direction === 'down') {
      if (appliedMigrations.rowLength === 0) {
        console.log('No migrations to revert.');
        return;
      }

      const lastMigration = appliedMigrations.rows[0].migration_name;
      console.log(`Last migration is ${lastMigration}: reverting`);
      const migration = require(
        path.join(__dirname + '/migrations/' + `${lastMigration}.js`),
      );

      await migration.down(client);
      await client.execute('DELETE FROM migrations WHERE migration_name = ?', [
        lastMigration,
      ]);

      console.log(`Migration ${lastMigration} reverted.`);
    }
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await client.shutdown();
  }
};

runMigrations(process.argv[2] || 'up');
