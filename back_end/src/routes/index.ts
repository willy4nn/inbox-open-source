import type { FastifyInstance } from 'fastify';

export async function appRoutes(app: FastifyInstance) {
    app.get('/', () => {
        return 'Hello World123';
    });
}
