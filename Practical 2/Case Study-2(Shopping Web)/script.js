/* ============================
        SHOPPING CART
============================ */

let cart = [];

/* ============================
      SEARCH PRODUCTS
============================ */

function searchProduct() {

    let input = document.getElementById("searchBar").value.toLowerCase();

    let cards = document.getElementsByClassName("product-card");

    for (let i = 0; i < cards.length; i++) {

        let name = cards[i]
            .getElementsByTagName("h3")[0]
            .innerText
            .toLowerCase();

        if (name.includes(input)) {

            cards[i].style.display = "block";

        } else {

            cards[i].style.display = "none";

        }

    }

}

/* ============================
        ADD TO CART
============================ */

function addToCart(productName, price, quantityId) {

    let quantity = Number(document.getElementById(quantityId).value);

if (isNaN(quantity) || quantity <= 0) {

    alert("Please enter quantity first.");

    return;

}

    let existingProduct = cart.find(item => item.name === productName);

    if (existingProduct) {

        existingProduct.quantity += quantity;

        existingProduct.total =
            existingProduct.quantity * existingProduct.price;

    }

    else {

        cart.push({

            name: productName,

            price: price,

            quantity: quantity,

            total: price * quantity

        });

    }

    updateCart();

}

/* ============================
        UPDATE CART
============================ */

function updateCart() {

    let cartItems = document.getElementById("cartItems");

    let cartCount = document.getElementById("cartCount");

    let cartTotal = document.getElementById("cartTotal");

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += item.total;

        cartItems.innerHTML += `

        <div class="cart-item">

            <h4>${item.name}</h4>

            <p>

            Quantity :
            ${item.quantity} Kg

            </p>

            <p>

            Price :

            ₹${item.price}/Kg

            </p>

            <p>

            Total :

            ₹${item.total.toFixed(2)}

            </p>

            <button onclick="increaseQuantity(${index})">

            +

            </button>

            <button onclick="decreaseQuantity(${index})">

            -

            </button>

            <button onclick="removeItem(${index})">

            Remove

            </button>

            <hr>

        </div>

        `;

    });

    cartCount.innerText = cart.length;

    cartTotal.innerText = total.toFixed(2);

}

/* ============================
      REMOVE PRODUCT
============================ */

function removeItem(index) {

    cart.splice(index,1);

    updateCart();

}

/* ============================
     INCREASE QUANTITY
============================ */

function increaseQuantity(index){

    cart[index].quantity++;

    cart[index].total =
    cart[index].quantity *
    cart[index].price;

    updateCart();

}

/* ============================
     DECREASE QUANTITY
============================ */

function decreaseQuantity(index){

    if(cart[index].quantity>1){

        cart[index].quantity--;

        cart[index].total=
        cart[index].quantity*
        cart[index].price;

    }

    updateCart();

}

/* ============================
      PROCEED TO BILLING
============================ */

function showBilling(){

    if(cart.length==0){

        alert("Your cart is empty!");

        return;

    }

    document.querySelector(".billing-section").style.display = "block";

    document.querySelector(".billing-section").scrollIntoView({

        behavior:"smooth"

    });

}

/* ============================
      GENERATE INVOICE
============================ */

function generateInvoice() {

    if (cart.length == 0) {

        alert("Cart is empty!");

        return;

    }

    let customerName = document.getElementById("customerName").value.trim();
    let mobile = document.getElementById("mobile").value.trim();

    if (customerName == "" || mobile == "") {

        alert("Please fill Customer Name and Mobile Number.");

        return;

    }

    let paymentMode = document.getElementById("paymentMode").value;

    let membership = document.getElementById("membership").value;

    let discount = Number(document.getElementById("discount").value);

    let gst = Number(document.getElementById("gst").value);

    let packing = Number(document.getElementById("packing").value);

    let subtotal = 0;

    let rows = "";

    cart.forEach(item => {

        subtotal += item.total;

        rows += `
        <tr>
            <td>${item.name}</td>
            <td>${item.quantity} Kg</td>
            <td>₹${item.price}</td>
            <td>₹${item.total.toFixed(2)}</td>
        </tr>
        `;

    });

    let discountAmount = subtotal * (discount / 100);

    let memberDiscount = 0;

    if (membership == "Yes") {

        memberDiscount = subtotal * 0.05;

    }

    let amountAfterDiscount =
        subtotal - discountAmount - memberDiscount;

    let gstAmount =
        amountAfterDiscount * (gst / 100);

    let grandTotal =
        amountAfterDiscount + gstAmount + packing;

    let invoiceNumber =
        "INV" + Math.floor(100000 + Math.random() * 900000);

    let today =
        new Date().toLocaleDateString();

    document.getElementById("invoice").innerHTML = `

<h2 style="text-align:center;color:#2e7d32;">
FreshMart
</h2>

<hr>

<p><b>Invoice No :</b> ${invoiceNumber}</p>

<p><b>Date :</b> ${today}</p>

<p><b>Customer :</b> ${customerName}</p>

<p><b>Mobile :</b> ${mobile}</p>

<p><b>Payment Mode :</b> ${paymentMode}</p>

<hr>

<table
border="1"
cellpadding="10"
width="100%"
style="border-collapse:collapse;text-align:center;">

<tr style="background:#2e7d32;color:white;">

<th>Product</th>

<th>Quantity</th>

<th>Rate</th>

<th>Total</th>

</tr>

${rows}

</table>

<br>

<h3>Bill Summary</h3>

<p>Subtotal : ₹${subtotal.toFixed(2)}</p>

<p>Discount (${discount}%) :
₹${discountAmount.toFixed(2)}</p>

<p>Membership Discount :
₹${memberDiscount.toFixed(2)}</p>

<p>GST (${gst}%) :
₹${gstAmount.toFixed(2)}</p>

<p>Packing Charges :
₹${packing.toFixed(2)}</p>

<hr>

<h2 style="color:#d84315;">

Grand Total :
₹${grandTotal.toFixed(2)}

</h2>

<hr>

<h3 style="text-align:center;color:#2e7d32;">

Thank You For Shopping With FreshMart!

</h3>

`;
document.querySelector(".invoice-section").style.display = "block";

document.querySelector(".invoice-section").scrollIntoView({

    behavior:"smooth"

});

    document.getElementById("printBtn").style.display = "inline-block";

}

/* ============================
        PRINT INVOICE
============================ */

function printInvoice(){

    window.print();

    if(confirm("Do you want to start a new shopping order?")){

        resetCart();

        document.getElementById("invoice").innerHTML="";

        document.querySelector(".invoice-section").style.display="none";

        document.querySelector(".billing-section").style.display="none";

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

}

/* ============================
        RESET CART
============================ */

function resetCart(){

    cart=[];

    updateCart();

    document.getElementById("billingForm").reset();

    document.getElementById("cartItems").innerHTML="<p>Your cart is empty.</p>";

    document.getElementById("cartTotal").innerHTML="0";

    document.getElementById("cartCount").innerHTML="0";

}
