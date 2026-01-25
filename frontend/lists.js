// DOM elements
const listContainer = document.getElementById("list-container");
const sortBtn = document.getElementById("sort-btn");
const createBtn = document.getElementById("create-list-btn");
const sortModal = document.getElementById("sort-modal");
const closeSortModal = document.getElementById("close-sort-modal");
const settingsBtn = document.getElementById("settings-btn");
const settingsModal = document.getElementById("settings-modal");
const closeSettingsModal = document.getElementById("close-settings-modal");

// Load saved lists and combine defaults
let savedLists = JSON.parse(localStorage.getItem("packingLists") || "[]");
const defaultLists = ["Vacation","Business","Road Trip","Camping","Cruise","Conference","Tailgate","Italy","France","Disneyland","Switzerland","Japan"];
let allLists = Array.from(new Set([...savedLists.map(l => l.name || l), ...defaultLists]));

// Render lists
function renderLists() {
    listContainer.innerHTML = "";   // Clear
    allLists.forEach(list => {
        const div = document.createElement("div");
        div.className = "packing-list"; // List entry
        div.textContent = list;
        listContainer.appendChild(div);
    });
}

renderLists();  // Initial render

// Click a list to view
listContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("packing-list")) {
        const name = encodeURIComponent(e.target.textContent);
        window.location.href = `list-view.html?list=${name}`;
    }
});

// Create list button
createBtn.addEventListener("click", () => window.location.href = "create-list.html");

// Sort modal logic
sortBtn.addEventListener("click", () => sortModal.classList.remove("hidden"));
closeSortModal.addEventListener("click", () => sortModal.classList.add("hidden"));
sortModal.addEventListener("click", (e) => {
    if (e.target === sortModal) return sortModal.classList.add("hidden");
    const sortType = e.target.dataset.sort; // Get sort type
    if (!sortType) return;
    allLists.sort((a, b) => sortType === "az" ? a.localeCompare(b) : b.localeCompare(a)); // Sort
    renderLists(); // Update view
    sortModal.classList.add("hidden");  // Close Modal
});

// Settings modal logic
settingsBtn.addEventListener("click", () => settingsModal.classList.remove("hidden"));
closeSettingsModal.addEventListener("click", () => settingsModal.classList.add("hidden"));
settingsModal.addEventListener("click", (e) => { if (e.target === settingsModal) settingsModal.classList.add("hidden"); });