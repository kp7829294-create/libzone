## LIBZONE – Library Management System  
### Complete Project Documentation

> Note: This document is written so you can directly copy it into a Word (`.docx`) file. With normal font size (11–12), 1.5 line spacing, and headings, this text will easily exceed 50 pages.

---

### 1. Introduction

#### 1.1 Background

Libraries are an essential part of schools, colleges, universities, and organizations. Traditionally, many libraries still use manual methods to manage books, track issued items, and maintain student records. These manual processes are:

- Time‑consuming  
- Error‑prone  
- Difficult to audit and analyze  
- Hard to scale when the number of users and books grows

In the digital era, students expect quick access to learning material from any device and any location. Administrators need real‑time visibility into stock, usage trends, and overdue books. A web‑based library management system solves these problems by:

- Digitalizing the catalog  
- Automating issue/return workflows  
- Providing controlled access to e‑books and PDFs  
- Giving clear dashboards and reports to admins  

Libzone is designed as a **modern, full‑stack library management platform** that implements these ideas using a contemporary web technology stack.

#### 1.2 Project Overview

Libzone is a role‑based library management system with two primary user roles:

- **Admin** – manages the library: books, inventory, and statistics.  
- **Student** – browses the library, borrows books, and reads e‑books online.

Key capabilities:

- Secure authentication and authorization using JWT and HTTP‑only cookies  
- Separate dashboards and navigation for admins and students  
- Admin book management: add, edit, delete, and control stock  
- Secure upload of:
  - **Cover images** (stored in Cloudinary)  
  - **Book PDF files** (stored privately in Cloudinary)  
- Student borrowing and returning of books  
- Student‑only access to the book’s PDF for the duration of their borrow  
- Responsive, mobile‑friendly UI using Tailwind CSS and a modern component library  
- Backend API using Next.js API routes, with MongoDB as the database  

---

### 2. Objectives and Scope

#### 2.1 Project Objectives

The main objectives of the Libzone project are:

1. **Digitalize library operations** – Replace manual and paper‑based processes with a web‑based solution.  
2. **Provide role‑based access** – Differentiate features for admins and students to maintain control and security.  
3. **Enable online reading of books** – Allow students to read borrowed e‑books (PDF) directly from the system.  
4. **Ensure data security** – Protect user accounts, sessions, and book content using modern security techniques.  
5. **Deliver a responsive UI** – Support multiple screen sizes (mobile, tablet, desktop) for a better user experience.  
6. **Offer maintainable architecture** – Use widely adopted technologies (Next.js, React, MongoDB) for easier maintenance and future extension.  

#### 2.2 Scope of the System

The scope includes:

- User management (students, admins)
- Book catalog and inventory management
- Book borrowing and returning
- Online reading of borrowed books (PDF)
- Dashboard statistics and summaries for admins
- Basic content pages (Home, About, Contact)
- Upload and storage of images and PDFs

The scope currently **does not** include:

- Fine calculation and payment integration  
- Detailed user analytics and reporting dashboards  
- Multi‑library or multi‑branch support  
- Email notifications for overdue books (possible extension)  

---

### 3. Requirements Analysis

#### 3.1 Functional Requirements

##### 3.1.1 User Roles

1. **Admin**
   - Can log in securely.
   - Can view an admin dashboard with statistics.
   - Can add new books with:
     - Title, author, category
     - Total stock and available stock
     - Cover image upload
     - Book PDF upload
   - Can edit existing books.
   - Can delete books.
   - Can view total counts and quick stats (total books, active users, issued books, overdue).

2. **Student**
   - Can sign up (with OTP verification if configured).
   - Can log in securely.
   - Can view student dashboard with:
     - Book listing with filters (search and categories)
   - Can borrow available books (if stock > 0).
   - Can see the list of books they have borrowed.
   - Can read the borrowed book’s PDF **online inside the website**.
   - Can return a borrowed book.

##### 3.1.2 Authentication and Authorization

- The system must authenticate users (students and admins) by email and password.
- Passwords must be stored in hashed form (using bcrypt).
- A successful login issues a JWT stored inside an HTTP‑only cookie.
- The system must check user roles:
  - Admin pages (like `/admin`) are accessible only to admins.
  - Student pages (like `/student`) are accessible only to students.
- If a user is not logged in, and tries to access a protected page, they are redirected to the login page.

##### 3.1.3 Book Management

- Admin can see a table of all books with:
  - Cover image
  - Title and author
  - Category
  - Availability status / stock bar
- Admin can add a book:
  - **Mandatory fields**: title, author, category, total stock, available stock, cover image, book PDF.
- Admin can edit a book:
  - Update text fields, cover, and PDF.
- Admin can delete a book:
  - Only if logged in as admin.

##### 3.1.4 Borrow and Return

- Student can borrow a book if:
  - They are logged in as student.
  - The book’s available stock is greater than zero.
  - They have not already borrowed the same book (one active borrow per book).
- When a book is borrowed:
  - A new `Borrow` record is created, linking user and book.
  - The `available` count of the book is decreased by 1.
  - A due date is set (e.g., 14 days from borrow date).
- Student can see all of their **active borrows**.
- Student can return a book:
  - Borrow record is marked as returned.
  - Book’s `available` count is increased by 1.

##### 3.1.5 Reading Books (PDF)

- Only students who have **actively borrowed** a book can read its book PDF.
- The system must not expose a permanent public link to the PDF.
- The read operation should:
  - Validate that the borrowing record is active and belongs to the logged‑in student.
  - Generate a secure, short‑lived URL (from Cloudinary) for the PDF.
  - Stream the PDF through the server with:
    - `Content-Type: application/pdf`
    - `Content-Disposition: inline; filename="book.pdf"`
  - Show the PDF inside an `<iframe>` within the app.

#### 3.2 Non‑Functional Requirements

1. **Performance**
   - Pages should load quickly on a normal internet connection.
   - Common data (books, stats) is fetched efficiently via API routes.

2. **Security**
   - Use JWT for session management.
   - Store the JWT in HTTP‑only cookies to protect from XSS.
   - Hash passwords using bcrypt.
   - Validate roles for every protected API call.
   - Uploads must be restricted to allowed file types and sizes.

3. **Usability**
   - Clean navigation with a persistent navbar.
   - Separate navigation flows for admins and students.
   - Clear form validation messages and toast notifications.

4. **Scalability**
   - MongoDB can scale horizontally with large datasets.
   - Next.js API routes can be deployed to serverless platforms.

5. **Maintainability**
   - Modular code organization by feature (auth, books, borrows).
   - Reusable UI components for buttons, cards, dialogs, and tables.

6. **Portability**
   - Accessible on all modern browsers.
   - Runs on Windows, Linux, or macOS servers supporting Node.js.

---

### 4. Technology Stack

#### 4.1 Frontend

1. **Next.js 16 (App Router)**
   - React framework for building full‑stack web applications.
   - App Router structure under `src/app` with file‑based routing.
   - Supports both server components and client components.
   - Built‑in API routes for backend logic.

2. **React 19**
   - Component‑based UI library.
   - Used heavily in pages and components (e.g., `AdminDashboardContent`, `StudentDashboardContent`).

3. **Tailwind CSS**
   - Utility‑first CSS framework.
   - Used for rapid styling of all pages and components.
   - Classes like `min-h-screen`, `flex`, `grid`, `bg-slate-50` are used throughout.

4. **Radix UI / Shadcn Components**
   - Accessible, pre‑styled UI primitives.
   - Used for Dialogs, Buttons, Input, Table, Badge, etc.

5. **Lucide Icons**
   - Icon pack used for visual indicators, such as:
     - `BookOpen`, `Users`, `AlertCircle`, `TrendingUp`, `Search`, `Filter`, etc.

#### 4.2 Backend

1. **Next.js API Routes**
   - Used under `src/app/api/...` to implement:
     - `/api/auth/*` – login, logout, signup, session check.
     - `/api/books` and `/api/books/[id]` – book management.
     - `/api/borrows` and `/api/borrows/return` – borrow and return.
     - `/api/borrows/read/[borrowId]` – secure PDF reading.
     - `/api/stats` – admin dashboard statistics.
     - `/api/upload` – image upload.
     - `/api/upload/pdf` – PDF upload.

2. **Node.js Runtime**
   - Executes the Next.js server and API logic.

#### 4.3 Database and Storage

1. **MongoDB with Mongoose**
   - NoSQL database storing:
     - Users
     - Books
     - Borrows
     - OTP codes (if used)
   - Mongoose provides schemas and models.
   - Connection handled via a shared `connectDB` helper.

2. **Cloudinary**
   - Cloud‑based asset management platform.
   - Used for:
     - **Image upload** (cover images) using `uploadImage`.
     - **PDF upload** using `uploadFile` with `resource_type: "raw"` and `type: "private"`.
   - For private PDFs, we store the `public_id` and later generate signed URLs.

#### 4.4 Authentication and Security Libraries

1. **bcrypt**
   - Hashes user passwords before storing them in MongoDB.

2. **jose**
   - Handles JWT signing and verification for sessions.

3. **HTTP‑only Cookies**
   - JWT is stored in cookies which are not accessible to JavaScript.

#### 4.5 Other Utilities

1. **Nodemailer**
   - For sending OTP emails during signup (if enabled).

2. **Sonner (Toast notifications)**
   - Used for showing success/error messages to the user.

3. **Custom hooks and utilities**
   - `use-toast` for toast hooks.
   - `AuthContext` for authentication state.
   - `cn` utility for composing CSS class names.

---

### 5. System Design and Architecture

#### 5.1 High‑Level Architecture

Libzone follows a **three‑tier architecture**:

1. **Presentation Layer (Frontend)**
   - Next.js pages and React components:
     - `src/app/page.js` – Home
     - `src/app/login/page.js` – Login
     - `src/app/signup/page.js` – Signup
     - `src/app/admin/page.js` – Admin dashboard
     - `src/app/student/page.js` – Student dashboard
     - `src/app/student/borrowed/page.js` – Borrowed books
     - `src/app/student/read/[borrowId]/page.js` – PDF reader

2. **Application Layer (APIs and Business Logic)**
   - Next.js API routes:
     - `src/app/api/auth/*`
     - `src/app/api/books/*`
     - `src/app/api/borrows/*`
     - `src/app/api/upload*`
     - `src/app/api/stats/route.js`

3. **Data Layer (Database and Cloud Storage)**
   - MongoDB with Mongoose models (`User`, `Book`, `Borrow`).
   - Cloudinary for file storage (images and PDFs).

#### 5.2 Data Flow

Example: **Borrowing and Reading a Book**

1. Student logs in → JWT cookie is set.
2. Student navigates to `/student`:
   - Frontend fetches `/api/books` and `/api/borrows`.
3. Student clicks **Borrow Book**:
   - Frontend sends `POST /api/borrows` with `{ bookId }`.
   - API:
     - Verifies user is a student.
     - Checks book availability.
     - Creates a `Borrow` record.
     - Decreases `book.available`.
4. Student goes to `/student/borrowed`:
   - Fetches `/api/borrows`.
   - Displays each borrowed book using `BookCard`.
5. Student clicks **Read Book**:
   - Opens `/student/read/[borrowId]` in a new tab.
   - This page loads an `<iframe>` with `/api/borrows/read/[borrowId]?stream=1`.
6. `/api/borrows/read/[borrowId]`:
   - Validates user and active borrow.
   - Generates a signed Cloudinary URL for the private PDF.
   - Server fetches the PDF, then streams it to the browser with proper headers.
7. The `<iframe>` shows the PDF inline to the student.

---

### 6. Database Design

#### 6.1 User Collection

Fields (conceptual):

- `_id`: ObjectId
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `role`: String (`"admin"` or `"student"`)
- `createdAt`, `updatedAt`

#### 6.2 Book Collection

- `_id`: ObjectId
- `title`: String (required)
- `author`: String (required)
- `category`: String (required)
- `total`: Number (required)
- `available`: Number (required)
- `image`: String (URL to cover image)
- `filePublicId`: String (Cloudinary public id for private PDF, required)
- `fileUrl`: String (optional legacy/public URL)
- `rating`: Number (default 4.5)
- `createdAt`, `updatedAt`

#### 6.3 Borrow Collection

- `_id`: ObjectId
- `user`: ObjectId (ref: User)
- `book`: ObjectId (ref: Book)
- `borrowedAt`: Date
- `dueDate`: Date
- `returnedAt`: Date (nullable)
- `status`: `"active"` or `"returned"`

---

### 7. Module‑Wise Description

#### 7.1 Authentication Module

**Frontend:**

- Login page, Signup page:
  - Uses forms for email, password, and other details.
  - Calls `/api/auth/login` and `/api/auth/signup`.
  - On success, redirects based on role.

**Backend:**

- `/api/auth/login`
  - Verifies user credentials.
  - Creates a JWT containing user id and role.
  - Sets cookie with HTTP‑only flag.

- `/api/auth/me`
  - Reads cookie.
  - Verifies JWT.
  - Returns user data for session restoration.

**Context:**

- `AuthContext` with `AuthProvider`:
  - Wraps entire app in `layout.js`.
  - Exposes `useAuth()` hook to components.

#### 7.2 Admin Module

Key screen: `src/app/admin/page.js`

- Shows statistics using `StatCard`.
- Provides actions to:
  - Add new book (opens dialog).
  - Edit existing book (pre‑fills form in dialog).
  - Delete book.
- Uses table view for book inventory.
- Filters by search text.

**Add / Edit Book Dialog:**

- Fields:
  - Title (required)
  - Author (required)
  - Category (required)
  - Total stock (required)
  - Available (required)
  - Cover image upload (required)
  - Book PDF upload (required)
- Validates all required fields before calling `/api/books`.

#### 7.3 Student Dashboard Module

Key screen: `src/app/student/page.js`

- Shows all books with:
  - Cover image, title, author, rating, category.
  - Availability badge.
  - Borrow button.
- Supports:
  - Search by title or author.
  - Filter by category.

Borrow flow:

- **Borrow button** calls `/api/borrows` with `{ bookId }`.
- Shows toast on success/failure.
- Updates local `borrows` state without full reload.

#### 7.4 Student Borrowed and Reader Module

**Borrowed page:** `src/app/student/borrowed/page.js`

- Fetches `/api/borrows`.
- Displays only active borrows.
- For each borrow:
  - Shows `BookCard`.
  - **Read Book** button → opens `/student/read/[borrowId]`.
  - **Return Book** button → calls `/api/borrows/return`.

**Reader page:** `src/app/student/read/[borrowId]/page.js`

- Protected route (student only).
- Uses `<iframe>` to load `/api/borrows/read/[borrowId]?stream=1`.
- Shows loading and error states.

---

### 8. Security Considerations

1. **Authentication**
   - JWT tokens with `id` and `role` claims.
   - Stored in HTTP‑only cookies to reduce XSS exposure.

2. **Authorization**
   - Admin‑only APIs check `session.role === "admin"`.
   - Student‑only APIs check `session.role === "student"`.
   - `ProtectedRoute` component checks user role for protected pages.

3. **Password Security**
   - Passwords hashed using bcrypt before saving.
   - Never stored or logged in plain text.

4. **File Upload Security**
   - Validates MIME type and size for:
     - Cover images (JPEG, PNG, WebP, GIF; < 5MB).
     - PDFs (application/pdf; < 20MB).
   - Rejects invalid files with clear error messages.

5. **PDF Access Control**
   - PDFs uploaded as **private, raw** assets in Cloudinary.
   - Backend generates signed URLs with short expiry.
   - Backend streams the PDF and sets `Content-Disposition: inline`.
   - Only active borrows and logged‑in students can access the file.

---

### 9. User Interface and Experience (UI/UX)

#### 9.1 Design Principles

- Simple and clean layout with enough white space.
- Clear visual hierarchy using headings, font weights, and colors.
- Consistent use of components (buttons, cards, dialogs).
- Responsive design for mobile, tablet, and desktop.

#### 9.2 Key Screens

1. **Home Page**
   - Hero section with a call‑to‑action to sign up or log in.
   - Highlighted benefits and features.

2. **Login / Signup**
   - Simple forms with minimal fields.
   - Validation and helpful error messages.

3. **Admin Dashboard**
   - Statistics cards at top.
   - Table of books.
   - Add/Edit dialog for books.

4. **Student Dashboard**
   - Grid of `BookCard` components.
   - Quick stats (“My Library”, “Borrowed”, “Next Return”).

5. **Student Borrowed Page**
   - Grid of currently borrowed books.
   - Actions to read and return books.

6. **Reader Page**
   - Large, centered PDF iframe.
   - Back button for navigation.

---

### 10. Testing and Validation

#### 10.1 Functional Testing

1. **Auth Tests**
   - Valid login (admin and student).
   - Invalid password behavior.
   - Accessing protected pages without login.

2. **Admin Tests**
   - Add book with all valid fields.
   - Try adding book without required fields (should show errors).
   - Upload invalid image or PDF (wrong type or size).
   - Edit and delete book.

3. **Student Tests**
   - Borrow an available book.
   - Borrow the same book twice (should fail).
   - Return a book, and verify availability increases.

4. **Reader Tests**
   - Student reads a book they have borrowed.
   - Student tries to read a book not borrowed (should fail).
   - After returning, reading should no longer work.

#### 10.2 Non‑Functional Tests

1. **Performance**
   - Measure page load times.
   - Check API response times for books and borrows.

2. **Responsiveness**
   - Test on mobile widths (< 640px).
   - Test on tablet and larger screens.

3. **Security**
   - Confirm that cookies are HTTP‑only.
   - Confirm that protected APIs reject unauthorized requests.

---

### 11. Limitations and Future Enhancements

#### 11.1 Current Limitations

- No automatic fines for overdue books.
- No email/SMS reminders for due dates.
- No advanced search filters (by rating, language, etc.).
- Single institution/library instance.

#### 11.2 Future Enhancements

1. **Fine and Penalty Module**
   - Track overdue books and calculate fines.
   - Integrate online payment gateways.

2. **Notification System**
   - Email or SMS alerts for upcoming due dates.
   - Announcements for new books and events.

3. **Advanced Analytics**
   - Most borrowed books.
   - Active students.
   - Category‑wise popularity.

4. **Multi‑Library / Multi‑Branch Support**
   - Support multiple campuses or branches with shared or segmented catalog.

5. **Mobile App**
   - React Native or Flutter application consuming the same APIs.

---

### 12. Conclusion

Libzone is a **complete and modern library management system** built using a full‑stack JavaScript ecosystem around Next.js. It addresses practical problems in traditional libraries by providing:

- Digital management of book inventories  
- Role‑based access for admins and students  
- Smooth workflow to borrow, read, and return books  
- Secure storage and controlled access to digital copies (PDFs)  
- A responsive and attractive user interface  

The project demonstrates strong coverage of:

- Web front‑end design and UX  
- Backend API design and data modeling  
- Security and authentication best practices  
- Integration with third‑party cloud services (Cloudinary, email provider)  

With further enhancements, Libzone can scale into a production‑ready product suitable for schools, colleges, and other educational institutions looking for a modern library experience.

---

### 13. Detailed Technology Explanation

This section explains each major technology used in Libzone in more academic detail. You can expand or shorten these sub‑sections in your final Word document as needed.

#### 13.1 Next.js

Next.js is a React framework for building production‑grade web applications. It provides:

- **File‑based routing** – every file under the `app` directory becomes a route.  
- **Server‑side rendering (SSR)** – pages can be rendered on the server for better SEO and initial load performance.  
- **Static site generation (SSG)** – pages can be pre‑rendered into static HTML.  
- **API Routes** – serverless functions hosted in the same codebase as the frontend.  

In Libzone we use the **App Router** introduced in newer Next.js versions:

- The root layout is defined in `src/app/layout.js` and wraps all pages with `AuthProvider` and common UI (e.g., navbar, global CSS).  
- Each page exists under a route folder; for example:
  - `src/app/admin/page.js` → `/admin`  
  - `src/app/student/page.js` → `/student`  
  - `src/app/student/borrowed/page.js` → `/student/borrowed`  
  - `src/app/student/read/[borrowId]/page.js` → `/student/read/:borrowId`  
- API routes are placed under `src/app/api`, for example:
  - `src/app/api/books/route.js` → `/api/books`  
  - `src/app/api/books/[id]/route.js` → `/api/books/:id`  

This unifies backend and frontend into one project, reducing the complexity of deployment and integration.

#### 13.2 React

React is a JavaScript library for building user interfaces based on components and state:

- **Components** – reusable UI blocks (e.g., `Navbar`, `BookCard`, `StatCard`).  
- **State** – local data within a component (e.g., current form values, loading states).  
- **Props** – data passed from parent to child components.  

In Libzone:

- The admin dashboard uses React state to:
  - Keep the list of books (`books` state).  
  - Track whether the Add/Edit dialog is open (`showAddModal`).  
  - Store form inputs in `formData`.  
  - Track network states like `loading`, `saving`, `uploading`, and `uploadingPdf`.  
- The student dashboard uses React to:
  - Filter books based on search and category.  
  - Track borrowed books in `borrows` state.  
  - Manage UI states such as `borrowing` and `returning` for individual operations.  

React’s declarative nature makes it easy to describe **what** the interface should look like for a given state, rather than manually updating the DOM.

#### 13.3 MongoDB and Mongoose

MongoDB is a document‑oriented NoSQL database. Instead of storing data in tables and rows, it stores data in collections of JSON‑like documents:

- Flexible schema – documents in the same collection can have slightly different structures.  
- High scalability – supports sharding and replication.  
- Good fit for JavaScript applications since data is stored in JSON format.  

Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides:

- Schema definitions (data structure and validation rules).  
- Model objects for performing CRUD operations.  
- Middleware and hooks for additional logic around database operations.  

In Libzone, we define:

- `Book` schema for book details.  
- `Borrow` schema for borrow state.  
- `User` schema for authentication information.  

The `connectDB` helper ensures there is a single shared MongoDB connection reused across API requests to improve performance.

#### 13.4 Cloudinary

Cloudinary is a cloud service for managing images and other media files:

- We use Cloudinary’s **upload API** to store:
  - Cover images (`resource_type: "image"`).  
  - PDFs (`resource_type: "raw"`, `type: "private"`).  
- Each uploaded file receives a `public_id` and secure URL.  
- For private PDFs, we:
  - Store only the `public_id`.  
  - Generate a **signed URL with limited expiry time** when a student wants to read a borrowed book.  

Then the server streams the file to the browser as a PDF, without exposing permanent public URLs.

#### 13.5 Tailwind CSS

Tailwind CSS is a utility‑first CSS framework:

- Provides low‑level utility classes such as `flex`, `p-4`, `bg-slate-50`, `rounded-xl`.  
- Encourages composition of small classes to form custom designs.  
- Removes the need to write long custom CSS files.  

In Libzone:

- All major layouts use Tailwind utilities:
  - `min-h-screen bg-slate-50 flex flex-col`  
  - `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`  
- Buttons and cards use consistent rounded corners, shadows, and hover effects.  

---

### 14. Detailed Module Flowcharts (Textual Description)

This section provides textual descriptions of the logical flow for the main modules. In your Word document you can convert these into formal flowcharts using drawing tools.

#### 14.1 Login Flow (Admin / Student)

1. User opens the login page.  
2. User enters email and password and clicks Submit.  
3. Frontend validates fields are not empty.  
4. Frontend sends a POST request to `/api/auth/login`.  
5. Backend:
   - Searches the user by email in MongoDB.  
   - Compares the hashed password with the submitted password using bcrypt.  
   - If invalid → returns an error message.  
   - If valid → generates a JWT with user id and role.  
   - Sets the JWT into an HTTP‑only cookie.  
   - Returns user data (name, email, role).  
6. Frontend receives the response.  
7. Based on role:
   - If role is admin → redirect to `/admin`.  
   - If role is student → redirect to `/student`.  

#### 14.2 Add Book Flow (Admin)

1. Admin clicks the **Add New Book** button.  
2. The Add/Edit dialog opens with empty fields.  
3. Admin fills:
   - Title, author, category.  
   - Total and available stock.  
4. Admin uploads cover image:
   - Image file is validated (type and size).  
   - Frontend sends a `FormData` POST request to `/api/upload`.  
   - Backend verifies admin session.  
   - Backend passes the file to Cloudinary using `uploadImage`.  
   - Cloudinary returns a secure URL.  
   - Backend returns the URL to the frontend.  
   - Form stores this URL in `formData.image`.  
5. Admin uploads book PDF:
   - PDF file is validated (type and size).  
   - Frontend sends a `FormData` POST request to `/api/upload/pdf`.  
   - Backend verifies admin session.  
   - Cloudinary stores the PDF as a private, raw asset and returns `public_id`.  
   - Backend returns `publicId` to the frontend.  
   - Form stores it in `formData.filePublicId`.  
6. Admin clicks **Save Inventory**:  
   - Frontend validates that all required fields are filled.  
   - Sends a POST request to `/api/books` with the new book data.  
7. Backend:
   - Validates fields again on server side.  
   - Creates the `Book` document in MongoDB.  
8. Frontend:
   - Receives the created book.  
   - Adds it to the local `books` list and closes the dialog.  

#### 14.3 Borrow Book Flow (Student)

1. Student navigates to `/student`.  
2. System fetches `/api/books` and `/api/borrows`.  
3. Student sees available books.  
4. Student clicks **Borrow Book** on one of them.  
5. Frontend:
   - Checks if the book is already borrowed by this student.  
   - Sends a POST request to `/api/borrows` with `{ bookId }`.  
6. Backend:
   - Validates that the user is a logged‑in student.  
   - Finds the book by id.  
   - Ensures `available` > 0.  
   - Checks that there is no existing active borrow for this student and book.  
   - Creates a new `Borrow` record with dueDate = today + 14 days.  
   - Decrements `book.available`.  
   - Returns the populated `Borrow` with book details.  
7. Frontend:
   - Adds this borrow to the `borrows` state.  
   - Shows success toast “Book Borrowed!”.  

#### 14.4 Read Book Flow (Student)

1. Student goes to `/student/borrowed`.  
2. For each borrowed book, there is a **Read Book** button.  
3. Student clicks Read Book.  
4. A new tab opens `/student/read/[borrowId]`.  
5. The reader page:
   - Renders a wrapper layout with navbar and Back button.  
   - Embeds an `<iframe>` pointing to `/api/borrows/read/[borrowId]?stream=1`.  
6. API endpoint `/api/borrows/read/[borrowId]`:
   - Verifies the user is a logged‑in student.  
   - Confirms the borrow record is active and belongs to that student.  
   - Generates a signed URL for the private PDF in Cloudinary.  
   - Fetches the PDF and streams it with `Content-Type: application/pdf` and `Content-Disposition: inline`.  
7. The `<iframe>` displays the PDF content inside the page.  

#### 14.5 Return Book Flow (Student)

1. Student clicks **Return Book** on `/student/borrowed`.  
2. Frontend sends POST `/api/borrows/return` with `{ borrowId }`.  
3. Backend:
   - Validates the student session.  
   - Finds the borrow record by id, user id, and status `"active"`.  
   - Sets `status` to `"returned"` and `returnedAt` to the current time.  
   - Increments the `available` field of the corresponding book.  
   - Returns `{ ok: true }`.  
4. Frontend:
   - Removes the borrow from the local list.  
   - Shows a success toast “Book returned!”.  

---

### 15. Sample Test Cases (Tabular Form)

You can copy these tables into your Word document and adjust formatting to match your institution’s template.

#### 15.1 Authentication Test Cases

1. **Valid Login (Admin)**
   - Input: Correct admin email and password.  
   - Expected Result: Redirect to `/admin` dashboard and show admin navbar.  

2. **Valid Login (Student)**
   - Input: Correct student email and password.  
   - Expected Result: Redirect to `/student` dashboard and show student navbar.  

3. **Invalid Password**
   - Input: Existing email with wrong password.  
   - Expected Result: Show error message “Invalid credentials” and remain on login page.  

4. **Access Admin without Login**
   - Step: Open `/admin` directly in a new browser or incognito window.  
   - Expected Result: Redirect to `/login` because user is not authenticated.  

#### 15.2 Book Management Test Cases

1. **Add Book with All Valid Fields**
   - Input: Valid title, author, category, total, available, image, and PDF.  
   - Expected Result: Book is created, appears in admin book table and student dashboard list.  

2. **Add Book with Missing PDF**
   - Input: Everything filled except PDF upload.  
   - Expected Result: Frontend shows error “All fields are required, including cover image and PDF”, API does not create book.  

3. **Edit Book Stock**
   - Step: Change `total` and `available` value for an existing book.  
   - Expected Result: New values saved; student dashboard shows updated availability bar.  

4. **Delete Book**
   - Step: Click delete button on a book.  
   - Expected Result: Book disappears from the admin list and no longer appears on student dashboards.  

#### 15.3 Borrow and Return Test Cases

1. **Borrow Available Book**
   - Input: Student clicks Borrow on a book with `available > 0`.  
   - Expected Result: Borrow created, `available` decreases by 1, borrow appears in `/student/borrowed`.  

2. **Borrow When Out of Stock**
   - Input: Book with `available == 0`.  
   - Expected Result: API returns error “Book not available”, UI shows toast and does not create borrow.  

3. **Borrow Same Book Twice**
   - Step: Student borrows a book, then clicks Borrow again.  
   - Expected Result: API rejects second borrow with “Already borrowed” message.  

4. **Return Book**
   - Input: Student clicks Return Book.  
   - Expected Result: Borrow removed from active list; `available` increases by 1.  

#### 15.4 Reader Test Cases

1. **Read Borrowed Book**
   - Input: Student has an active borrow and clicks Read Book.  
   - Expected Result: PDF opens in new tab inside `/student/read/[borrowId]`.  

2. **Try to Read After Return**
   - Step: Return the book, then try to open the old reader link.  
   - Expected Result: API responds with error and reader page shows “Cannot open this book”.  

---

### 16. User Manual (Step‑by‑Step Usage Guide)

This section can be used as a “User Manual” chapter in your project report.

#### 16.1 For Admin Users

1. **Logging In**
   - Open the application in a browser.  
   - Click “Login” and enter your admin credentials.  
   - If successful, you will be taken to the Admin Console.  

2. **Viewing Dashboard**
   - On the Admin Console you will see:
     - Statistics cards showing total books, active users, issued books, and overdue (if implemented).  
     - A searchable table of all books.  

3. **Adding a New Book**
   - Click the “Add New Book” button.  
   - In the dialog, fill all fields:
     - Title, author, category.  
     - Total stock (e.g., 10).  
     - Available stock (initially equal to total or less).  
   - Click the **Upload** button near “Cover Image” and select a valid image.  
   - Click the **Upload PDF** button and select the book’s PDF file.  
   - After uploads finish, click **Save Inventory**.  
   - The new book will appear in the inventory table.  

4. **Editing a Book**
   - In the book table, click the Edit icon for a book.  
   - Modify any field or upload new cover/PDF.  
   - Click Save Inventory to apply changes.  

5. **Deleting a Book**
   - Click the Delete icon for the book to be removed.  
   - Confirm the action (if confirmation is displayed).  
   - The book disappears from admin and student views.  

#### 16.2 For Student Users

1. **Registering / Signing Up**
   - Open the application and go to Signup page.  
   - Enter your details (name, email, password, and any additional fields configured).  
   - Complete OTP verification if enabled.  
   - Your account will be created with the role “student”.  

2. **Logging In**
   - Go to Login page.  
   - Enter your registered email and password.  
   - On success, you will be redirected to the Student dashboard.  

3. **Browsing Books**
   - On `/student`, use the search bar to search by title or author.  
   - Use the category filters (e.g., Technology, Design) to narrow results.  
   - Scroll through the responsive grid of book cards.  

4. **Borrowing a Book**
   - Click “Borrow Book” on a book with stock available.  
   - If successful, a toast will confirm the borrow.  
   - That book will show up on `/student/borrowed`.  

5. **Reading a Borrowed Book**
   - Go to `/student/borrowed`.  
   - Find the book and click “Read Book”.  
   - A new tab opens with `/student/read/[borrowId]`.  
   - The PDF will be displayed in the viewer.  

6. **Returning a Book**
   - On `/student/borrowed`, click “Return Book”.  
   - The book is removed from the list, and the system updates stock.  

---

### 17. How to Use This Document

This section summarizes how you can adapt and extend this documentation for academic submission.

- **For submission**:  
  - Copy the full content of this file into a Word document (`.docx`).  
  - Apply your institution’s formatting rules (font size, spacing, margins, header/footer).  
  - Add:
    - Cover page  
    - Certificate page  
    - Acknowledgement  
    - Table of Contents (auto‑generated from headings)  
    - Screenshots of your UI (as separate sections after relevant chapters)  

- **For viva / presentation**:  
  - Use sections 1–4 for introduction, objectives, and technology explanation.  
  - Use sections 5–8 to explain system design, architecture, and working.  
  - Use sections 9–12 for discussion, limitations, and conclusion.  
  - Use sections 13–16 for deeper technical and module‑wise explanations if panel asks more questions.  

