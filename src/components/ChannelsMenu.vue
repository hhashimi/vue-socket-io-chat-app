<template>
  <div
    :class="{ hidden: !showChannelsMenu }"
    class="bg-white rounded-3xl my-2 mb-5 w-full sm:flex flex-col sm:self-center sm:w-1/3 p-2 h-52"
  >
    <p class="text-2xl">Channels</p>
    <hr class="mt-2" />
    <ul class="cursor-pointer mt-2 space-y-3 text-md">
      <li
        v-for="(channel, index) in channels"
        :key="index"
        class="hover:bg-green-100 rounded-md px-2"
        :class="{ 'bg-green-50': channel === this.channel }"
        @click="this.$emit('setChannel', channel)"
      >
        {{ channel }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      channels: ["TypeScript", "Node", "React", "Vue", "Angular"],
    };
  },
  props: {
    showChannelsMenu: Boolean,
    channel: String,
  },
};
</script>

<style lang="scss" scoped></style>
