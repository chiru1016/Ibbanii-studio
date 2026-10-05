# Ibbanii Studio - Cloudinary Image Upload

This version adds gallery image upload for products.

## 1. Install backend packages

cd server
npm.cmd install

## 2. Add these variables to server/.env

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Do not put the Cloudinary API secret in the React client or commit it to GitHub.

## 3. How it works

Admin selects an image in Add Product.
The React app sends the image as multipart/form-data.
The Express backend receives it with Multer.
The backend uploads it to Cloudinary in:
ibbanii/products
MongoDB stores the Cloudinary secure URL in the Product.image field.

## 4. Render

Add the same three CLOUDINARY_* variables in Render Environment Variables.

## 5. Local run

Backend:
cd server
npm.cmd run dev

Frontend:
cd client
npm.cmd run dev
