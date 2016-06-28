var fs = require('fs');

exports.getIP = function () {

  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) return alias.address;
    }
  }

  return '0.0.0.0';
};

exports.getPidFilePath = function (home, envType, envPort) {
  var basePath = this.getBaseDirPath(home);
  return basePath + '/XPUSH.' + envType + '.' + envPort + '.pid';
};

exports.getBaseDirPath = function (home) {

  var homePath = home || process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'] + '/.xpush';

  try {
    if (!fs.existsSync(homePath)) fs.mkdirSync(homePath, parseInt('0766', 8));
  } catch (e) {
    console.log('Error creating xpush directory: ' + e);
  }

  return homePath;
};
