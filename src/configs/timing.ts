const timing = {
  // Action cooldowns in milliseconds
  cooldowns: {
    gather: {
      food: 1000,
      wood: 1000,
      metals: 3000,
    },
    build: {
      houses: 5000,
      mines: 8000,
      farms: 4000,
      tenements: 1200,
    },
  },
} as const;

export default timing;
