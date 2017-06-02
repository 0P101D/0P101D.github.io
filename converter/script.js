/*document.createElement("element");
.appendChild(thing);
.setAttribute("attribute","value");
.getElementByID("ID").innerHTML = stuff;*/
var iframe, head, body, html, css, googlefont;
var $html;
var surrspace = ["\,", "\:", "\;", "\"", "'", ">"];
var invalid = ["accelerator", "azimuth", "background-position-x", "background-position-y", "behavior",
  "bottom", "clip", "content", "counter-increment", "counter-reset", "cue",
  "cue-after", "cue-before", "cursor", "display", "elevation", "filter",
  "font-size-adjust", "font-stretch", "ime-mode", "include-source",
  "layer-background-color", "layer-background-image", "layout-flow",
  "layout-grid", "layout-grid-char", "layout-grid-char-spacing",
  "layout-grid-line", "layout-grid-mode", "layout-grid-type", "left", "line-break",
  "marker-offset", "marks", "-moz-binding", "-moz-border-radius", "-moz-border-radius-topleft", "-moz-border-radius-topright", "-moz-border-radius-bottomright", "-moz-border-radius-bottomleft", "-moz-border-top-colors", "-moz-border-right-colors", "-moz-border-bottom-colors", "-moz-border-left-colors", "-moz-opacity", "-moz-outline", "-moz-outline-color", "-moz-outline-style", "-moz-outline-width", "-moz-user-focus", "-moz-user-input", "-moz-user-modify",
  "-moz-user-select", "orphans", "outline-width", "overflow-X", "overflow-Y",
  "page", "page-break-after", "page-break-before", "page-break-inside", "pause", "pause-after",
  "pause-before", "pitch", "pitch-range", "play-during", "position", "quotes", "-replace",
  "richness", "right", "ruby-align", "ruby-overhang", "ruby-position", "-set-link-source", "size",
  "speak", "speak-header", "speak-numeral", "speak-punctuation", "speech-rate", "stress",
  "scrollbar-arrow-color", "scrollbar-base-color", "scrollbar-dark-shadow-color", "scrollbar-face-color",
  "scrollbar-highlight-color", "scrollbar-shadow-color", "scrollbar-3d-light-color", "scrollbar-track-color", "text-align-last",
  "text-justify", "text-overflow", "text-autospace", "text-kashida-space",
  "text-underline-position", "top", "unicode-bidi", "-use-link-source",
  "visibility", "voice-family", "volume", "widows", "word-break", "word-wrap",
  "writing-mode", "z-index"];

$(document).ready(function() {
  var iframe = $('#result');
  $.ajax({
    url: "defhtml",
    dataType: "text",
    success: function(data) {
      $("#inputHTML").text(data);
    }
  });
  $.ajax({
    url: "defcss",
    dataType: "text",
    success: function(data) {
      $("#inputCSS").text(data);
    }
  });

  iframe.ready(function() {
    iframe.contents().html("<head></head><body></body>");
    body = iframe.contents().find("body");
    head = iframe.contents().find("head");

    update();
  });
});


function update() {
  html = $('#inputHTML').val();
  css = $('#inputCSS').val();
  googlefont = $('#googlefont').val();

  head.html("<style>" + css + "</style>");
  head.append('<link href="https:\/\/fonts.googleapis.com/css?family=' + googlefont + '" rel="stylesheet">');
  body.html(html);


  var final = convHTML() + "[div style='height:0;overflow:hidden;']" + ((googlefont != "") ? "[googlefont=\"" + googlefont + "\"]" : "") + convCSS() + "[/div]";
  $("#output").html(final);
}

function convHTML() {
  var temp = $('<output>').append($.parseHTML(html));

  temp.find("*").each(function(i, ele) {
    var objclass = $(ele).attr('class');
    if (objclass != undefined) {
      $(ele).removeClass();
      $(ele).html('[attr="class", "' + objclass + '"]' + $(ele).html());
    }
  });

  var result = "\r\n" + temp.html();

  result = result.replace(/((?:\r\n|\r|\n)\s+)/g, '\r\n');
  result = result.replace(/class=""/g, "");
  result = result.replace("  ", " ");

  for (var i = 0, len = surrspace.length; i < len; i++) {
    var before = new RegExp("\\s" + surrspace[i], "g");
    var after = new RegExp(surrspace[i] + "\\s", "g");

    result = result.replace(before, surrspace[i]).replace(after, surrspace[i]);
  }

  var inv = "";

  for (var i = 0, len = invalid.length; i < len; i++) {
    if (result.indexOf(invalid[i] + ":") != -1) {
      inv += "[" + invalid[i] + "] ";
      console.log(i);
    }
  }

  console.log(inv);

  result = result.replace(/</g, "[").replace(/>/g, "]").replace(/(?:\r\n|\r|\n)/g, "");
  result = result.replace(/(\](?!\[)(?!(b|i|em|u|a|strong|\s|\.|\,|\;|\w)))/g, "]\r\n\r\n");
  result = result.replace(/(\[br\])|(\[br \])|(\[br\])/g, "\r\n").slice(0, -4);

  if (inv.length > 0) {
    $("#warn").html("<b>WARNING:</b> possible invalid classes<br>");
    $("#warn").append(inv);
  }
  return result;
}

function convCSS() {
  var input = "\r\n" + css;
  input = input.replace(/((?:\r\n|\r|\n)\s+)/g, '\r\n');
  input = input.replace(/;\s+/g, ";").replace(/;(?:\r\n|\r|\n)/g, ";");
  input = input.replace(/{\s+/g, "{").replace(/{(?:\r\n|\r|\n)/g, "{");
  input = input.replace(/\,(?:\r\n|\r|\n)/g, ",");
  input = input.replace(/{\s+/g, "{");
  input = input.replace(/}(?:\r\n|\r|\n)/g, "}\r\n") + "\r\n";
  input = input.replace(/}(?:\r\n|\r|\n)@/g, "} @");
  input = input.replace(/(?:\r\n|\r|\n)(\.)/g, "\r\n[newclass=\"").replace(/}(?:\r\n|\r|\n)/g, "[/newclass]\r\n");

  var lines = input.split(/(?:\r\n|\r|\n)/g);
  var result = "";
  $.each(lines, function(n, elem) {
    var str = elem;
    str = str.toString().replace("{", "\"]");
    result += str;
  });
  for (var i = 0, len = surrspace.length; i < len; i++) {
    var before = new RegExp("\\s+" + surrspace[i], "g");
    var after = new RegExp(surrspace[i] + "\\s+", "g");

    result = result.replace(before, surrspace[i]).replace(after, surrspace[i]);
  }

  result = result.replace(/\[\/newclass\]/g, "[/newclass]\r\n")
  return result;
}
