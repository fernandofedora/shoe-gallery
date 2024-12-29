const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const sharp = require('sharp'); // Importamos sharp
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

// Ruta: Página principal
app.get('/', (req, res) => {
    db.query('SELECT * FROM images', (err, results) => {
        if (err) throw err;
        res.render('index', { images: results });
    });
});

// Ruta: Formulario para agregar imagen
app.get('/add', (req, res) => {
    res.render('add');
});

// Ruta: Crear nueva imagen
app.post('/add', upload.single('image'), async (req, res) => {
    const { title, brand } = req.body;
    
    try {
        const image_path = await optimizarImagen(req.file.buffer, `${Date.now()}_${req.file.originalname}`);
        db.query('INSERT INTO images (title, brand, image_path) VALUES (?, ?, ?)', [title, brand, image_path], (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    } catch (error) {
        console.error('Error al optimizar la imagen:', error);
        res.status(500).send('Error al subir la imagen.');
    }
});

// Ruta: Formulario para editar
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM images WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.render('edit', { image: results[0] });
    });
});

// Ruta: Actualizar imagen
app.post('/edit/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, brand } = req.body;
    
    let updateQuery = 'UPDATE images SET title = ?, brand = ?';
    const params = [title, brand];

    try {
        // Si se sube una nueva imagen
        if (req.file) {
            const image_path = await optimizarImagen(req.file.buffer, `${Date.now()}_${req.file.originalname}`);
            updateQuery += ', image_path = ?';
            params.push(image_path);
        }

        updateQuery += ' WHERE id = ?';
        params.push(id);

        db.query(updateQuery, params, (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    } catch (error) {
        console.error('Error al optimizar la imagen:', error);
        res.status(500).send('Error al actualizar la imagen.');
    }
});

// Ruta: Eliminar imagen
app.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM images WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
