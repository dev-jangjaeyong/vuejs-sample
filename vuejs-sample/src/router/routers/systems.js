import Layout2 from '@/layout/Layout2'

export default [
  {
    path: '/systems',
    component: Layout2,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'menu',
        component: () => import('@/components/systems/menu/MenuWithList')
      },
      {
        path: 'menu-author',
        component: () => import('@/components/systems/menu-author/MenuAuthor')
      },
      {
        path: 'author',
        component: () => import('@/components/systems/author/Author')
      },
      {
        path: 'product',
        component: () => import('@/components/systems/product/Product')
      },
      {
        path: 'api',
        component: () => import('@/components/systems/api/Api')
      },
      {
        path: 'api-author',
        component: () => import('@/components/systems/api-author/ApiAuthor')
      },
      {
        path: 'user-author',
        component: () => import('@/components/systems/user-author/UserAuthor')
      },
      {
        path: 'code',
        component: () => import('@/components/systems/code/Code')
      }
    ]
  }
]
