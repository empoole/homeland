const timing = {
  // Action cooldowns in milliseconds
  cooldowns: {
    gather: {
      wood: 1000,
      metals: 3000,
    },
    build: {
      house: 5000,
      tenement: 1200,
    },
  },
} as const;

export default timing;
