const db = require('../db');

class ProgressService {
  /**
   * PUBLIC_INTERFACE
   * Aggregate progress for a user and upsert into progress_summaries.
   * @param {number} userId user id
   */
  async getProgress(userId) {
    const attemptsAgg = await db.query(
      `SELECT
         COUNT(*)::int AS attempts_count,
         COALESCE(SUM(score), 0)::int AS total_correct,
         COALESCE(SUM(total), 0)::int AS total_questions
       FROM quiz_attempts
       WHERE user_id = $1`,
      [userId]
    );

    const vocabAgg = await db.query(
      `SELECT COUNT(*)::int AS vocab_count
       FROM vocabulary
       WHERE user_id = $1`,
      [userId]
    );

    const attempts = attemptsAgg.rows[0] || { attempts_count: 0, total_correct: 0, total_questions: 0 };
    const vocab = vocabAgg.rows[0] || { vocab_count: 0 };

    const accuracy =
      Number(attempts.total_questions) > 0 ? Number(attempts.total_correct) / Number(attempts.total_questions) : 0;

    const summary = await db.query(
      `INSERT INTO progress_summaries (user_id, attempts_count, total_correct, total_questions, accuracy, vocab_count)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id)
       DO UPDATE SET attempts_count = EXCLUDED.attempts_count,
                     total_correct = EXCLUDED.total_correct,
                     total_questions = EXCLUDED.total_questions,
                     accuracy = EXCLUDED.accuracy,
                     vocab_count = EXCLUDED.vocab_count,
                     updated_at = NOW()
       RETURNING user_id, attempts_count, total_correct, total_questions, accuracy, vocab_count, updated_at`,
      [userId, attempts.attempts_count, attempts.total_correct, attempts.total_questions, accuracy, vocab.vocab_count]
    );

    return summary.rows[0];
  }
}

module.exports = new ProgressService();
