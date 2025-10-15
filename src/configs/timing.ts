const timing = {
  // Action cooldowns in milliseconds
  cooldowns: {
    gather: {
      wood: 1000,
      metals: 3000,
    },
    build: {
      houses: 5000,
      tenements: 1200,
    },
  },
} as const;

export default timing;
