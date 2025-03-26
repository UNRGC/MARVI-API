import { get, post } from "./api.js";

export const getConnection = async () => {
    const response = await get("env");
    return response;
};

export const updateConnection = async (dbUser, dbPass, dbServer, dbName, online, serverEmail, email, password, timeZone, dateFormat, timeFormat) => {
    const data = {
        dbUser,
        dbPass,
        dbServer,
        dbName,
        online,
        serverEmail,
        email,
        password,
        timeZone,
        dateFormat,
        timeFormat,
    };

    const response = await post("env", data);
    return response;
};
