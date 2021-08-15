import Layout2 from '@/layout/Layout2'

export default [{
  path: '/home',
  component: Layout2,
  meta: { requiresAuth: true },
  children: [{
    path: '',
    component: () => import('@/components/Home')
  }]
}]
