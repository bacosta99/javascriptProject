// simula data base de productos
// celularesData.push(new Celular("sam101","Samsung Galaxy S22",899,"https://i.ibb.co/jhQRJYK/s22.png","samsung"))
// celularesData.push(new Celular("sam102","Samsung Galaxy Z Flip",1199,"https://i.ibb.co/bHLnks7/z-flip.png","samsung"))
// celularesData.push(new Celular("sam103","Samsung Galaxy Note 20",1399,"https://i.ibb.co/r7trTmz/note-20.png","samsung"))
// celularesData.push(new Celular("iph101","iPhone 12",899,"https://i.ibb.co/qRJhWCX/iphone-12-sin-fondo.png","apple"))
// celularesData.push(new Celular("iph102","iPhone 12 Pro",1299,"https://i.ibb.co/VVvHSM0/iphone-12-pro.png","apple"))
// celularesData.push(new Celular("iph103","iPhone 12 Pro Max",1499,"https://i.ibb.co/tbcHv9c/iphone-12-pro-max.png","apple"))

const cargarPagina = async () => {
    const resp = await fetch(URL) //trae los celulares del JSON
    const data = await resp.json() //los transforma en un objeto
    const celularesDB = data
    celularesDB.forEach(cel => {
        celularesData.push(cel)
    })
    loadItems() //carga los celulares en la pagina
    addToCartFunction() //les da a todos los botones de add to cart el evento
    localToArrayCart() //rescata el carrito del localStorage
}

cargarPagina()

document.getElementById("goToCheckout").addEventListener("click", function() {
    window.location.href = `${window.location.origin}/checkout.html`   
})