var fs = require('fs');

var uuid 		= require('node-uuid');

exports.getMsgid = function() {
	return uuid.v4();
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

exports.getPidFilePath = function (home, envType, envPort) {
  var basePath = this.getBaseDirPath(home);
  return basePath + '/XPUSH.' + envType + '.' + envPort + '.pid';
};

exports.getDaemonLogFilePath = function (home, envType, envPort) {
  var basePath = this.getBaseDirPath(home) + '/log';
  try {
    if (!fs.existsSync(basePath)) fs.mkdirSync(basePath, parseInt('0766', 8));
  } catch (e) {
    console.log('Error creating xpush directory: ' + e);
  }

  return basePath + '/DEAMON.' + envType + '.' + envPort + '.log';
};

exports.cloneObject = function (obj) {
  var clonedObjectsArray = [];
  var originalObjectsArray = []; //used to remove the unique ids when finished
  var next_objid = 0;

  function objectId(obj) {
    if (obj == null) return null;
    if (obj.__obj_id == undefined) {
      obj.__obj_id = next_objid++;
      originalObjectsArray[obj.__obj_id] = obj;
    }
    return obj.__obj_id;
  }

  function cloneRecursive(obj) {
    if (null == obj || typeof obj == "string" || typeof obj == "number" || typeof obj == "boolean") return obj;

    // Handle Date
    if (obj instanceof Date) {
      var copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      var copy = [];
      for (var i = 0; i < obj.length; ++i) {
        copy[i] = cloneRecursive(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      if (clonedObjectsArray[objectId(obj)] != undefined)
        return clonedObjectsArray[objectId(obj)];

      var copy;
      if (obj instanceof Function)//Handle Function
        copy = function () {
          return obj.apply(this, arguments);
        };
      else
        copy = {};

      clonedObjectsArray[objectId(obj)] = copy;

      for (var attr in obj)
        if (attr != "__obj_id" && obj.hasOwnProperty(attr))
          copy[attr] = cloneRecursive(obj[attr]);

      return copy;
    }


    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  var cloneObj = cloneRecursive(obj);


  //remove the unique ids
  for (var i = 0; i < originalObjectsArray.length; i++) {
    delete originalObjectsArray[i].__obj_id;
  }

  return cloneObj;
};


exports.checkProcess = function (pid) {
  try {
    return process.kill(pid, 0)
  }
  catch (e) {
    return e.code === 'EPERM'
  }
};

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
