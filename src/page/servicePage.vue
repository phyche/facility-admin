<template>
  <div id="app">
    <div>
      <el-form :inline="true" size="mini" :model="listQuery" label-position="right" label-width="50px" @keyup.enter.native="search()">
        <el-row :gutter="8">
          <el-col :span="8">
          <el-form-item label="类型">
            <el-select filterable v-model="listQuery.type" clearable>
              <el-option v-for="(item,i) in typeList" :key="i" :value="item.type" :label="item.type">
              </el-option>
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="SN">
              <el-input v-model="listQuery.snNo" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="float: right">
      <el-button type="primary" @click="search()">查询</el-button>
      <el-button type="primary" @click="addFacility()">测试添加</el-button>
<!--      <el-button type="primary" @click="uploadAll()">上传</el-button>-->
      <input type="file" id="fileBatch" @change="uploadAll">
    </div>
    <div>
      <el-table v-loading="dataListLoading" :style="{display:dataListLoading?'none':''}"
                :data="dataList" :border="false"
                @selection-change="selectionChangeHandle">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="type"  header-align="center" align="center" label="类型"></el-table-column>
        <el-table-column prop="snNo" header-align="center" align="center" label="SN"></el-table-column>
        <el-table-column prop="fileName" header-align="center" align="center" label="文件名称"></el-table-column>
        <el-table-column header-align="center" align="center" label="操作">
          <template slot-scope="scope">
            <a :href="'http://localhost:8088/facility/downloadFile/' + scope.row.id">下载</a>
            <input type="file" :id="'file'+scope.row.id" @change="uploadFile(scope.row.id)">
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="totalCount>0" :total="totalCount" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="search" />
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import qs from 'qs'
  import axios from 'axios' // 1、在这里引入axios

export default {
  name: 'Service Page',
  components: {
    Pagination,
  },
  data() {
    return {
      dataListLoading: false,
      loadingText: 'Initializing ...',
      listQuery: {
        page: 1,
        limit: 20,
        type: '',
        snNo: ''
      },
      typeList:[
        {type:'nano'},
        {type:'弹药库'}
      ],
      totalCount: 2,
      dataList:[
        {
          id: 1,
          type: 'nano',
          snNo: '1111111',
        },
        {
          id: 2,
          type: '弹药库',
          snNo: '22222222',
        }
      ],
      selections:[],
      ids:[],
      uploadParam: {
        id: ''
      }
    }
  },
  created() {
    this.search();
    // this.test();
  },
  methods: {
    uploadFile(id) {
      var this_ = this;
      let formData = new FormData();
      formData.append('multipartFile', document.querySelector('input[id=file'+id+']').files[0]);
      formData.append('id', id);   // 上传文件的同时， 也可以上传其他数据

      let config = {
        headers:{'Content-Type':'multipart/form-data'}
      };
      this.$axios.post('/facility/uploadFile',formData, config).then(function (res) {
        this_.search();
        if (res.data.status == 'success') {
          this_.$message.success("成功")
        } else {
          this_.$message.error("失败")
        }
      })
    },
    downloadFile(id) {
      this.$axios.get('/facility/downloadFile/'+ id).then(function (res) {
      })
    },
    test() {
      this.$axios({
        url: '/index',
        method: 'get',
        params:
          {
            bcmc:'111'
          }
      }).then(data => {
        console.log(data)
      }).catch(err => {
        console.log(err)
      })
    },
    search() {
      // this.listQuery.flag = '';
      this.getDataList()
    },
    getDataList() {
      var this_ = this;
      this.dataList = [];
      this.$axios.post('/facility/list',
        qs.stringify(this.listQuery)
        // {
        //   headers: {
        //     // 'Content-Type': 'application/x-www-form-urlencoded',
        //     'Content-Type': 'application/json;charset=UTF-8'
        //     // 'Accept': 'application/json'
        //   }
        // }
        ).then(function (res) {
          this_.dataList = res.data.list
          this_.totalCount = res.data.total
          console.log(res);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    addFacility() {
      var this_ = this;
      this.dataList = [];
      this.$axios.post('/facility/queryFile',
        qs.stringify(this.listQuery)
      ).then(function (res) {
        if (res.data.status == 'success') {
          this.$message.success("成功")
        } else {
          this.$message.error("失败")
        }
      }).catch(function (error) {
          console.log(error);
      });
    },
    uploadAll() {
      var this_ = this;
      if (this.ids.length == 0) {
        this.$message.error("至少选择一条记录")
      }
      let formData = new FormData();
      formData.append('multipartFile', document.querySelector('input[id=fileBatch]').files[0]);
      formData.append('ids', this.ids.join(';'));   // 上传文件的同时， 也可以上传其他数据

      let config = {
        headers:{'Content-Type':'multipart/form-data'}
      };
      this.$axios.post('/facility/uploadFileBatch',formData, config).then(function (res) {
        this_.search();
        if (res.data.status == 'success') {
          this_.$message.success("成功")
        } else {
          this_.$message.error("失败")
        }
      })
    },
    upload(row) {

    },
    selectionChangeHandle(val){
      this.selections = val
      let a = []
      val.forEach(item=>{
        a.push(item.id)
      });
      this.ids = a
    },
  }
}
</script>

