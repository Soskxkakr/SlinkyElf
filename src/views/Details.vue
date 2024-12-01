<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { SettingOutlined } from "@ant-design/icons-vue";
import jsonData from "../data/nodes.json";

const router = useRouter();
const slinkyNodes = ref(
	jsonData.filter(
		(data) => !["trigger", "dateTimeConnector"].includes(data.type)
	)
);

const onClick = (node) => {
	if (node.id) {
		// console.log(selectedNode.value.data);
		router.push(`/details/${node.id}`);
	}
};
</script>

<template>
	<div class="dnd-flow-container">
		<div class="dnd-flow" style="padding-left: 18px; padding-right: 18px">
			<h1>Slinky Elf Nodes</h1>

			<a-flex wrap="wrap" gap="small">
				<template v-for="node in slinkyNodes" :key="node.id">
					<a-card
						size="small"
						:bordered="true"
						:title="node.name || 'Trigger'"
						style="width: 300px; border: 2px solid black"
					>
						<a-space direction="vertical">
							<span>Type: {{ node.type }}</span>
							<a-typography-paragraph :level="5"
								><strong>Additional Data</strong></a-typography-paragraph
							>

							<template v-if="node.type === 'dateTime'">
								<span
									>No. of hours available:
									{{ node.data?.times.length || "0" }}</span
								>
								<span>Timezone: {{ node.data?.timezone || "UTC" }}</span>
							</template>

							<template v-else-if="node.type === 'sendMessage'">
								<span
									>Message sequence:
									{{ node.data?.payload.length || "0" }}</span
								>
							</template>

							<template v-else-if="node.type === 'addComment'">
								<span>Comment: {{ node.data?.comment || "" }}</span>
							</template>
						</a-space>
						<template #actions>
							<setting-outlined key="setting" @click="onClick(node)" />
						</template>
					</a-card>
				</template>
			</a-flex>
		</div>
	</div>
</template>
