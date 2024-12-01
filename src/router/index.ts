import { createRouter, createWebHistory } from "vue-router";
import Slinky from "../views/Slinky.vue";
import Details from "../views/Details.vue";
import NodeDetails from "../views/NodeDetails.vue";

const routes = [
	{ path: "/", name: "Home", component: Slinky },
	{ path: "/details", name: "Details", component: Details },
	{ path: "/details/:id", name: "Node Details", component: NodeDetails },
];

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

export default router;
