<template>
  <div
    ref="inputMessage"
    class="flex bg-white rounded-lg p-2 w-full items-start h-32"
  >
    <img
      :src="`https://avatars.dicebear.com/api/bottts/${usernameTrimmed}.svg`"
      class="w-10 mt-3"
    />
    <div class="flex flex-col mt-3 ml-2">
      <p class="font-bold">{{ message.username }}</p>
      <p class="text-sm text-gray-400">
        {{ formattedDate }}
      </p>
      <p class="">{{ message.text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: Object,
  },
  computed: {
    usernameTrimmed: function() {
      return this.message.username.split(" ").join("");
    },
    formattedDate: function() {
      // firebase timestamp
      if (this.message.created.seconds)
        return new Date(this.message.created.seconds * 1000).toLocaleString(
          "en-US",
          {
            weekday: "short",
            day: "numeric",
            year: "numeric",
            month: "long",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          }
        );

      return this.message.created;
    },
  },
  mounted() {
    this.$refs.inputMessage.scrollIntoView({ behavior: "smooth" });
  },
};
</script>

<style lang="scss" scoped></style>
