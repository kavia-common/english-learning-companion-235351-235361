const db = require('../db');
const { ApiError } = require('../middleware/errors');

function normalizeAnswer(a) {
  return String(a || '').trim().toLowerCase();
}

class QuizzesService {
  async _getOrCreateQuizForLesson(lessonId) {
    // If a quiz exists for lesson, reuse it; else create.
    const existing = await db.query(
      'SELECT id, lesson_id, created_at FROM quizzes WHERE lesson_id = $1 ORDER BY id DESC LIMIT 1',
      [lessonId]
    );
    if (existing.rows[0]) return existing.rows[0];

    const inserted = await db.query(
      `INSERT INTO quizzes (lesson_id)
       VALUES ($1)
       RETURNING id, lesson_id, created_at`,
      [lessonId]
    );
    return inserted.rows[0];
  }

  async _ensureQuestions(quizId, lessonId) {
    const qCount = await db.query(
      'SELECT COUNT(*)::int AS count FROM quiz_questions WHERE quiz_id = $1',
      [quizId]
    );
    if (qCount.rows[0]?.count > 0) {
      const q = await db.query(
        `SELECT id, quiz_id, prompt, choices, correct_answer
         FROM quiz_questions
         WHERE quiz_id = $1
         ORDER BY id ASC`,
        [quizId]
      );
      return q.rows;
    }

    // Basic question generation from lesson content_json if available; otherwise fallback.
    const lesson = await db.query(
      'SELECT content_json, title FROM lessons WHERE id = $1',
      [lessonId]
    );
    if (!lesson.rows[0]) throw new ApiError(404, 'Lesson not found');

    const content = lesson.rows[0].content_json || {};
    const vocab = Array.isArray(content.vocabulary) ? content.vocabulary : [];
    const grammar = Array.isArray(content.grammar_points) ? content.grammar_points : [];

    const questions = [];

    // Generate up to 4 questions from vocab entries like {term, definition} if present.
    for (const v of vocab.slice(0, 4)) {
      if (v?.term && v?.definition) {
        const correct = v.definition;
        const distractors = vocab
          .filter((x) => x && x.definition && x.definition !== correct)
          .slice(0, 3)
          .map((x) => x.definition);

        const choices = [correct, ...distractors].slice(0, 4);

        // Ensure at least 2 choices for a meaningful MCQ.
        if (choices.length < 2) continue;

        questions.push({
          prompt: `What is the definition of '${v.term}'?`,
          choices,
          correct_answer: correct,
        });
      }
    }

    // Add one grammar question if present.
    if (grammar[0]?.point) {
      questions.push({
        prompt: 'Which grammar topic is covered in this lesson?',
        choices: [grammar[0].point, 'Past perfect', 'Passive voice', 'Conditionals'].slice(0, 4),
        correct_answer: grammar[0].point,
      });
    }

    // Fallback if none generated.
    if (questions.length === 0) {
      questions.push(
        {
          prompt: `What is the main topic of '${lesson.rows[0].title}'?`,
          choices: ['Vocabulary', 'Grammar', 'Reading', 'Conversation'],
          correct_answer: 'Vocabulary',
        },
        {
          prompt: 'Choose the best definition of \'practice\'.',
          choices: ['to do repeatedly to improve', 'to ignore', 'to damage', 'to forget'],
          correct_answer: 'to do repeatedly to improve',
        }
      );
    }

    const inserted = [];
    for (const q of questions) {
      const r = await db.query(
        `INSERT INTO quiz_questions (quiz_id, prompt, choices, correct_answer)
         VALUES ($1, $2, $3, $4)
         RETURNING id, quiz_id, prompt, choices`,
        [quizId, q.prompt, JSON.stringify(q.choices), q.correct_answer]
      );
      inserted.push(r.rows[0]);
    }

    return inserted;
  }

  /**
   * PUBLIC_INTERFACE
   * Generate quiz for a given lessonId (idempotent: reuses existing quiz + questions if present).
   * @param {number} lessonId lesson id
   */
  async generateQuiz(lessonId) {
    const quiz = await this._getOrCreateQuizForLesson(lessonId);
    const questions = await this._ensureQuestions(quiz.id, lessonId);
    return { ...quiz, questions };
  }

  /**
   * PUBLIC_INTERFACE
   * Get quiz with questions by quiz id.
   * @param {number} quizId quiz id
   */
  async getQuizById(quizId) {
    const quiz = await db.query(
      'SELECT id, lesson_id, created_at FROM quizzes WHERE id = $1',
      [quizId]
    );
    if (!quiz.rows[0]) throw new ApiError(404, 'Quiz not found');

    const questions = await db.query(
      `SELECT id, quiz_id, prompt, choices
       FROM quiz_questions
       WHERE quiz_id = $1
       ORDER BY id ASC`,
      [quizId]
    );

    return { ...quiz.rows[0], questions: questions.rows };
  }

  /**
   * PUBLIC_INTERFACE
   * Submit quiz answers, score, and persist quiz_attempt.
   * @param {number} quizId quiz id
   * @param {number} userId user id
   * @param {{questionId:number, answer:string}[]} answers answers
   */
  async submitQuiz(quizId, userId, answers) {
    const quiz = await db.query(
      'SELECT id, lesson_id FROM quizzes WHERE id = $1',
      [quizId]
    );
    if (!quiz.rows[0]) throw new ApiError(404, 'Quiz not found');

    const questionRows = await db.query(
      `SELECT id, correct_answer
       FROM quiz_questions
       WHERE quiz_id = $1`,
      [quizId]
    );

    const correctMap = new Map(questionRows.rows.map((q) => [q.id, q.correct_answer]));
    const total = questionRows.rows.length;

    if (total === 0) throw new ApiError(400, 'Quiz has no questions');

    let score = 0;
    for (const a of answers) {
      const correct = correctMap.get(a.questionId);
      if (correct == null) continue;
      if (normalizeAnswer(a.answer) === normalizeAnswer(correct)) score += 1;
    }

    const attempt = await db.query(
      `INSERT INTO quiz_attempts (quiz_id, user_id, lesson_id, score, total)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, quiz_id, user_id, lesson_id, score, total, created_at`,
      [quizId, userId, quiz.rows[0].lesson_id, score, total]
    );

    return {
      attempt: attempt.rows[0],
      score,
      total,
    };
  }
}

module.exports = new QuizzesService();
