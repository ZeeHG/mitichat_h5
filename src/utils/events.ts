import mitt, { Emitter } from "mitt";

type Events = {
  CHAT_MAIN_SCROLL_TO_BOTTOM: boolean;
  CHAT_MAIN_SCROLL_TO_CLIENTMSGID: string;
  TYPING_UPDATE: void;
  ONLINE_STATE_CHECK: void;
  UPDATE_MULTIPLE_CHECK_STATE: boolean;
  KEYBOARD_UPDATE: void;
  AT_SOMEONE: any;
  MOMENTS_UPDATE_PERMISSION: string;
  MOMENTS_SELECT_AT_USER: string;
  MOMENTS_SELECT_PERMISSION_USER: string;
  MOMENTS_RELEASE_INIT: void;
};

const emitter: Emitter<Events> = mitt<Events>();

export default emitter;
