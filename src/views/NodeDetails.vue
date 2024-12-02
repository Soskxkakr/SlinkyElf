<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { SlinkyNode } from "../data/nodes";
import { reactive, ref } from "vue";
import { message, type UploadProps } from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import dayjs, { Dayjs } from "dayjs";
import { storeToRefs } from "pinia";
import { useSlinkyStore } from "../stores/useSlinkyStore.js";

const fileList = ref<UploadProps["fileList"]>([]);
const timeRanges = ref<[Dayjs, Dayjs]>([dayjs(), dayjs()]);

const route = useRoute();
const router = useRouter();
const { sideBarNodes } = storeToRefs(useSlinkyStore());
const { onUpdateNode } = useSlinkyStore();

const { id } = route.params;
const filteredNode: SlinkyNode[] = sideBarNodes.value.filter(
  (data: SlinkyNode) => !["trigger", "dateTimeConnector"].includes(data.type)
);

const node = ref(filteredNode.find((data: SlinkyNode) => data.id == id));
const fieldsToValidate = reactive([
  {
    name: "name",
    isValid: true,
    errorMessage: "Name is required.",
  },
  {
    name: "dateTime",
    isValid: true,
    errorMessage: "Date time is required",
  },
  {
    name: "messageSequence",
    isValid: true,
  },
]);

if (node.value?.type === "sendMessage") {
  fileList.value = node.value.data.payload
    ?.filter((data) => data.type === "attachment")
    .map((data, index) => ({
      uid: `${index}`,
      name: `${index}.png`,
      status: "done",
      url: data.attachment,
      thumbUrl: data.attachment,
    }));
} else if (node.value?.type === "dateTime") {
  timeRanges.value = node.value.data?.times?.map((time) => [
    dayjs(time.startTime, "HH:mm"),
    dayjs(time.endTime, "HH:mm"),
  ]);
}

const validateFields = (): boolean => {
  let isValid = true;
  fieldsToValidate.forEach((field) => {
    field.isValid = true;
  });

  if (!node.value?.name || node.value.name.trim() === "") {
    isValid = false;
    const nameField = fieldsToValidate.find((field) => field.name === "name");

    if (nameField) nameField.isValid = false;

    message.error("Name is required.");
  }

  if (node.value?.type === "sendMessage") {
    const msqSequence = fieldsToValidate.find(
      (field) => field.name === "messageSequence"
    );
    if (!node.value.data.payload || node.value.data.payload.length === 0) {
      isValid = false;

      if (msqSequence) msqSequence.isValid = false;

      message.error("Message sequence must have at least 1 sequence.");
    }

    if (
      node.value.data.payload &&
      node.value.data.payload.some(
        (msg) => msg.text === "" || msg.attachment === ""
      )
    ) {
      isValid = false;

      if (msqSequence) msqSequence.isValid = false;

      message.error("Message sequence is incomplete.");
    }
  }

  if (node.value?.type === "dateTime") {
    const dateTimeList = fieldsToValidate.find(
      (field) => field.name === "dateTime"
    );

    const times = node.value.data?.times || [];

    if (times.length !== 7) {
      dateTimeList.isValid = false;
      isValid = false;
      message.error("Invalid date range.");
    }

    const incompleteDays = times.some(
      (time) => !time.startTime || !time.endTime
    );

    if (incompleteDays) {
      dateTimeList.isValid = false;
      isValid = false;
      message.error("All date time needs to be valid.");
    }
  }

  return isValid;
};

const updateNode = () => {
  if (node.value && validateFields()) {
    onUpdateNode(node.value);
    message.success("Node has been updated");
    return;
  }
};

const beforeUpload = (file: File) => {
  const isValidType = file.type === "image/jpeg" || file.type === "image/png";
  if (!isValidType) {
    message.error("You can only upload JPG/PNG files!");
    return false;
  }
  const isLessThan2MB = file.size / 1024 / 1024 < 2;
  if (!isLessThan2MB) {
    message.error("Image must be smaller than 2MB!");
    return false;
  }

  const blobUrl = URL.createObjectURL(file);

  fileList.value?.push({
    uid: `${fileList.value.length++}`,
    name: file.name,
    status: "done",
    url: blobUrl,
  });

  node.value?.data.payload?.push({
    type: "attachment",
    attachment: blobUrl,
  });
};

const addNewMessage = (type: "text" | "attachment") => {
  if (node.value?.type === "sendMessage") {
    if (!node.value?.data?.payload) {
      node.value.data["payload"] = [
        {
          type,
          [type]: "",
        },
      ];
    } else {
      node.value?.data.payload?.push({
        type,
        [type]: "",
      });
    }
  }
};

const removeMessage = (text: string) => {
  if (node.value?.type === "sendMessage" && node.value.data.payload) {
    const valueToBeRemoved = node.value.data.payload.find(
      (data) => data.text === text || data.attachment === text
    );
    node.value.data.payload = node.value.data.payload.filter(
      (data) =>
        data.text !== valueToBeRemoved?.text ||
        data.attachment !== valueToBeRemoved?.attachment
    );

    if (valueToBeRemoved?.type === "attachment") {
      fileList.value = fileList.value?.filter(
        (data) => data.url !== valueToBeRemoved.attachment
      );
    }
  }
};

const updateTime = (index: number, value: [Dayjs, Dayjs] | null) => {
  if (node.value?.data?.times?.[index]) {
    node.value.data.times[index].startTime = value
      ? value[0].format("HH:mm")
      : "";
    node.value.data.times[index].endTime = value
      ? value[1].format("HH:mm")
      : "";
  }
};
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
              v-model:value="node.name"
              placeholder="Enter node name"
              :status="
                fieldsToValidate?.find((field) => field.name === 'name').isValid
                  ? ''
                  : 'error'
              "
            />
          </a-form-item>

          <a-form-item label="Description">
            <a-textarea
              v-model:value="node.data.description"
              placeholder="Enter description"
              rows="4"
            />
          </a-form-item>

          <a-form-item
            v-if="node.type === 'sendMessage'"
            label="Message Sequence"
          >
            <a-list
              size="small"
              bordered
              :vertical="false"
              :data-source="node.data.payload"
            >
              <template #renderItem="{ item, index }">
                <a-list-item>
                  <a-input
                    v-if="item.type === 'text'"
                    v-model:value="item.text"
                    style="margin-bottom: 8px"
                  />
                  <a-image
                    v-else-if="item.type === 'attachment'"
                    :width="150"
                    :src="item.attachment"
                  />
                  <template #actions>
                    <a
                      key="list-loadmore-edit"
                      @click="
                        removeMessage(item?.text || item?.attachment || '')
                      "
                      >Delete</a
                    >
                  </template>
                </a-list-item>
              </template>
            </a-list>
            <a-space style="margin-top: 16px">
              <a-button block @click="addNewMessage('text')">
                <plus-outlined />
                New message
              </a-button>
              <a-upload
                :show-upload-list="false"
                :before-upload="beforeUpload"
                accept=".jpg, .png, .jpeg"
              >
                <a-button block>
                  <plus-outlined />
                  New Attachment
                </a-button>
              </a-upload>
            </a-space>
          </a-form-item>

          <a-form-item v-else-if="node.type === 'dateTime'" label="Date Time">
            <template v-if="node.data.times && node.data.times.length > 0">
              <template v-for="(time, index) in node.data.times" :key="index">
                <a-form-item
                  :label="time?.day || `Day ${index + 1}`"
                  label-align="left"
                >
                  <a-time-range-picker
                    v-model:value="timeRanges[index]"
                    @change="(value: [Dayjs, Dayjs]) => updateTime(index, value)"
                    :status="
                      fieldsToValidate?.find(
                        (field) => field.name === 'dateTime'
                      ).isValid
                        ? ''
                        : 'error'
                    "
                    format="HH:mm"
                  />
                </a-form-item>
              </template>
            </template>
          </a-form-item>

          <a-form-item v-else-if="node.type === 'addComment'" label="Comment">
            <a-input v-model:value="node.data.comment" />
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
