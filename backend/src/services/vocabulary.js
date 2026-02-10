const db = require('../db');
const { ApiError } = require('../middleware/errors');

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

class VocabularyService {
  /**
   * PUBLIC_INTERFACE
   * List vocabulary for a user.
   * @param {number} userId user id
   */
  async list(userId) {
    const { rows } = await db.query(
      `SELECT id, user_id, term, definition, example, created_at, updated_at
       FROM vocabulary
       WHERE user_id = $1
       ORDER BY term ASC`,
      [userId]
    );
    return rows;
  }

  /**
   * PUBLIC_INTERFACE
   * Upsert vocabulary (unique per user_id + term).
   */
  async upsert({ userId, term, definition, example }) {
    // Assumes unique constraint exists; if not, this will error and should be fixed at schema level.
    const { rows } = await db.query(
      `INSERT INTO vocabulary (user_id, term, definition, example)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, term)
       DO UPDATE SET definition = EXCLUDED.definition, example = EXCLUDED.example, updated_at = NOW()
       RETURNING id, user_id, term, definition, example, created_at, updated_at`,
      [userId, term, definition, example]
    );
    return rows[0];
  }

  /**
   * PUBLIC_INTERFACE
   * Update review schedule using a simple interval progression.
   * - pass: increase interval (1, 3, 7, 14, 30...)
   * - fail: reset interval to 1 day
   */
  async review({ userId, term, result }) {
    // Ensure vocab exists for the term (for UX; otherwise schedule would be orphaned)
    const vocab = await db.query('SELECT id FROM vocabulary WHERE user_id = $1 AND term = $2', [userId, term]);
    if (!vocab.rows[0]) throw new ApiError(404, 'Vocabulary term not found for user');

    const existing = await db.query(
      `SELECT user_id, term, interval_days, repetition, next_review_at
       FROM review_schedules
       WHERE user_id = $1 AND term = $2`,
      [userId, term]
    );

    const now = new Date();
    let intervalDays = existing.rows[0]?.interval_days ?? 1;
    let repetition = existing.rows[0]?.repetition ?? 0;

    if (result === 'pass') {
      repetition += 1;
      // Basic intervals, SM-2-like progression (not full SM-2)
      const intervals = [1, 3, 7, 14, 30, 60];
      intervalDays = intervals[Math.min(repetition - 1, intervals.length - 1)];
    } else {
      repetition = 0;
      intervalDays = 1;
    }

    const nextReviewAt = addDays(now, intervalDays);

    const upserted = await db.query(
      `INSERT INTO review_schedules (user_id, term, interval_days, repetition, next_review_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, term)
       DO UPDATE SET interval_days = EXCLUDED.interval_days,
                     repetition = EXCLUDED.repetition,
                     next_review_at = EXCLUDED.next_review_at,
                     updated_at = NOW()
       RETURNING user_id, term, interval_days, repetition, next_review_at`,
      [userId, term, intervalDays, repetition, nextReviewAt.toISOString()]
    );

    return upserted.rows[0];
  }
}

module.exports = new VocabularyService();
