import Layout2 from '@/layout/Layout2'

export default [
  {
    path: '/services',
    component: Layout2,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'reservations',
        component: () => import('@/components/services/reservations/Reservations')
      },
      {
        path: 'serviceRequests',
        component: () => import('@/components/services/serviceRequests/ServiceRequests')
      },
      {
        path: 'advance-reservation',
        component: () => import('@/components/services/advance-reservation/advance-reservation')
      },
      {
        path: 'car-accessory-supply',
        component: () => import('@/components/services/car-accessory-supply/car-accessory-supply')
      },
      {
        path: 'consign',
        component: () => import('@/components/services/consign/consign')
      },
      {
        path: 'extend-warranty',
        component: () => import('@/components/services/extend-warranty/extend-warranty')
      },
      {
        path: 'makeup',
        component: () => import('@/components/services/makeup/makeup')
      },
      {
        path: 'miserable-reward',
        component: () => import('@/components/services/miserable-reward/miserable-reward')
      },
      {
        path: 'online-request',
        component: () => import('@/components/services/online-request/online-request')
      }
    ]
  }
]
