import { feedbackToast } from "@utils/common";
import useConversationStore from "@/store/modules/conversation";
import useMessageStore from "@/store/modules/message";
import { IMSDK } from "@/utils/imCommon";
import { MessageReceiveOptType } from "@/utils/open-im-sdk-wasm/types/enum";
import { showConfirmDialog } from "vant";

export default function useConversationSettings() {
  const { t } = useI18n();
  const conversationStore = useConversationStore();
  const messageStore = useMessageStore();

  const switchLoading = reactive({
    pinLoading: false,
    recvMsgLoading: false,
    privateLoading: false,
  });

  const updateConversationPinState = async () => {
    switchLoading.pinLoading = true;
    try {
      await IMSDK.pinConversation({
        conversationID:
          conversationStore.storeCurrentConversation.conversationID,
        isPinned: !conversationStore.storeCurrentConversation.isPinned,
      });
    } catch (error) {}
    switchLoading.pinLoading = false;
  };

  const updateConversationRecvMsgState = async (
    flag: boolean,
    opt: MessageReceiveOptType
  ) => {
    switchLoading.recvMsgLoading = true;
    try {
      await IMSDK.setConversationRecvMessageOpt({
        conversationID:
          conversationStore.storeCurrentConversation.conversationID,
        opt: flag ? opt : MessageReceiveOptType.Nomal,
      });
    } catch (error) {}
    switchLoading.recvMsgLoading = false;
  };

  const updateConversationPrivateState = async () => {
    switchLoading.privateLoading = true;
    try {
      await IMSDK.setConversationPrivateChat({
        conversationID:
          conversationStore.storeCurrentConversation.conversationID,
        isPrivate: !conversationStore.storeCurrentConversation.isPrivateChat,
      });
    } catch (error) {}
    switchLoading.privateLoading = false;
  };

  const updateBurnDuration = async (seconds: number) => {
    try {
      await IMSDK.setConversationBurnDuration({
        conversationID:
          conversationStore.storeCurrentConversation.conversationID,
        burnDuration: seconds,
      });
    } catch (error) {}
  };

  const clearLogs = () => {
    showConfirmDialog({
      message: t("popover.clearChatHistory"),
      beforeClose: (action: string) => {
        return new Promise((resolve) => {
          if (action !== "confirm") {
            resolve(true);
            return;
          }
          IMSDK.clearConversationAndDeleteAllMsg(
            conversationStore.storeCurrentConversation.conversationID
          )
            .then(() => {
              messageStore.clearHistoryMessage();
              feedbackToast();
            })
            .catch((error: unknown) => feedbackToast({ error }))
            .finally(() => resolve(true));
        });
      },
    });
  };

  return {
    conversationStore,
    switchLoading,
    updateConversationPinState,
    updateConversationRecvMsgState,
    updateConversationPrivateState,
    updateBurnDuration,
    clearLogs,
  };
}
