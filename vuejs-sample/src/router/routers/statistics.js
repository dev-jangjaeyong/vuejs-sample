import Layout2 from '@/layout/Layout2'

export default [
  {
    path: '/statistics',
    component: Layout2,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'login',
        component: () => import('@/components/statistics/Login')
      },
      {
        path: 'sign-up',
        component: () => import('@/components/statistics/SignUp')
      },
      {
        path: 'my-car-manage',
        component: () => import('@/components/statistics/MyCarManage')
      },
      {
        path: 'car-trans',
        component: () => import('@/components/statistics/CarTrans')
      },
      {
        path: 'my-car/alarm',
        component: () => import('@/components/statistics/MyCarAlarm')
      },
      {
        path: 'action',
        component: () => import('@/components/statistics/Action')
      }
    ]
  }
]
