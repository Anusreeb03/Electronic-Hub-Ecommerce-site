Electronic-Hub|Ecommerce Store
A full-stack e-commerce web application built for an electronics shop. It features secure session-based authentication, 
role-based access control (Admin vs. User), a dynamic product catalog with real-time search, an interactive shopping cart 
with localStorage persistence, and media file support.

Tech Stack
Frontend: React (Vite), JavaScript (ES6+), HTML5, Responsive CSS

Backend: Python, Django, Django REST Framework (DRF)

Database: SQLite

Authentication & Security: Django Session Authentication with CORS (django-cors-headers) & credentials support
Login Credentials
You can use the following test accounts to log into the application:
1. Admin Account (Full Access)
Email: admin@shop.com
Password: admin123

Capabilities: Can view products, search, add items to the cart, add new products with images, edit existing products, and delete products.

2. Normal Customer Account (Read-Only / Shopping)
Email: user@shop.com
Password: shopuser
(since django user creation through admin panel doesnot allow users with password similar to username)

Capabilities: Can view products, search, view full product details, add items to the shopping cart, 
and manage cart quantities. (Admin-only buttons are hidden and restricted by backend permissions).

Steps to Run the Project
Since this project consists of a Django backend and a React frontend, you will need to run them simultaneously in two separate 
terminal windows.

Step 1: Start the Django Backend Server

Open your first terminal window and navigate to your backend directory:

cd backend


Activate your Python virtual environment:

On Windows:

venv\Scripts\activate


On macOS/Linux:

source venv/bin/activate


Install required packages (if not already installed):

pip install django djangorestframework django-cors-headers pillow


Run database migrations and start the server:

python manage.py migrate
python manage.py runserver


The backend will run at http://127.0.0.1:8000/. Keep this terminal open.

Step 2: Start the React Frontend Server

Open a second, separate terminal window and navigate to your frontend directory:

cd frontend
cd ecommerce
cd reactapp
Install dependencies (if not already installed):

npm install

Start the Vite development server:

npm run dev


The frontend will run at http://localhost:5173/.

