import { writeFileSync, readFileSync } from "fs";
import { getCreated, getSecret } from "../config/env.js";

export const envGet = () => {
    const envFilePath = ".env";
    const envContent = readFileSync(envFilePath, "utf8");
    const envVariables = envContent.split("\n").map((line) => line.split("="));
    const envObject = Object.fromEntries(envVariables);
    const { DB_USER, DB_NAME, DB_SERVER, SERVER_EMAIL, USER_EMAIL, TIME_ZONE, DATE_FORMAT } = envObject;
    return { DB_USER, DB_NAME, DB_SERVER, SERVER_EMAIL, USER_EMAIL, TIME_ZONE, DATE_FORMAT };
};

export const envUpdate = (data) => {
    const envFilePath = ".env";
    const envContent = `JWT_SECRET=${getSecret()}
PORT=3000
DB_USER=${data.dbUser}
DB_PASSWORD=${data.dbPass}
DB_SERVER=${data.dbServer}
DB_NAME=${data.dbName}
DB_URI=postgresql://${data.dbUser}:${data.dbPass}@${data.dbServer}:5432
SERVER_EMAIL=${data.serverEmail}
USER_EMAIL=${data.email}
PASSWORD_EMAIL=${data.password}
TIME_ZONE=${data.timeZone}
DATE_FORMAT=${data.dateFormat}
TIME_FORMAT=HH:mm:ss
CREATED=${getCreated()}`;

    writeFileSync(envFilePath, envContent, "utf8");
};

export const envUpdateCreated = (created) => {
    const envFilePath = ".env";
    const envContent = readFileSync(envFilePath, "utf8");
    const envVariables = envContent.split("\n").map((line) => line.split("="));
    const envObject = Object.fromEntries(envVariables);
    envObject.CREATED = created;
    const newContent = Object.entries(envObject)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");
    writeFileSync(envFilePath, newContent, "utf8");
};
