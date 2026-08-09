/*=========================================
        CALCULATE RESULT
=========================================*/

function calculateResult() {

    let name = document.getElementById("name").value.trim();

    let roll = document.getElementById("roll").value.trim();

    let course = document.getElementById("course").value.trim();

    let semester = document.getElementById("semester").value.trim();

    let js = Number(document.getElementById("js").value);

    let cn = Number(document.getElementById("cn").value);

    let cc = Number(document.getElementById("cc").value);

    let dc = Number(document.getElementById("dc").value);

    let ai = Number(document.getElementById("ai").value);



/*=========================================
            FORM VALIDATION
=========================================*/

    if(name=="" || roll=="" || course=="" || semester==""){

        alert("Please fill all student details.");

        return;

    }


    if(

        isNaN(js) ||

        isNaN(cn) ||

        isNaN(cc) ||

        isNaN(dc) ||

        isNaN(ai)

    ){

        alert("Please enter marks for all subjects.");

        return;

    }



    if(

        js<0 || js>100 ||

        cn<0 || cn>100 ||

        cc<0 || cc>100 ||

        dc<0 || dc>100 ||

        ai<0 || ai>100

    ){

        alert("Marks should be between 0 and 100.");

        return;

    }



/*=========================================
        TOTAL CALCULATION
=========================================*/

    let total =

    js +

    cn +

    cc +

    dc +

    ai;



    let percentage = total / 5;



/*=========================================
        SUBJECT STATUS
=========================================*/

    let jsStatus = js>=35 ? "✅ Pass" : "❌ Fail";

    let cnStatus = cn>=35 ? "✅ Pass" : "❌ Fail";

    let ccStatus = cc>=35 ? "✅ Pass" : "❌ Fail";

    let dcStatus = dc>=35 ? "✅ Pass" : "❌ Fail";

    let aiStatus = ai>=35 ? "✅ Pass" : "❌ Fail";



/*=========================================
        OVERALL RESULT
=========================================*/

    let result = "PASS";



    if(

        js<35 ||

        cn<35 ||

        cc<35 ||

        dc<35 ||

        ai<35

    ){

        result="FAIL";

    }



/*=========================================
            GRADE
=========================================*/

    let grade="";

    let remark="";



    if(result=="FAIL"){

        grade="F";

        remark="Need Improvement";

    }

    else if(percentage>=90){

        grade="A+";

        remark="Outstanding ⭐";

    }

    else if(percentage>=80){

        grade="A";

        remark="Excellent";

    }

    else if(percentage>=70){

        grade="B";

        remark="Very Good";

    }

    else if(percentage>=60){

        grade="C";

        remark="Good";

    }

    else if(percentage>=50){

        grade="D";

        remark="Average";

    }

    else{

        grade="F";

        remark="Fail";

    }
/*=========================================
        DISPLAY RESULT
=========================================*/

document.getElementById("resultSection").style.display = "block";

document.getElementById("result").innerHTML = `

<h3 style="text-align:center;color:#0d47a1;margin-bottom:20px;">

Student Result Card

</h3>

<p><strong>Student Name :</strong> ${name}</p>

<p><strong>Roll Number :</strong> ${roll}</p>

<p><strong>Course :</strong> ${course}</p>

<p><strong>Semester :</strong> ${semester}</p>

<table>

<tr>

<th>Subject</th>

<th>Marks</th>

<th>Status</th>

</tr>

<tr>

<td>JavaScript Lab</td>

<td>${js}</td>

<td>${jsStatus}</td>

</tr>

<tr>

<td>Computer Networks</td>

<td>${cn}</td>

<td>${cnStatus}</td>

</tr>

<tr>

<td>Compiler Construction</td>

<td>${cc}</td>

<td>${ccStatus}</td>

</tr>

<tr>

<td>Data Compression</td>

<td>${dc}</td>

<td>${dcStatus}</td>

</tr>

<tr>

<td>Agentic AI</td>

<td>${ai}</td>

<td>${aiStatus}</td>

</tr>

</table>

<div class="summary">

<p>

Total Marks :

<span>

${total} / 500

</span>

</p>

<p>

Average :

<span>

${percentage.toFixed(2)}

</span>

</p>

<p>

Percentage :

<span>

${percentage.toFixed(2)} %

</span>

</p>

<p>

Grade :

<span class="grade">

${grade}

</span>

</p>

<p>

Overall Result :

<span class="${result=="PASS"?"pass":"fail"}">

${result}

</span>

</p>

<p>

Remark :

<span>

${remark}

</span>

</p>

</div>

<div style="text-align:center;margin-top:25px;">

<button onclick="window.print()">

Print Result

</button>

</div>

`;

document.getElementById("resultSection").scrollIntoView({

behavior:"smooth"

});

}

/*=========================================
            RESET FORM
=========================================*/

function resetForm(){

document.getElementById("name").value="";

document.getElementById("roll").value="";

document.getElementById("course").value="";

document.getElementById("semester").value="";

document.getElementById("js").value="";

document.getElementById("cn").value="";

document.getElementById("cc").value="";

document.getElementById("dc").value="";

document.getElementById("ai").value="";

document.getElementById("resultSection").style.display="none";

document.getElementById("result").innerHTML="";

window.scrollTo({

top:0,

behavior:"smooth"

});

}