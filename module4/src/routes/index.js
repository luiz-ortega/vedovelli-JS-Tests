import { serviceMiddleware, userMiddleware } from '@/middleware';
import homeRouter from './home.router';
import ordersRouter from './orders.router';

const routers = [{ '/': homeRouter }, { '/order': ordersRouter }];

const middlewares = [serviceMiddleware.get, userMiddleware.get];

export function attachRouters(app) {
  for (const routerObj of routers) {
    const [resource, router] = Object.entries(routerObj)[0];
    //.....👇🏻 /api/order
    app.use(`/api${resource}`, middlewares, router);
  }
}
