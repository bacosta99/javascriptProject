//variables
var DateTime = luxon.DateTime

const cart = []
const cartAux = JSON.parse(localStorage.getItem("cart")) || []
let cartTotal = 0
let i=1
let number = 0
const celularesData = []
const samsungShop = document.getElementById("samsungShop")
const appleShop = document.getElementById("appleShop")
const shoppingCart = document.getElementById("shopCart")
const elCartTotal = document.getElementById("cartTotal")
const fullCart = document.getElementById("fullCart")
const alerts = document.getElementById("alerts")
const URL = `${window.location.origin}/js/celulares.json`
let removeButtons


//clase constructora de celulares
class Celular {
    constructor(id,phone,price,image,brand) {
        this.id = id
        this.phone = phone
        this.price = price
        this.phoneImage = image
        this.brand = brand
    }
}

class cartItem {
    constructor(id,phone,price,image,quantity) {
        this.id = id
        this.phone = phone
        this.price = price
        this.phoneImage = image
        this.quantity = quantity 
    }
}