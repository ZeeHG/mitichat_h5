import { feedbackToast } from "@utils/common";
import { IMSDK } from "@/utils/imCommon";
import { MessageItem } from "@/utils/open-im-sdk-wasm/types/entity";
import { MessageType } from "@/utils/open-im-sdk-wasm/types/enum";
import { GetAdvancedHistoryMsgParams } from "@/utils/open-im-sdk-wasm/types/params";
import { defineStore } from "pinia";
import store from "../index";
import useUserStore from "./user";

interface StateType {
  historyMessageList: ExMessageItem[];
  hasMore: boolean;
  previewImgList: string[];
  msgTranslate: Record<string, Record<string, any>>;
}

type ExType = {
  checked?: boolean;
  isAppend?: boolean;
  jump?: boolean;
};

type GetHistoryMessageListFromReqResp = {
  messageIDList: string[];
  lastMinSeq: number;
};

interface IAdvancedMessageResponse {
  lastMinSeq: number;
  isEnd: boolean;
  messageList: ExMessageItem[];
}

export type ExMessageItem = MessageItem & ExType;

const useStore = defineStore("message", {
  state: (): StateType => ({
    historyMessageList: [],
    hasMore: true,
    previewImgList: [],
    msgTranslate: {}
  }),
  getters: {
    storeHistoryMessageList: (state) => state.historyMessageList,
    storeHistoryMessageHasMore: (state) => state.hasMore,
    storePreviewImgList: (state) => state.previewImgList,
    storeMsgTranslate: (state) => state.msgTranslate,
  },
  actions: {
    async getHistoryMessageListFromReq(
      params: GetAdvancedHistoryMsgParams
    ): Promise<GetHistoryMessageListFromReqResp> {
      const isFirstPage =
        params.startClientMsgID === "" || params.lastMinSeq === 0;
      try {
        const { data: tmpData } =
          await IMSDK.getAdvancedHistoryMessageList<IAdvancedMessageResponse>(
            params
          );
        this.historyMessageList = [
          ...tmpData.messageList,
          ...(isFirstPage ? [] : this.historyMessageList),
        ];
        const imageUrls = filterPreviewImage(tmpData.messageList);
        this.previewImgList = [
          ...imageUrls,
          ...(isFirstPage ? [] : this.previewImgList),
        ];
        this.hasMore = !tmpData.isEnd && tmpData.messageList.length === 20;
        // console.log(this.historyMessageList);
        return {
          messageIDList: tmpData.messageList.map(
            (message: MessageItem) => message.clientMsgID
          ),
          lastMinSeq: tmpData.lastMinSeq,
        };
      } catch (error) {
        feedbackToast({ message: "Get history message failed", error });
        this.hasMore = false;
        return {
          messageIDList: [],
          lastMinSeq: 0,
        };
      }
    },
    pushNewMessage(message: MessageItem) {
      const imageUrls = filterPreviewImage([message]);
      if (imageUrls.length > 0) {
        this.previewImgList = [...this.previewImgList, ...imageUrls];
      }
      this.historyMessageList.push(message);
    },
    updateOneMessage(message: ExMessageItem, isSuccessCallBack = false) {
      const idx = this.historyMessageList.findIndex(
        (msg) => msg.clientMsgID === message.clientMsgID
      );
      if (idx !== -1) {
        this.historyMessageList[idx] = {
          ...this.historyMessageList[idx],
          ...message,
        };
        if (isSuccessCallBack) {
          const imageUrls = filterPreviewImage([message]);
          if (imageUrls.length > 0) {
            this.previewImgList = [...this.previewImgList, ...imageUrls];
          }
        }
      }
    },
    deleteOneMessage(message: ExMessageItem) {
      const idx = this.historyMessageList.findIndex(
        (msg) => msg.clientMsgID === message.clientMsgID
      );
      if (idx !== -1) {
        this.historyMessageList.splice(idx, 1);
      }
    },
    clearHistoryMessage() {
      this.historyMessageList = [];
      this.previewImgList = [];
    },
    resetCheckState() {
      this.historyMessageList.forEach((message) => (message.checked = false));
    },
    updatePreviewImgList(imgs: string[]) {
      this.previewImgList = [...this.previewImgList, ...imgs];
    },
    resetHistoryMessageList() {
      this.historyMessageList = [];
      this.hasMore = true;
      this.previewImgList = [];
    },
    updateMessageNicknameAndFaceUrl({
      sendID,
      senderFaceUrl,
      senderNickname,
    }: {
      sendID: string;
      senderFaceUrl: string;
      senderNickname: string;
    }) {
      const tmpList = [...this.historyMessageList].map((message) => {
        if (message.sendID === sendID) {
          message.senderFaceUrl = senderFaceUrl;
          message.senderNickname = senderNickname;
        }
        return message;
      });
      this.historyMessageList = tmpList;
    },
    updateQuoteMessageRevoke(clientMsgID: string) {
      this.historyMessageList.map((message) => {
        if (
          message.contentType === MessageType.QuoteMessage &&
          clientMsgID === message.quoteElem.quoteMessage.clientMsgID
        ) {
          const newMessage = {
            ...message,
            quoteElem: {
              ...message.quoteElem,
              quoteMessage: {
                ...message.quoteElem.quoteMessage,
                contentType: 2101,
              },
            },
          };
          this.updateOneMessage(newMessage);
        }
      });
    },
    initMsgTranslate(userID?: string) {
      const userStore = useUserStore();
      userID = userID ?? userStore.selfInfo.userID;
      if(userID){
        const storageKey = `${userID}_msgTranslate`;
        const storage = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
        Object.values(storage).map((item: any) => {
          if(item.status === "loading"){
            item.status = "hidden";
          }
        });
        this.msgTranslate = storage;
      }
    },
    updateMsgTranslate(clientMsgID: string, data: Record<string, any>) {
      // {
      //   "targetLang": targetLang,
      //   [targetLang]: content,
      //   "origin": query,
      //   "clientMsgID": clientMsgID,
      //   "status": "show"
      // }
      const userStore = useUserStore();
      const userID = userStore.selfInfo.userID;
      const storageKey = `${userID}_msgTranslate`;
      const storage = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
      if (storage[clientMsgID]) {
        Object.assign(storage[clientMsgID], data);
        Object.assign(this.msgTranslate[clientMsgID], data);
      } else {
        storage[clientMsgID] = data;
        this.msgTranslate[clientMsgID] = data;
      }
      localStorage.setItem(storageKey, JSON.stringify(storage));
    },
  },
});

function filterPreviewImage(messages: MessageItem[]) {
  return messages
    .filter((message) => {
      if (message.contentType === MessageType.PictureMessage) {
        return true;
      }
      if (message.contentType === MessageType.OANotification) {
        let notificationData = {} as any;
        try {
          notificationData = JSON.parse(message.notificationElem.detail);
        } catch (error) {}
        if (notificationData.mixType === 1) {
          message.pictureElem.snapshotPicture.url =
            notificationData.pictureElem.sourcePicture.url;
          return true;
        }
        return false;
      }
      return false;
    })
    .map((item) => item.pictureElem.sourcePicture.url);
}

export default function useMessageStore() {
  return useStore(store);
}
