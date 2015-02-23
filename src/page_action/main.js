/* Document ready */
document.addEventListener("DOMContentLoaded", function(event) {
  /* On signature change, commit the value to localstorage */
  var sig = document.getElementById('signature');
  sig.addEventListener('input', function() {
    chrome.storage.local.set({signature: sig.value});
  }, false);

  /* On removeGmailSig change, commit the value to local storage */
  var removeGmailSig = document.getElementById('remove-gmail-sig');
  removeGmailSig.addEventListener('change', function() {
    var on = false;
    if (removeGmailSig.checked) {
      on = true;
    }
    chrome.storage.local.set({removeGmailSig: on});
  }, false);

  /* Get the current values from localstorage and set up view */
  chrome.storage.local.get(['signature', 'removeGmailSig'], function(val) {
    var sigVal = val.signature;
    sig.value = sigVal !== undefined ? sigVal : '';
    removeGmailSig.checked = val.removeGmailSig;
    bodyChange();
  });
});
