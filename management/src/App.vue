<template>
  <div id="app">
    <Layout style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;">
      <Header class="layout-header-bar">
        <div style="margin: 0 20px;color: white;font-size: 22px;font-weight: bold;float: left;">
          <Icon type="ios-analytics" size="33"/>
          服务管理系统
        </div>
        <Dropdown trigger="click" placement="bottom-end" style="margin: 0 10px;float: right;line-height: 64px;">
          <a href="javascript:void(0)" style="padding-right: 20px;">
            <Icon style="cursor: pointer;color: white;" type="md-menu" size="30"/>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem>退出登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Header>
      <Layout>
        <Sider hide-trigger>
          <Menu theme="light" width="240" :open-names="[menus[0].name]" active-name="0-0" @on-select="updateTag">
            <Submenu v-for="(menu,menu_index) in menus" :key="menu.name" :name="menu.name">
              <template slot="title">
                <Icon :type="menu.icon_type"/>
                {{menu.name}}
              </template>
              <MenuItem v-for="(item,item_index) in menu.items" :key="item.name" :name="menu_index+'-'+item_index"
                        :to="menu.path+item.path">
                {{item.name}}
              </MenuItem>
            </Submenu>
          </Menu>
        </Sider>
        <Content>
          <div style="background: white;line-height: 49px;">
            <Icon type="ios-home" size="20" style="color: grey;margin: 0 8px 0 10px;float: left;line-height: 46px;"/>
            <Breadcrumb>
              <BreadcrumbItem>{{parentTag}}</BreadcrumbItem>
              <BreadcrumbItem>{{childTag}}</BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div style="padding: 0 2px;">
            <router-view></router-view>
          </div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        parentTag: '书籍管理',
        childTag: '添加信息',
        menus: [
          {
            name: '书籍管理',
            path: '/book',
            icon_type: 'ios-paper',
            items: [{name: '书籍列表', path: '/list'}, {name: '章节列表', path: '/chapters'}]
          },
          {
            name: '服务管理',
            path: '/service',
            icon_type: 'ios-people',
            items: [{name: '服务列表', path: '/list'}]
          }
        ]
      }
    },
    methods: {
      updateTag(name) {
        const index = name.split('-');
        this.parentTag = this.menus[index[0]].name;
        this.childTag = this.menus[index[0]].items[index[1]].name;
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  .layout-header-bar {
    background: rgb(70, 141, 233);
    box-shadow: 0 2px 3px 2px rgba(0, 0, 0, .1);
    padding: 0;
  }

  .ivu-layout {
    min-width: 1200px;
  }

  .ivu-layout-sider {
    background: white;
  }

  .ivu-menu-vertical.ivu-menu-light:after {
    background: none;
  }
</style>
