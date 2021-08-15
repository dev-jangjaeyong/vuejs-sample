import Layout2 from '@/layout/Layout2'

export default [{
  path: '/users',
  component: Layout2,
  meta: { requiresAuth: true },
  children: [
    {
      path: 'userInfo',
      component: () => import('@/components/users/userInfo/UserInfo')
    },
    {
      path: 'orgnzt',
      component: () => import('@/components/users/orgnzt-async/Orgnzt')
    },
    {
      path: 'userinfo/dealer',
      component: () => import('@/components/users/dealer-info/Dealer')
    },
    {
      path: 'admin',
      component: () => import('@/components/users/admin-info/Admin')
    },
    {
      path: 'partner',
      component: () => import('@/components/users/partner/Partner')
    },
    {
      path: 'base-dealer',
      component: () => import('@/components/users/base-dealer/BaseDealer')
    }
  ]
}]
