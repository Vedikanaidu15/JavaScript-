function calculate() {

    try {

        let study = Number(document.getElementById("study").value);

        let instagram = Number(document.getElementById("instagram").value);

        if (study < 0 || instagram < 0) {
            throw "Hours cannot be negative.";
        }

        if (study === 0 && instagram === 0) {
            throw "Please enter your hours.";
        }

        let total = study + instagram;

        let studyPercent = (study / total) * 100;

        let instagramPercent = (instagram / total) * 100;

        let message;

        if (study > instagram) {
            message = "Great! You spend more time studying.";
        }
        else if (instagram > study) {
            message = "Try reducing Instagram time and focus more on studies.";
        }
        else {
            message = "Your study and Instagram time are equal.";
        }

        document.getElementById("result").innerHTML =
            "📚 Study Time: " + study + " hours<br>" +
            "Instagram Time: " + instagram + " hours<br>" +
            "Study Percentage: " + studyPercent.toFixed(1) + "%<br>" +
            "Instagram Percentage: " + instagramPercent.toFixed(1) + "%<br><br>" +
            "<strong>" + message + "</strong>";

    }

    catch (error) {

        document.getElementById("result").innerHTML =
            "⚠️ " + error;

    }
}


function openInstagram() {

    window.location.href = "https://www.instagram.com/";

}