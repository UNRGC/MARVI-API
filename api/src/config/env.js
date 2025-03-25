import { writeFileSync, existsSync, readFileSync } from "fs";

const newSecret = () => {
    const secret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return secret;
};

export const getSecret = () => {
    const envFilePath = ".env";
    const envContent = readFileSync(envFilePath, "utf8");
    const envVariables = envContent.split("\n").map((line) => line.split("="));
    const envObject = Object.fromEntries(envVariables);
    const { JWT_SECRET } = envObject;
    return JWT_SECRET;
};

export const envStart = () => {
    const envFilePath = ".env";
    if (!existsSync(envFilePath)) {
        const envContent = `JWT_SECRET=${newSecret()}
PORT=3000
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_URI=
SERVER_EMAIL=gmail
USER_EMAIL=
PASSWORD_EMAIL=
TIME_ZONE=America/Mexico_City
DATE_FORMAT=DD/MM/YYYY
TIME_FORMAT=HH:mm:ss`;

        writeFileSync(envFilePath, envContent, "utf8");
        console.debug("Entorno creado con éxito");
    } else console.debug("Entorno cargado con éxito");
};
