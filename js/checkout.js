function setOrderTotal() {
    let cartTotal = parseFloat(localStorage.getItem("cartTotal"))
    document.getElementById("orderTotal").setAttribute("value",cartTotal)
    document.getElementById("orderTotalVisible").innerHTML = cartTotal
}

function goToIndex() {
    window.location.href = `${window.location.origin}/index.html`
}

document.getElementById("keepShopping").addEventListener("click",goToIndex)

document.getElementById("checkoutForm").addEventListener("submit", function (event) {
            event.preventDefault();
            emailjs.sendForm('default_service', 'template_bacosta199', this)
            .then(
                (response) => {
                    Swal.fire({
                        title: 'Your order has been placed!',
                        text: "If we are feeling like it, you'll recieve your package. Maybe",
                        allowOutsideClick: false,
                    }).then((result) => {
                        if(result.isConfirmed) {
                            localStorage.removeItem("cart",'')
                            localStorage.removeItem("dateAndTime",'')
                            localStorage.removeItem("cartTotal",'')
                            goToIndex()
                        }
                    })
                },
                (error) => {
                console.log("FAILED...", error);
                alert("FAILED...", error);
                }
            )
            // .then(
            //     window.location.href = `${window.location.origin}/index.html`
            // );
            });