const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const sharp = require('sharp'); // Importamos sharp
const fs = require('fs'); // Para manejar el sistema de archivos
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        return;
    }
    console.log('Conectado a la base de datos');
});

// Configuración de EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de multer para subir imágenes
const storage = multer.memoryStorage(); // Usamos memoria para procesar la imagen antes de guardarla
const upload = multer({ storage });

// Función para optimizar y guardar la imagen
async function optimizarImagen(buffer, filename) {
    const outputPath = path.join(__dirname, 'public/uploads/', filename);
    
    await sharp(buffer)
        .resize(800) // Redimensionar a un ancho máximo de 800px
        .toFormat('jpeg', { quality: 85 }) // Convertir a JPEG con calidad 85
        .toFile(outputPath); // Guardar en el sistema

    return `/uploads/${filename}`;
}

// Asegurarse que el directorio existe
const uploadsDir = path.join(__dirname, 'public/uploads/');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Ruta: Página principal con filtro
app.get('/', (req, res) => {
    const { brand } = req.query; // Obtener el valor del query string

    let query = 'SELECT * FROM images';
    const params = [];

    // Si hay una marca especificada, actualizamos la consulta
    if (brand) {
        query += ' WHERE brand = ?';
        params.push(brand);
    }

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error al obtener imágenes:', err);
            return res.status(500).send('Error al obtener imágenes.');
        }
        res.render('index', { images: results });
    });
});

// Otras rutas...

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
