import { createWebHistory, createRouter } from 'vue-router';
import Renderer from './components/Renderer.vue'
import siteSchema from './siteSchema.js'

const routes = [];
Object.entries(siteSchema.pageRoutes).forEach(pageRoute => {
  const [pageRouteKey, pageRouteValue] = pageRoute;
  routes.push({ 
    path: pageRouteValue.path || '/' + pageRouteKey,
    component: Renderer,
    props: {
      elementsArray: pageRouteValue.content
    },
  });
});

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
