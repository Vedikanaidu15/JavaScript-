
const API_URL = "https://jsonplaceholder.typicode.com/users";

const fetchBtn = document.getElementById("fetchBtn");
const jqueryBtn = document.getElementById("jqueryBtn");
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");

const totalRecords = document.getElementById("totalRecords");
const filteredRecords = document.getElementById("filteredRecords");
const dataStatus = document.getElementById("dataStatus");
const statusMessage = document.getElementById("statusMessage");
const resultLabel = document.getElementById("resultLabel");
const methodLabel = document.getElementById("methodLabel");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

let allUsers = [];

// Load data using the JavaScript fetch() API
async function loadWithFetch() {
    setLoading(true);

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const users = await response.json();

        displayUsers(users);
        methodLabel.textContent = "Method: JavaScript fetch()";
    } catch (error) {
        showError(error);
    } finally {
        setLoading(false);
    }
}

// Load data using jQuery $.getJSON()
function loadWithJQuery() {
    setLoading(true);

    $.getJSON(API_URL)
        .done(function (users) {
            displayUsers(users);
            methodLabel.textContent = "Method: jQuery $.getJSON()";
        })
        .fail(function (xhr, status, error) {
            showError(new Error(error || status || "Request failed"));
        })
        .always(function () {
            setLoading(false);
        });
}

// Render the JSON records dynamically
function displayUsers(users) {
    if (!Array.isArray(users)) {
        showError(new Error("The API returned invalid JSON data."));
        return;
    }

    allUsers = users;
    dataStatus.textContent = "Loaded";
    statusMessage.textContent = "Data retrieved successfully";

    errorMessage.classList.add("hidden");

    renderTable();
}

// Create table rows safely using DOM elements
function renderTable() {
    const query = searchInput.value.trim().toLowerCase();

    const filteredUsers = allUsers.filter(function (user) {
        const searchableText = [
            user.name,
            user.username,
            user.email,
            user.address?.city
        ].join(" ").toLowerCase();

        return searchableText.includes(query);
    });

    // Remove previous rows
    tableBody.replaceChildren();

    // Update statistics
    totalRecords.textContent = allUsers.length;
    filteredRecords.textContent = filteredUsers.length;

    resultLabel.textContent =
        `Showing ${filteredUsers.length} of ${allUsers.length} records`;

    // Display an empty state if no results match
    if (filteredUsers.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 6;
        cell.className = "empty-state";

        const title = document.createElement("strong");
        title.textContent = allUsers.length
            ? "No matching records found"
            : "No data available";

        const message = document.createElement("p");
        message.textContent = allUsers.length
            ? "Try another search term."
            : "Load data using either method above.";

        cell.append(title, message);
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    // Create one row for each JSON object
    filteredUsers.forEach(function (user) {
        const row = document.createElement("tr");

        const values = [
            user.id,
            user.name,
            user.username,
            user.email,
            user.address?.city || "N/A"
        ];

        values.forEach(function (value, index) {
            const cell = document.createElement("td");

            // Use textContent to prevent HTML injection
            cell.textContent = value ?? "N/A";

            if (index === 0) cell.className = "id-cell";
            if (index === 1) cell.className = "name-cell";
            if (index === 3) cell.className = "email-cell";
            if (index === 4) cell.className = "city-cell";

            row.appendChild(cell);
        });

        // Add a status badge
        const statusCell = document.createElement("td");
        const badge = document.createElement("span");

        badge.className = "status-pill";
        badge.textContent = "Active";

        statusCell.appendChild(badge);
        row.appendChild(statusCell);

        tableBody.appendChild(row);
    });
}

// Show and hide loading indicators
function setLoading(isLoading) {
    loading.classList.toggle("hidden", !isLoading);
    errorMessage.classList.add("hidden");

    fetchBtn.disabled = isLoading;
    jqueryBtn.disabled = isLoading;

    if (isLoading) {
        dataStatus.textContent = "Loading";
        statusMessage.textContent = "Please wait...";
        tableBody.replaceChildren();

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 6;
        cell.className = "empty-state";
        cell.textContent = "Retrieving data from the API...";
        row.appendChild(cell);
        tableBody.appendChild(row);
    } else if (allUsers.length === 0 &&
               dataStatus.textContent === "Loading") {
        dataStatus.textContent = "Ready";
        statusMessage.textContent = "Waiting to load data";
    }
}

// Display an API error
function showError(error) {
    dataStatus.textContent = "Error";
    statusMessage.textContent = "Unable to retrieve data";

    errorMessage.textContent =
        `Could not load JSON data. ${error.message}. ` +
        "Check your internet connection and try again.";

    errorMessage.classList.remove("hidden");
    resultLabel.textContent = "Request failed";

    tableBody.replaceChildren();

    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 6;
    cell.className = "empty-state";
    cell.textContent = "Data could not be loaded. Please try again.";

    row.appendChild(cell);
    tableBody.appendChild(row);
}

// Button events
fetchBtn.addEventListener("click", loadWithFetch);
jqueryBtn.addEventListener("click", loadWithJQuery);

// Live search
searchInput.addEventListener("input", renderTable);

// Load sample data automatically when the page opens
loadWithFetch();
