// ============================================
// FORGE FITNESS - EXPERIMENT 8
// JavaScript Events & Live Form Validation
// ============================================


// ---------- GET FORM ELEMENTS ----------

const form = document.getElementById("gymForm");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const mobile = document.getElementById("mobile");
const dob = document.getElementById("dob");

const height = document.getElementById("height");
const weight = document.getElementById("weight");
const goal = document.getElementById("goal");

const emergencyName =
    document.getElementById("emergencyName");

const emergencyPhone =
    document.getElementById("emergencyPhone");

const relation =
    document.getElementById("relation");

const terms =
    document.getElementById("terms");


// ---------- SUMMARY ELEMENTS ----------

const summaryName =
    document.getElementById("summaryName");

const summaryGoal =
    document.getElementById("summaryGoal");

const summaryPlan =
    document.getElementById("summaryPlan");

const summaryFee =
    document.getElementById("summaryFee");


// ---------- PROGRESS ----------

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

const progressPercent =
    document.getElementById("progressPercent");


// ---------- BMI ----------

const bmiValue =
    document.getElementById("bmiValue");

const bmiText =
    document.getElementById("bmiText");


// ---------- SUCCESS ----------

const successBox =
    document.getElementById("successBox");

const successName =
    document.getElementById("successName");

const successPlan =
    document.getElementById("successPlan");

const successFee =
    document.getElementById("successFee");


// ---------- MEMBERSHIP PRICES ----------

const prices = {

    Monthly: 1500,

    Quarterly: 4000,

    Yearly: 12000

};


// ============================================
// SHOW VALIDATION RESULT
// ============================================

function showResult(input, message, valid) {

    const wrapper =
        input.closest(".input-group")
        ?.querySelector(".input-wrapper");

    const feedback =
        input.closest(".input-group")
        ?.querySelector(".feedback");

    if (!wrapper || !feedback) {
        return;
    }


    wrapper.classList.remove(
        "valid",
        "invalid"
    );


    if (valid) {

        wrapper.classList.add("valid");

        feedback.textContent =
            "✓ Looks good";

        feedback.className =
            "feedback success";

    } else {

        wrapper.classList.add("invalid");

        feedback.textContent =
            "✕ " + message;

        feedback.className =
            "feedback error";

    }

}


// ============================================
// NAME
// ============================================

function validateName() {

    const value =
        fullName.value.trim();


    if (value === "") {

        showResult(
            fullName,
            "Name is required.",
            false
        );

        return false;
    }


    if (value.length < 3) {

        showResult(
            fullName,
            "Enter at least 3 characters.",
            false
        );

        return false;
    }


    showResult(
        fullName,
        "",
        true
    );


    summaryName.textContent =
        value;


    return true;
}


// ============================================
// EMAIL
// ============================================

function validateEmail() {

    const value =
        email.value.trim();


    const pattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (value === "") {

        showResult(
            email,
            "Email is required.",
            false
        );

        return false;
    }


    if (!pattern.test(value)) {

        showResult(
            email,
            "Enter a valid email.",
            false
        );

        return false;
    }


    showResult(
        email,
        "",
        true
    );


    return true;
}


// ============================================
// MOBILE
// ============================================

function validateMobile() {

    const value =
        mobile.value.trim();


    const pattern =
        /^[0-9]{10}$/;


    if (value === "") {

        showResult(
            mobile,
            "Mobile number is required.",
            false
        );

        return false;
    }


    if (!pattern.test(value)) {

        showResult(
            mobile,
            "Enter exactly 10 digits.",
            false
        );

        return false;
    }


    showResult(
        mobile,
        "",
        true
    );


    return true;
}


// ============================================
// DOB
// ============================================

function validateDOB() {

    if (dob.value === "") {

        showResult(
            dob,
            "Date of birth is required.",
            false
        );

        return false;
    }


    const selected =
        new Date(dob.value);

    const today =
        new Date();


    if (selected > today) {

        showResult(
            dob,
            "Date cannot be in the future.",
            false
        );

        return false;
    }


    showResult(
        dob,
        "",
        true
    );


    return true;
}


// ============================================
// GENDER
// ============================================

function validateGender() {

    const selected =
        document.querySelector(
            'input[name="gender"]:checked'
        );


    const feedback =
        document.getElementById(
            "genderFeedback"
        );


    if (!selected) {

        feedback.textContent =
            "✕ Please select your gender.";

        feedback.className =
            "feedback error";

        return false;
    }


    feedback.textContent =
        "✓ Gender selected";

    feedback.className =
        "feedback success";


    return true;
}


// ============================================
// HEIGHT
// ============================================

function validateHeight() {

    const value =
        Number(height.value);


    if (height.value === "") {

        showResult(
            height,
            "Height is required.",
            false
        );

        return false;
    }


    if (value < 100 || value > 250) {

        showResult(
            height,
            "Enter 100–250 cm.",
            false
        );

        return false;
    }


    showResult(
        height,
        "",
        true
    );


    calculateBMI();


    return true;
}


// ============================================
// WEIGHT
// ============================================

function validateWeight() {

    const value =
        Number(weight.value);


    if (weight.value === "") {

        showResult(
            weight,
            "Weight is required.",
            false
        );

        return false;
    }


    if (value < 30 || value > 250) {

        showResult(
            weight,
            "Enter 30–250 kg.",
            false
        );

        return false;
    }


    showResult(
        weight,
        "",
        true
    );


    calculateBMI();


    return true;
}


// ============================================
// BMI CALCULATION
// ============================================

function calculateBMI() {

    const h =
        Number(height.value) / 100;

    const w =
        Number(weight.value);


    if (
        !h ||
        !w ||
        h <= 0 ||
        w <= 0
    ) {

        bmiValue.textContent =
            "--";

        bmiText.textContent =
            "Enter height and weight to calculate BMI";

        return;
    }


    const bmi =
        w / (h * h);


    bmiValue.textContent =
        bmi.toFixed(1);


    if (bmi < 18.5) {

        bmiText.textContent =
            "Below normal range";

    } else if (bmi < 25) {

        bmiText.textContent =
            "Healthy range";

    } else if (bmi < 30) {

        bmiText.textContent =
            "Above normal range";

    } else {

        bmiText.textContent =
            "High range";

    }

}


// ============================================
// GOAL
// ============================================

function validateGoal() {

    if (goal.value === "") {

        showResult(
            goal,
            "Please select your goal.",
            false
        );

        return false;
    }


    showResult(
        goal,
        "",
        true
    );


    summaryGoal.textContent =
        goal.value;


    return true;
}


// ============================================
// MEMBERSHIP
// ============================================

function validatePlan() {

    const plan =
        document.querySelector(
            'input[name="plan"]:checked'
        );


    const feedback =
        document.getElementById(
            "planFeedback"
        );


    if (!plan) {

        feedback.textContent =
            "✕ Please select a membership.";

        feedback.className =
            "feedback error";

        return false;
    }


    feedback.textContent =
        "✓ Membership selected";

    feedback.className =
        "feedback success";


    summaryPlan.textContent =
        plan.value;


    summaryFee.textContent =
        "₹" +
        prices[plan.value]
            .toLocaleString("en-IN");


    return true;
}


// ============================================
// EMERGENCY NAME
// ============================================

function validateEmergencyName() {

    const value =
        emergencyName.value.trim();


    if (value === "") {

        showResult(
            emergencyName,
            "Contact name is required.",
            false
        );

        return false;
    }


    if (value.length < 3) {

        showResult(
            emergencyName,
            "Enter a valid name.",
            false
        );

        return false;
    }


    showResult(
        emergencyName,
        "",
        true
    );


    return true;
}


// ============================================
// EMERGENCY PHONE
// ============================================

function validateEmergencyPhone() {

    const value =
        emergencyPhone.value.trim();


    const pattern =
        /^[0-9]{10}$/;


    if (value === "") {

        showResult(
            emergencyPhone,
            "Contact number is required.",
            false
        );

        return false;
    }


    if (!pattern.test(value)) {

        showResult(
            emergencyPhone,
            "Enter exactly 10 digits.",
            false
        );

        return false;
    }


    showResult(
        emergencyPhone,
        "",
        true
    );


    return true;
}


// ============================================
// RELATIONSHIP
// ============================================

function validateRelation() {

    if (relation.value === "") {

        showResult(
            relation,
            "Select a relationship.",
            false
        );

        return false;
    }


    showResult(
        relation,
        "",
        true
    );


    return true;
}


// ============================================
// TERMS
// ============================================

function validateTerms() {

    const feedback =
        document.getElementById(
            "termsFeedback"
        );


    if (!terms.checked) {

        feedback.textContent =
            "✕ Please confirm the information.";

        feedback.className =
            "feedback error";

        return false;
    }


    feedback.textContent =
        "✓ Confirmation accepted";

    feedback.className =
        "feedback success";


    return true;
}


// ============================================
// PROGRESS
// ============================================

function updateProgress() {

    let completed = 0;


    if (
        fullName.value.trim().length >= 3
    ) {
        completed++;
    }


    if (
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email.value.trim())
    ) {
        completed++;
    }


    if (
        /^[0-9]{10}$/
        .test(mobile.value.trim())
    ) {
        completed++;
    }


    if (dob.value !== "") {
        completed++;
    }


    if (
        document.querySelector(
            'input[name="gender"]:checked'
        )
    ) {
        completed++;
    }


    const h =
        Number(height.value);

    if (
        h >= 100 &&
        h <= 250
    ) {
        completed++;
    }


    const w =
        Number(weight.value);

    if (
        w >= 30 &&
        w <= 250
    ) {
        completed++;
    }


    if (goal.value !== "") {
        completed++;
    }


    if (
        document.querySelector(
            'input[name="plan"]:checked'
        )
    ) {
        completed++;
    }


    if (
        emergencyName.value
            .trim().length >= 3
    ) {
        completed++;
    }


    if (
        /^[0-9]{10}$/
        .test(
            emergencyPhone.value.trim()
        )
    ) {
        completed++;
    }


    if (relation.value !== "") {
        completed++;
    }


    if (terms.checked) {
        completed++;
    }


    const percent =
        Math.round(
            (completed / 13) * 100
        );


    progressBar.style.width =
        percent + "%";


    progressText.textContent =
        completed + " / 13 completed";


    progressPercent.textContent =
        percent + "%";

}


// ============================================
// INPUT EVENTS
// ============================================

fullName.addEventListener(
    "input",
    () => {
        validateName();
        updateProgress();
    }
);


email.addEventListener(
    "input",
    () => {
        validateEmail();
        updateProgress();
    }
);


mobile.addEventListener(
    "input",
    () => {
        validateMobile();
        updateProgress();
    }
);


height.addEventListener(
    "input",
    () => {
        validateHeight();
        updateProgress();
    }
);


weight.addEventListener(
    "input",
    () => {
        validateWeight();
        updateProgress();
    }
);


emergencyName.addEventListener(
    "input",
    () => {
        validateEmergencyName();
        updateProgress();
    }
);


emergencyPhone.addEventListener(
    "input",
    () => {
        validateEmergencyPhone();
        updateProgress();
    }
);


// ============================================
// CHANGE EVENTS
// ============================================

dob.addEventListener(
    "change",
    () => {
        validateDOB();
        updateProgress();
    }
);


goal.addEventListener(
    "change",
    () => {
        validateGoal();
        updateProgress();
    }
);


relation.addEventListener(
    "change",
    () => {
        validateRelation();
        updateProgress();
    }
);


terms.addEventListener(
    "change",
    () => {
        validateTerms();
        updateProgress();
    }
);


// ============================================
// GENDER RADIO EVENTS
// ============================================

document
    .querySelectorAll(
        'input[name="gender"]'
    )
    .forEach(radio => {

        radio.addEventListener(
            "change",
            () => {

                validateGender();
                updateProgress();

            }
        );

    });


// ============================================
// MEMBERSHIP EVENTS
// ============================================

document
    .querySelectorAll(
        'input[name="plan"]'
    )
    .forEach(radio => {

        radio.addEventListener(
            "change",
            () => {

                validatePlan();
                updateProgress();

            }
        );

    });


// ============================================
// BLUR EVENTS
// ============================================

fullName.addEventListener(
    "blur",
    validateName
);

email.addEventListener(
    "blur",
    validateEmail
);

mobile.addEventListener(
    "blur",
    validateMobile
);

dob.addEventListener(
    "blur",
    validateDOB
);

height.addEventListener(
    "blur",
    validateHeight
);

weight.addEventListener(
    "blur",
    validateWeight
);

emergencyName.addEventListener(
    "blur",
    validateEmergencyName
);

emergencyPhone.addEventListener(
    "blur",
    validateEmergencyPhone
);


// ============================================
// SUBMIT EVENT
// ============================================

form.addEventListener(
    "submit",
    function(event) {

        // Prevent default browser submission
        event.preventDefault();


        const valid =
            validateName() &&
            validateEmail() &&
            validateMobile() &&
            validateDOB() &&
            validateGender() &&
            validateHeight() &&
            validateWeight() &&
            validateGoal() &&
            validatePlan() &&
            validateEmergencyName() &&
            validateEmergencyPhone() &&
            validateRelation() &&
            validateTerms();


        updateProgress();


        if (valid) {

            const selectedPlan =
                document.querySelector(
                    'input[name="plan"]:checked'
                );


            successName.textContent =
                fullName.value.trim();


            successPlan.textContent =
                selectedPlan.value;


            successFee.textContent =
                "₹" +
                prices[selectedPlan.value]
                    .toLocaleString("en-IN");


            form.style.display =
                "none";


            document.querySelector(
                ".progress-container"
            ).style.display =
                "none";


            successBox.style.display =
                "block";


            successBox.scrollIntoView({
                behavior: "smooth"
            });

        } else {

            alert(
                "Please complete all required fields correctly."
            );

        }

    }
);


// Initial progress
updateProgress();