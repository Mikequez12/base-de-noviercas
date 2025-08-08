async function login() {
    let loginbtn = document.querySelector('#loginbtn');
    loginbtn.setAttribute('disabled',true);
    setTimeout(() => {
        loginbtn.removeAttribute('disabled');
    }, 1500);
    let dsr = document.querySelector('#dsr').value.toUpperCase();
    let users = await getUsers()
        .then(response => response[dsr.toUpperCase()]);
    if (users.DSR == undefined) {
        alert('Error, puede que ese DSR no se encuentre en nuestras bases de datos.');
        return false;
    } else {
        document.querySelector('.form').innerHTML=`<h1>Verificación</h1><p>Hemos enviado un correo electrónico a su cuenta. Contiene un enlace con el que puede iniciar sesión. Recuerde revisar el apartado de <b>"spam"</b>.</p><span style="color:gray;">Por seguridad, el enlace caducará en 5 minutos.</span><p><a style="text-decoration:underline;cursor:pointer;">Reenviar mail</a></p>`;

        document.querySelector('.form a').addEventListener(
            'click',
            () => {
                sendMail()
            }
        )

        async function sendMail() {
            alert('Enviando mensaje...')
            let data = await fetch('https://base-de-noviercas.onrender.com/token',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"dsr":users.DSR,"name":users.name,"mail":users.mail})
            })
            .then(r => r.json());
            console.log('Se ha procesado la solicitud del TOKEN');
            if (!data.ok) {
                alert('El envío de mensaje ha fallado... enviando de nuevo...');
                setTimeout(() => {
                    sendMail();
                }, 1500)
            } else {
                alert('Se ha enviado el mensaje correctamente.')
            }
            return data
        }

        await sendMail();
        /*const send = await fetch('https://base-de-noviercas.onrender.com/send',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name": users.name,
                "token": data.token,
                "mail": users.mail
            })
        }).then(r => r.json());*/

        /*sendLoginMail(
            encodeURIComponent(
                btoa(
                    decode(
                        cookieToken(
                            createPersonalToken(),
                            users
                        )
                    )
                )
            ),
            dsr
        );*/
    }
}

function loadMainJS(timeout=10000) {
    const interval = 50;
    let waited = 0;

    return new Promise((resolve, reject) => {
    const check = () => {
        if (typeof window.decode === 'function') {
        resolve();
        } else if (waited >= timeout) {
        reject(new Error("main.js no está disponible después del tiempo límite"));
        } else {
        waited += interval;
        setTimeout(check, interval);
        }
    };
    check();
    });
}

async function main() {
    await loadMainJS();
    if (parseCookies().acc!='' && parseCookies().acc!=undefined) {
        window.location.href='account';
    }
}

main();
