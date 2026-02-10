const db = require('../db');
const { ApiError } = require('../middleware/errors');

class LessonsService {
  /**
   * PUBLIC_INTERFACE
   * List lesson summaries.
   */
  async listLessons() {
    const { rows } = await db.query(
      `SELECT id, title, difficulty, summary
       FROM lessons
       ORDER BY id ASC`
    );
    return rows;
  }

  /**
   * PUBLIC_INTERFACE
   * Get lesson detail by id including content_json.
   * @param {number} id lesson id
   */
  async getLessonById(id) {
    const { rows } = await db.query(
      `SELECT id, title, difficulty, summary, content_json
       FROM lessons
       WHERE id = $1`,
      [id]
    );

    if (!rows[0]) {
      throw new ApiError(404, 'Lesson not found');
    }
    return rows[0];
  }
}

module.exports = new LessonsService();
