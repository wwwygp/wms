<template>
    <el-dialog id="tipsDialog"  :close-on-click-modal="parentData.modalClickShow" :title="parentData.title" :visible.sync="parentData.modalShow" width="400px" center append-to-body>
        <div class="del-dialog-cnt">{{parentData.text}}</div>
        <span slot="footer" class="dialog-footer" style="text-align: left">
                <el-button type="primary" class="blue" @click="handleOk" v-db-click>确 定</el-button>
				<el-button class="blue" type="primary" @click="parentData.modalShow = false" v-db-click>取 消</el-button>
			</span>
    </el-dialog>
</template>

<script>
  import './tips.scss'
    export default {
        name: "tipsDialog",
        props:[
            'parentData'
        ],
        methods: {
            handleOk () {
                this.$emit('handleOkTip');
            },
        }
    }
</script>

<style scoped>
  #tipsDialog{
    z-index: 9000 !important;
  }
</style>
