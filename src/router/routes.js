const routes = [
  // {
  //   path: '/',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  // },
  {
    path: '/',
    component: () => import('layouts/GuestLayout.vue'),
    meta: { authOnly: false, middleware: 'guest' },
    children: [
      { path: 'admin', name: 'login', component: () => import('pages/auth/AuthLogin.vue') },
      { path: '', name: 'webpage', component: () => import('pages/auth/WebPage.vue') },
      { path: 'register', component: () => import('pages/auth/AuthRegister.vue') },
      { path: 'forgot-password', component: () => import('pages/auth/AuthForgotPassword.vue') },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('layouts/AdminLayout.vue'),
    meta: { authOnly: true, middleware: 'admin' }, // Allow both
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('pages/admin/IndexPage.vue'),
      },
      { path: 'students', component: () => import('pages/admin/StudentsPage.vue') },
      { path: 'classes', component: () => import('pages/admin/ClassesPage.vue') },
      { path: 'enrollments', component: () => import('pages/admin/EnrollmentsPage.vue') },
      { path: 'attendance', component: () => import('pages/admin/AttendancePage.vue') },
      { path: 'payments', component: () => import('pages/admin/PaymentsPage.vue') },
      { path: 'bible-verse/:language', component: () => import('pages/admin/BibleVersePage.vue') },
      { path: 'news', component: () => import('pages/admin/NewsPage.vue') },
      { path: 'admins', component: () => import('pages/admin/AdminsPage.vue') }, // Only for Super Admins
      // { path: 'admins', component: () => import('pages/admin/AdminsPage.vue'), meta: { middleware: 'superadmin' } } // Only for Super Admins
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
