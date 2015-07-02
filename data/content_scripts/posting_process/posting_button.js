/**
 * @fileOverview Displays the Privly "New Message" button on clicking a
 * content editable DOM element.
 */
/**
 * Shows a button in editable content areas for starting a Privly Post.
 */
function addPrivlyButton() {

  // Create a div to handle the privly button
  var div = document.createElement("div");

  div.style.position = "absolute";
  div.style.opacity = "0";
  div.title = "New Privly message";

  // The button is represented by this span element
  var span = document.createElement("span");

  span.style.background = "url(https://raw.githubusercontent.com/privly/privly-jetpack/master/data/skin/logo_16.png) no-repeat";
  span.style.width = "16px";
  span.style.height = "16px";
  span.style.display = "block";
  div.appendChild(span);

  var active, hovered, timeout;
  var targetNodeId, parentOffsets, offsets, rightMargin, topMargin;

  var timeoutLength = 5000;

  // Function that makes the button fade out
  function fadeOut() {
    div.style.transition = "opacity 0.3s ease-out";
    div.style.opacity = "0";
    active = false;

    // To allow the transition to happen, set the zIndex with a delay
    setTimeout(function() {div.style.zIndex = "-1";}, 200);
  }

  // Use JavaScript event delegation functionality to attach a click event to
  // every textarea and editable div on page
  document.body.addEventListener( "click", function(evt) {
    if(evt.target &&
      (evt.target.nodeName === "TEXTAREA" || evt.target.isContentEditable)) {

      // The button can now be click-able
      span.style.cursor = "pointer";

      if (evt.target.id === "") {
        evt.target.id = "privly" + Math.random().toString(36).substring(2);
      }
      targetNodeId = evt.target.id.slice(0);

      active = true;
      div.style.zIndex = "999";
      div.style.opacity = "0";

      // The button div is appended as the last child of the body element
      document.body.style.position = "relative";
      document.body.appendChild(div);

      // The body element will act now as the parent
      // Not a perfect positioning of the button, especially in G+
      parentOffsets = document.body.getBoundingClientRect();
      offsets = evt.target.getBoundingClientRect();

      topMargin = offsets.top - parentOffsets.top;
      rightMargin = parentOffsets.right - offsets.right;

      // Check if the height of the form is bigger then 21
      // 21px = 16px (logo) + 5px (desired margin)
      if(offsets.bottom - offsets.top > 21) {
        // If there is already a top margin bigger then 5px
        if(topMargin > 5) {
          div.style.top = (topMargin + 2) + "px";
        } else {
          div.style.top = (topMargin + 5) + "px";
        }
      } else {
        if(topMargin <= 5) {
          topMargin = topMargin + 2;
        }
        div.style.top = topMargin + "px";
      }

      div.style.right = (rightMargin + 3) + "px";

      div.style.transition = "opacity 0.3s ease-in";
      div.style.opacity = "0.7";

      // Make the button fade out after 3s
      if(!hovered) {
        clearTimeout(timeout);
        timeout = setTimeout(fadeOut, timeoutLength);
      }
    }
  });

  // The button will not disappear while it is hovered
  span.addEventListener("mouseover", function(){
    hovered = true;
    div.style.opacity = "1";
    clearTimeout(timeout);
  });

  span.addEventListener("mouseout", function(){
    hovered = false;
    div.style.opacity = "0.7";
    timeout = setTimeout(fadeOut, timeoutLength);
  });

  // Clicking the button will send a message to posting_process.js to create new
  // Privly message using Message application
  span.addEventListener("click", function() {
    // Check if the button has been triggered i.e. the opacity is 0.7
    if (active && (getComputedStyle(div).getPropertyValue("opacity") > 0)) {
      var info = {
        nodeId: targetNodeId,
        text: "",
        pageURL: window.location.href,
      };
      self.port.emit("PrivlyButtonClicked", info);
    }
  });
}

// Check if the posting button has been enabled?
// i.e, if the disable option is unchecked.
self.port.emit("showPrivlyBtn?", "Check for button status");
self.port.on("privlyBtnStatus", function(message) {
  if (message === "unchecked") {
    addPrivlyButton();
  }
});
