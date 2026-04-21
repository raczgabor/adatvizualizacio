/** @type {import('vite').UserConfig} */
export default {
  server: {
    fs: {
      // allow serving files from the project root (needed for the CSV data file)
      allow: ["."],
    },
  },
};
