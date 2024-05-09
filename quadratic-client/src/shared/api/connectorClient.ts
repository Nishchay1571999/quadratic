import { ConnectionFormPostgresSchema } from 'quadratic-shared/typesAndSchemasConnections';
import z from 'zod';
const API_URL = import.meta.env.VITE_QUADRATIC_CONNECTOR_URL;

// Postgres
//
// TODO: (connections) these should come from the connector service definition for these endpoints
// but for now, they are defined here
type TestConnectionResponse = {
  connected: boolean;
  message: string | null;
};
const PostgresSchema = ConnectionFormPostgresSchema.omit({ type: true, name: true });
type TestPostgresBody = z.infer<typeof PostgresSchema>;

export const connectorClient = {
  test: {
    postgres: async (body: TestPostgresBody) => {
      try {
        const res = fetch(`${API_URL}/postgres/test`, {
          method: 'POST',
          headers: new Headers({ 'content-type': 'application/json' }),
          body: JSON.stringify(body),
        });
        const json: TestConnectionResponse = await res.then((res) => res.json());
        return json;
      } catch (err) {
        console.error('Failed to connect to connector service', err);
        return {
          connected: false,
          message:
            'Network error: failed to make connection. Make sure you’re connected to the internet and try again.',
        };
      }
    },
  },
};
