const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'English Learning Companion API',
      version: '1.0.0',
      description: 'Express API for lessons, quizzes, vocabulary, and progress tracking.',
    },
    components: {
      schemas: {
        LessonListItem: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Daily Conversations' },
            difficulty: { type: 'string', example: 'Beginner' },
            summary: { type: 'string', example: 'Learn common phrases used in everyday situations.' },
          },
        },
        LessonDetail: {
          allOf: [
            { $ref: '#/components/schemas/LessonListItem' },
            {
              type: 'object',
              properties: {
                content_json: {
                  description: 'Lesson content as JSON (structure depends on seed).',
                  oneOf: [{ type: 'object' }, { type: 'array' }, { type: 'string' }],
                },
              },
            },
          ],
        },
        QuizQuestion: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 10 },
            quiz_id: { type: 'integer', example: 3 },
            prompt: { type: 'string', example: 'What is the definition of "greet"?' },
            choices: {
              type: 'array',
              items: { type: 'string' },
              example: ['to say hello', 'to leave', 'to run', 'to sleep'],
            },
          },
        },
        Quiz: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 3 },
            lesson_id: { type: 'integer', example: 1 },
            created_at: { type: 'string', format: 'date-time' },
            questions: { type: 'array', items: { $ref: '#/components/schemas/QuizQuestion' } },
          },
        },
        GenerateQuizRequest: {
          type: 'object',
          required: ['lessonId'],
          properties: {
            lessonId: { type: 'integer', example: 1 },
          },
        },
        SubmitQuizRequest: {
          type: 'object',
          required: ['userId', 'answers'],
          properties: {
            userId: { type: 'integer', example: 1 },
            answers: {
              type: 'array',
              items: {
                type: 'object',
                required: ['questionId', 'answer'],
                properties: {
                  questionId: { type: 'integer', example: 10 },
                  answer: { type: 'string', example: 'to say hello' },
                },
              },
            },
          },
        },
        QuizAttempt: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 100 },
            quiz_id: { type: 'integer', example: 3 },
            user_id: { type: 'integer', example: 1 },
            lesson_id: { type: 'integer', example: 1 },
            score: { type: 'integer', example: 3 },
            total: { type: 'integer', example: 4 },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        QuizSubmissionResult: {
          type: 'object',
          properties: {
            attempt: { $ref: '#/components/schemas/QuizAttempt' },
            score: { type: 'integer', example: 3 },
            total: { type: 'integer', example: 4 },
          },
        },
        VocabularyItem: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 22 },
            user_id: { type: 'integer', example: 1 },
            term: { type: 'string', example: 'greet' },
            definition: { type: 'string', example: 'to say hello' },
            example: { type: 'string', example: 'I greet my neighbors every morning.' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        UpsertVocabularyRequest: {
          type: 'object',
          required: ['userId', 'term', 'definition', 'example'],
          properties: {
            userId: { type: 'integer', example: 1 },
            term: { type: 'string', example: 'greet' },
            definition: { type: 'string', example: 'to say hello' },
            example: { type: 'string', example: 'I greet my neighbors every morning.' },
          },
        },
        VocabularyReviewRequest: {
          type: 'object',
          required: ['userId', 'term', 'result'],
          properties: {
            userId: { type: 'integer', example: 1 },
            term: { type: 'string', example: 'greet' },
            result: { type: 'string', enum: ['pass', 'fail'], example: 'pass' },
          },
        },
        ReviewSchedule: {
          type: 'object',
          properties: {
            user_id: { type: 'integer', example: 1 },
            term: { type: 'string', example: 'greet' },
            interval_days: { type: 'integer', example: 3 },
            repetition: { type: 'integer', example: 2 },
            next_review_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        ProgressSummary: {
          type: 'object',
          properties: {
            user_id: { type: 'integer', example: 1 },
            attempts_count: { type: 'integer', example: 5 },
            total_correct: { type: 'integer', example: 14 },
            total_questions: { type: 'integer', example: 20 },
            accuracy: { type: 'number', example: 0.7 },
            vocab_count: { type: 'integer', example: 32 },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Service health checks' },
      { name: 'Lessons', description: 'Lesson listing and detail' },
      { name: 'Quizzes', description: 'Quiz generation, retrieval, and submissions' },
      { name: 'Vocabulary', description: 'User vocabulary and review schedules' },
      { name: 'Progress', description: 'Aggregated learning progress' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
