var debounce = require('lodash.debounce');
let needLoadingRequestCount = 0;

export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    // endLoading()
    debounce(tryCloseLoading, 300)()
  }
}
var layerIndex;
function startLoading() {
  layerIndex = layer.load(1, {
    shade: [0.5,'#fff']
  });
}

function endLoading() {
  layer.close(layerIndex)
}
const tryCloseLoading = () => {
  if (needLoadingRequestCount === 0) {
    endLoading();
  }
}
