const progressService = require('../services/progress');

class ProgressController {
  async getSummary(req, res) {
    const userId = Number(req.query.userId);
    const summary = await progressService.getProgress(userId);
    return res.status(200).json({ progress: summary });
  }
}

module.exports = new ProgressController();
