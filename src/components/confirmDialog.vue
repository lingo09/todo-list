<template>
  <div class="confirm-dialog">
    <section class="dialog">
      <header class="dialog-header">
        <h2>提示</h2>
        <span class="close-dialog">×</span>
      </header>
      <section class="dialog-content">
        <span>确认要删除吗?</span>
      </section>
      <footer class="dialog-footer">
        <button class="dialog-cancel btn" @click="cancel">取消</button>
        <button class="dialog-primary btn" @click="confirm">确认</button>
      </footer>
    </section>
  </div>
</template>

<script>
export default {
  name: "ConfirmDialog",
  data() {
    return {};
  },
  methods: {
    cancel() {
      // this.$emit("addTip", "comfirm-dialog");
      this.$store.dispatch("confirmState", { state: false });
    },
    confirm() {
      // this.$emit("addTip", "");
      this.$store.dispatch("confirmState", { state: true });
    },
  },
};
</script>

<style lang="less" scoped>
.confirm-dialog {
  // display: none;
  z-index: 1000;
  position: fixed;
  left: 0px;
  right: 0px;
  top: 20px;
  bottom: 0px;
  margin: 0 auto;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 5px 5px #ccc;
  width: 600px;
  height: 170px;
  box-sizing: border-box;
  background-color: #fff;
  .dialog {
    height: 100%;
    .dialog-header {
      position: relative;
      margin-bottom: 10px;
      padding-left: 10px;
      .close-dialog {
        position: absolute;
        top: -5px;
        right: 10px;
        font-size: 30px;
        font-weight: 700;
        color: #000;
        text-shadow: 0 1px 0 #fff;
        opacity: 0.2;
        cursor: pointer;
      }
      .close-dialog:hover {
        opacity: 0.5;
      }
    }
    .dialog-content {
      padding: 20px 0px 20px 10px;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
    }
    .dialog-footer {
      position: relative;
      .btn {
        position: absolute;
        display: inline-block;
        width: 28px;
        height: 20px;
        padding: 6px 12px;
        border: 1px solid #ccc;
        border-radius: 8px;
        color: #333;
        background-color: #fff;
        box-sizing: content-box;
        font-weight: 700;
        cursor: pointer;
      }
      .dialog-cancel {
        top: 10px;
        right: 69px;
      }
      .dialog-cancel:hover {
        color: #333;
        background-color: #e6e6e6;
        border-color: #adadad;
      }
      .dialog-cancel:active {
        background-color: #fff;
      }
      .dialog-primary {
        top: 10px;
        right: 10px;
        color: #fff;
        background-color: #337ab7;
        border-color: #2e6da4;
      }
      .dialog-primary:hover {
        color: #fff;
        background-color: #286090;
        border-color: #204d74;
      }
      .dialog-primary:active {
        // background-color: #4b8fe2;
        background-color: #337ab7;
      }
    }
  }
}
</style>
