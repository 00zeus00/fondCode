import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  // {
  //   path: '/authentication',
  //   component: () => import('@/views/login/authentication'),
  //   hidden: true
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index'),
        name: '首页',
        meta: { title: '首页', icon: 'home', affix: true }
      },
      {
        path: 'award',
        component: () => import('@/views/award/index'),
        name: '奖品管理',
        meta: { title: '奖品管理', icon: 'award', affix: true }
      },
      {
        path: 'project',
        component: () => import('@/views/project/index'),
        name: '积分项目管理',
        meta: { title: '积分项目管理', icon: 'project', affix: true }
      },
      {
        path: 'order',
        component: () => import('@/views/order/index'),
        name: '订单管理',
        meta: { title: '订单管理', icon: 'order', affix: true }
      },
      {
        path: 'tongji',
        component: () => import('@/views/tongji/index'),
        name: '员工积分统计',
        meta: { title: '员工积分统计', icon: 'tongji-menu', affix: true }
      },
      {
        path: 'declare',
        component: () => import('@/views/declare/index'),
        name: '积分申报记录',
        meta: { title: '积分申报记录', icon: 'declare', affix: true }
      },
      {
        path: 'exchange',
        component: () => import('@/views/exchange/index'),
        name: '积分兑换记录',
        meta: { title: '积分兑换记录', icon: 'exchange', affix: true }
      },
      {
        path: 'admin',
        component: () => import('@/views/admin/index'),
        name: '权限管理',
        meta: { title: '权限管理', icon: 'admin', affix: true }
      },
    ]
  },
]

export const asyncRoutes = [
  
]

export const errorRoutes = [

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
