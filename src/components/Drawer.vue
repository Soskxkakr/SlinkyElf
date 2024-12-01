<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSlinkyStore } from "../stores/useSlinkyStore";
import dayjs from "dayjs";
import { useRouter } from "vue-router";

const { selectedNode } = storeToRefs(useSlinkyStore());
const { resetSelectedNode } = useSlinkyStore();
const router = useRouter();

const onClick = () => {
	if (selectedNode.value.data?.id) {
		// console.log(selectedNode.value.data);
		router.push(`/details/${selectedNode.value?.data?.id}`);
	}
};
</script>

<template>
	<a-drawer
		title="Node details"
		size="default"
		:open="!!selectedNode"
		@close="resetSelectedNode"
	>
		<a-descriptions
			bordered
			:column="{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }"
		>
			<a-descriptions-item label="Name">{{
				selectedNode?.data?.name || "-"
			}}</a-descriptions-item>
			<a-descriptions-item label="Type">{{
				selectedNode?.type || "-"
			}}</a-descriptions-item>
			<a-descriptions-item label="Description">{{
				selectedNode?.data?.description || "-"
			}}</a-descriptions-item>
		</a-descriptions>

		<a-space direction="vertical">
			<a-typography-title :level="5">Additional Data</a-typography-title>
			<template v-if="selectedNode?.type === 'dateTime'">
				<template
					v-for="(time, index) in selectedNode.data.data.times"
					:key="index"
				>
					<a-time-range-picker
						:bordered="false"
						:disabled="true"
						:value="[
							dayjs(time.startTime, 'HH:mm'),
							dayjs(time.endTime, 'HH:mm'),
						]"
						format="HH:mm"
					/>
					<span v-show="!!time?.day">{{ time.day }}</span>
				</template>
			</template>

			<template v-else-if="selectedNode?.type === 'sendMessage'">
				<a-typography-text>Messages</a-typography-text>
				<a-timeline
					v-for="(item, index) in selectedNode.data?.data?.payload || []"
					:key="index"
					style="margin-top: 16px"
				>
					<a-timeline-item color="green" v-show="item.type === 'text'">{{
						item.text
					}}</a-timeline-item>
					<a-timeline-item color="green" v-show="item.type === 'attachment'"
						><a-image
							:src="item.attachment"
							alt="Attachment Image"
							:width="100"
					/></a-timeline-item>
				</a-timeline>
			</template>

			<template v-else-if="selectedNode?.type === 'addComment'">
				<a-typography-paragraph>Comments</a-typography-paragraph>
				<a-typography-text
					keyboard
					v-show="selectedNode?.data?.data?.comment"
					>{{ selectedNode?.data?.data?.comment }}</a-typography-text
				>
			</template>

			<a-button style="margin-top: 16px" @click="onClick">Edit Node</a-button>
		</a-space>
	</a-drawer>
</template>
