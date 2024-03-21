import { config } from "../config/config";

export const servers = {
  servers: [
    {
      url: `http://localhost:${config.server.port}`,
      description: "Local server",
    },
    {
      url: `https://slyft.onrender.com/`,
      description: "Prod server",
    },
  ],
};
