import Vue from 'vue'
import Router from 'vue-router'
import bookList from '@/components/book/bookList'
import chapterList from '@/components/book/chapterList'
import bookManager from '@/components/book/manager'
import serviceList from '@/components/service/serviceList'
import serviceManager from '@/components/service/manager'


Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/book',
      name: 'bookManager',
      component: bookManager,
      children: [
        {
          path: '/book/list',
          name: 'bookList',
          component: bookList,
        },
        {
          path: '/book/chapters',
          name: 'chapterList',
          component: chapterList
        }
      ]
    },
    {
      path: '/service',
      name: 'serviceManager',
      component: serviceManager,
      children: [
        {
          path: '/service/list',
          name: 'serviceList',
          component: serviceList,
        }
      ]
    }
  ]
})
