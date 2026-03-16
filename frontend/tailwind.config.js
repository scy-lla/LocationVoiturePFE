/** @type {import('tailwindcss').Config} */
export default {
  // Fichiers où Tailwind va chercher les classes CSS
  // Il regarde dans tous vos fichiers React (.jsx, .js...)
  content: [
    "./index.html",          // La page principale
    "./src/**/*.{js,ts,jsx,tsx}",  // Tous les composants React
  ],

  theme: {
    extend: {
      // Ici vous pouvez ajouter vos propres couleurs
      colors: {
        primary: "#1D4ED8",   // Bleu principal du site
        secondary: "#F97316", // Orange secondaire
      },
    },
  },

  plugins: [], // 🔌 Extensions Tailwind (vide pour l'instant)
}