import Layout2 from '@/layout/Layout2'

// export default [
//   {
//     path: '/car',
//     component: Layout2,
//     meta: { requiresAuth: true },
//     children: [
//       {
//         path: 'list',
//         component: () => import('@/components/car/search/CardataList')
//       },
//       {
//         path: 'new',
//         component: () => import('@/components/car/new/NewCarFinList')
//       },
//       {
//         path: 'rent',
//         component: () => import('@/components/car/new/NewCarRentalList')
//       }
//     ]
//   }
// ]

export default [
  {
    path: '/car',
    component: Layout2,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'carinfo/cardataList',
        component: () => import('@/components/car/search/CardataList')
      },
      {
        path: 'new',
        component: () => import('@/components/car/new/NewCarFinList')
      },
      {
        path: 'rent',
        component: () => import('@/components/car/new/NewCarRentalList')
      },
    ]
  }
]
