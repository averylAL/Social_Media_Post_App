# Social_Media_Post_App

## **Project Introduction**  
This full-stack social media web application, inspired by Twitter, was developed by **Liu Avery** and **Sun Lipeipei**. It enables users to create accounts, log in, post status updates, edit or delete their own posts, and view a live feed of updates from other users.  

The app is built with the **MERN (MongoDB, Express.js, React, Node.js) stack** and follows RESTful API principles. It ensures secure authentication, smooth user interactions, and a clean, responsive design.  

---

## **Key Capabilities**  
✅ **Real-Time Feed:** Publicly visible status updates displayed in chronological order.  
✅ **User Authentication:** Secure login/register functionality with session persistence.  
✅ **Personalized Profiles:** User pages display bio, join date, and post history.  
✅ **Post Management:** Logged-in users can create, edit, and delete their own posts.  
✅ **API-Driven Architecture:** RESTful API endpoints handle all user interactions.  
✅ **Database Integration:** MongoDB stores user data and posts efficiently.  
✅ **Security & Encryption:** Passwords are hashed, and unauthorized actions are blocked.  
✅ **Responsive & Intuitive UI:** Works smoothly across desktop and mobile devices.  

---

## **Tech Stack & Tools**  
- **Frontend:** React, Tailwind CSS (or Bootstrap/Material UI)  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose ORM  
- **Authentication & Security:** bcrypt for password hashing, JWT or session cookies  
- **Deployment:** Hosted on Render (or Vercel/Heroku)  
- **Version Control:** GitHub  

---

## **Setting Up Locally**  
1. **Clone the Repository**  
    ```bash
    git clone https://github.com/averylAL/Social_Media_Post_App.git
    cd Social_Media_Post_App
2. **Install Dependencies**
    ```bash
    cd backend
    npm install
    cd ../frontend
    npm install
3.**Configure Environment Variables**
    ```bash
    Create a .env file in backend/ and add:
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
4.**Start the Backend Server**
    ```bash
    cd backend
    npm run backendev
5.**Start the Frontend Server**
    ```bash
    cd frontend
    npm run dev
6.**Launch the App**
    ```bash
    Open http://localhost:8000 in your browser to access the application.





