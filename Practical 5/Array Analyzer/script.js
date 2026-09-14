/* =========================
        ARRAY ANALYZER
========================= */

function analyzeArray() {

    let input =
        document.getElementById("numbers").value;


    /* CHECK INPUT */

    if (input.trim() === "") {

        alert("Please enter some numbers.");

        return;

    }


    /* CONVERT INPUT INTO ARRAY */

    let numbers = input
        .split(",")
        .map(Number);


    /* CHECK FOR INVALID VALUES */

    if (numbers.some(isNaN)) {

        alert("Please enter valid numerical values.");

        return;

    }


    /* FIND MAXIMUM AND MINIMUM */

    let maximum = numbers[0];

    let minimum = numbers[0];


    for (let i = 1; i < numbers.length; i++) {

        if (numbers[i] > maximum) {

            maximum = numbers[i];

        }


        if (numbers[i] < minimum) {

            minimum = numbers[i];

        }

    }


    /* DISPLAY ARRAY */

    document.getElementById("arrayDisplay").innerText =
        "[ " + numbers.join(", ") + " ]";


    /* DISPLAY RESULTS */

    document.getElementById("maximum").innerText =
        maximum;


    document.getElementById("minimum").innerText =
        minimum;

}


/* =========================
        RESET
========================= */

function resetArray() {

    document.getElementById("numbers").value = "";

    document.getElementById("arrayDisplay").innerText =
        "[ 12, 45, 2, 89, 34 ]";

    document.getElementById("maximum").innerText =
        "89";

    document.getElementById("minimum").innerText =
        "2";

}