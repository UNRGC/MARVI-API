export const deniedInjections = (req, res, next) => {
    const sqlInjectionPatterns = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|--|#|;|OR|AND)\b|['"]\s*(OR|AND)\s*['"]|['"]\s*=\s*['"])/i;

    const excludedFields = ["dbPass", "dbServer", "password", "contrasena", "foto_src"];

    const checkForInjection = (obj, exclude = []) => {
        for (const key in obj) {
            if (exclude.includes(key)) {
                continue;
            }

            if (typeof obj[key] === "string" && sqlInjectionPatterns.test(obj[key])) {
                return true;
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
                if (checkForInjection(obj[key], exclude)) {
                    return true;
                }
            }
        }
        return false;
    };

    if (checkForInjection(req.body, excludedFields) || checkForInjection(req.query, excludedFields) || checkForInjection(req.params, excludedFields)) {
        return res.status(400).json({ error: "Acción no permitida" });
    }

    next();
};
