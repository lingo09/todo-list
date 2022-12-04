<template>
  <div id="app">
    <router-view @addTip="addTip" />
    <template v-if="tip">
      <confirm-dialog></confirm-dialog>
    </template>
  </div>
</template>

<script>
import confirmDialog from "@/components/confirmDialog.vue";

export default {
  name: "App",
  data() {
    return {
      tip: "",
    };
  },
  components: {
    confirmDialog,
  },
  methods: {
    addTip(tip) {
      this.tip = tip;
    },
  },
};
</script>

<style lang="less">
@import "https://unpkg.com/todomvc-app-css@2.1.0/index.css";

body {
  margin: 0 auto !important;
}
</style>
