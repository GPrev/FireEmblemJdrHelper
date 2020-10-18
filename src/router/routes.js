
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/unit/:unitID', component: () => import('pages/UnitPage.vue') },
      { path: '/auth', component: () => import('pages/AuthPage.vue') },
      { path: '/new', component: () => import('pages/NewUnitPage.vue') }
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
