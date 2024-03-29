import { ElNotification } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import nProgress from 'nprogress'

//消息提示
export function toast(message,type="success",dangerouslyUseHTMLString=true){
    ElNotification({
        message,
        type,
        duration:3000,
        dangerouslyUseHTMLString
    })
}

// 消息对话框
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

//显示全屏loading
export function showFullLoading(){
  nProgress.start()
}
//隐藏全屏loading
export function hideFullLoading(){
  nProgress.done()
}
//弹出输入框
export function showPrompt(tip,value=''){
  return ElMessageBox.prompt(tip, '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue:value
  })
}

//将query对象转为url参数
export function queryParams(query){
  let q=[]
  for (const key in query) {
      if(query[key]){
          q.push(`${key}=${encodeURIComponent(query[key])}`)
      }
  }
  let r=q.join('&')
  r=r ? "?"+r :''
  return r
}