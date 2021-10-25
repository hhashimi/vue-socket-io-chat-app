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

import { db } from "../main";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

const socket = io("http://localhost:8080/");

export default {
  data() {
    return {
      chatMessages: [],
    };
  },
  methods: {
    async messageEntered(msg) {
      socket.emit("chat-message", { text: msg, username: this.characterName });

      // save message in firestore collection
      try {
        await addDoc(collection(db, "messages"), {
          text: msg,
          username: this.characterName,
          created: serverTimestamp(),
        });
      } catch (e) {
        console.error("Error adding document");
      }
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
  async mounted() {
    // get last 25 previous messages from firebase
    const q = query(
      collection(db, "messages"),
      orderBy("created", "desc"),
      limit(25)
    );
    const querySnapshot = await getDocs(q);
    const firebaseMessages = [];
    querySnapshot.forEach((doc) => {
      firebaseMessages.push(doc.data());
    });

    firebaseMessages
      .slice()
      .reverse()
      .forEach((msg) => {
        this.chatMessages.push(msg);
      });

    // listen for server messages
    socket.on("server-message", (message) => {
      this.chatMessages.push(message);
    });
  },
};
</script>

<style lang="scss" scoped></style>
