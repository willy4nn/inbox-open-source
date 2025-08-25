import Fastify from 'fastify';
import cors from '@fastify/cors';
import { appRoutes } from './routes';
import scalar from '@scalar/fastify-api-reference';


const app = Fastify();

app.register(cors);
app.register(appRoutes);
app.register(appRoutes,{prefix:'/api'});
app.register(scalar, {
  prefix: '/reference'
})

app.listen({
    port: 3000,
}).then(() => {
    console.log('HTTP Server running!');
});
