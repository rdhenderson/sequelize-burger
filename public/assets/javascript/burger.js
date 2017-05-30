$(document).ready(function() {
  // Getting a reference to the input field where user adds a new Burger
  var newItemInput = $("input.new-item");
  // Our new Burgers will go inside the burgerContainer
  var burgerContainer = $(".burger-container");
  // Adding event listeners for deleting, editing, and adding burgers
  $(document).on("click", "button.delete", devourBurger);
  $(document).on("click", ".burger-item", editBurger);
  $(document).on("keyup", ".burger-item", finishEdit);
  $(document).on("blur", ".burger-item", cancelEdit);
  $(document).on("submit", "#burger-form", insertBurger);

  // Our initial burgers array
  var burgers;

  //Initialize Burger Template
  var burgerTemplateScript = $("#burger-template").html();
  var burgerTemplate = Handlebars.compile(burgerTemplateScript);

  // Initial load of burgers array from database when page loads
  getBurgers();

  // This function resets the burgers displayed with updated burgers from the database
  function initializeRows() {
    burgerContainer.empty();
    var burgerRows = burgerTemplate({burgers:burgers});
    burgerContainer.append(burgerRows);
  }

  // This function grabs burgers from the database and updates the view
  function getBurgers() {
    $.get("/api/burger", function(data) {
      burgers = data;
      initializeRows();
    });
  }

  // This function deletes a burger when the user clicks the delete button
  function devourBurger() {
    var id = $(this).data("id");

    $.ajax({
      method: "DELETE",
      url: "/api/burger/" + id
    })
    .done(function() {
      getBurgers();
    });
  }



  // This function handles showing the input box for a user to edit a burger
  function editBurger() {
    var id = $(this).data("id");
    var text = $("#span-"+id).text();
    $(this)
      .children()
      .hide();
    $(this)
      .children("input.edit")
      .val(text);
    $(this)
      .children("input.edit")
      .show();
    $(this)
      .children("input.edit")
      .focus();
  }

  // This function starts updating a burger in the database if a user hits the
  // "Enter Key" While in edit mode
  function finishEdit(event) {
    var updatedBurger;
    if (event.key === "Enter") {
      updatedBurger = {
        id: $(this).data("id"),
        burger_name: $(this)
          .children("input")
          .val()
          .trim()
      };
      $(this).blur();
      updateBurger(updatedBurger);
    }
  }

  // This function updates a burger in our database
  function updateBurger(burger) {
    $.ajax({
      method: "PUT",
      url: "/api/burger",
      data: burger
    })
    .done(() => getBurgers());
  }

  // This function is called whenever a burger item is in edit mode and loses focus
  // This cancels any edits being made
  function cancelEdit() {
    var id = $(this).data("id");
    var text = $("#span-"+id).text();

    $(this)
      .children()
      .hide();
    $(this)
      .children("input.edit")
      .val(text);
    $(this)
      .children("span")
      .show();
    $(this)
      .children("button")
      .show();
  }

  // This function inserts a new burger into our database and then updates the view
  function insertBurger(event) {
    event.preventDefault();
    if (!newItemInput.val().trim()) {   return; }
    var burger = {
      burger_name : newItemInput
        .val()
        .trim(),
      devoured: false
    };

    // Posting the new burger, calling getBurgers when done
    $.post("/api/burger", burger, function() {
      getBurgers();
    });
    newItemInput.val("");
  }

});
