// DOM elements
const params = new URLSearchParams(window.location.search);
const listName = params.get("list") || "Trip Name";

const tripTitle = document.getElementById("trip-title");
const backBtn = document.getElementById("back-btn");
const addItemsBtn = document.getElementById("add-items-btn");

const modal = document.getElementById("exit-modal");
const closeModal = document.getElementById("close-modal");
const modalNo = document.getElementById("modal-no");
const modalYes = document.getElementById("modal-yes");

const unpackedBtn = document.getElementById("unpacked-btn");
const packedBtn = document.getElementById("packed-btn");
const itemContainer = document.getElementById("item-list-container");
const weatherForecast = document.getElementById("weather-forecast");

tripTitle.textContent = listName;   // Set page title to trip name

let showPacked = false; // Track if showng pack or unpacked items
let currentUnit = 'f'; // Track temperature unit
let currentTemp = null; // Store original temp for conversion
let forecastData = null; // Store forecast data for unit conversion

// Modal Logic
backBtn.addEventListener("click", () => modal.classList.remove("hidden"));
closeModal.addEventListener("click", () => modal.classList.add("hidden"));
modalNo.addEventListener("click", () => modal.classList.add("hidden"));
modalYes.addEventListener("click", () => window.location.href = "lists.html");
modal.addEventListener("click", e => { if(e.target === modal) modal.classList.add("hidden"); });

// Navigate to Add Items page
addItemsBtn.addEventListener("click", () => {
    window.location.href = `add-items.html?list=${encodeURIComponent(listName)}`;
});

// Toggle unpacked/packed view
unpackedBtn.addEventListener("click", () => { showPacked = false; updateToggleStyles(); renderItems(); });
packedBtn.addEventListener("click", () => { showPacked = true; updateToggleStyles(); renderItems(); });

function updateToggleStyles() {
    unpackedBtn.classList.toggle("selected", !showPacked);  // Highlight selected toggle
    packedBtn.classList.toggle("selected", showPacked);
}

// Map item names to their types
const typeMap = {
    "Hat": "Clothing", "T-Shirt": "Clothing", "Jeans": "Clothing",
    "Sandals": "Clothing", "Socks": "Clothing",
    "Laptop": "Electronics", "Phone": "Electronics", "Headphones": "Electronics",
    "Charger": "Electronics", "Power Bank": "Electronics",
    "Passport": "Documents", "Tickets": "Documents",
    "Toothbrush": "Toiletries", "Soap": "Toiletries",
    "Medication": "Medical"
};

// Render forecast with current unit
async function renderForecast() {
    if (!forecastData) return;
    weatherForecast.innerHTML = "";
    const daily = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));

    for (const day of daily) {
        const date = new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.gap = "8px";
        div.style.padding = "0.25em 0";

        const icon = document.createElement("img");
        icon.src = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
        icon.style.width = "30px";
        icon.style.height = "30px";

        let temp = day.main.temp;
        if (currentUnit === 'c') {
            const res = await fetch('/converter-data/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ value: temp, from: 'f', to: 'c' })
            });
            const converted = await res.json();
            temp = converted.result;
        }

        const text = document.createElement("span");
        text.textContent = `${date}: ${Math.round(temp)}°${currentUnit.toUpperCase()}, ${day.weather[0].description}`;

        div.appendChild(icon);
        div.appendChild(text);
        weatherForecast.appendChild(div);
    }
}

// Fetch and display weather for destination
async function loadWeather(destination) {
    const weatherSummary = document.getElementById("weather-summary");
    const weatherCurrent = document.getElementById("weather-current");

    const res = await fetch(`/weather-data/${encodeURIComponent(destination)}`);
    const data = await res.json();

    if (data.error) {
        weatherSummary.textContent = "Weather unavailable for this destination.";
        weatherCurrent.classList.remove("hidden");
        return;
    }

    currentTemp = data.main.temp;
    currentUnit = 'f';
    document.getElementById("unit-toggle-btn").classList.remove("hidden");
    document.getElementById("unit-toggle-btn").textContent = "°C";

// Show weather label, icon, and summary after a successful search 
document.getElementById('weather-label').classList.remove('hidden');
document.getElementById('weather-icon').classList.remove('hidden');
document.getElementById('weather-summary').classList.remove('hidden');

    weatherSummary.textContent = `${data.name}: ${Math.round(data.main.temp)}°F, ${data.weather[0].description}`;

    // Show weather icon after search
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.classList.remove('hidden');

    weatherCurrent.classList.remove("hidden");
    weatherForecast.classList.add("hidden");

    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherCurrent.classList.remove("hidden");
    weatherForecast.classList.add("hidden");

    // Toggle forecast on click
    weatherSummary.onclick = async () => {
        if (!weatherForecast.classList.contains("hidden")) {
            weatherForecast.classList.add("hidden");
            return;
        }

        const forecastRes = await fetch(`/weather-data/forecast/${encodeURIComponent(destination)}`);
        forecastData = await forecastRes.json();

        await renderForecast();
        weatherForecast.classList.remove("hidden");
    };
}

// Weather search button
document.getElementById("weather-search-btn").addEventListener("click", () => {
    const destination = document.getElementById("weather-input").value.trim();
    if (!destination) return;
    loadWeather(destination);
});

// Unit toggle button
document.getElementById("unit-toggle-btn").addEventListener("click", async () => {
    const toggleBtn = document.getElementById("unit-toggle-btn");
    const weatherSummary = document.getElementById("weather-summary");

    const from = currentUnit;
    const to = currentUnit === 'f' ? 'c' : 'f';

    const res = await fetch('/converter-data/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: currentTemp, from, to })
    });
    const data = await res.json();

    currentTemp = data.result;
    currentUnit = to;
    toggleBtn.textContent = currentUnit === 'f' ? '°C' : '°F';
    weatherSummary.textContent = `${weatherSummary.textContent.split(':')[0]}: ${Math.round(currentTemp)}°${currentUnit.toUpperCase()}, ${weatherSummary.textContent.split(',')[1]}`;

    await renderForecast();
});

// Fetch list from microservice
let currentList = null;
async function loadCurrentList() {
    const res = await fetch('/lists-data');
    const allLists = await res.json();

    currentList = allLists.lists.find(l => l.list_name === listName);
    if (!currentList) {
        const defaultItems = [  // If not found, create default items locally
            { item_name: "Hat", type: "Clothing", packed: false },
            { item_name: "T-Shirt", type: "Clothing", packed: false },
            { item_name: "Jeans", type: "Clothing", packed: false },
            { item_name: "Sandals", type: "Clothing", packed: false },
            { item_name: "Socks", type: "Clothing", packed: false },
            { item_name: "Laptop", type: "Electronics", packed: false },
            { item_name: "Phone", type: "Electronics", packed: false },
            { item_name: "Headphones", type: "Electronics", packed: false },
            { item_name: "Charger", type: "Electronics", packed: false },
            { item_name: "Power Bank", type: "Electronics", packed: false },
            { item_name: "Passport", type: "Documents", packed: false },
            { item_name: "Tickets", type: "Documents", packed: false },
            { item_name: "Toothbrush", type: "Toiletries", packed: false },
            { item_name: "Soap", type: "Toiletries", packed: false },
            { item_name: "Medication", type: "Medical", packed: false }
        ];
        currentList = { list_name: listName, items: defaultItems };
    }

    renderItems();
}

// Render items in list
function renderItems() {
    itemContainer.innerHTML = "";   // Clear current list

    if (!currentList || !currentList.items) return;

    const itemsToShow = currentList.items.filter(i => i.completed === showPacked);
    const types = [...new Set(itemsToShow.map(i => i.type || typeMap[i.item_name] || "Other"))];

    types.forEach(type => {
        const categoryDiv = document.createElement("div");
        categoryDiv.className = "category";
        categoryDiv.textContent = type;
        itemContainer.appendChild(categoryDiv);

        itemsToShow.filter(i => (i.type || typeMap[i.item_name] || "Other") === type).forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "item";
            itemDiv.textContent = item.item_name;

            // Show packed if needed
            if (!showPacked && item.completed) itemDiv.classList.add("checked");

            // Delete button for item
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "🗑︎";
            deleteBtn.className = "delete-item";
            deleteBtn.style.marginLeft = "10px";
            itemDiv.appendChild(deleteBtn);

            itemContainer.appendChild(itemDiv);
        });
    });
}

// Toggle unpacked/packed
itemContainer.addEventListener("click", async e => {
    if (e.target.classList.contains("delete-item")) {   // Delete item
        const itemDiv = e.target.parentElement;
        const itemName = itemDiv.textContent.replace("🗑︎", "").trim();
        const item = currentList.items.find(i => i.item_name === itemName);
        if (!item) return;

        const listId = currentList.id;
        await fetch(`/lists-data/${listId}/items/${item.id}`, { method: 'DELETE' });

        // Remove item locally and re-render
        currentList.items = currentList.items.filter(i => i.id !== item.id);
        renderItems();
        return;
    }

    // Toggle packed state
    if (!e.target.classList.contains("item")) return;
    const itemName = e.target.textContent.replace("🗑︎", "").trim();
    const item = currentList.items.find(i => i.item_name === itemName);
    if (!item) return;

    // Update local state
    const listId = currentList.id;
    await fetch(`/lists-data/${listId}/items/${item.id}`, { method: 'PUT' });
    item.completed = !item.completed;

    // Re-render
    renderItems();
});

// Initial render
updateToggleStyles();
loadCurrentList();