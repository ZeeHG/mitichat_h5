import {
  FriendUserItem,
  GroupItem,
  MessageItem,
} from "@/utils/open-im-sdk-wasm/types/entity";

export type SearchLocalLogData = {
  conversationID: string;
  conversationType: number;
  faceURL: string;
  messageCount: number;
  messageList: MessageItem[];
  showName: string;
  sendTime?: number;
  latestMsg?: string;
  groupID?: string;
};

export type GlobalDataSource = {
  contacts: FriendUserItem[];
  groups: GroupItem[];
  chatLogs: SearchLocalLogData[];
  documents: MessageItem[];
};

export type GlobalSearchItem = SearchLocalLogData &
  FriendUserItem &
  GroupItem &
  Omit<MessageItem, "status">;
