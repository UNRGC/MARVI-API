import { alertConfirm, alertMessage, alertToast } from "./alerts.js";
import { get, del } from "./api.js";
import { getConnection, updateConnection } from "./connection.js";
import { changeTheme, loadTheme } from "./theme.js";
const { ipcRenderer } = require("electron");

let hash = window.location.hash || "#console";

const themeBtn = document.getElementById("theme");

const connectionBtn = document.getElementById("connection");
const consoleBtn = document.getElementById("console");
const usersBtn = document.getElementById("users");
const exitBtn = document.getElementById("exit");

const connectionSection = document.querySelector(".connection");
const consoleSection = document.querySelector(".console");
const usersSection = document.querySelector(".users");

const formConnection = document.querySelector(".connection");
const userInput = document.getElementById("user");
const passInput = document.getElementById("pass");
const serverInput = document.getElementById("server");
const databaseInput = document.getElementById("database");
const onlineInput = document.getElementById("online");
const serviceSelect = document.getElementById("service");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const timeZoneInput = document.getElementById("timeZone");
const dateFormatInput = document.getElementById("date");
const discardBtn = document.getElementById("discard");
const saveBtn = document.getElementById("save");

const consoleOutput = document.getElementById("output");
const cleanBtn = document.getElementById("clean");

const tbody = document.querySelector("tbody");
const closeBtn = document.getElementById("close");

// Escuchar la salida de la API desde el proceso principal
ipcRenderer.on("api-output", (event, data) => {
    // Crear un nuevo div para cada mensaje
    const messageElement = document.createElement("div");

    // Asegurarse de que el contenido del div sea solo el mensaje recibido
    messageElement.textContent = data;

    // Asignar clases según el contenido del mensaje
    if (data.includes("Error:")) messageElement.classList.add("error");
    else if (data.includes("Conectado") || data.includes("éxito")) messageElement.classList.add("success");
    else if (data.includes("Creando")) messageElement.classList.add("warning");

    // Agregar el nuevo div al contenedor de salida
    consoleOutput.appendChild(messageElement);
    loadUsers();
});

// Header buttons

const hashChange = () => {
    hash = window.location.hash;

    connectionBtn.classList.remove("active");
    consoleBtn.classList.remove("active");
    usersBtn.classList.remove("active");

    connectionSection.classList.add("hidden");
    consoleSection.classList.add("hidden");
    usersSection.classList.add("hidden");

    if (hash === "#connection") {
        connectionBtn.classList.add("active");
        connectionSection.classList.remove("hidden");
    } else if (hash === "#console") {
        consoleBtn.classList.add("active");
        consoleSection.classList.remove("hidden");
    } else if (hash === "#users") {
        usersBtn.classList.add("active");
        usersSection.classList.remove("hidden");
    }

    discardBtn.click();
};

window.addEventListener("hashchange", () => {
    hashChange();
});

exitBtn.addEventListener("click", async () => {
    exitBtn.classList.add("active");
    if (await alertConfirm("¿Estás seguro?", "Si sales ahora, todos los usuarios conectados perderán acceso al sistema y cualquier trabajo no guardado se perderá.", "warning")) setTimeout(() => window.close(), 250);
    else exitBtn.classList.remove("active");
});

themeBtn.addEventListener("click", () => {
    const icon = themeBtn.querySelector("i");

    if (icon.classList.contains("bi-cloud-sun")) {
        icon.classList.replace("bi-cloud-sun", "bi-cloud-moon");
    } else {
        icon.classList.replace("bi-cloud-moon", "bi-cloud-sun");
    }

    changeTheme();
});

// Panel de conexión

const enableButtons = () => {
    discardBtn.disabled = false;
    saveBtn.disabled = false;
};

[userInput, databaseInput, serviceSelect, emailInput, passInput, passwordInput, timeZoneInput, dateFormatInput].forEach((input) => {
    input.addEventListener("focus", enableButtons);
});

discardBtn.addEventListener("click", () => {
    discardBtn.disabled = true;
    saveBtn.disabled = true;
});

formConnection.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (await alertConfirm("¿Deseas aplicar los cambios?", "Esta acción no se puede deshacer. Asegúrate de tener las credenciales correctas antes de proceder.", "warning")) {
        const response = await updateConnection(userInput.value, passInput.value, serverInput.value, databaseInput.value, onlineInput.checked, serviceSelect.value, emailInput.value, passwordInput.value, timeZoneInput.value, dateFormatInput.value);

        if (response.message.includes("éxito")) {
            const action = async () => {
                if (!(await alertToast("", "La aplicación se cerrara en % segundos", "info", 10000, "bottom"))) setTimeout(() => window.close(), 250);
            };

            if (await alertMessage("Cambios aplicados", "Los cambios se han guardado correctamente. Por favor, reinicia la aplicación para que surtan efecto.", "success", 5000)) action();
            else action();
        } else {
            alertMessage("Error al guardar", "No se pudieron guardar los cambios. Por favor, verifica tus credenciales e intenta nuevamente.", "error", 5000);
        }
    }
});

// Panel de consola

cleanBtn.addEventListener("click", () => {
    consoleOutput.innerText = "";
});

// Panel de usuarios

async function loadUsers() {
    const response = await get("users/active");

    tbody.innerHTML = "";

    response.forEach((user) => {
        const tr = document.createElement("tr");

        const tdName = document.createElement("td");
        tdName.innerText = user.usuario;

        const tdEmail = document.createElement("td");
        tdEmail.innerText = user.nombre_usuario;

        const tdRole = document.createElement("td");
        tdRole.innerText = user.rol_usuario;

        const tdActivity = document.createElement("td");
        tdActivity.innerText = user.ultima_actividad;

        tr.appendChild(tdName);
        tr.appendChild(tdEmail);
        tr.appendChild(tdRole);
        tr.appendChild(tdActivity);

        tbody.appendChild(tr);
    });
}

closeBtn.addEventListener("click", async () => {
    if (await alertConfirm("¿Estás seguro?", "Si cierras las sesiones, todos los usuarios conectados perderán acceso al sistema y cualquier trabajo no guardado se perderá.", "warning")) {
        const response = await del("login/logout");
        if (response) {
            tbody.innerHTML = "";
        }
    }
});

// Inicio

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await getConnection();

        userInput.value = data.DB_USER;
        serverInput.value = data.DB_SERVER;
        databaseInput.value = data.DB_NAME;
        onlineInput.checked = data.ONLINE === "true";
        serviceSelect.value = data.SERVER_EMAIL;
        emailInput.value = data.USER_EMAIL;
        timeZoneInput.value = data.TIME_ZONE;
        dateFormatInput.value = data.DATE_FORMAT;

        [passInput, passwordInput].forEach((input) => {
            const placeholder = input.placeholder;

            if (userInput.value !== "" || emailInput.value !== "") input.placeholder = "••••••••";

            input.addEventListener("focus", () => {
                input.placeholder = placeholder;
            });
        });
    } catch (error) {
        alertMessage("Error de conexión", "No se pudo establecer conexión con el servidor. Por favor, verifica tus credenciales e intenta nuevamente.", "error", 5000);
    }
});

loadTheme();
window.location.hash = hash;
hashChange();
