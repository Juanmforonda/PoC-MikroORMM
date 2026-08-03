# PoC-MikroORMM

Prueba de concepto (PoC) para explorar el uso de **MikroORM** en una aplicación Node.js/TypeScript, enfocada en modelado de entidades, persistencia de datos y buenas prácticas de arquitectura backend.

---

## Objetivo del proyecto

Este repositorio demuestra cómo implementar una capa de acceso a datos robusta usando MikroORM, validando:

- Definición de entidades y relaciones.
- Configuración del ORM en entorno TypeScript.
- Operaciones CRUD con enfoque desacoplado.
- Organización del código para facilitar escalabilidad y mantenimiento.

---

## Qué se aplicó principalmente

### ORM & Base de Datos
- Configuración y uso de **MikroORM**.
- Mapeo objeto-relacional (ORM) en TypeScript.
- Definición de relaciones entre entidades (1:1, 1:N, N:N según el caso).
- Manejo de migraciones/esquemas (si aplica en el flujo actual).
- Uso de seeders.

### TypeScript
- Tipado estático para mayor seguridad y mantenibilidad.
- Uso de interfaces/DTOs para contratos claros.
- Estructuración modular del proyecto.
