var chalk = require('chalk'),
    cursor = require('cli-cursor'),
    symbols = require('log-symbols'),
    spinners = require('cli-spinners');

class Spinner {

  constructor(options) {

    this.options = {
      color: options.color || 'green',
      text: options.text || '',
      stream: options.stream, //process.stderr,
      interval: options.interval || 100,
      spinner: (process.platform === 'win32') ? spinners.line : (spinners[options.spinner] || spinners.hamburger),
      id: null,
      frameIndex: 0,
      enabled: options.enabled || ((options.stream && options.stream.isTTY) && !process.env.CI),
    };

    this.frame = this.frame.bind(this);
    this.clear = this.clear.bind(this);
    this.render = this.render.bind(this);
    this.stop = this.stop.bind(this);
    this.stopAndPersist = this.stopAndPersist.bind(this);

  }

  frame() {
      var frames = this.options.spinner.frames,
          frame = frames[this.options.frameIndex],
          text = this.options.text;

      if (this.options.color) {
          frame = chalk[this.options.color](frame);
          text = chalk[this.options.color](text);
      }

      this.options.frameIndex = (this.options.frameIndex + 1) % frames.length;

      return frame + ' ' + text;
  }

  clear() {

      if (!this.options.enabled) {
          return this;
      }

      this.options.stream.clearLine();
      this.options.stream.cursorTo(0);

      return this;
  }

  render() {

      this.clear();

      this.options.stream.write(this.frame());

      return this;
  }

  start() {
      if (!this.options.enabled || this.options.id) {
          return this;
      }

      cursor.hide();
      this.render();
      this.options.id = setInterval(this.render, this.options.interval);

      return this;
  }

  stop() {
      if (!this.options.enabled) {
          return this;
      }

      clearInterval(this.id);
      this.options.id = null;
      this.options.frameIndex = 0;
      this.clear();
      cursor.show();

      return this;
  }

  succeed() {
      return this.stopAndPersist(symbols.success, 'green');
  }

  fail() {
      return this.stopAndPersist(symbols.error, 'red');
  }

  stopAndPersist(symbol, color) {
      var text = this.options.text;

      if (color || this.options.color) {
          text = chalk[color || this.options.color](text);
      }

      this.stop();
      this.options.stream.write((symbol || ' ') + ' ' + text + '\n');
      return this;
  }

}

module.exports = Spinner;
