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
    <el-progress
      v-if="showPercent"
      :percentage="percent"
      style="width: 180px"
    ></el-progress>
    <el-dialog title="图片预览" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云的包
// 需要实例化
const cos = new COS({
  SecretId: 'AKIDhDTSAbleFZcPwCAuRoxsZ1GI9nETVM1S',
  SecretKey: 'KSMUUGm0xd2A1buwgAOL1QZR2MQDjyxe'
}) // 实例化的包 已经具有了上传的能力 可以上传到该账号里面的存储桶了
export default {
  data() {
    return {
      fileList: [],
      showDialog: false, // 控制图片的显示或者隐藏
      imgUrl: '', // 存储点击的图片地址
      currentFileUid: '', // 用一个变量 记住当前上传的图片id
      percent: 0,
      showPercent: false // 默认不显示进度条
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
    handleRemove(file) {
      // file是点击删除的文件
      //   将原来的文件给排除掉了 剩下的就是最新的数组了
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
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // file.uid
      this.currentFileUid = file.uid // 记住当前的uid
      this.showPercent = true
      return true
    },
    // 自定义上传动作 有个参数 有个file对象，是我们需要上传到腾讯云服务器的内容
    upload(params) {
      if (params.file) {
        //  上传文件到腾讯云
        cos.putObject(
          {
            // 配置
            Bucket: 'zhao-feifei-1303816190', // 存储桶名称
            Region: 'ap-beijing', // 存储桶地域
            Key: params.file.name, // 文件名作为key
            StorageClass: 'STANDARD', // 此类写死
            Body: params.file, // 将本地的文件赋值给腾讯云配置
            // 进度条
            onProgress: params => {
              this.percent = params.percent * 100
            }
          },
          (err, data) => {
            // 需要判断错误与成功
            if (!err && data.statusCode === 200) {
              // 如果没有失败表示成功了
              // 此时认为上传成功了
              // this.currentFileUid
              // 仍然有个小问题， 比如此时我们正在上传，但是调用了保存，保存在上传过程中进行，
              // 此时上传还没有完成  此时可以这样做 ： 给所有上传成功的图片 加一个属性 upload: true
              this.fileList = this.fileList.map(item => {
                if (item.uid === this.currentFileUid) {
                  //   upload为true表示 该图片已经成功上传到服务器，地址已经是腾讯云的地址了  就不可以执行保存了
                  return { url: 'http://' + data.Location, upload: true } // 将本地的地址换成腾讯云地址
                }
                return item
              })
              setTimeout(() => {
                this.showPercent = false // 隐藏进度条
                this.percent = 0 // 进度归0
              }, 2000)

              // 将腾讯云地址写入到fileList上 ，保存的时候 就可以从fileList中直接获取图片地址

              // 此时注意，我们应该记住 当前上传的是哪个图片  上传成功之后，将图片的地址赋值回去
            }
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
