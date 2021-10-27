<template>
  <div class="flex w-full justify-center max-h-screen">
    <div
      class="flex flex-col sm:flex-row mb-16 mx-5 rounded-md px-5 w-full sm:w-3/4 lg:w-2/4 justify-evenly"
    >
      <ChannelsMenuToggle @toggled="toggleChannelsMenu" />
      <ChannelsMenu
        :showChannelsMenu="showChannelsMenu"
        @setChannel="setChannel"
        :channel="channel"
      />
      <div class="overflow-auto">
        <div>
          <chat-message
            v-for="(message, index) in channelChatMessages"
            :key="index"
            :message="message"
            class="mt-2 h-auto"
          />
        </div>
        <span class="text-xs text-gray-400"
          >Currently online: {{ onlineUsers }}
          {{ onlineUsers > 1 ? "users" : "user" }}</span
        >
        <chat-input @message-entered="messageEntered" />
      </div>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import { uniqueNamesGenerator, starWars } from "unique-names-generator";

import ChatMessage from "./ChatMessage.vue";
import ChatInput from "./ChatInput.vue";
import ChannelsMenu from "./ChannelsMenu.vue";
import ChannelsMenuToggle from "./ChannelsMenuToggle.vue";

import { db } from "../main";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  getDocs,
  orderBy,
  limit,
  where,
} from "firebase/firestore";

const socket = io(process.env.VUE_APP_SOCKET_IO_SERVER);

export default {
  data() {
    return {
      chatMessages: [],
      showChannelsMenu: false,
      channel: "TypeScript", // default
      onlineUsers: 0,
    };
  },
  methods: {
    async messageEntered(msg) {
      socket.emit("chat-message", {
        text: msg,
        username: this.characterName,
        channel: this.channel,
      });

      // save message in firestore collection
      try {
        await addDoc(collection(db, "messages"), {
          text: msg,
          username: this.characterName,
          created: serverTimestamp(),
          channel: this.channel,
        });
      } catch (e) {
        console.error("Error adding document");
      }
    },
    toggleChannelsMenu: function() {
      this.showChannelsMenu = !this.showChannelsMenu;
    },
    setChannel: function(channel) {
      this.channel = channel;
      socket.emit("join-channel", this.channel);

      // load past messages from firebase
      if (this.channelChatMessages.length === 0) {
        this.loadPreviousChatMessages();
      }
    },
    async loadPreviousChatMessages() {
      // firebase
      // get last 25 previous messages from firebase
      const q = query(
        collection(db, "messages"),
        where("channel", "==", this.channel),
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
    },
  },
  computed: {
    characterName: function() {
      return uniqueNamesGenerator({
        dictionaries: [starWars],
      });
    },
    channelChatMessages: function() {
      return this.chatMessages.filter(
        (message) => this.channel === message.channel
      );
    },
  },
  components: { ChatMessage, ChatInput, ChannelsMenu, ChannelsMenuToggle },
  async mounted() {
    // load previous chat messages
    this.loadPreviousChatMessages();

    // join channel
    socket.emit("join-channel", this.channel);

    // listen for server messages
    socket.on("server-message", (message) => {
      this.chatMessages.push(message);
    });

    // listen for online users
    socket.on("online-users", (onlineUsers) => {
      this.onlineUsers = onlineUsers;
    });
  },
};
</script>

<style lang="scss" scoped></style>
