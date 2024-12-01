<script lang="ts">
import { reactive } from "vue";

const state = reactive({
	selectedKeys: ["dnd"],
	openKeys: ["dnd"],
});

export default {
	setup() {
		return {
			state,
		};
	},
};
</script>

<template>
	<div class="app-container">
		<a-menu
			class="vertical-menu"
			mode="inline"
			v-model:openKeys="state.openKeys"
			v-model:selectedKeys="state.selectedKeys"
		>
			<a-menu-item key="dnd">
				<router-link to="/">
					<span>Slinky Flow</span>
				</router-link>
			</a-menu-item>
			<a-menu-item key="details">
				<router-link to="/details">
					<span>Details</span>
				</router-link>
			</a-menu-item>
		</a-menu>
		<router-view v-slot="{ Component }">
			<keep-alive include="Slinky">
				<component :is="Component" />
			</keep-alive>
		</router-view>
	</div>
</template>
