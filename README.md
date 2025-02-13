# shoe-gallery
It's just an attempt to help my girlfriend organize her shoe collection and in this way give her better information about her stock to help her make a decision about her next purchases. She has a lot of shoes, but she doesn't have space XD

# 📸 Image Gallery

A web application to securely store, manage, and display images with MySQL and Express.js.

## ✨ Features
- **Upload & Optimize Images**: Uses `sharp` to resize and compress images.
- **Store & Retrieve**: Save image metadata in MySQL.
- **Filter by Category**: Query images by brand.
- **Edit & Delete**: Modify and remove images.
- **User-Friendly UI**: Built with EJS and Bootstrap.

## 🛠️ Technologies
- **Backend**: Node.js + Express
- **Database**: MySQL
- **Image Processing**: `sharp`
- **File Uploads**: `multer`
- **Templating**: EJS
- **Styling**: Bootstrap

## 📂 File Structure
```
📁 image-gallery
 ├── 📄 app.js         # Main server file
 ├── 📂 views         # EJS templates
 ├── 📂 public        # Static assets (images, CSS, JS)
 ├── 📂 uploads       # Uploaded images
 ├── 📂 routes        # Express route handlers
 ├── 📂 config        # Database configuration
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js v16+
- MySQL Database
- npm/Yarn

### Steps to Run
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/image-gallery.git
   cd image-gallery
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure environment**:
   - Create `.env` file and set your MySQL credentials:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=image_gallery
     PORT=3000
     ```
4. **Run the server**:
   ```bash
   npm start
   ```
   Output should confirm:
   ```
   Server started on http://localhost:3000
   ```
5. **Access the app**: Open `http://localhost:3000` in a browser.

## 📸 Image Upload Example
### Upload Image
```http
POST /add
Content-Type: multipart/form-data

(title: "My Image", brand: "Nature", image: [file])
```

## 🖼️ UI Preview
### Homepage
![Image Gallery UI](https://via.placeholder.com/800x400)

## 🤝 Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit changes:
   ```bash
   git commit -m 'Add new feature'
   ```
4. Push to branch:
   ```bash
   git push origin feature/new-feature
   ```
5. Open a Pull Request.

## 📄 License
MIT License - See LICENSE for details.

