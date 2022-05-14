var tpbanksdk = new (function () {
  var platform = "";
  var window1 = null;
  this.sendMessage = function (e, data) {
    window1 = e;
    var dataJson = JSON.stringify(data);
    if (this.isIOS()) {
      window.webkit.messageHandlers.sendDataToNative.postMessage(
        encodeData(dataJson)
      );
    } else if (this.isAndroid()) {
      JSBridge.sendDataToNative(encodeData(dataJson));
    } else {
      window.parent.postMessage(encodeData(dataJson), "*");
    }
  };

  this.updateFromNative = function (message) {
    try {
      var data = JSON.parse(decodeURIComponent(atob(decodeURI(message))));
      var dataJson = JSON.stringify(data);
      window.parent.postMessage(encodeData(dataJson), "*");
    } catch (e) {
      alert("data encode error");
      sendErrorToNative(e);
    }
  };

  function updateToPartner(data) {
    try {
      if (data.event == "setPlatform") {
        platform = data.value.platform;
      }
      if (typeof partnerHandler[data.event] == "function") {
        partnerHandler[data.event](JSON.stringify(data.value));
      }
    } catch (e) {
      sendErrorToNative(e.toString());
    }
  }

  function sendErrorToNative(ex) {
    try {
      var tmpStr = ex.stack || ex.stacktrace || " ";
      if (this.isIOS()) {
        window.webkit.messageHandlers.sendDataError.postMessage(
          encodeData(tmpStr)
        );
      } else if (this.isAndroid()) {
        JSBridge.sendDataError(encodeData(tmpStr));
      }
    } catch (e) {}
  }

  function encodeData(str) {
    return window.btoa(encodeURI(str));
  }

  function decodeData(str) {
    return decodeURI(atob(decodeURI(str)));
  }

  this.isAndroid = function () {
    return platform == "Android" ? true : navigator.userAgent.match(/Android/i);
  };

  this.isIOS = function () {
    return platform == "IOS" ? true : navigator.userAgent.match(/iPhone|iPad/i);
  };

  this.isWeb = function () {
    return true;
  };
})();

1;
