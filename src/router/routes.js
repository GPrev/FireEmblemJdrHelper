
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/auth', component: () => import('pages/AuthPage.vue') },
      { path: '/new', component: () => import('pages/NewUnitPage.vue') },
      { path: '/unit/:unitID', component: () => import('pages/UnitPage.vue') },
      { path: '/unit/:unitID/edit', component: () => import('pages/NewUnitPage.vue') },
      { path: '/unit/:unitID/training/:masteryID', component: () => import('pages/MasteryPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
