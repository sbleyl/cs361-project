// DOM elements
const submitBtn = document.getElementById("submit-list-btn");
const listNameInput = document.querySelector("input[type='text']");
const listTypeSelect = document.querySelector("select");
const expirationInput = document.querySelector("input[type='date']");

// Submit list to microservice
submitBtn.addEventListener("click", async () => {
    const name = listNameInput.value.trim();

    // If list name is empty
    if (!name) { alert("Please enter a list name."); return; }

    // Create list via microservice
    await fetch('/lists-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ list_name: name })
    });

    // Redirect back
    window.location.href = "lists.html";
});