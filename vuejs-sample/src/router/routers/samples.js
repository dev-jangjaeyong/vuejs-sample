import Layout2 from '@/layout/Layout2'

export default [
  {
    path: '/samples',
    component: Layout2,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'cardata',
        component: () => import('@/components/samples/cardata/CardataList')
      },
      {
        path: 'board/inquery',
        component: () => import('@/components/samples/board/InqueryList')
      }
    ]
  }
]
