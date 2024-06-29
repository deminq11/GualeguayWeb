const passwordForm = document.getElementById("passwordForm")
passwordForm.addEventListener("submit", Password)
function Password(event){
    event.preventDefault();
    const password = document.getElementById("password").value;
    const messageDiv = document.getElementById("message");
    const passwordInput = document.getElementById("password");

    if (password === "2024") {
        messageDiv.innerText = "Bienvenido!";
        messageDiv.style.color = "green";
        window.location.href = "../index.html";
    } else {
        intento++
        messageDiv.innerText = "La contraseña es incorrecta, intente de nuevo.";
        messageDiv.style.color = "red";
        if (intento>5){
                messageDiv.textContent = "Tuvo demasiados intentos incorrectos, intente de nuevo más tarde.";
                passwordInput.remove();
            }
        }
}