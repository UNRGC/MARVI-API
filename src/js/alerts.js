import Swal from "./sweetalert2.esm.all.min.js";

/* global Swal */

/* Mensaje sencillo con aceptación y temporizador opcional */
export const alertMessage = async (_title, _text, _icon, _timer) => {
    const res = await Swal.fire({
        title: _title,
        text: _text,
        icon: _icon,
        timer: _timer,
        showConfirmButton: true,
        confirmButtonText: "Aceptar",
        allowOutsideClick: false,
        timerProgressBar: true,
        customClass: {
            popup: "alert-popup",
            confirmButton: "alert-confirm",
        },
    });
    return res.isConfirmed;
};

/* Mensaje de confirmación con aceptación y cancelación */
export const alertConfirm = async (_title, _text, _icon) => {
    const res = await Swal.fire({
        title: _title,
        text: _text,
        icon: _icon,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        allowOutsideClick: false,
        customClass: {
            popup: "alert-popup",
            confirmButton: "alert-confirm",
            cancelButton: "alert-cancel",
        },
    });
    return res.isConfirmed;
};

/* Toast de notificación con temporizador */
export const alertToast = async (_title, _text, _icon, _timer, _position) => {
    let timeLeft = _timer / 1000;

    const Toast = Swal.mixin({
        toast: true,
        position: _position,
        timer: _timer,
        showConfirmButton: false,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;

            const content = toast.querySelector(".swal2-html-container");

            content.innerHTML = _text.replace("%", timeLeft);

            const countdown = setInterval(() => {
                timeLeft--;
                content.innerHTML = _text.replace("%", timeLeft);
                if (timeLeft <= 0) {
                    clearInterval(countdown);
                }
            }, 1000);
        },
    });

    const res = await Toast.fire({
        title: _title,
        text: _text.replace("%", timeLeft),
        icon: _icon,
        customClass: { popup: "alert-popup" },
    });

    return res.isConfirmed;
};
