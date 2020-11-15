export function isImage(file) {
  return /^image/.test(file.type);
};

export function getImageSize(file) {
  return new Promise(function(resolve, reject) {
      var image = document.createElement('img');
      image.src = URL.createObjectURL(file);
      image.onerror = function(err) {
          clearInterval(intervalId);
          reject(err);
      };
      var intervalId = setInterval(function() {
          if (image.naturalWidth && image.naturalHeight) {
              clearInterval(intervalId);
              URL.revokeObjectURL(image.src);
              resolve({
                  width: image.naturalWidth,
                  height: image.naturalHeight
              });
          }
      }, 1);
  });
};