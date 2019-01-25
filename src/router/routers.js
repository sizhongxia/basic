import Main from '@/components/main'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: {  String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{多语言字段}}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: '控制台',
          notCache: true,
          icon: 'ios-speedometer-outline'
        },
        component: () => import('@/view/main/home')
      }
    ]
  },
  {
    path: '/farm',
    name: 'farm', // 农场管理
    meta: {
      access: ['super_admin', 'farm'],
      title: '农场管理',
      icon: 'ios-navigate-outline'
    },
    component: Main,
    children: [
      {
        path: '/farm/manage',
        name: 'farm_manage',
        notCache: true,
        meta: {
          access: ['super_admin', 'farm_manage'],
          icon: 'md-arrow-dropright',
          title: '农场列表'
        },
        component: () => import('@/view/farm/index.vue')
      },
      {
        path: '/farm/add',
        name: 'farm_add',
        notCache: true,
        meta: {
          access: ['super_admin', 'farm_add'],
          icon: 'md-arrow-dropright',
          title: '新增农场'
        },
        component: () => import('@/view/farm/add.vue')
      },
      {
        path: '/farm/edit',
        name: 'farm_edit',
        notCache: true,
        meta: {
          access: ['super_admin', 'farm_edit'],
          hideInMenu: true,
          icon: 'md-arrow-dropright',
          title: '修改农场'
        },
        component: () => import('@/view/farm/edit.vue')
      },
      {
        path: '/farm/area',
        name: 'farm_area',
        notCache: true,
        meta: {
          access: ['super_admin', 'farm_area'],
          hideInMenu: true,
          icon: 'md-arrow-dropright',
          title: '农场厂区'
        },
        component: () => import('@/view/farm/area/index.vue')
      },
      {
        path: '/farm/picture',
        name: 'farm_picture',
        notCache: true,
        meta: {
          access: ['super_admin', 'farm_picture'],
          hideInMenu: true,
          icon: 'md-arrow-dropright',
          title: '农场图片'
        },
        component: () => import('@/view/farm/picture/index.vue')
      },
      {
        path: '/farm/console',
        name: 'farm_console',
        notCache: true,
        meta: {
          access: ['super_admin', 'farm_console'],
          hideInMenu: true,
          icon: 'md-arrow-dropright',
          title: '农场管理'
        },
        component: () => import('@/view/farm/console/index.vue')
      }
    ]
  },
  {
    path: '/equipment',
    name: 'equipment', // 设备管理
    notCache: true,
    meta: {
      access: ['super_admin', 'equipment'],
      title: '设备管理',
      icon: 'ios-settings-outline'
    },
    component: Main,
    children: [
      {
        path: '/equipment/manage',
        name: 'equipment_manage',
        notCache: true,
        meta: {
          access: ['super_admin', 'equipment_manage'],
          icon: 'md-arrow-dropright',
          title: '采集设备管理'
        },
        component: () => import('@/view/equipment/index.vue')
      },
      {
        path: '/equipment/video',
        name: 'video_manage',
        notCache: true,
        meta: {
          access: ['super_admin', 'video_manage'],
          icon: 'md-arrow-dropright',
          title: '视频设备管理'
        },
        component: () => import('@/view/equipment/camera/index.vue')
      },
      {
        path: '/equipment/model',
        name: 'equipment_model',
        notCache: true,
        meta: {
          access: ['super_admin', 'equipment_model'],
          icon: 'md-arrow-dropright',
          title: '设备型号'
        },
        component: () => import('@/view/equipment/model/index.vue')
      },
      {
        path: '/equipment/type',
        name: 'equipment_type',
        notCache: true,
        meta: {
          access: ['super_admin', 'equipment_type'],
          icon: 'md-arrow-dropright',
          title: '设备类型'
        },
        component: () => import('@/view/equipment/type/index.vue')
      }
    ]
  },
  {
    path: '/business',
    name: 'business', // 业务管理
    notCache: true,
    meta: {
      access: ['super_admin', 'business'],
      title: '业务管理',
      icon: 'ios-color-filter-outline'
    },
    component: Main,
    children: [
      {
        path: '/business/product',
        name: 'business_product',
        notCache: true,
        meta: {
          access: ['super_admin', 'business_product'],
          icon: 'md-arrow-dropright',
          title: '产品管理'
        },
        component: () => import('@/view/user/index.vue')
      },
      {
        path: '/business/news',
        name: 'business_news',
        notCache: true,
        meta: {
          access: ['super_admin', 'business_news'],
          icon: 'md-arrow-dropright',
          title: '资讯管理'
        },
        component: () => import('@/view/user/index.vue')
      },
      {
        path: '/business/solution',
        name: 'business_solution',
        notCache: true,
        meta: {
          access: ['super_admin', 'business_solution'],
          icon: 'md-arrow-dropright',
          title: '解决方案管理'
        },
        component: () => import('@/view/user/index.vue')
      },
      {
        path: '/business/knowledges',
        name: 'business_knowledges',
        notCache: true,
        meta: {
          access: ['super_admin', 'business_knowledges'],
          icon: 'md-arrow-dropright',
          title: '知识库管理'
        },
        component: () => import('@/view/user/index.vue')
      }
    ]
  },
  {
    path: '/order',
    name: 'order_sys', // 订单系统管理
    notCache: true,
    meta: {
      access: ['super_admin', 'order_sys'],
      title: '商城系统',
      icon: 'ios-cart-outline'
    },
    component: Main,
    children: [
      {
        path: '/order/manage',
        name: 'order_manage',
        notCache: true,
        meta: {
          access: ['super_admin', 'order_manage'],
          icon: 'md-arrow-dropright',
          title: '订单管理'
        },
        component: () => import('@/view/user/index.vue')
      },
      {
        path: '/order/activity',
        name: 'order_activity',
        notCache: true,
        meta: {
          access: ['super_admin', 'order_activity'],
          icon: 'md-arrow-dropright',
          title: '活动管理'
        },
        component: () => import('@/view/user/index.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'user', // 用户&权限
    notCache: true,
    meta: {
      access: ['super_admin', 'user'],
      title: '用户&权限',
      icon: 'ios-unlock-outline'
    },
    component: Main,
    children: [
      {
        path: '/user/manage',
        name: 'user_manage',
        notCache: true,
        meta: {
          access: ['super_admin', 'user_manage'],
          icon: 'md-arrow-dropright',
          title: '用户管理'
        },
        component: () => import('@/view/user/index.vue')
      },
      {
        path: '/user/certification',
        name: 'user_certification',
        notCache: true,
        meta: {
          access: ['super_admin', 'user_certification'],
          icon: 'md-arrow-dropright',
          title: '认证管理'
        },
        component: () => import('@/view/user/index.vue')
      },
      {
        path: '/user/organize/manage',
        name: 'organize_manage',
        notCache: true,
        meta: {
          access: ['super_admin', 'organize_manage'],
          icon: 'md-arrow-dropright',
          title: '组织管理'
        },
        component: () => import('@/view/organize/index.vue')
      }
    ]
  },
  {
    path: '/system',
    name: 'system', // 系统管理
    notCache: true,
    meta: {
      access: ['super_admin', 'system'],
      title: '系统管理',
      icon: 'ios-appstore-outline'
    },
    component: Main,
    children: [
      {
        path: '/system/func',
        name: 'system_func',
        notCache: true,
        meta: {
          access: ['super_admin', 'system_func'],
          icon: 'md-arrow-dropright',
          title: '系统应用'
        },
        component: () => import('@/view/user/index.vue')
      },
      {
        path: '/system/dict',
        name: 'system_dict',
        notCache: true,
        meta: {
          access: ['super_admin', 'system_dict'],
          icon: 'md-arrow-dropright',
          title: '系统字典'
        },
        component: () => import('@/view/user/index.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
