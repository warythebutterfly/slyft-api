import { config } from "../config/config";

export const servers = {
  servers: [
    {
      url: `http://localhost:${config.server.port}`,
      description: "Local server",
    },
  ],
};
