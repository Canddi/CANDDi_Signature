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
    signatureId = 1,
/* Boolean whether to remove the Gmail set signature */
    removeGmailSig = true,
/* jQuery clone of the Gmail signature */
    $gmailSigCopy;

/* Get the settings from localstorage */
chrome.storage.local.get(['signature', 'removeGmailSig'], function(val) {
  signature = val.signature;
  removeGmailSig = val.removeGmailSig;
  bodyChange();
});

/* Listen for changes in local storage */
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.signature) {
    signature = changes.signature.newValue;
    signatureId++;
    bodyChange();
  }
  if (changes.removeGmailSig) {
    removeGmailSig = changes.removeGmailSig.newValue;
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
  var $gmailSig = $editor.find('.gmail_signature');
  var $sig = $editor.find('#canddi-signature');

  /* If we don't have a clone of the composer window yet, make one.
     This is complex as some users may have the '--' disbaled, which changes
     the structure of .gmail_signature */
  /* TODO: There's probably a more effiecient way of doing this. */
  if (!$gmailSigCopy || $gmailSigCopy.length === 0) {
    if ($gmailSig.parent().hasClass('editable')) {
      /* In '--' mode */
      $gmailSig
          .add($gmailSig.prev('div'))
          .add($gmailSig.prev('br'));
      $gmailSigCopy = $gmailSig.clone();
    }
    else {
      /* '--' disabled mode */
      $gmailSigCopy = $gmailSig.parent().clone();
    }
  }

  if (removeGmailSig) {
    /* Remove the Gmail signature */
    $gmailSig.remove();
  }
  else if ($gmailSig.length === 0 && $sig.length > 0) {
    /* No Gmail signature but the is a CANDDi signature. Add Gmail before CANDDi */
    $sig.before($gmailSigCopy.clone());
  }
  else if ($gmailSig.length === 0) {
    /* No Gmail signature and no CANDDi signature */
    $editor.append($gmailSigCopy.clone());
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
    $editor.append('<div id="canddi-signature" data-canddi-sig-id="' + signatureId + '">' + signature + '</div>');
  }
  else {
    /* There is a signature, but ids differ. Change the signature to the new one */
    $sig.attr('data-canddi-sig-id', signatureId.toString());
    $sig.html(signature);
  }
};
