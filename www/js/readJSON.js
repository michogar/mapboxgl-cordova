var readJSON = function (url) {
  return new Promise(function (resolve, reject) {
    const xhr = new window.XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.onerror = function (e) {
      reject(e);
    };
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
        var data;
        try {
          data = JSON.parse(xhr.response);
        } catch (err) {
          reject(err);
        }
        resolve(data);
      } else {
        reject(new Error(xhr.statusText, xhr.status));
      }
    };
    xhr.send();
    return xhr;
  });
};
