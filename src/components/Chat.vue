<template>
  <div class="flex w-full justify-center max-h-screen">
    <div
      class="flex flex-col bg-blue-100 mb-16 mx-5 rounded-md px-5 w-full sm:w-3/4 lg:w-2/4"
    >
      <div class="overflow-auto">
        <chat-message
          v-for="(message, index) in chatMessages"
          :key="index"
          :message="message"
          class="mt-2 h-auto"
        />
      </div>

      <chat-input @message-entered="messageEntered" />
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import { uniqueNamesGenerator, starWars } from "unique-names-generator";

import ChatMessage from "./ChatMessage.vue";
import ChatInput from "./ChatInput.vue";

const socket = io("http://localhost:8080/");

export default {
  data() {
    return {
      chatMessages: [],
    };
  },
  methods: {
    messageEntered(msg) {
      socket.emit("chat-message", { text: msg, username: this.characterName });
    },
  },
  computed: {
    characterName: function() {
      return uniqueNamesGenerator({
        dictionaries: [starWars],
      });
    },
  },
  components: { ChatMessage, ChatInput },
  mounted() {
    // listen for server messages
    socket.on("server-message", (message) => {
      this.chatMessages.push(message);
    });
  },
};
</script>

<style lang="scss" scoped></style>
