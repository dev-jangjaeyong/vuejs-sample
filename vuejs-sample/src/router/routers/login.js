import LayoutBlank from '@/layout/LayoutBlank'

export default [{
  path: '/login',
  component: LayoutBlank,
  children: [{
    path: '',
    component: () => import('@/components/Login')
  }]
}]
