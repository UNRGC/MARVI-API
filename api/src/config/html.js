import { mkdirSync, writeFileSync, existsSync } from "fs";

const htmlStart = () => {
    const htmlDir = "templates";
    if (!existsSync(htmlDir)) {
        mkdirSync(htmlDir, { recursive: true });
    }

    const htmlFiles = [
        {
            path: `${htmlDir}/email.html`,
            content: `<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Recuperar contraseña</title>
        <style>
            body {
                font-family: "Inter", sans-serif;
                margin: 0;
                padding: 32px;
                color: #2d3e58;
            }

            img {
                display: block;
                margin: 0 auto;
                width: 256px;
                height: auto;
            }

            h1 {
                text-align: center;
                margin-top: 32px;
                color: #dd5746;
            }

            p {
                text-align: center;
                margin: 0;
                margin-top: 32px;
            }
        </style>
    </head>
    <body>
        <img src="cid:logo" alt="Logo" />
        <h1>_asunto</h1>
        <p style="font-size: 16px">_mensaje</p>
        <p>Este es un mensaje automático. Si tienes alguna duda, por favor no dudes en contactarnos o acudir a nuestra sucursal. <b>Gracias por tu preferencia.</b></p>
    </body>
</html>
`,
        },
        {
            path: `${htmlDir}/recovery.html`,
            content: `<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Recuperar contraseña</title>
        <style>
            body {
                font-family: "Inter", sans-serif;
                margin: 0;
                padding: 32px;
                color: #2d3e58;
            }

            img {
                display: block;
                margin: 0 auto;
                width: 256px;
                height: auto;
            }

            h1 {
                text-align: center;
                margin-top: 32px;
                color: #dd5746;
            }

            p {
                text-align: center;
                margin: 0;
                margin-top: 32px;
            }

            section {
                display: block;
                margin: 0 auto;
                min-width: 200px;
                max-width: max-content;
                height: max-content;
                border: 1px solid #dd5746;
                border-radius: 8px;
                text-align: center;
                line-height: 64px;
                font-size: 24px;
                margin-top: 32px;
            }

            strong {
                color: #dd5746;
            }
        </style>
    </head>
    <body>
        <img src="cid:logo" alt="Logo" />
        <h1>Restablecimiento de contraseña</h1>
        <p>Hola, hemos recibido tu solicitud para restablecer tu contraseña. <b>Puedes iniciar sesión con la siguiente contraseña:</b></p>
        <section>
            <strong>_temp</strong>
        </section>
        <p>Por favor, asegúrate de cambiar tu contraseña en la configuración de tu usuario.</p>
    </body>
</html>
`,
        },
    ];

    htmlFiles.forEach(({ path, content }) => {
        if (!existsSync(path)) writeFileSync(path, content, "utf8");
    });
};

export default htmlStart;
