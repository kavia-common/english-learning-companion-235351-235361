const vocabularyService = require('../services/vocabulary');

class VocabularyController {
  async list(req, res) {
    const userId = Number(req.query.userId);
    const vocab = await vocabularyService.list(userId);
    return res.status(200).json({ vocabulary: vocab });
  }

  async upsert(req, res) {
    const item = await vocabularyService.upsert(req.body);
    return res.status(200).json({ vocabulary: item });
  }

  async review(req, res) {
    const schedule = await vocabularyService.review(req.body);
    return res.status(200).json({ schedule });
  }
}

module.exports = new VocabularyController();
