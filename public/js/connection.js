import {get, post} from "./api.js";

export const getConnection = async () => {
    return await get("env");
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

    return await post("env", data);
};
