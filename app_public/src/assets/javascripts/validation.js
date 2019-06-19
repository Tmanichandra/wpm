// jQuery form validation for Add New Review form data

// listen for a submit action on an element with id="addReview"
$("#addReview").submit(function(e) {
  // and .hide() the Bootstrap alert (in case it is showing)
  $(".alert.alert-danger").hide();
  // and if no values on <input id="name">, <select id="rating", OR <textarea id="review">
  if (!$("input#name").val() || !$("select#rating").val() || !$("textarea#review").val()) {
    // AND if the Bootstrap alert has a (string) .length (ie, a message)
    if ($(".alert.alert-danger").length) {
      // then show the Bootstrap alert box with it's alert message
      $(".alert.alert-danger").show();
    } else {
      // otherwise (if there's no-value field, but also no .length to alert message), then
      // add a div to the page with the Bootstrap alert message
      $(this).prepend('<div role="alert" class="alert-danger">All fields required, please try again</div>');
    }
    // and return false (to cancel the POST action?)
    return false;
  }
});
