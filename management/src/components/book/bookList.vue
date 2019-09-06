<template>
  <div>
    <Card style="margin: 10px;min-height: 670px;" :padding="20" :dis-hover="true" :shadow="true">
      <div style="height: 60px;">
        <Select v-model="searchInfo.category" :disabled="!searchInfo.category_flag" placeholder="请选择要查询的分类"
                @on-change="initPaging" style="width:150px;margin-right: 20px;">
          <Option v-for="item in paging.categoryList" :value="item" :key="item">{{ item }}</Option>
        </Select>
        <Input v-model="searchInfo.name" :disabled="!searchInfo.name_flag" placeholder="请输入要查询的书名" clearable
               @on-blur="initPaging" style="width: 180px;margin-right: 20px;"/>
        <Input v-model="searchInfo.author" :disabled="!searchInfo.author_flag" placeholder="请输入要查询的作者" clearable
               @on-blur="initPaging" style="width: 150px;margin-right: 20px;"/>
        <Button type="primary" @click="search" style="margin-right: 20px;">查询</Button>
        <Checkbox v-model="searchInfo.category_flag" @on-change="initPaging">分类</Checkbox>
        <Checkbox v-model="searchInfo.name_flag" @on-change="initPaging">书名</Checkbox>
        <Checkbox v-model="searchInfo.author_flag" @on-change="initPaging">作者</Checkbox>
        <Button size="large" @click="showAddModal" style="float: right;">添加</Button>
      </div>
      <div style="min-height: 520px;">
        <Table :columns="columns" :data="data"></Table>
      </div>
      <div style="margin-top: 30px;margin-left: 20px;">
        <Page @on-change="pageChange" :current="paging.page" :total="paging.total" :page-size="paging.size" size="small"
              prev-text="上一页" next-text="下一页" show-total show-elevator/>
      </div>
    </Card>

    <Modal v-model="modal.delete_switch" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <h3>《 {{modal.data.name}} 》 — {{modal.data.author}}</h3>
        <p style="margin-top: 10px;">是否删除该选项?</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal.loading" @click="delBook">删除</Button>
      </div>
    </Modal>

    <Modal v-model="modal.add_switch" width="430">
      <p slot="header" style="color:#2d8cf0;">
        <Icon type="md-add-circle"/>
        <span>添加</span>
      </p>
      <div style="text-align:center" class="modal-body">
        <p>
          <b style="margin-right: 10px;">封面：</b>
          <Input v-model="modal.data.img" size="large" placeholder="请输入封面URL" clearable style="width: 300px"/>
        </p>
        <p v-if="modal.data.img!==''">
          <img :src="modal.data.img" height="140"/>
        </p>
        <p>
          <b style="margin-right: 10px;">分类：</b>
          <Select ref="categorySelect" v-model="modal.data.category" size="large" placeholder="请选择分类"
                  style="width:300px;" clearable>
            <Option v-for="item in paging.categoryList.slice(1,paging.categoryList.length)" :value="item" :key="item">
              {{item }}
            </Option>
          </Select>
        </p>
        <p>
          <b style="margin-right: 10px;">书名：</b>
          <Input v-model="modal.data.name" size="large" placeholder="请输入书名" clearable style="width: 300px"/>
        </p>
        <p>
          <b style="margin-right: 10px;">作者：</b>
          <Input v-model="modal.data.author" size="large" placeholder="请输入作者名" clearable style="width: 300px"/>
        </p>
        <p style="margin-bottom: 0;">
          <b style="margin-right: 10px;">简介：</b>
          <Input v-model="modal.data.introduce" size="large" type="textarea" :autosize="{minRows: 5,maxRows: 5}"
                 placeholder="请输入作品简介" style="width: 300px"/>
        </p>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="modal.loading" @click="addBook">确认添加</Button>
      </div>
    </Modal>

    <Modal v-model="modal.see_switch" width="430">
      <p slot="header" style="color:#2d8cf0;">
        <Icon type="md-eye"/>
        <span>查看</span>
      </p>
      <div style="text-align:center" class="modal-body">
        <p>
          <b style="margin-right: 10px;">ID：</b>
          <Tooltip content="点击复制ID" theme="light" placement="top">
            <div style="display: inline-block;width: 300px;">
              <span class="select-opt" @click="copyBookId">{{modal.data.id}}</span>
            </div>
          </Tooltip>
        </p>
        <p>
          <b style="margin-right: 10px;">封面：</b>
          <Input v-model="modal.data.img" size="large" placeholder="请输入封面URL" clearable style="width: 300px"/>
        </p>
        <p v-if="modal.data.img!==''">
          <img :src="modal.data.img" height="140"/>
        </p>
        <p>
          <b style="margin-right: 10px;">分类：</b>
          <Select v-model="modal.data.category" size="large" style="width:300px;">
            <Option v-for="item in paging.categoryList.slice(1,paging.categoryList.length)" :value="item" :key="item">
              {{item }}
            </Option>
          </Select>
        </p>
        <p>
          <b style="margin-right: 10px;">书名：</b>
          <Input v-model="modal.data.name" size="large" placeholder="请输入书名" clearable style="width: 300px"/>
        </p>
        <p>
          <b style="margin-right: 10px;">作者：</b>
          <Input v-model="modal.data.author" size="large" placeholder="请输入作者名" clearable style="width: 300px"/>
        </p>
        <p style="margin-bottom: 0;">
          <b style="margin-right: 10px;">简介：</b>
          <Input v-model="modal.data.introduce" type="textarea" :autosize="{minRows: 5,maxRows: 5}"
                 placeholder="请输入作品简介"
                 style="width: 300px"/>
        </p>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="modal.loading" @click="updateBook">修改</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "GetBooks",
    data() {
      return {
        searchInfo: {
          name: '',
          author: '',
          category: '',
          name_flag: false,
          author_flag: false,
          category_flag: true,
        },
        modal: {
          data: {
            id: '',
            img: '',
            name: '',
            author: '',
            introduce: '',
            category: '',
          },
          loading: false,
          delete_switch: false,
          add_switch: false,
          see_switch: false,
        },
        paging: {
          action: true, // 上次查询后是否初始化过分页信息
          categoryList: ['全部', '玄幻', '奇幻', '武侠', '仙侠', '都市', '历史', '军事', '灵异', '科幻', '游戏', '二次元'],
          page: 1,
          size: 10,
          total: 0,
        },
        data: [],
        columns: [
          {
            type: 'index1',
            width: 60,
            align: 'center',
            render: (h, params) => {
              return h('span', params.index + (this.paging.page - 1) * this.paging.size + 1);
            }
          },
          {
            title: '书名',
            key: 'name',
            minWidth: 180,
          },
          {
            title: '作者',
            key: 'author',
            minWidth: 170,
          },
          {
            title: '类型',
            key: 'category',
            minWidth: 110,
          },
          {
            title: '介绍',
            key: 'introduce',
            minWidth: 180,
            ellipsis: true,
          },
          {
            title: '操作',
            align: 'center',
            minWidth: 200,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                  },
                  style: {
                    marginRight: '20px'
                  },
                  on: {
                    click: () => {
                      this.showSeeModal(params.index)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'error',
                  },
                  on: {
                    click: () => {
                      this.showDelModal(params.index);
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ]
      }
    }, methods: {
      initPaging() {
        // 初始化页位置
        this.paging.page = 1;
        this.paging.action = true;
      },
      afterRequestSearch() {
        if (!this.paging.action) {
          this.search();
        }
      },
      search() {
        // 获取查询参考数据
        let name_flag = this.searchInfo.name_flag;
        let author_flag = this.searchInfo.author_flag;
        let category_flag = this.searchInfo.category_flag;
        let name = this.searchInfo.name;
        let author = this.searchInfo.author;
        let category = this.searchInfo.category;
        if (name_flag === false && author_flag === false && category_flag === false) {
          this.$Message.warning('至少选择一项属性作为查询条件！');
          return;
        } else if (name_flag === false && author_flag === false) {
          // 通过分类查询
          name = undefined;
          author = undefined;
        } else if (author_flag === false && category_flag === false) {
          // 通过书名查询
          category = undefined;
          author = undefined;
        } else if (name_flag === false && category_flag === false) {
          // 通过作者查询
          category = undefined;
          name = undefined;
        } else if (name_flag === false) {
          // 通过作者和分类查询
          name = undefined;
        } else if (author_flag === false) {
          // 通过书名和分类查询
          author = undefined;
        } else if (category_flag === false) {
          // 通过书名和作者查询
          category = undefined;
        }
        this.$axios.get('/book/paging', {
          params: {
            name: name,
            author: author,
            category: category,
            page: this.paging.page,
            size: this.paging.size
          }
        }).then((response) => {
          let data = response.data;
          if (data.status === 200) {
            this.data = data.result.data;
            this.paging.total = data.result.total;
            this.paging.action = false;
          } else {
            this.data = [];
            this.paging.total = 0;
          }
        })
      },
      delBook() {
        this.modal.loading = true;
        this.$axios.delete('/book/delete', {params: {id: this.modal.data.id}})
          .then((response) => {
            let data = response.data;
            if (data.status === 200) {
              this.$Message.success('删除成功！');
              this.modal.delete_switch = false;
              this.afterRequestSearch();
            } else if (data.status === 400) {
              this.$Message.warning({content: data.error, duration: 2.5});
            }
          })
          .finally(() => {
            this.modal.loading = false;
          });
      },
      addBook() {
        this.modal.loading = true;
        this.$axios.post('/book/add', this.modal.data)
          .then((response) => {
            let data = response.data;
            if (data.status === 200) {
              this.$Message.success('添加成功！');
              this.modal.add_switch = false;
              this.afterRequestSearch();
            } else if (data.status === 400) {
              this.$Message.warning({content: data.error, duration: 2.5});
            }
          })
          .finally(() => {
            this.modal.loading = false;
          });
      },
      updateBook() {
        this.modal.loading = true;
        this.$axios.put('/book/update', this.modal.data)
          .then((response) => {
            let data = response.data;
            if (data.status === 200) {
              this.$Message.success('修改成功！');
              this.modal.see_switch = false;
              this.afterRequestSearch();
            } else if (data.status === 400) {
              this.$Message.warning({content: data.error, duration: 2.5});
            }
          })
          .finally(() => {
            this.modal.loading = false;
          });
      },
      pageChange(page) {
        this.paging.page = page;
        this.search();
      },
      showDelModal(index) {
        // 初始化表单
        this.modal.data.id = this.data[index].id;
        this.modal.data.name = this.data[index].name;
        this.modal.data.author = this.data[index].author;
        // 显示模态框
        this.modal.delete_switch = true;

        this.modal.loading = false;
      },
      showSeeModal(index) {
        // 填充表单
        this.modal.data.id = this.data[index].id;
        this.modal.data.img = this.data[index].img;
        this.modal.data.name = this.data[index].name;
        this.modal.data.author = this.data[index].author;
        this.modal.data.introduce = this.data[index].introduce;
        this.modal.data.category = this.data[index].category;
        // 显示模态框
        this.modal.see_switch = true;
      },
      showAddModal() {
        // 初始化表单
        this.$refs.categorySelect.clearSingleSelect();
        this.modal.data.img = '';
        this.modal.data.name = '';
        this.modal.data.author = '';
        this.modal.data.introduce = '';
        this.modal.data.category = '';
        // 显示模态框
        this.modal.add_switch = true;
      },
      copyBookId() {
        this.$copyText(this.modal.data.id).then(() => {
          this.$Message.info('复制ID成功');
        })
      }
    }
  }
</script>

<style scoped>
  .ivu-table-wrapper {
    border-width: 0;
  }

  .modal-body p {
    margin-bottom: 20px;
  }

  .select-opt {
    cursor: pointer;
  }

  .select-opt:hover {
    color: cornflowerblue !important;
  }

</style>
