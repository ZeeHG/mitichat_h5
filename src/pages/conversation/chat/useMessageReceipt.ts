import useConversationStore from "@/store/modules/conversation";
import useMessageStore, { ExMessageItem } from "@/store/modules/message";
import useUserStore from "@/store/modules/user";
import { IMSDK } from "@/utils/imCommon";
import { CbEvents } from "@/utils/open-im-sdk-wasm/constant";
import {
  GroupMessageReceiptInfo,
  ReceiptInfo,
  WSEvent,
} from "@/utils/open-im-sdk-wasm/types/entity";
import { SessionType } from "open-im-sdk-wasm/lib/types/enum";

const userStore = useUserStore();
const messageStore = useMessageStore();
const conversationStore = useConversationStore();

export function useMessageReceipt() {
  const setIMListener = () => {
    IMSDK.on(CbEvents.OnRecvC2CReadReceipt, singleMessageHasReadedHander);
    IMSDK.on(CbEvents.OnRecvGroupReadReceipt, groupMessageHasReadedHander);
  };

  const disposeIMListener = () => {
    IMSDK.off(CbEvents.OnRecvC2CReadReceipt, singleMessageHasReadedHander);
    IMSDK.off(CbEvents.OnRecvGroupReadReceipt, groupMessageHasReadedHander);
  };

  const singleMessageHasReadedHander = ({ data }: WSEvent<ReceiptInfo[]>) => {
    if (
      conversationStore.storeCurrentConversation.conversationType !==
      SessionType.Single
    )
      return;

    data.map((receipt) => {
      (receipt.msgIDList ?? []).map((clientMsgID: string) => {
        messageStore.updateOneMessage({
          clientMsgID,
          isRead: true,
        } as ExMessageItem);
      });
    });
  };

  const groupMessageHasReadedHander = ({data}: WSEvent<GroupMessageReceiptInfo>) => {
    if (
      data.conversationID !==
      conversationStore.storeCurrentConversation.conversationID
    )
      return;

    data.groupMessageReadInfo.forEach((receipt) => {
      if (receipt.readMembers?.[0].userID === userStore.selfInfo.userID) return;

      const oldMessage = messageStore.storeHistoryMessageList.find(
        (message) => message.clientMsgID === receipt.clientMsgID
      );
      
      if (oldMessage) {
        messageStore.updateOneMessage({
          ...oldMessage,
          isRead: true,
          attachedInfoElem: {
            ...oldMessage?.attachedInfoElem,
            groupHasReadInfo: {
              hasReadCount: receipt.hasReadCount,
              unreadCount: receipt.unreadCount,
            },
          },
        } as ExMessageItem);
      }
    });
  };

  onMounted(() => {
    setIMListener();
  });

  onUnmounted(() => {
    disposeIMListener();
  });
}
