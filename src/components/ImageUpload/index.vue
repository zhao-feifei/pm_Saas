<template>
  <div>
    <el-upload
      :on-preview="preview"
      :file-list="fileList"
      list-type="picture-card"
      action="#"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :limit="1"
      :http-request="upload"
      :before-upload="beforeUpload"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus"></i>
    </el-upload>

    <el-dialog title="图片预览" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云的包
//实例化cos对象
const cos = new COS({
  SecretId: 'AKIDhDTSAbleFZcPwCAuRoxsZ1GI9nETVM1S', //身份识别ID
  SecretKey: 'KSMUUGm0xd2A1buwgAOL1QZR2MQDjyxe' //身份秘钥
}) // 实例化的包 已经具有了上传的能力 可以上传到该账号里面的存储桶了
export default {
  data() {
    return {
      fileList: [
        {
          url:
            'https://img1.baidu.com/it/u=2786765109,1819282822&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500'
        }
      ], // 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: ''
    }
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove(file, fileList) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 修改文件时触发
    // 此时可以用fileList 因为该方法会进来很多遍 不能每次都去push
    // fileList因为fileList参数是当前传进来的最新参数 我们只需要将其转化成数组即可 需要转化成一个新的数组
    // [] => [...fileList] [] => fileList.map()
    // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //限制上传的图片大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      return true
    },
    //上传操作
    upload(params) {
      if (params.file) {
        cos.putObject(
          {
            Bucket: 'zhao-feifei-1303816190' /* 必须 */,
            Region: 'ap-beijing' /* 存储桶所在地域，必须字段 */,
            Key: params.file.name /* 必须 */,
            StorageClass: 'STANDARD',
            Body: params.file // 上传文件对象
          },
          function(err, data) {
            console.log(err || data)
          }
        )
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
