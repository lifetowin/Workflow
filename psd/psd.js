var PSD = require('psd');

PSD.open('./!final.psd').then(function (psd) {
  return psd.image.saveAsPng('psd.png');
}).then(function () {
  console.log('Finished!');
});