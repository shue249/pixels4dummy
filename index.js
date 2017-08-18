function log(obj) {
  var str = JSON.stringify( obj );
  chrome.devtools.inspectedWindow.eval('console.log(' + str + ');');
}

function getCode() {
// function generateCode(eventName, contentType, contentIdsElement, valueElement, currencyElement, mode, buttonElement = 0) {
// var eventName = document.getElementById();

// generateCode();
  alert('a');
  log(JSON.stringify({a:5}));
}

function init() {
  document.getElementById('getcode').addEventListener('click', function() {getCode();});
  log('a');

}
document.addEventListener('DOMContentLoaded', init);

