function reverseNumber(num) {

    let reverse = 0;
    let remainder;

    while (num > 0) {

        remainder = num % 10;

        reverse = reverse * 10 + remainder;

        num = Math.floor(num / 10);
    }

    return reverse;
}


function checkPalindrome() {

    let input = document.getElementById("number").value;

    if (input === "") {

        document.getElementById("result").innerHTML =
            "Please enter a number.";

        document.getElementById("original").innerHTML = "—";
        document.getElementById("reversed").innerHTML = "—";
        document.getElementById("status").innerHTML = "—";

        return;
    }


    let number = Number(input);


    // Calling the reverseNumber() function
    let reversed = reverseNumber(number);


    // Display original and reversed numbers
    document.getElementById("original").innerHTML = number;

    document.getElementById("reversed").innerHTML = reversed;


    // Check whether the number is palindrome
    if (number === reversed) {

        document.getElementById("status").innerHTML =
            "Palindrome";

        document.getElementById("result").innerHTML =
            number + " is a Palindrome Number.";

    } else {

        document.getElementById("status").innerHTML =
            "Not Palindrome";

        document.getElementById("result").innerHTML =
            number + " is not a Palindrome Number.";
    }
}

