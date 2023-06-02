class DQNmodel {
  constructor(
    episode,
    learningRate_0_1,
    learningRate_0_0_1,
    learningRate_0_0_0_1,
  ) {
    this.episode = episode,
    this.learningRate_0_1 = learningRate_0_1,
    this.learningRate_0_0_1 = learningRate_0_0_1,
    this.learningRate_0_0_0_1 = learningRate_0_0_0_1
    return this;
  }
}
module.exports = DQNmodel;
