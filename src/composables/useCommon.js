import { ref, reactive, computed } from "vue";
import {toast} from '~/composables/util'

//列表，分页，搜索
export function useInitTable(opt = {}) {
  // const searchForm=reactive({
  //     keyword:''
  // })
  // const resetSearchForm=()=>{
  //     searchForm.keyword=''
  //     getData()
  // }

  let searchForm = null;
  let resetSearchForm = null;
  if (opt.searchForm) {
    searchForm = reactive({ ...opt.searchForm });
    resetSearchForm = () => {
      for (const key in opt.searchForm) {
        searchForm[key] = opt.searchForm[key];
      }
      getData();
    };
  }

  const loading = ref(false);
  const tableData = ref([]);
  //分页
  const currentPage = ref(1);
  const total = ref(10);
  const limit = ref(10);

  //获取数据
  const getData = (page = null) => {
    if (typeof page == "number") {
      currentPage.value = page;
    }
    loading.value = true;
    opt
      .getList(currentPage.value, searchForm)
      .then((res) => {
        if (opt.onGetListSuccess && typeof opt.onGetListSuccess == "function") {
          opt.onGetListSuccess(res);
        } else {
          tableData.value = res.list;
          total.value = res.totalCount;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  };
  getData();

  return {
    searchForm,
    resetSearchForm,
    tableData,
    loading,
    currentPage,
    total,
    limit,
    getData,
  };
}
//新增，修改
export function useInitForm(opt={}) {
  const form = reactive({});
    const defaultForm=opt.form
  const formDrawerRef = ref(null);
  const formRef = ref(null);
  const rules =opt.rules || {};
  const editId = ref(0);
  const drawerTitle = computed(() => (editId.value ? "修改" : "新增"));

  const handeSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) {
        return;
      }
      formDrawerRef.value.showLoading();
      const fun = editId.value
        ? opt.update(editId.value, form)
        : opt.create(form);
      fun
        .then((res) => {
          toast(drawerTitle.value + "成功");
          opt.getData(editId.value ? false : 1);
          formDrawerRef.value.close();
        })
        .finally(() => {
          formDrawerRef.value.hideLoading();
        });
    });
  };
//重置表单
  function resetForm(row = false) {
    if (formRef.value) {
      formRef.value.clearValidate();
    }
    for (const key in defaultForm) {
        form[key] = row[key];
    }
  }
  //编辑
  const handleEdit = (item) => {
    editId.value = item.id;
    resetForm(item);
    formDrawerRef.value.open();
  };

  //新增
  const openDrawer = () => {
    editId.value = 0;
    resetForm(defaultForm);
    formDrawerRef.value.open();
  };
  return {
    form,
    formDrawerRef,
    formRef,
    rules,
    editId,
    drawerTitle,
    handeSubmit,
    resetForm,
    openDrawer,
    handleEdit
  }
}
