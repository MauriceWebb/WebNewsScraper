// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  data.forEach( article => {
    if (!article.excerpt) {
      return;
    } else {
      $("#articles").append(`
        <div class="mb-3 p-3 border rounded border-dark bg-secondary article">
          <h3 class="font-weight-bold text-warning" data-id=${article._id}>${article.title}</h3>
          <p class="text-light">${article.excerpt}</p>
          <a href=${article.link} class="btn btn-dark text-light" target="_blank">Read more</a>
        </div>
      `);
    }
  });



    // // Display the apropos information on the page
    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br />" + data[i].excerpt +"</p>");
  
});


// Whenever someone clicks a p tag
$(document).on("click", ".article", function(e) {
  $("#notes").empty();
  e.preventDefault();
  // Empty the notes from the note section
  // $("#notes").empty();
  // Save the id from the p tag
  let thisId = $(this).children('h3').attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);

      $('#notes').append(`
        <div class="mb-2 p-3 border rounded border-dark bg-secondary">
          <h2 class="font-weight-bold text-center text-warning">${data.title}</h2>
          <hr class="w-50 text-center"/>
          <input id="titleinput" name="title" class="p-2 mb-2 col-12 text-light bg-dark border-0 border-dark rounded" placeholder="Title">
          <textarea id="bodyinput" name="body" class="p-2 mb-2 col-12 text-light bg-dark border-0 border-dark rounded" placeholder="Something noteable"></textarea>
          <a data-id="${data._id}" id="savenote" class="btn btn-dark text-light">Save Note</a>
        </div>
      `);

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  let thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
