# Masonry Grid Photo App 🧱🖼️

A responsive image gallery application built with React and TypeScript, featuring a masonry layout, photo search, and a detail view for individual photos. The application fetches images from the Pexels API.

---

## ✨ Features

- **Masonry Layout:** Displays photos in a dynamic and responsive masonry grid.
- **Photo Search:** Allows users to search for photos via the Pexels API.
- **Photo Detail View:** Click on a photo to see a larger version and details.
- **Responsive Design:** Adapts to different screen sizes for optimal viewing on desktop and mobile.
- **Image Caching:** Implements a simple in-memory cache for fetched image blobs to improve performance.
- **Virtualization (Implied):** The `VirtualMasonryGrid` component suggests optimized rendering for large lists of photos.
- **Debounced Search:** Search API calls are debounced for better performance as the user types.

---

## 🛠️ Technologies Used

- **React:** (v18.2.0) A JavaScript library for building user interfaces.
- **TypeScript:** For static typing and improved developer experience.
- **React Router DOM:** (v6.22.3) For client-side routing and navigation.
- **Styled Components:** (v6.1.8) For CSS-in-JS styling, allowing for dynamic and scoped styles.
- **React Context API:** For global state management (e.g., photos, search query, API data).
- **Vite:** As the build tool and development server, providing a fast development experience.
- **ESLint & Prettier:** For code linting and formatting to maintain code quality and consistency.
- **Jest & React Testing Library:** For unit and integration testing.
- **Pexels API:** As the source for photos.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (v9.x or later) or [yarn](https://yarnpkg.com/)

---

## 🚀 Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone [https://github.com/Andrey98/masonry-grid-app.git](https://github.com/Andrey98/masonry-grid-app.git)
cd masonry-grid-app
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### 3. Starting project

#### Development mode

Using npm:

```bash
npm run dev
```

Or using yarn:

```bash
yarn dev
```

#### Production mode

Using npm:

```bash
npm run build && npm run preview
```

Or using yarn:

```bash
yarn build && yarn preview
```

---

## 📜 Available Scripts

In the project directory, you can run the following scripts:

### `npm run dev` or `yarn dev`

Runs the app in development mode. Open http://localhost:5173 (or a different port if 5173 is busy) to view it in your browser. The page will reload if you make edits.

### `npm run build` or `yarn build`

Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run lint` or `yarn lint`

Runs ESLint to analyze the code for potential errors and style issues.

### `npm run test` or `yarn test`

Launches the test runner in interactive watch mode using Jest and React Testing Library.

### `npm run preview` or `yarn preview`

Serves the production build from the `dist` folder locally. This is useful for checking the production build before deploying.
