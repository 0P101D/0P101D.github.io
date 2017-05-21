var page = new Array("home", "works", "comm", "guest", "credit");
var curr = 0;

function goto(n) {
  $("article#" + page[curr]).css('animation', 'goout 1s').css('opacity', 0).css('pointer-events', 'none');
  setTimeout(function() {
    $("article#" + page[n]).css('animation', 'goin 1s').css('opacity', 1).css('pointer-events', 'all');;
  }, 750);
  curr = n;
}

$(document).ready(function() {
  $('article#home').load('content/about.html');
  $('article#works').load('content/gallery.html');
  $('article#comm').load('content/commission.html');
  $('article#guest').load('content/guest.html')
  $('article#credit').load('content/credit.html');
});
