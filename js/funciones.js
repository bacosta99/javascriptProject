function loadItems() {
    for (cel of celularesData) {
        let itemList = "<div class='card col-md-3 col-10 mt-5 ms-5' id='" + cel.id + "'><img class='mx-auto img-thumbnail' src='" + cel.phoneImage +"' width='auto' height='auto' /><div class='card-body text-center mx-auto'><div class='cvp'><h5 class='card-title font-weight-bold'>" + cel.phone + "</h5><p class='card-text'>U$S " + cel.price + "</p><a href='#fullCart' class='btn cart px-auto' onclick='addToCart(`" + cel.id + "`)'>ADD TO CART</a></div></div></div>"
        switch (cel.brand) {
            case "samsung":
                samsungShop.innerHTML += itemList
                break;
            case "apple":
                appleShop.innerHTML += itemList
                break;
            default:            
                break;
        }
    }
}

function addToCartFunction() {// darle a todos los Add to Cart el event listener para mostrar el cartel de success
    const addToCartButtons = document.querySelectorAll(".btn.cart")
    addToCartButtons.forEach(button => {
        button.addEventListener("click",successAlert)
    })
}

function localToArrayCart() {   
    if (cartAux.length != 0) {
        i = luxon.Interval.fromDateTimes(DateTime.fromISO(localStorage.getItem('dateAndTime')),DateTime.now())
        abandonedCart()
    }
}

function abandonedCart() {
    if (i.length('minutes')>30) { // Se establece un intervalo de tiempo desde la ultima vez que se actualizó el carrito para que salga el pop up de carrito abandonado
        Swal.fire({
            title: 'Do you wish to restore your abandoned cart?',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
            allowOutsideClick: false,
            customClass: {
              actions: 'my-actions',
              cancelButton: 'order-1 right-gap',
              confirmButton: 'order-2',
              denyButton: 'order-3',
            }
          }).then((result) => {
            if (result.isConfirmed) {
                loadCart()
                uploadCart()
                Swal.fire('Your cart has been restored!')
            } else if (result.isDenied) {
                cart.splice(0,cart.length)
                localStorage.clear("cart")
                localStorage.clear("dateAndTime")
                localStorage.clear("cartTotal")
                Swal.fire('Your cart has been emptied')
            }
          })   
    } else {
        loadCart()
    }
}

function loadCart() {
    cartAux.forEach(cel => {
        cart.push(cel)
        }
    )
    cart.forEach(cel => {
        addToCart(cel.id,cel.quantity)
    })
}

//agrega el articulo al carrito
function addToCart(id,quantity) {
    quantity = quantity || 1
    fullCart.className = "visible"
    let {phone, price, phoneImage:img} = findItemInDB(id) // se usa la desestructuracion
    const cartItemArray = [id,phone,price,img,quantity] // se arma el array para el spread
    if (document.querySelector(`#shopCart #${id}`) == null) {
        let itemList = "<div class='d-flex flex-row align-items-center p-2 bg-white mt-4 px-3 rounded' id='" + id + "'> <div class='mr-1 col-2'><img class='rounded' src='" + img + "' width='70' alt='" + phone + "'></div> <div class='col-4'>" + phone + "</div> <div class='col-2 align-items-center'> <input type='number' min='1' step='1' class='w-50' value='" + quantity + "' id='quantity' onclick='updateTotals(`"+ id + "`," + price + ")'> </div> <div class='col-2 align-items-center text-grey mt-1 ms-auto h6'> <a>U$D </> <a id='totalPrice'>" + price * quantity + "</a> </div> <div class='col-2 align-text-center text-grey mt-2 h6'><button type='button' class='btn text-danger' onclick='removeItemFromCart(`"+ id +"`)'>Remove</button></div> </div>"
        shoppingCart.innerHTML += itemList
        if (findItemInCartObject(id) == null) { // como se usa esta funcion para cargar el arrito desde el array, tengo que diferenciar cuando lo cargo por primera vez y cuando no
            cart.push (new cartItem(...cartItemArray)) // se usa el spread
        }
    } else {
        const existingCartItemQ = document.querySelector(`#${id} #quantity`)
        let newQuantity = parseFloat(existingCartItemQ.value) + 1
        existingCartItemQ.value = newQuantity
        existingCartItemQ.setAttribute("value",newQuantity)
        const existingTotalPrice = document.querySelector(`#${id} #totalPrice`)
        existingTotalPrice.innerText = parseFloat(existingTotalPrice.innerText) + price
        updateInCartObject(id)
    }
    cartTotal += price * quantity
    elCartTotal.innerText = cartTotal
}

// saca completamente el articulo del carrito con el boton Remove
function removeItemFromCart(id) {
    const elemento = document.querySelector(`#shopCart #${id}`)
    const priceRemoved = document.querySelector(`#${id} #totalPrice`)
    cartTotal -= parseFloat(priceRemoved.innerText)
    elCartTotal.innerText = cartTotal
    elemento.remove()
    removeItemFromCartObject(id)
    cartTotal == 0 ? fullCart.className = "invisible" : fullCart.className = "visible"
    warningAlert()
}

// actualiza el total del carrito y del elemento cuando se cambia la cantidad en el input
function updateTotals(id,price) {
    const existingCartItemQ = document.querySelector(`#${id} #quantity`)
    let newQuantity = parseFloat(existingCartItemQ.value)
    existingCartItemQ.value = newQuantity
    existingCartItemQ.setAttribute("value",newQuantity)
    const existingTotalPrice = document.querySelector(`#${id} #totalPrice`)
    const oldTotalPrice = parseFloat(existingTotalPrice.innerText)
    existingTotalPrice.innerText = price * newQuantity
    const diferencia = parseFloat(existingTotalPrice.innerText) - oldTotalPrice
    cartTotal += diferencia
    elCartTotal.innerText = cartTotal
    findItemInCartObject(`${id}`).quantity = newQuantity
}

// encontrar el item en el carrito objeto por su id
function findItemInCartObject(id){
    return cart.find(cel => cel.id === id)
}

function findItemInDB(id){
    return celularesData.find(cel => cel.id === id)
}

// eliminar el item en el carrito objeto con su id
function removeItemFromCartObject(id) {
    const index = cart.indexOf(findItemInCartObject(id),0)
    cart.splice(index,1)
}

//actualizar cantidad en carrito objeto
function updateInCartObject(id){
    cart.forEach(cel => {
        cel.id == id ? cel.quantity ++ : cel.quantity = cel.quantity
    });
}

// cargar el array carrito y la hora actual a storage
function uploadCart(){
    localStorage.setItem("cart",JSON.stringify(cart))
    localStorage.setItem("dateAndTime",DateTime.now())
    localStorage.setItem("cartTotal",cartTotal)
}

// cartel de success y warning
function successAlert() {
    const Success = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Success.fire({
        icon: 'success',
        title: 'Phone has been added to cart'
      })
}

function warningAlert() {
    const Success = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Success.fire({
        icon: 'warning',
        title: 'Phone has been removed from cart'
      })
}

