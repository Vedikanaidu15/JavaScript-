// ---------------- EMAIL VALIDATION ----------------

function validateEmail() {

    let email = document.getElementById("emailInput").value.trim();

    let result = document.getElementById("emailResult");


    if (email === "") {

        result.innerText = "Please enter an email address.";

        result.style.color = "#dc2626";

        return;
    }


    // Regular Expression for email validation

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (emailPattern.test(email)) {

        result.innerText = "✓ Valid Email Address";

        result.style.color = "#16a34a";

    } else {

        result.innerText = "✗ Invalid Email Address";

        result.style.color = "#dc2626";
    }
}



// ---------------- TEXT ANALYSIS ----------------

function analyzeText() {

    let text = document.getElementById("textInput").value;


    if (text.trim() === "") {

        alert("Please enter some text.");

        return;
    }


    // Count characters

    let characters = text.length;


    // Count words using split()

    let words = text.trim().split(/\s+/).length;


    // Extract numbers using Regex

    let numbers = text.match(/\d+/g) || [];


    // Extract email addresses using Regex

    let emails = text.match(
        /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g
    ) || [];


    // Display results

    document.getElementById("characterCount").innerText =
        characters;


    document.getElementById("wordCount").innerText =
        words;


    document.getElementById("numberCount").innerText =
        numbers.length;


    document.getElementById("emailCount").innerText =
        emails.length;



    // ---------------- EXTRACTED DATA ----------------

    let output = "";


    if (emails.length > 0) {

        output += "<strong>📧 Emails Found</strong><br>";

        output += emails.join("<br>");

    } else {

        output += "<strong>📧 Emails Found:</strong> None";
    }


    output += "<br><br>";


    if (numbers.length > 0) {

        output += "<strong>🔢 Numbers Found</strong><br>";

        output += numbers.join(", ");

    } else {

        output += "<strong>🔢 Numbers Found:</strong> None";
    }


    document.getElementById("extractedData").innerHTML =
        output;
}



// ---------------- CLEAR ----------------

function clearAll() {

    document.getElementById("emailInput").value = "";

    document.getElementById("textInput").value = "";


    document.getElementById("emailResult").innerText =
        "Enter an email address to validate.";

    document.getElementById("emailResult").style.color =
        "#64748b";


    document.getElementById("characterCount").innerText = "0";

    document.getElementById("wordCount").innerText = "0";

    document.getElementById("numberCount").innerText = "0";

    document.getElementById("emailCount").innerText = "0";


    document.getElementById("extractedData").innerHTML =
        '<span class="empty-text">No data extracted yet.</span>';
}