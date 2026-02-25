const customers = [
  {
    id: 1,
    name: "Alice",
    provider: "BT",
    commission: 50,
  },

  {
    id: 2,
    name: "Bob",
    provider: "Sky",
    commission: 60,
  },

  {
    id: 3,
    name: "Charlie",
    provider: "Virgin",
    commission: 45,
  },
];

export const getCustomers = () => {
  return Promise.resolve(customers);
};
