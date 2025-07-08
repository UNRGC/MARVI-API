const protocol = window.location.protocol;
const host = window.location.host;
const url = `${protocol}//${host}`;

console.log(url);

// Realiza una solicitud GET a la URL especificada
export const get = async (rute) => {
    const response = await fetch(`${url}/${rute}`, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.json();
};

// Realiza una solicitud POST a la URL especificada con los datos proporcionados
export const post = async (rute, data) => {
    const response = await fetch(`${url}/${rute}`, {
        mode: "cors",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response.json();
};

// Realiza una solicitud PUT a la URL especificada con los datos proporcionados
export const put = async (rute, data) => {
    const response = await fetch(`${url}/${rute}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return response.json();
};

// Realiza una solicitud DELETE a la URL especificada
export const del = async (rute) => {
    const response = await fetch(`${url}/${rute}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.json();
};
