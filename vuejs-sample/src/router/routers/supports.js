import Layout2 from '@/layout/Layout2'

export default [
  {
    path: '/supports',
    component: Layout2,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'banner',
        component: () => import('@/components/supports/banner/Banner')
      },
      {
        path: 'board',
        component: () => import('@/components/supports/board/Board')
      },
      {
        path: 'notice',
        component: () => import('@/components/supports/notice/Notice')
      },
      {
        path: 'qna',
        component: () => import('@/components/supports/qna/Qna')
      },
      {
        path: 'faq',
        component: () => import('@/components/supports/faq/Faq')
      }
    ]
  }
]
