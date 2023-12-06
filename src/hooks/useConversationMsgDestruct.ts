import useConversationStore from "@/store/modules/conversation";
import { feedbackToast } from "@/utils/common";
import { IMSDK } from "@/utils/imCommon";
import { PickerChangeEventParams } from "vant";

export default function useConversationMsgDestruct() {
  const { t } = useI18n();
  const conversationStore = useConversationStore();

  const timeOptions = [
    [
      { text: "1", value: 1 },
      { text: "2", value: 2 },
      { text: "3", value: 3 },
      { text: "4", value: 4 },
      { text: "5", value: 5 },
      { text: "6", value: 6 },
    ],
    [
      { text: t("date.day"), value: 60 * 60 * 24 },
      { text: t("date.week"), value: 60 * 60 * 24 * 7 },
      { text: t("date.month"), value: 60 * 60 * 24 * 30 },
    ],
  ];

  const destructLoading = ref(false);
  const showDestructTime = ref(false);
  const destructTime = ref(0);

  const updateDestructDuration = async () => {
    destructLoading.value = true;
    try {
      await IMSDK.setConversationIsMsgDestruct({
        conversationID:
          conversationStore.storeCurrentConversation.conversationID,
        isMsgDestruct: !conversationStore.currentConversation.isMsgDestruct,
      });
    } catch (error) {
      feedbackToast({ error });
    }
    destructLoading.value = false;
  };

  const updateDestructDurationTime = async () => {
    destructLoading.value = true;
    try {
      await IMSDK.setConversationMsgDestructTime({
        conversationID:
          conversationStore.storeCurrentConversation.conversationID,
        msgDestructTime: destructTime.value,
      });
    } catch (error) {
      feedbackToast({ error });
    }
    showDestructTime.value = false;
    destructLoading.value = false;
  };

  const onChange = ({ selectedValues }: PickerChangeEventParams) => {
    destructTime.value =
      (selectedValues[0] as number) * (selectedValues[1] as number);
  };

  const destructTimeStr = computed(() => {
    const days = Math.floor(
      conversationStore.currentConversation.msgDestructTime / 86400
    );
    const weeks = Math.floor(days / 7);
    const month = Math.floor(weeks / 4);
    if (days <= 6) {
      return `${days}${t("date.day")}`;
    } else if (weeks <= 6 && days % 7 === 0) {
      return `${weeks}${t("date.week")}`;
    }
    return `${month}${t("date.month")}`;
  });

  return {
    onChange,
    timeOptions,
    destructLoading,
    destructTimeStr,
    showDestructTime,
    updateDestructDuration,
    updateDestructDurationTime,
  };
}
