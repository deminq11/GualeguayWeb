//Variables
const ListaCarrito = JSON.parse(localStorage.getItem("ListaCarritoSAVE")) || []
const ListaCompra = []
const ComprasRealizadas = JSON.parse(localStorage.getItem("CompraSAVE"))
const contenedorMercaderias = document.getElementById("mercaderias")
const carritoIcon = document.getElementById("cart-icon")
const carritoMenu = document.getElementById("cart-menu")
const compraMenu = document.getElementById("purchase-menu")
const compraCerrar = document.getElementById("close-button")
const popUp = document.getElementById("pop-up")
const backgroundOverlay = document.querySelector(".screen")


class Mercaderia {
    constructor(id, nombre, fabricante, precio, imagen, cantidad=1){
        this.id = id;
        this.nombre = nombre;
        this.fabricante = fabricante;
        this.precio = precio;
        this.imagen = imagen;
        this.cantidad = cantidad;
    }
}
const Mercaderias = [
    new Mercaderia (1, "Monocomando Cocina Vigo", "Peirano", 60000,  "https://griferiapeirano.com/wp-content/uploads/2023/08/LINEA-VIGO-%E2%80%93-MONOCOMANDO-DE-COCINA-1-scaled.jpg"),

    new Mercaderia (2, "Juego de Ducha Exterior", "Peirano", 70000, "https://griferiapeirano.com/wp-content/uploads/2023/08/A1250_Columna-de-ducha-compatible-con-cualquier-ducha-exterior-500x500.jpg"),

    new Mercaderia (3, "Monocomando Cocina Valencia", "Peirano", 25000, "https://griferiapeirano.com/wp-content/uploads/2024/01/20-122_Valencia-monocomando-1-600x600.jpg"),

    new Mercaderia (4, "Lavatorio de Baño Vigo", "Peirano", 80000, "https://griferiapeirano.com/wp-content/uploads/2023/08/62-132_Vigo-lavatorio-de-pared-600x600.jpg"),

    new Mercaderia (5, "Bicomando Bidet Mallorca", "Peirano", 70000, "https://griferiapeirano.com/wp-content/uploads/2023/08/LINEA-MALLORCA-%E2%80%93-BIDE-BICOMANDO.jpg"),

    new Mercaderia (6, "Bicomando Cocina Mallorca", "Peirano", 75000, "https://griferiapeirano.com/wp-content/uploads/2023/08/51-121_Mallorca-cocina-bimando-scaled.jpeg")
]


// Funciones
//Mercaderias

Mercaderias.forEach(mercaderia =>{
    contenedorMercaderias.innerHTML += `
        <div class="card">
            <img class="card-image"src=${mercaderia.imagen} alt="${mercaderia.nombre}"/>
            <div class="card-details">
                <h3 class="card-title">${mercaderia.nombre}</h3>
                <p class="card-description">${mercaderia.fabricante}</p>
                <p class="card-price">AR$${mercaderia.precio}</p>
                <button id="add-to-cart${mercaderia.id}"class="card-button">Añadir al carrito</button>
            </div>
        </div>
    `
})

Mercaderias.forEach(mercaderia => {
    const cardButton = document.getElementById(`add-to-cart${mercaderia.id}`)
    cardButton.addEventListener("click", ()=>{
        const productoAgregado = ListaCarrito.find(producto => producto.id === mercaderia.id);
        if (productoAgregado) {
            productoAgregado.cantidad++;
            carritoPrint()
        }else{
            ListaCarrito.push(new Mercaderia(mercaderia.id, mercaderia.nombre, mercaderia.fabricante, mercaderia.precio, mercaderia.imagen, mercaderia.cantidad));
            carritoPrint()
        }

    })
})

//Carrito

function carritoAdd(producto){
    carritoMenu.innerHTML +=`
    <div class="cart-item">
    <div class="cart-item-name">${producto.nombre}</div>
    <div class="cart-item-price">$${producto.precio}</div>
    <div class="cart-item-price">x${producto.cantidad}</div>
    <i id="${producto.id}" class="cart-minus fa-solid fa-minus"></i>
    </div>`
}

function carritoRemove(productId) {
    const index = ListaCarrito.findIndex(producto => producto.id == productId);
    if(index !==-1){
        ListaCarrito[index].cantidad--
    }
    if (ListaCarrito[index].cantidad === 0) {
        ListaCarrito.splice(index, 1)
    }
    carritoPrint();
}

function carritoVaciar(){
    ListaCarrito.length = 0
    carritoPrint();
}

function carritoPrint() {
    savetoLocal();
    carritoMenu.innerHTML = '';
    if(ListaCarrito.length == 0){
        carritoMenu.innerHTML +=`
    <div class="cart-item">
    <div>Su lista esta vacía, agregue productos a la compra para verlos.</div>
    </div>`
    }else{
        ListaCarrito.forEach(producto => {
            carritoAdd(producto)
        });
        carritoMenu.innerHTML +=`
        <button id="purchase-cart"class="cart-button">Comprar</button>
        <button id="empty-cart"class="cart-button">Vaciar carrito</button>
        `
    }
}

function savetoLocal(){
    localStorage.setItem("ListaCarritoSAVE", JSON.stringify(ListaCarrito))
}

//Compra

function carritoComprar(){
    const compras = ListaCarrito.slice()
    compras.forEach(compra =>{
        ListaCompra.push(compra)
    })
    menuCompraPrint()
    carritoVaciar()
    compraMenu.classList.add("show-purchase-menu")
}
function cancelarCompra(){
    const compraCancelada = ListaCompra.slice()
    compraCancelada.forEach(compra =>{
        ListaCarrito.push(compra)
    })
    ListaCompra.length = 0
    menuCompraPrint()
    carritoPrint()
}
function menuCompraPrint() {
    let totalPrecio = ListaCompra.reduce((acc, compra) =>{
        return acc + parseFloat(compra.precio)* compra.cantidad
    }, 0)
    compraMenu.innerHTML =`
    <i id="close-button" class="close-icon fa-solid fa-x"></i>
    <p class="total-price">Total: <b>AR$${totalPrecio}</b></p>
    <div class="purchase-buttons">
        <button id="close-button" class="close-button">Cancelar Compra</button>
        <button id="purchase-button" class="finish-button">Finalizar Compra</button>
    </div>`
    ListaCarrito.forEach(compra => {
        menuCompraAdd(compra)
    })
}

function finalizarCompra(){
    localStorage.setItem("CompraSAVE", JSON.stringify(ListaCompra))
}
function menuCompraAdd(compra) {
    compraMenu.innerHTML += `
        <div class="purchase">
            <img class="purchase-image" src=${compra.imagen} alt="${compra.nombre}" />
            <div class="purchase-details">
                <h3 class="purchase-title">${compra.nombre}</h3>
                <p class="purchase-description">${compra.fabricante}</p>
                <p class="purchase-price">AR$${compra.precio} x${compra.cantidad}</p>
            </div>
        </div>
    `;
}



//Eventos

carritoIcon.addEventListener("click", ()=>{
    carritoIcon.classList.toggle("active")
    carritoMenu.classList.toggle("show")
})
carritoMenu.addEventListener("click", (click) => {
    if(click.target.id >= 0 && click.target.id!=""){
        carritoRemove(click.target.id)
    }else if(click.target.id === "empty-cart"){
        carritoVaciar();
    }else if(click.target.id === "purchase-cart"){
        carritoComprar()
        compraMenu.classList.add("show-purchase-menu")
        backgroundOverlay.classList.add("show-screen")
    }
})
compraMenu.addEventListener('click', (click)=>{
    if(click.target.id == "close-button"){
        cancelarCompra()
        compraMenu.classList.remove("show-purchase-menu")
        backgroundOverlay.classList.remove("show-screen")
    }else if (click.target.id == "purchase-button"){
        finalizarCompra()
        compraMenu.classList.remove("show-purchase-menu")
        popUp.classList.add("show-pop-up")
    }
})
popUp.addEventListener("click", (click)=>{
    if(click.target.id == "pop-up-close"){
        popUp.classList.remove("show-pop-up")
        backgroundOverlay.classList.remove("show-screen")
    }
})
document.addEventListener("DOMContentLoaded",()=>{
    carritoPrint()
})

