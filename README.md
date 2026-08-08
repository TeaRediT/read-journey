# 📚 ReadJourney

This web application is designed for book lovers who want to effectively track their reading progress. The project allows users to maintain a personal book library, log reading sessions, automatically calculate reading speed, and view detailed visual statistics.

## 🛠 Main Technologies

The project is built using a modern technology stack to ensure high performance, smooth development, and a great user experience:

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management & Caching:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **HTTP Client:** Axios
- **Forms:** [React Hook Form](https://react-hook-form.com/)
- **Validation:** [Yup](https://github.com/jquense/yup)
- **Notifications:** React Hot Toast
- **Icons:** Custom SVG Sprite

## 🎨 Design

The project design is based on a Figma mockup:  
🔗 **[Link](https://www.figma.com/file/z3m0rdBcEfLTJUBDkAKhWQ/BOOKS-READING?type=design&node-id=18743%3A4973&mode=design&t=Hi1KTaUJMogWXZzz-1)**

## 📋 Features & Technical Requirements

The application consists of several key modules:

### 1. Authorization & Registration

- Ability to create a new account and log in.
- Protected private routes.

### 2. User Library (My Library)

- Add new books to the library (title, author, total pages).
- Display the list of books with the ability to delete them.
- Book status indication (unread, in progress, completed).

### 3. Progress Tracking (Reading Page)

- **Add Reading Form:** Allows users to start and finish a reading session. The form features strict validation.
- **Reading Diary:** A vertical timeline displaying the history of sessions. For each session, it automatically calculates:
  - Number of pages read per session.
  - Percentage of the total book length.
  - Time spent reading.
  - Reading speed.
- **Statistics:** A fully responsive SVG Donut chart visualizing the overall reading progress in percentages.
- **Session Deletion:** Ability to delete specific sessions from the diary, with instant updates to the charts and statistics via Optimistic UI Updates.

### 4. Recommended Books

- Browse a curated list of recommended books to read.
- Search functionality and filtering options (by title or author) to easily find specific books.
- Quickly add any book from the recommended list directly to the personal library with a single click.

## 🚀 Installation & Setup

To run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone [https://github.com/TeaRediT/read-journey](https://github.com/TeaRediT/read-journey)
   ```

2. Navigate to the project folder:

   ```bash
   cd your-repo-name
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a .env file in the root directory and add the necessary environment variables (e.g., your backend API URL):

   ```bash
   NEXT_PUBLIC_API_URL=https://readjourney.b.goit.study/api
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open http://localhost:3000 in your browser.
