const mensajeError = document.getElementById("error")

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
}
const Usuarios =  JSON.parse(localStorage.getItem("UsuariosSAVE")) || []

document.getElementById("signup-form").addEventListener("submit", (event)=> {
    event.preventDefault();
    let username = document.getElementById("username").value.trim()
    let email = document.getElementById("email").value.trim()
    let password = document.getElementById("password").value
    let passwordConfirm = document.getElementById("password-confirm").value
    let confirmedEmail = ValidarEmail(email)
    let confirmedPassword = ConfirmarContraseña(password, passwordConfirm)
    let newEmail = NuevoEmail(email)
    if(confirmedEmail && confirmedPassword && !newEmail){
        mensajeError.innerText = "Usuario creado con éxito.";
        mensajeError.style.color = "green"
        CrearUsuario(email, username, password)
        setTimeout(function() {
            window.location.href="../index.html"
        }, 2500)
    }else if(!confirmedEmail){
        mensajeError.innerText = "Email no válido.";
        mensajeError.style.color = "red"
    }else if(!confirmedPassword){
        mensajeError.innerText = "Las Contraseñas no coinciden.";
        mensajeError.style.color = "red";
    }else if(newEmail){
        mensajeError.innerText = "El Email ya esta en uso.";
        mensajeError.style.color = "red";
    }else{
        mensajeError.innerText = "Hubo un error al crear el Usuario.";
        mensajeError.style.color = "red"
    }
})
function CrearUsuario(email, username, password){
    Usuarios.push(new Usuario(email, username, password))
    localStorage.setItem("UsuariosSAVE", JSON.stringify(Usuarios))
}
function ConfirmarContraseña(password, passwordConfirm){
    if(password === passwordConfirm){
        return true
    }else{
        return false;
    }
}     
function NuevoEmail(emailNuevo){
    emailNuevo = emailNuevo
    return Usuarios.some(user => user.email === emailNuevo);
}
function ValidarEmail(email){
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        return false
    }else{
        return true
    }
}
document.addEventListener("DOMContentLoaded",()=>{
    Swal.fire({
        title: "Cargando...",
        didOpen: () => {
            Swal.showLoading();
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
    });
    setTimeout(() => {
        Swal.close();
    }, 1000);
})