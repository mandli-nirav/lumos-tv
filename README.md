<div align="center">
  <img src="./public/assets/logos/lumos-light.svg" alt="Lumos TV Logo" width="200" height="auto" />
  
  ### A Premium, Feature-Rich Media Streaming Discovery Platform
  
  [![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
  [![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)](https://www.framer.com/motion/)

</div>

---

## 📺 Project Overview

**Lumos TV** is a state-of-the-art media discovery application built with performance and aesthetics in mind. It provides a cinematic experience for browsing movies and TV shows, leveraging the power of the **TMDB API** to deliver real-time data with a premium user interface.

## ⚠️ Disclaimers

> [!IMPORTANT]
>
> **Educational Purpose**: This project is developed strictly for **learning and development purposes only**. It is not intended for commercial use or production environments.
>
> **Content & Hosting**: Lumos TV **does not host any media content** (movies, TV shows, or videos) on its own servers. All metadata, posters, backdrops, and video links are provided by third-party services, primarily **[The Movie Database (TMDB)](https://www.themoviedb.org/)**. This application serves only as a user interface to discover and browse information provided by these APIs.

## ✨ Key Features

- 🎞️ **Cinematic Hero Sections**: Immersive parallax scrolling effects with dynamic scaling and fade animations.
- ♾️ **Infinite Discovery**: Seamless infinite scrolling in "More Like This" sections for endless exploration.
- 🎭 **Comprehensive Media Details**: Seperate, comprehensive grids for Cast & Crew, Trailers, Photos, and Episode guides.
- ⚡ **Lightning Fast Performance**: Powered by **TanStack Query** for efficient data fetching, caching, and state management.
- 🎨 **Modern Aesthetics**: A curated dark-mode interface built with **Tailwind CSS** and **Shadcn UI** components.
- 🛠️ **Utility Powered**: Integrated with **Lodash** for robust and safe data manipulation.
- 🖼️ **Smart Fallbacks**: Customized placeholder system ensures no broken images for posters, backdrops, or profiles.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Fetching**: [TanStack React Query v5](https://tanstack.com/query/latest)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI Primitives)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utilities**: [Lodash](https://lodash.com/), [Axios](https://axios-http.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- A TMDB API Read Access Token

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/lumos-tv.git
   cd lumos-tv
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your TMDB credentials:

   ```env
   VITE_TMDB_READ_ACCESS_TOKEN=your_token_here
   VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 🏗️ Folder Structure

- `src/api`: TMDB API configuration and helper functions.
- `src/components`: Reusable UI components (Shared, Media, Layout).
- `src/hooks`: Custom React Query hooks for media data.
- `src/layouts`: Main application shell.
- `src/lib`: Utility functions and shared tailwind logic.
- `public/assets`: Branding assets and icons.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for the cinematic community.
</p>
