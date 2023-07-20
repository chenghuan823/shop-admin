import {ref,reactive,computed} from 'vue'
import {getManagerList,updateManageStatus,createManager,updateManager,deleteManager} from '~/api/manager'

export function useInitTable(opt={}){
    // const searchForm=reactive({
    //     keyword:''
    // })
    // const resetSearchForm=()=>{
    //     searchForm.keyword=''
    //     getData()
    // }

    let searchForm=null
    let resetSearchForm=null
    if(opt.searchForm){
        searchForm=reactive({...opt.searchForm})
        resetSearchForm=()=>{
            for (const key in opt.searchForm) {
                searchForm[key]=opt.searchForm[key]
            }
            getData()
        }
    }

    const loading=ref(false)
    const tableData = ref([])
    //分页
    const currentPage=ref(1)
    const total=ref(10)
    const limit=ref(10)

    //获取数据
    const getData=(page=null)=>{
        if(typeof page=='number'){
            currentPage.value=page
        }
        loading.value=true
        opt.getList(currentPage.value,searchForm)
        .then(res=>{
            if(opt.onGetListSuccess && typeof opt.onGetListSuccess=='function' ){
              opt.onGetListSuccess(res)      
            }else{
                tableData.value=res.list
                total.value=res.totalCount
            }
        })
        .finally(()=>{
            loading.value=false
        })
    }
    getData()

    return {
        searchForm,
        resetSearchForm,
        tableData,
        loading,
        currentPage,
        total,
        limit,
        getData
    }
}