import { MessageItem } from "@/utils/open-im-sdk-wasm/types/entity";

type ExMessageFields = {
  checked: boolean;
  disabled: boolean;
  jump: boolean;
  isAppend?: boolean;
};

export type ExedMessageItem = MessageItem & ExMessageFields;

export enum MessageMenuType {
  Copy,
  Delete,
  ForWard,
  Replay,
  Revoke,
  Multiple,
  Emoji
}
