/**
 * @fileOverview Script used to post the privly URL into the Host page target node.
 */
function dispatchClickEvent(target) {
  var evt = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: document.defaultView,
  });
  target.dispatchEvent(evt);
}

self.port.on("postURL", function(message) {
  // Check whether the privly URl is intended for the current location.
  if (message.pageURL === window.location.href) {
    // Target DOM node.
    var node = document.getElementById(message.nodeId);
    // Status: complete or error
    // Determines if the Privly Application Tab needs to be closed.
    var postStatus;
    if (node !== null) {
      node.focus();
      // Click the form to trigger any click callbacks
      dispatchClickEvent(node);
      setTimeout(function() {
        bililiteRange(node).bounds('selection').sendkeys(message.privlyURL).select();
        self.port.emit("removeScript", "Delete worker!");
      }, 100);
      postStatus = "complete";      
    } else {
      // DOM element not found.
      postStatus = "error";
    }
    self.port.emit("postStatus", postStatus);
  }
});
