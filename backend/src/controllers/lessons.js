const lessonsService = require('../services/lessons');

class LessonsController {
  async list(req, res) {
    const lessons = await lessonsService.listLessons();
    return res.status(200).json({ lessons });
  }

  async getById(req, res) {
    const id = Number(req.params.id);
    const lesson = await lessonsService.getLessonById(id);
    return res.status(200).json({ lesson });
  }
}

module.exports = new LessonsController();
