function getCode() {
// function generateCode(eventName, contentType, contentIdsElement, valueElement, currencyElement, mode, buttonElement = 0) {
// var eventName = document.getElementById();

// generateCode();
}

function init() {
  function log(obj) {
    var str = JSON.stringify( obj );
    chrome.devtools.inspectedWindow.eval('console.log(' + str + ');');
  }
  $('#getcode').on('click') = getCode;

  log("hi");
  log({a:4});
}
document.addEventListener('DOMContentLoaded', init);

