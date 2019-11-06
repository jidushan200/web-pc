import MyBread from "@/components/my-bread.vue";
import MyChannel from "@/components/my-channel.vue";
import MyImage from "@/components/my-image.vue";

export default {
  install(Vue) {
    // Vue是一个构造函数——指new Vue
    Vue.component("my-bread", MyBread);
    Vue.component("my-channel", MyChannel);
    Vue.component("my-image", MyImage);
  }
};
