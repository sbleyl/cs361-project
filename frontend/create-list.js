// DOM elements
const submitBtn = document.getElementById("submit-list-btn");
const listNameInput = document.querySelector("input[type='text']");
const listTypeSelect = document.querySelector("select");
const expirationInput = document.querySelector("input[type='date']");

// Load existing lists. Create empty array if empty
const lists = JSON.parse(localStorage.getItem("packingLists") || "[]");

// Submit list
submitBtn.addEventListener("click", () => {
    const name = listNameInput.value.trim();
    const type = listTypeSelect.value;
    const expiration = expirationInput.value;

    // If list name is empty
    if (!name) {
        alert("Please enter a list name.");
        return;
    }

    // Add new list object
    const newList = { name, type, expiration };
    lists.push(newList);

    localStorage.setItem("packingLists", JSON.stringify(lists));

    // Redirect back
    window.location.href = "lists.html";
});