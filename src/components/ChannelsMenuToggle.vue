<template>
  <span
    class="sm:hidden p-2 flex cursor-pointer"
    @click="this.$emit('toggled', true)"
  >
    <svg
      class="block h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
    <p class="mx-2">Channels</p>
  </span>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
