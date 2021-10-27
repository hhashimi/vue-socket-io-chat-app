<template>
  <div class="mt-3 px-2">
    <input
      class="w-full h-12 px-4 mb-2 text-lg text-gray-700 placeholder-gray-400 border rounded-lg focus:shadow-outline"
      type="text"
      v-model="inputMessage"
      placeholder="Enter your message"
      @keyup.enter="onMessageEnter"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputMessage: "",
    };
  },
  methods: {
    onMessageEnter($event) {
      this.$emit("message-entered", $event.target.value);
      this.inputMessage = "";
    },
  },
};
</script>

<style lang="scss" scoped></style>
