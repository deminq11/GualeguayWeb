//Inicializacion
document.addEventListener("DOMContentLoaded",()=>{
    Swal.fire({
        title: "Cargando...",
        didOpen: () => {
            Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
    logoutButton.classList.add("hide")
    AlreadyLogged()
    carritoPrint()
    setTimeout(() => {
        Swal.close();
    }, 3000);
})

//Clases
class Usuario {
    constructor(email, nombre, contraseña, carrito=[], compras=[], imagen="", logged=false){
        this.email = email;
        this.nombre = nombre;
        this.contraseña = contraseña;
        this.carrito = carrito;
        this.compras = compras;
        this.imagen = imagen;
        this.logged = logged;
    }
    absorb(usuario) {
        this.email = usuario.email;
        this.nombre = usuario.nombre;
        this.contraseña = usuario.contraseña;
        this.carrito = usuario.carrito;
        this.compras = usuario.compras;
        this.imagen = usuario.imagen;
    }
    login(){
        this.logged = true
        SaveLog()
        carritoPrint()
    }
    logout(){
        this.logged = false
        SaveLog()
        this.email = "";
        this.nombre = "";
        this.contraseña = "";
        this.carrito = "";
        this.compras = "";
        this.imagen = "";
        carritoPrint()
    }
}

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


//Variables
//Mercaderia
const contenedorMercaderias = document.getElementById("mercaderias")
const Mercaderias = [
    new Mercaderia (1, "Monocomando Cocina Vigo", "Peirano", 60000,  "https://griferiapeirano.com/wp-content/uploads/2023/08/LINEA-VIGO-%E2%80%93-MONOCOMANDO-DE-COCINA-1-scaled.jpg"),
    
    new Mercaderia (2, "Juego de Ducha Exterior", "Peirano", 70000, "https://griferiapeirano.com/wp-content/uploads/2023/08/A1250_Columna-de-ducha-compatible-con-cualquier-ducha-exterior-500x500.jpg"),
    
    new Mercaderia (3, "Monocomando Cocina Valencia", "Peirano", 25000, "https://griferiapeirano.com/wp-content/uploads/2024/01/20-122_Valencia-monocomando-1-600x600.jpg"),
    
    new Mercaderia (4, "Lavatorio de Baño Vigo", "Peirano", 80000, "https://griferiapeirano.com/wp-content/uploads/2023/08/62-132_Vigo-lavatorio-de-pared-600x600.jpg"),
    
    new Mercaderia (5, "Bicomando Bidet Mallorca", "Peirano", 70000, "https://griferiapeirano.com/wp-content/uploads/2023/08/LINEA-MALLORCA-%E2%80%93-BIDE-BICOMANDO.jpg"),
    
    new Mercaderia (6, "Bicomando Cocina Mallorca", "Peirano", 75000, "https://griferiapeirano.com/wp-content/uploads/2023/08/51-121_Mallorca-cocina-bimando-scaled.jpeg")
]
//Usuario
const Usuarios =  JSON.parse(localStorage.getItem("UsuariosSAVE")) || []
const UsuarioEnSesion = new Usuario
const userIcon = document.getElementById("user-icon")
const userMenu = document.getElementById("user-menu")
const loginMenu = document.getElementById("login-menu")
const HistoryButton = document.getElementById("user-purchases")
const loginButton = document.getElementById("user-login")
const logoutButton = document.getElementById("user-logout")
const loginForm = document.getElementById("login-form")
const mensajeError = document.getElementById("error")

//Carrito
let ListaCarrito = UsuarioEnSesion.carrito
const carritoIcon = document.getElementById("cart-icon")
const carritoMenu = document.getElementById("cart-menu")
//Compra
const ListaCompra = []
const compraMenu = document.getElementById("purchase-menu")
const compraCerrar = document.getElementById("close-button")
const ComprasRealizadas = JSON.parse(localStorage.getItem("CompraSAVE"))
const popUp = document.getElementById("pop-up")
//Overlay
const backgroundOverlay = document.querySelector(".screen")



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

//Carrito

function carritoAdd(producto){
    carritoMenu.innerHTML +=`
    <div class="cart-item">
    <div class="cart-item-name">${producto.nombre}</div>
    <div class="cart-item-price">$${producto.precio}</div>
    <i id="${producto.id}" class="cart-quantity-icon fa-solid fa-plus"></i>
    <div class="cart-item-quantity">${producto.cantidad}</div>
    <i id="${producto.id}" class="cart-quantity-icon fa-solid fa-minus"></i>
    <i id="${producto.id}" class="cart-remove-icon fa-solid fa-x"></i>
    </div>`
}

function carritoSubstract(productId) {
    const index = ListaCarrito.findIndex(producto => producto.id == productId);
    if(index !==-1){
        ListaCarrito[index].cantidad--
    }
    if (ListaCarrito[index].cantidad === 0) {
        carritoRemove(index)
    }
    carritoPrint();
}
function carritoRemove(productId){
    const index = ListaCarrito.findIndex(producto => producto.id == productId);
    ListaCarrito.splice(index, 1)
    carritoPrint();
}
function carritoPlus (productId) {
        const index = ListaCarrito.findIndex(producto => producto.id == productId);
        if(index !==-1){
            ListaCarrito[index].cantidad++;
        }
        carritoPrint();
}
function carritoVaciar(){
    ListaCarrito.length = 0
    carritoPrint();
}

function carritoPrint() {
    UsuarioEnSesion.carrito = ListaCarrito
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
    const index = Usuarios.findIndex(usuario => usuario.email === UsuarioEnSesion.email)
    if(index !== -1){
        Usuarios[index].carrito = UsuarioEnSesion.carrito
        localStorage.removeItem("UsuariosSAVE")
        localStorage.setItem("UsuariosSAVE", JSON.stringify(Usuarios))
    }
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
    compraMenu.innerHTML +=`
    <i id="close-button" class="close-icon fa-solid fa-x"></i>
    <p class="total-price">Total: AR$${totalPrecio}</p>
    <div class="purchase-buttons">
        <button id="close-button" class="close-button">Cancelar Compra</button>
        <button id="purchase-button" class="finish-button">Finalizar Compra</button>
    </div>`
    ListaCarrito.forEach(compra => {
        menuCompraAdd(compra)
    })
}

function finalizarCompra(){
    UsuarioEnSesion.compras.push(ListaCompra)
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
//Login
function AlreadyLogged(){
    const index = Usuarios.findIndex(usuario => usuario.logged === true)
    if(index !== -1){
        UsuarioEnSesion.login()
        UsuarioEnSesion.absorb(Usuarios[index])
        ListaCarrito = UsuarioEnSesion.carrito
        loginButton.classList.add("hide")
        logoutButton.classList.remove("hide")
    }
}
function SaveLog(){
    const index = Usuarios.findIndex(usuario => usuario.email === UsuarioEnSesion.email)
    if(index !== -1){
        Usuarios[index].logged= UsuarioEnSesion.logged
        localStorage.removeItem("UsuariosSAVE")
        localStorage.setItem("UsuariosSAVE", JSON.stringify(Usuarios))
    }
}
function Login(event) {
    event.preventDefault();
    let username = document.getElementById("username").value.trim()
    let email = document.getElementById("email").value.trim()
    let password = document.getElementById("password").value
    if (ValidacionDeUsuario(username, email, password)){
        loginMenu.classList.remove("show")
        mensajeError.innerText = ""
        username, email, password = ""
        AccederUsuario(email)
    }
}
function AccederUsuario(Email){
    const index = Usuarios.findIndex(usuario => usuario.email === Email)
    if(index !== -1){
        UsuarioEnSesion.absorb(Usuarios[index])
        UsuarioEnSesion.login()
        Swal.fire({
            toast: true,
            position: "top",
            icon: "success",
            iconColor: "white",
            color: "#f8feff",
            background: "#31c467",
            timer: 2000,
            showConfirmButton: false,
            text: "Se ha iniciado sesión correctamente.",
        })
        loginButton.classList.add("hide")
        logoutButton.classList.remove("hide")
    }
}
function ValidacionDeUsuario(username, email, password){
    let confirmedUsername = ValidarNombre(username)
    let confirmedEmail = ValidarEmail(email)
    let confirmedPassword = ValidarContraseña(password)
    if(confirmedEmail && confirmedPassword && confirmedUsername){
        mensajeError.innerText = "Se ha iniciado sesión exitosamente.";
        mensajeError.style.color = "green"
        return true
    }else if((!confirmedEmail && confirmedUsername && confirmedPassword) || (!confirmedEmail && confirmedUsername && !confirmedPassword)){
        mensajeError.innerText = "El Email no coincide";
        mensajeError.style.color = "red"
    }else if((confirmedEmail && !confirmedUsername && confirmedPassword) || (confirmedEmail && !confirmedUsername && !confirmedPassword)){
        mensajeError.innerText = "El Nombre de Usuario no coincide.";
        mensajeError.style.color = "red";
    }else if(!confirmedPassword && confirmedEmail && confirmedUsername){
        mensajeError.innerText = "Contraseña incorrecta.";
        mensajeError.style.color = "red";
    }
    function ValidarEmail(Email){
        Email = Email
        confirmEmail = Usuarios.some(user => user.email === Email);
        if(confirmEmail === true){
            return true
        }else{
            mensajeError.innerText = "El Email no esta registrado, ";
            mensajeError.innerHTML += `<a href="./signup/signup.html">registrese.</a>`;
            mensajeError.style.color = "red";
        }
    }
    function ValidarNombre(Username){
        return Usuarios.some(user => user.nombre === Username);
    }
    function ValidarContraseña(Password){
        return Usuarios.some(user => user.contraseña === Password);
    }
}

//Eventos
//Mercaderia
Mercaderias.forEach(mercaderia => {
    const cardButton = document.getElementById(`add-to-cart${mercaderia.id}`)
    cardButton.addEventListener("click", ()=>{
        const productoAgregado = ListaCarrito.find(producto => producto.id === mercaderia.id);
        if(UsuarioEnSesion.logged === false){
            Swal.fire({
                text: "Debes iniciar sesión para añadir al carrito.",
                icon: "warning",
                showCloseButton: true,
                confirmButtonColor: "#0d50cc",
                confirmButtonText: "Iniciar Sesión"
              }).then((result) => {
                if (result.isConfirmed) {
                  loginMenu.classList.add("show")
                }
            });
        }else if(UsuarioEnSesion.logged === true){
            if (productoAgregado) {
                productoAgregado.cantidad++;
                carritoPrint()
            }else{
                ListaCarrito.push(new Mercaderia(mercaderia.id, mercaderia.nombre, mercaderia.fabricante, mercaderia.precio, mercaderia.imagen, mercaderia.cantidad));
                carritoPrint()
            }
        }

    })
})
//Carrito
carritoIcon.addEventListener("click", (e)=>{
    carritoIcon.classList.toggle("active")
    carritoMenu.classList.toggle("show")
    if(e.target.parentElement != "div.cart-container"){
        userIcon.classList.remove("active")
        userMenu.classList.remove("show")
    }
})
carritoMenu.addEventListener("click", (click) => {
    if(click.target.classList[2] === "fa-plus"){
        carritoPlus(click.target.id)
    }
    else if(click.target.classList[2] === "fa-x"){
        carritoRemove(click.target.id);
    }
    else if(click.target.id >= 0 && click.target.id!=""){
        carritoSubstract(click.target.id);
    }
    else if(click.target.id === "empty-cart"){
        carritoVaciar();
    } 
    else if(click.target.id === "purchase-cart"){
        carritoComprar()
        compraMenu.classList.add("show-purchase-menu")
        backgroundOverlay.classList.add("show-screen")
    }
})
//Usuario
userIcon.addEventListener("click", (e)=>{
    userIcon.classList.toggle("active")
    userMenu.classList.toggle("show")
    if(e.target.parentElement != "div.user"){
        carritoIcon.classList.remove("active")
        carritoMenu.classList.remove("show")
    }
})
userMenu.addEventListener("click", (e)=>{
    if(e.target.id == "user-login"){
        loginMenu.classList.toggle("show")
        userIcon.classList.remove("active")
        userMenu.classList.remove("show")
    }
    if(e.target.id == "user-logout"){
        Swal.fire({
            title: "¿Seguro que quieres cerrar sesión?",
            icon: "warning",
            confirmButtonColor: "red",
            confirmButtonText: "Cerrar Sesión",
            showCancelButton: true,
            cancelButtonText: "#0d50cc",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {         
                UsuarioEnSesion.logout()
                logoutButton.classList.add("hide")
                loginButton.classList.remove("hide")
                userIcon.classList.remove("active")
                userMenu.classList.remove("show")
            }
          });
    }
    if(e.target.id == "user-purchases"){
        historyMenu.classList.toggle("show")
        loginMenu.classList.toggle("show")
        userIcon.classList.remove("active")
        userMenu.classList.remove("show")
    }
})
//Login
loginMenu.addEventListener("click", (e)=>{
    if(e.target.id == "close-login-icon"){
        loginMenu.classList.remove("show")
    }
})
loginForm.addEventListener("submit", Login)


//Compra
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


