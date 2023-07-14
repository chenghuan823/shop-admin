import { ElNotification } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'


//消息提示
export function toast(message,type="success",dangerouslyUseHTMLString=false){
    ElNotification({
        message,
        type,
        duration:3000,
        dangerouslyUseHTMLString
    })
}

export const showModal=(content="提示内容",type="warning",title="")=>{
    return ElMessageBox.confirm(
        content,
        title,
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type,
        }
      )   
}