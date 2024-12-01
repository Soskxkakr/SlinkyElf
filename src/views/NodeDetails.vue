<script setup>
import { useRoute, useRouter } from "vue-router";
import jsonData from "../data/nodes.json";
import { ref } from "vue";

const route = useRoute();
const router = useRouter();

const { id } = route.params;
const filteredNode = jsonData.filter(
	(data) => !["trigger", "dateTimeConnector"].includes(data.type)
);

const updateNode = () => {
	console.log(node.value);
};
const node = ref(filteredNode.find((data) => data.id == id));
</script>

<template>
	<div class="dnd-flow-container">
		<div class="dnd-flow" style="padding-left: 18px; padding-right: 18px">
			<a-page-header
				style="border: 1px solid rgb(235, 237, 240)"
				title="Slinky Elf Nodes"
				@back="router.back"
			/>

			<template v-if="!!node">
				<p>{{ node.id }}</p>
				<p>{{ node }}</p>

				<form @submit.prevent="updateNode">
					<a-form-item label="Name">
						<a-input
							v-model="node.name"
							:value="node.name"
							placeholder="Enter node name"
						/>
					</a-form-item>
					<a-form-item label="Description">
						<a-textarea
							v-model="node.data.description"
							:value="node.data?.description"
							placeholder="Enter description"
							rows="4"
						/>
					</a-form-item>
					<a-form-item
						v-if="node.type === 'sendMessage'"
						label="Message Sequence"
					>
						<template
							v-for="(item, index) in node.data?.payload || []"
							:key="index"
						>
							<a-input
								v-show="node.data.payload[index].type === 'text'"
								v-model="node.data.payload[index].text"
								:value="node.data.payload[index].text"
							/>
							<a-image
								v-show="!!node.data.payload[index].type === 'attachment'"
								v-model="node.data.payload[index].attachment"
								:src="node.data.payload[index].attachment"
								:width="200"
							/>
							<p>
								{{ item }}
							</p>
						</template>
					</a-form-item>
					<a-button type="primary" html-type="submit">Save Changes</a-button>
				</form>
			</template>

			<template v-else>
				<p>Node not found.</p>
			</template>
			<!-- <h1>Slinky Elf Nodes {{ id }}</h1> -->
		</div>
	</div>
</template>
