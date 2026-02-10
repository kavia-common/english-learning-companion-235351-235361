const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

/**
 * Attempts to extract a postgres connection string from database/db_connection.txt.
 * Expected convention: a line containing "psql postgresql://..." or "postgresql://...".
 */
function getDatabaseUrlFromDbConnectionTxt() {
  try {
    const candidatePaths = [
      // Most likely: sibling container in monorepo workspace
      path.resolve(__dirname, '../../../english-learning-companion-235351-235360/database/db_connection.txt'),
      // Alternate: database folder at repo root (in case of different workspace layout)
      path.resolve(__dirname, '../../../database/db_connection.txt'),
    ];

    const existingPath = candidatePaths.find((p) => fs.existsSync(p));
    if (!existingPath) return null;

    const txt = fs.readFileSync(existingPath, 'utf8');

    // Try to find a postgresql:// URL anywhere in the file.
    const match = txt.match(/postgres(?:ql)?:\/\/[^\s'"]+/i);
    if (!match) return null;

    return match[0];
  } catch (e) {
    // Non-fatal; we will error later if DATABASE_URL is also missing.
    return null;
  }
}

const resolvedDatabaseUrl = process.env.DATABASE_URL || getDatabaseUrlFromDbConnectionTxt();

if (!resolvedDatabaseUrl) {
  // Fail fast with actionable guidance.
  console.error(
    'DATABASE_URL is not set and db_connection.txt could not be found/parsed. ' +
      'Set DATABASE_URL in the backend environment or ensure database/db_connection.txt contains a postgresql:// URL.'
  );
}

const pool = new Pool({
  connectionString: resolvedDatabaseUrl,
  // Keep defaults; rely on DATABASE_URL params for SSL if needed.
});

/**
 * PUBLIC_INTERFACE
 * Executes a parameterized SQL query using the shared pool.
 * @param {string} text SQL query text
 * @param {any[]} [params] parameter array
 * @returns {Promise<import("pg").QueryResult>}
 */
async function query(text, params = []) {
  return pool.query(text, params);
}

/**
 * PUBLIC_INTERFACE
 * Gracefully closes the pool (useful for tests/shutdown).
 * @returns {Promise<void>}
 */
async function closePool() {
  await pool.end();
}

module.exports = {
  pool,
  query,
  closePool,
};
