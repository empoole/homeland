const costs = {
  buildings: {
    houses: {
      wood: 10,
    },
    farms: {
      wood: 20,
    },
    mines: {
      wood: 40,
    },
    tenements: {
      wood: 40,
      metals: 15,
    },
  },
} as const;

export default costs;
