import 'reflect-metadata'; //Lo que hace es habilitar el uso de decoradores en TypeScript. Es necesario para que MikroORM funcione correctamente con TypeScript.
import { bootstrap } from './app.js';
try {
    const { server, port } = await bootstrap();
    console.log(`server started at http://localhost:${port}`);
}
catch (e) {
    console.error(e);
}
