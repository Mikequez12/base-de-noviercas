<head>
    <meta charset='UTF-8'>
</head>

# Cambios en la web
Se registran los cambios más importantes de la web, para información concreta de la web actual, prueba a ir a la sección de [version](version).
## 2025
### 06/25
Anteriormente la web se alojaba en http://glitch.com, un servicio que aceptaba un hosting personalizado 24/7, lo que permitía envío de formularios automatizados.

Tras problemas con la plataforma se disputa entre dos elecciones:
1. Usar **Github**
Con Github, el servicio sería 24/7, aunque no se aceptarían los formularios tales como el de inicio de sesión, conque la arquitectura del proyecto debería cambiarse.

2. Usar **túneles**
Con otros servicios se podría conseguir el mismo servicio sin cambiar el código, aunque un ordenador debería estar encendido para que la web estuviera disponible; esto significa que la web sería temporal si no se quisieran pagar tasas para servidores.

Tras una meditación intensa se ha tomado la decisión de usar **Github**, ya que por lo menos no dependeríamos de una pequeña máquina.
Se ha cambiado toda la arquitectura y jerarquía del proyecto para poder aguantar un backend como el de **Github**, aunque la seguridad del usuario comienza a ser preocupante.

Cambios realizados:
- Backend
    - Se ha cambiado el servicio de `glitch` a `github`
- Frontend
    - Se han cambiado los servicios internos en un intento de ser más flexible para gitub
        - Se ha simplificado y privatizado el inicio de sesión
        - Cambio en la forma de interpretación y guardado en los Tokens

### 07/25
Tras graves preocupaciones del desarrollador sobre la protección de datos y seguridad de los usuarios, se ha implementado temporalmente un sistema mejor, que envíe los datos a un servidor, en vez de un uso local; de nuevo, hemos conseguido esto gracias a [Glitch](http://glitch.com)*, donde hemos alojado los servidores de verificación.

*<span style="font-size:10px;">Posteriormente se cambió a [render](https://render.com) por el fín del hosting de Glitch</span>

Como este servicio se usa muy poco, los servidores no se saturarán ni un mínimo.

Añadido soporte `CORS` y habilitado `HTTPS` en el backend para resolver problemas de llamadas bloqueadas por `Mixed Content`.

Se ha tenido que cambiar de `Glith` a `Render` ([render.com](https://render.com)) para hacer el backend posible.
También se ha tratado de mejorar la conmpatibilidad con teléfonos y mejorar el estilo gráfico.

Hemos añadido un diagrama de tipo `mermaid` para que otros DEVs entiendan cómo funciona el nuevo backend.

Se ha creado una previsualización de peticiones.

También hemos cambiado el sistema de peticiones para que los envíos sean automáticos, previniendo hacks.

Estas son las mejoras:
- Seguridad
    - Tokens del lado del servidor
    - Verificación anónima
    - Acceso denegado a los tokens
    - Se ha añadido el uso de los códigos QR
        - Se ha arreglado el uso de los QR
- Planes
    - Al dejar de usar `EmailJS`, y usar en vez de eso usar `Render`, se ha quitado el límite de 200 mails que teníamos antes
- Estilo de la web
    - Se ha mejorado la compatibilidad con teléfonos, aunque sigue siendo mejorable
    - Se ha aplicado un estilo más limpio a la interfaz general
    - Nueva función para cambiar el color de la web
- Frontend
    - El uso de tokens se ha globalizado para que sea posible en todo dispositivo
- Variables persistentes
    - Se ha mejorado el modo en el que se guarda la información de inicio de sesión
        - Mejor seguridad contra hacks
        - Mayor navegabilidad al mantener la sesión iniciada