import { ref } from "vue";
import { useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import { useCookies } from "@vueuse/integrations/useCookies";

export const useTabList = () => {
  const cookies = useCookies();

  const route = useRoute();
  const router = useRouter();
  const activeTab = ref(route.path);
  const tabList = ref([
    {
      title: "后台首页",
      path: "/",
    },
  ]);

  //初始化标签导航列表
  const initTabList = () => {
    let tbs = cookies.get("tabList");
    if (tbs) {
      tabList.value = tbs;
    }
  };
  initTabList();

  const addTab = (data) => {
    let noTab = tabList.value.findIndex((t) => t.path == data.path) == -1;
    if (noTab) {
      tabList.value.push(data);
    }
    cookies.set("tabList", tabList.value);
  };
  onBeforeRouteUpdate((to, from) => {
    activeTab.value = to.path;
    addTab({
      title: to.meta.title,
      path: to.path,
    });
  });

  const changeTab = (path) => {
    activeTab.value = path;
    router.push(path);
  };

  const removeTab = (t) => {
    let tabs = tabList.value;
    let a = activeTab.value;
    if (a === t) {
      tabs.forEach((tab, index) => {
        if (tab.path === t) {
          const nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) {
            a = nextTab.path;
          }
        }
      });
    }
    activeTab.value = a;
    tabList.value = tabList.value.filter((tab) => tab.path != t);
    cookies.set("tabList", tabList.value);
  };

  const clearOther = () => {
    tabList.value = tabList.value.filter(
      (tab) => tab.path === "/" || tab.path === activeTab.value
    );
    cookies.set("tabList", tabList.value);
  };
  const clearAll = () => {
    activeTab.value = "/";
    tabList.value = [
      {
        title: "后台首页",
        path: "/",
      },
    ];
    cookies.set("tabList", tabList.value);
  };
  const handleClose = (c) => {
    switch (c) {
      case "clearOther":
        clearOther();
        break;

      case "clearAll":
        clearAll();
        break;
    }
  };
  return {
    activeTab,
    tabList,
    changeTab,
    removeTab,
    handleClose
  }
};
