import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueFlow } from "@vue-flow/core";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import "@vue-flow/core/dist/style.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.component("VueFlow", VueFlow); // Register VueFlow as a global component

app.mount("#app");
