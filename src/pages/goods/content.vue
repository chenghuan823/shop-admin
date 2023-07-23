<script setup>
import {ref,reactive} from 'vue'
import {readGoods,updateGoods} from '~/api/goods'
import Editor from '~/components/Editor.vue'
import {toast} from '~/composables/util'
import FormDrawer from '~/components/FormDrawer.vue'
const dialogVisiable=ref(false)
const formDrawerRef=ref(null)
const form=reactive({
    content:'',
})

const goodsId=ref(0)
const open=(row)=>{
    // debugger
    goodsId.value=row.id
    row.contentLoading=true
    readGoods(goodsId.value)
    .then(res=>{
        form.content=res.content
        formDrawerRef.value.open()
    })
    .finally(()=>{
        row.contentLoading=false
    })
}

const emit=defineEmits(['reloadData'])
const submit=()=>{
    formDrawerRef.value.showLoading()
    updateGoods(goodsId.value,form)
    .then(res=>{
        toast('设置商品详情成功')
        formDrawerRef.value.close()
        emit('reloadData')
    })
    .finally(()=>{
        formDrawerRef.value.hideLoading()
    })
}

defineExpose({
    open
})

</script>

<template>
    <FormDrawer ref="formDrawerRef" title="设置商品详情" @submit="submit" destory-on-close>
        <el-form :model="form">
            <el-form-item>
                <Editor v-model="form.content" />
            </el-form-item>
        </el-form>
    </FormDrawer>
</template>