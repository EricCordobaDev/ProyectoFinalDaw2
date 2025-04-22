# Guía de instalación del proyecto

## 1. Clonar el repositorio

```bash
git clone https://github.com/EricCordobaDev/ProyectoFinalDaw2.git
cd ProyectoFinalDaw2
```

## 2. Copiar y configurar variables de entorno

Copia el fichero de ejemplo:

```bash
cp .env.example .env
```

Edita `.env` con tus datos de conexión:

- `DB_HOST`
- `DB_DATABASE`
- `DB_USERNAME`
- `DB_PASSWORD`
- Otros según sea necesario

## 3. Instalar dependencias PHP y JS

```bash
composer install
npm install
```

## 4. Generar clave de aplicación

```bash
php artisan key:generate
```

## 5. Ejecutar migraciones y seeders

```bash
php artisan migrate --seed
```


```bash
npm run build
```

## 6. Levantar servidor local

```bash
composer run dev
```
