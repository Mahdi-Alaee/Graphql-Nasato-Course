export const resolvers = {
  Query: {
    jobs: () => [
      {
        id: "1",
        title: "job 1 title",
        description: "job 1 description",
      },
      {
        id: "2",
        title: "job 2 title",
        description: "job 2 description",
      },
    ],
  },
};
