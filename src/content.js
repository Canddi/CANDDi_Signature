/**
 * Content script added to Gmail
 *
 * @license    MIT
 * @copyright  2015 Campaign and Digital Intelligence
 * @author     Mark Hemmings
 **/

/* Composer dialog jQuery objects */
var $dialogs,
/* The HTML signature to add */
    signature,
/* A unique ID for the current signature. Everytime the signature changes, this gets incremented */
    signatureId = 1;

/* Get the settings from localstorage */
chrome.storage.local.get(['signature'], function(val) {
  signature = val.signature;
  bodyChange();
});

/* Listen for changes in local storage */
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.signature) {
    signature = changes.signature.newValue;
    signatureId++;
    bodyChange();
  }
});

/* Page ready */
$(function() {
  /* Look for mutations of the body. Fire bodyChange() after 200ms buffer */
  /* TODO: Find a better way to do this to the same stability without listening
     on the entire body */
  var bodyObserver = new MutationObserver(function () {
    $.doTimeout('bodyChange', 200, bodyChange);
  });
  bodyObserver.observe(document.body, {childList: true, subtree: true});
});

/* Initialise a check of all the composer dialogs */
var bodyChange = function () {
  $dialogs = $('.nH.Hd[role="dialog"]')
    .add('table.aoP.HM td.I5')
    .add('body.xE .M9 .aoI')
    .each(checkForNewDialogs);
};

/* Checks a dialog for signatures and sets any missing signatures */
var checkForNewDialogs = function () {
  var $editor = $(this).find('.Am.Al.editable');

  /* The composer dev isn't created yet, exit */
  if ($editor.length === 0) {
    return;
  }

  var $sig = $editor.find('#canddi-signature');

  $editor.find('.gmail_signature').remove();

  /* Only fallback to horrible CSS selector if we have to (when a draft email) */
  if ($sig.length === 0) {
    var $sigDel = $editor.find('div[title="canddi-signature"]').not('#canddi-signature');
    $sigDel.remove();
  }

  /* Signature has not been set by the user yet */
  if (signature === undefined) {
    return;
  }

  /* Check if signature is the same (has already been set) */
  if ($sig.length > 0 && $sig.attr('data-canddi-sig-id') === signatureId.toString()) {
    return;
  }
  else if ($sig.length === 0) {
    /* Else there is no signature. Apeend it to the composer */
    $editor.append('<div title="canddi-signature" id="canddi-signature" data-canddi-sig-id="' +
        signatureId + '">' + signature + '</div>');
  }
  else {
    /* There is a signature, but ids differ. Change the signature to the new one */
    $sig.attr('data-canddi-sig-id', signatureId.toString());
    $sig.html(signature);
  }
};
