<template>
  <div>
    <Card style="margin: 10px;min-height: 670px;" :padding="20" :dis-hover="true" :shadow="true">
      <div style="height: 60px;">
        <Input v-model="searchInfo.id" placeholder="请输入要查询的ID" clearable style="width: 200px;margin-right: 20px;"/>
        <Button @click="search" type="primary" style="margin-right: 20px;">查询</Button>
        <div style="display: inline-block;margin-left: 50px;" v-if="searchInfo.name!==''">
          <span style="font-weight: bold;">《 {{searchInfo.name}} 》 - {{searchInfo.author}}</span>
        </div>
        <Button @click="showAddModal" size="large" style="float: right;" v-if="searchInfo.name!==''">添加
        </Button>
      </div>
      <div style="min-height: 520px;">
        <Table :columns="columns" :data="data"></Table>
      </div>
      <div style="margin-top: 30px;margin-left: 20px;">
        <Page @on-change="" :current="paging.page" :total="paging.total" :page-size="paging.size" size="small"
              prev-text="上一页" next-text="下一页" show-total show-elevator/>
      </div>
    </Card>

    <Modal v-model="modal.add_switch" width="1000">
      <p slot="header" style="color:#2d8cf0;">
        <Icon type="md-add-circle"/>
        <span>添加</span>
      </p>
      <div style="text-align:center" class="modal-body">
        <p>
          <Input v-model="modal.data.name" size="large" placeholder="请输入章名" style="width: 300px"/>
          <span style="float: right;margin-right: 10px;font-weight: bold;">当前字数: {{modal.word_number}}</span>
        </p>
        <p>
          <Input v-model="modal.data.content" size="large" type="textarea" :autosize="{minRows: 20,maxRows: 20}"
                 placeholder="请输入内容" style="width: 950px" @on-change="statisticalWordNumbe"/>
        </p>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="modal.loading" @click="addChapter">确认添加</Button>
      </div>
    </Modal>

    <Modal v-model="modal.delete_switch" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <h3>《 {{searchInfo.name}} 》 — {{modal.data.name}}</h3>
        <p style="margin-top: 10px;">是否删除该选项?</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal.loading" @click="delChapter">删除</Button>
      </div>
    </Modal>

    <Modal v-model="modal.see_switch" width="1000">
      <p slot="header" style="color:#2d8cf0;">
        <Icon type="md-eye"/>
        <span>查看</span>
      </p>
      <div style="text-align:center" class="modal-body">
        <p>
          <Input v-model="modal.data.name" size="large" placeholder="请输入章名" style="width: 300px"/>
          <span style="float: right;margin-right: 10px;font-weight: bold;">当前字数: {{modal.word_number}}</span>
        </p>
        <p>
          <Input v-model="modal.data.content" size="large" type="textarea" :autosize="{minRows: 20,maxRows: 20}"
                 placeholder="请输入内容" style="width: 950px" @on-change="statisticalWordNumbe"/>
        </p>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="modal.loading" @click="addChapter">修改</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  export default {
    name: "chapterList",
    data() {
      return {
        time: '',
        searchInfo: {
          id: '',
          name: '',
          author: ''
        },
        paging: {
          page: 1,
          size: 10,
          total: 0,
        },
        modal: {
          data: {
            id: '',
            name: '',
            content: ''
          },
          word_number: 0,
          loading: false,
          delete_switch: false,
          add_switch: false,
          see_switch: false,
        },
        data: [],
        columns: [
          {
            type: 'index1',
            width: 100,
            align: 'center',
            render: (h, params) => {
              return h('span', params.index + (this.paging.page - 1) * this.paging.size + 1);
            }
          },
          {
            title: '章节名',
            key: 'name',
            minWidth: 110,
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
    },
    methods: {
      search() {
        this.$axios.get('/book', {
          params: {
            id: this.searchInfo.id
          }
        }).then((response) => {
          let data = response.data;
          if (data.status === 200) {
            this.searchInfo.name = data.result.name;
            this.searchInfo.author = data.result.author;
            this.searchChapter();
          }
        });
      },
      searchChapter() {
        this.$axios.get('/book/chapter/paging', {
          params: {
            id: this.searchInfo.id,
            page: this.paging.page,
            size: this.paging.size
          }
        }).then((response) => {
          let data = response.data;
          if (data.status === 200) {
            this.data = data.result.data;
            this.paging.total = data.result.total;
          } else {
            this.data = [];
            this.paging.total = 0;
          }
        });
      },
      addChapter() {
        if (this.modal.data.name.length === 0) {
          this.$Message.warning('章节名不能为空');
          return;
        }
        this.$axios.post("/book/chapter/add", {
          id: this.searchInfo.id,
          chapters: {
            name: this.modal.data.name,
            content: this.modal.data.content
          }
        }).then((response) => {
          let data = response.data;
          if (data.status === 200) {
            this.modal.add_switch = false;
            this.$Message.success('添加成功！');
            this.searchChapter();
          } else if (status === 400) {
            this.$Message.warning(data.error);
          }
        })
      },
      delChapter() {
        this.$axios.post("/book/chapter/delete", {
          id: this.searchInfo.id,
          chapters: [
            {
              id: this.modal.data.id,
              name: this.modal.data.name
            }
          ]
        }).then((response) => {
          let data = response.data;
          if (data.status === 200) {
            this.modal.delete_switch = false;
            this.$Message.success('删除成功！');
            this.searchChapter();
          }
        })
      },
      showDelModal(index) {
        // 初始化表单
        this.modal.data.id = this.data[index].id;
        this.modal.data.name = this.data[index].name;
        // 显示模态框
        this.modal.delete_switch = true;
        this.modal.loading = false;
      },
      showSeeModal(index) {
        // 填充表单
        this.modal.data.id = this.data[index].id;
        this.modal.data.name = this.data[index].name;
        this.modal.data.content = this.data[index].content;
        this.modal.word_number = 0;
        // 显示模态框
        this.modal.see_switch = true;
      },
      showAddModal() {
        // 初始化表单
        this.modal.data.name = '';
        this.modal.data.content = '';
        this.modal.word_number = 0;
        // 显示模态框
        this.modal.add_switch = true;
      },
      statisticalWordNumbe() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.modal.word_number = this.modal.data.content.replace(/[\r\n]/g, "").replace(/\ +/g, "").length;
        }, 300)
      }
    }
  }
</script>

<style scoped>
  .modal-body p {
    margin-bottom: 20px;
    margin-left: 10px;
    text-align: left;
  }
</style>
