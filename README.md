# PoC MikroORM - Prueba de Concepto sobre ORMs

Esta es una **Prueba de Concepto (PoC)** que demuestra cómo implementar y usar **MikroORM** como ORM (Object-Relational Mapping) con **MySQL**, **Node.js** y **TypeScript**.

## 🎯 Objetivo de la PoC

Evaluar las capacidades y facilidad de uso de MikroORM como alternativa a otros ORMs populares como Sequelize, Prisma o TypeORM, específicamente enfocándose en:

- Configuración inicial y setup
- Definición de entidades con decoradores
- Operaciones CRUD básicas
- Gestión de migraciones
- Performance y facilidad de desarrollo

## 🔧 Tecnologías Utilizadas

- **MikroORM v6.5.2** - ORM principal
- **MySQL** - Base de datos relacional
- **TypeScript** - Lenguaje de programación
- **Node.js** - Runtime de JavaScript
- **mysql2** - Driver de MySQL para Node.js

## 📋 Requisitos Previos

Antes de inicializar la aplicación, asegúrate de tener instalado:

- **Node.js** (v18 o superior) - [Descargar aquí](https://nodejs.org/)
- **MySQL Server** (v8.0 o superior) - [Descargar aquí](https://dev.mysql.com/downloads/mysql/)
- **npm** o **yarn** (incluido con Node.js)
- **Git** (opcional, para clonar el repositorio)

## 🚀 Cómo Inicializar la Aplicación

### Paso 1: Preparar el Entorno

1. **Clona el repositorio** (si no lo has hecho):

   ```bash
   git clone https://github.com/Juanmforonda/PoC-MikroORMM.git
   cd PoC-MikroORMM
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

### Paso 2: Configurar MySQL

1. **Inicia MySQL Server** en tu sistema
2. **Crea la base de datos**:
   ```sql
   CREATE DATABASE mikroorm_db;
   ```
3. **Verifica la conexión** con las credenciales que usarás

### Paso 3: Configurar Variables de Entorno

1. **Edita el archivo `.env`** con tus credenciales de MySQL:

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=tu_password_aqui
   DB_NAME=mikroorm_db

   # Environment
   NODE_ENV=development
   ```

### Paso 4: Crear el Schema de Base de Datos

**Opción A: Crear tablas automáticamente**

```bash
npm run schema:create
```

**Opción B: Usar migraciones (recomendado para producción)**

```bash
# Crear migración inicial
npm run migration:create

# Ejecutar migraciones
npm run migration:up
```

### Paso 5: Ejecutar la Aplicación

**Para desarrollo con recarga automática:**

```bash
npm run dev:watch
```

**Para ejecución simple:**

```bash
npm run dev
```

**Para producción (compilado):**

```bash
npm run build
npm start
```

## 📂 Estructura del Proyecto

```
PoC-MikroORMM/
├── src/
│   ├── entities/              # 📁 Definiciones de entidades
│   │   └── User.ts           # 👤 Entidad Usuario de ejemplo
│   ├── migrations/           # 📁 Migraciones de base de datos
│   ├── mikro-orm.config.ts   # ⚙️ Configuración de MikroORM
│   └── index.ts             # 🚀 Punto de entrada principal
├── dist/                    # 📁 Código compilado (generado)
├── .env                     # 🔐 Variables de entorno
├── .gitignore              # 📝 Archivos ignorados por Git
├── package.json            # 📦 Dependencias y scripts
├── tsconfig.json           # 📝 Configuración de TypeScript
└── README.md               # 📖 Esta documentación
```

## 🛠️ Scripts Disponibles

| Comando                    | Descripción                       | Cuándo usarlo        |
| -------------------------- | --------------------------------- | -------------------- |
| `npm run dev`              | Ejecuta en modo desarrollo        | Desarrollo y testing |
| `npm run dev:watch`        | Desarrollo con recarga automática | Desarrollo activo    |
| `npm run build`            | Compila TypeScript a JavaScript   | Antes de producción  |
| `npm start`                | Ejecuta la versión compilada      | Producción           |
| `npm run schema:create`    | Crea todas las tablas             | Setup inicial        |
| `npm run schema:drop`      | Elimina todas las tablas          | Reset completo       |
| `npm run schema:update`    | Actualiza schema existente        | Cambios en entidades |
| `npm run migration:create` | Crea nueva migración              | Cambios controlados  |
| `npm run migration:up`     | Ejecuta migraciones pendientes    | Aplicar cambios      |
| `npm run migration:down`   | Revierte última migración         | Rollback             |

## 🏗️ Arquitectura de MikroORM

### Componentes Principales

1. **Entity Manager (EM)**: Gestiona el ciclo de vida de las entidades
2. **Repository Pattern**: Abstrae las operaciones de base de datos
3. **Unit of Work**: Rastrea cambios y optimiza queries
4. **Identity Map**: Evita objetos duplicados en memoria

### Flujo de Trabajo Típico

```typescript
// 1. Inicializar MikroORM
const orm = await MikroORM.init(config);
const em = orm.em;

// 2. Crear entidad
const user = new User();
user.name = 'Juan';
user.email = 'juan@example.com';

// 3. Persistir (guardar)
await em.persistAndFlush(user);

// 4. Consultar
const users = await em.find(User, { name: 'Juan' });

// 5. Cerrar conexión
await orm.close();
```

## 🧪 Probando la PoC

### Operaciones Básicas Incluidas

El archivo `src/index.ts` demuestra:

1. ✅ **Conexión a la base de datos**
2. ✅ **Creación de registros** (`persistAndFlush`)
3. ✅ **Consulta de datos** (`find`)
4. ✅ **Manejo de errores**
5. ✅ **Cierre de conexión**

### Resultados Esperados

Al ejecutar `npm run dev`, deberías ver:

```
Usuario creado: User { id: 1, name: 'Juan Pérez', email: 'juan@example.com', ... }
Todos los usuarios: [ User { id: 1, name: 'Juan Pérez', email: 'juan@example.com', ... } ]
```

## 🔍 Entidades Definidas

### User Entity

```typescript
@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  email!: string;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
```

**Características:**

- Primary Key autoincremental
- Timestamps automáticos
- Validación de tipos con TypeScript
- Mapeo automático a tabla MySQL

## 🚨 Solución de Problemas

### Error: "Connection refused"

- ✅ Verifica que MySQL esté ejecutándose
- ✅ Confirma las credenciales en `.env`
- ✅ Asegúrate de que la base de datos exista

### Error: "Table doesn't exist"

- ✅ Ejecuta `npm run schema:create`
- ✅ O usa migraciones: `npm run migration:create && npm run migration:up`

### Error de TypeScript

- ✅ Ejecuta `npm run build` para verificar errores
- ✅ Revisa `tsconfig.json` si es necesario

### Error: "Cannot find module"

- ✅ Ejecuta `npm install` para instalar dependencias
- ✅ Verifica que todas las importaciones sean correctas

## 📊 Evaluación de MikroORM (Resultados de la PoC)

### ✅ Ventajas Identificadas

- **Type Safety**: Excelente integración con TypeScript
- **Performance**: Lazy loading y optimización de queries automática
- **Flexibilidad**: Soporte para múltiples patrones (Active Record, Data Mapper)
- **Migraciones**: Sistema robusto de versionado de schema
- **Decoradores**: Sintaxis limpia y expresiva

### ⚠️ Consideraciones

- **Curva de aprendizaje**: Más complejo que ORMs simples
- **Documentación**: Menos recursos que Sequelize o Prisma
- **Ecosistema**: Comunidad más pequeña

## 🔗 Recursos Adicionales

- [Documentación Oficial de MikroORM](https://mikro-orm.io/)
- [Guía de Migraciones](https://mikro-orm.io/docs/migrations)
- [Ejemplos Avanzados](https://github.com/mikro-orm/mikro-orm/tree/master/tests)

---

**Nota**: Esta PoC está diseñada para evaluar MikroORM en un entorno de desarrollo. Para producción, considera aspectos adicionales como pooling de conexiones, logging, monitoreo y optimización de queries.
