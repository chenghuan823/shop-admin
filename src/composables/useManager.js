import {ref,reactive} from 'vue'
import {showModal} from '~/composables/util'
import { ElMessage } from 'element-plus'
import {logout,updatepassword} from '~/api/manager'
import { removeToken } from '~/composables/auth'
import { useRouter } from 'vue-router'
import {useStore} from 'vuex'
//修改密码
export const useRepassword=()=>{
    const store=useStore()
    const router =useRouter()

    const form = reactive({
        oldpassword:'',
        repassword: '',
        password: '',
    })
    const formDrawerRef=ref(null)
    const formRef=ref(null)

    //修改密码api
    const onSubmit = async() => {
        formRef.value.validate(async(valid)=>{
            if(!valid){
                return
            }
            formDrawerRef.value.showLoading()
            try {
                const res= await updatepassword(form)
                if(res){
                    toast('修改成功')
                    removeToken()
                    store.dispatch('logout')
                    router.push('/login')
                }
            } catch (error) {
            }
            formDrawerRef.value.hideLoading()            
        })
    }

    const openRepasswordForm=()=>{
        formDrawerRef.value.open()
    }
    const rules={
        oldpassword:[
            { 
                required: true,
                message: '旧密码不能为空',
                trigger: 'blur' 
            }
        ],
        password:[
            {
                required: true,
                trigger: 'blur',
                message: '新密码不能为空',
            }
        ],
        repassword:[
            {
                required: true,
                trigger: 'blur',
                message: '确认密码不能为空',
            }
        ]
    }
    return {
        form,
        formDrawerRef,
        formRef,
        onSubmit,
        rules,
        openRepasswordForm
    }
}
//退出登录
export const useLogout=()=>{
    const store=useStore()
    const router =useRouter()
    //退出登录api
    const handleLogout= async()=>{
        const res=await logout()
        if(res){
            removeToken()
            store.dispatch('logout')
            router.push('/login')
        }
    }

    const openLogoutModal=()=>{
        showModal("是否退出登录").then(() => {
            ElMessage({
            type: 'success',
            message: '退出登录',
            })
            handleLogout()
        }).catch(()=>{})
    }
    return{
        openLogoutModal
    }
}