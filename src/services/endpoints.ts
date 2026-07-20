export const API = {
  WORKFLOW: {
    GET_ALL: "/workflow",

    CREATE: "/workflow",

    UPDATE: (id: number) => `/workflow/${id}`,

    DELETE: (id: number) => `/workflow/${id}`,
  },
};
