const quizzesService = require('../services/quizzes');

class QuizzesController {
  async generate(req, res) {
    const { lessonId } = req.body;
    const quiz = await quizzesService.generateQuiz(lessonId);
    return res.status(200).json({ quiz });
  }

  async getById(req, res) {
    const quizId = Number(req.params.id);
    const quiz = await quizzesService.getQuizById(quizId);
    return res.status(200).json({ quiz });
  }

  async submit(req, res) {
    const quizId = Number(req.params.id);
    const { userId, answers } = req.body;
    const result = await quizzesService.submitQuiz(quizId, userId, answers);
    return res.status(200).json({ result });
  }
}

module.exports = new QuizzesController();
