import request from "@utils/request";
import { BusinessUserInfo } from "./data";
import { getChatToken, getChatUrl } from "@/utils/storage";
import useUserStore, { AppConfig } from "@/store/modules/user";
import { SessionType } from "open-im-sdk-wasm/lib/types/enum";

// new
export const updateBusinessInfo = (params: Partial<BusinessUserInfo>) =>
  request.post(
    "/user/update",
    JSON.stringify({ ...params, userID: useUserStore().storeSelfInfo.userID }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );

// new
export const getBusinessInfo = (userID: string) =>
  request.post<{ users: BusinessUserInfo[] }>(
    "/user/find/full",
    JSON.stringify({ userIDs: [userID] }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );

// new
export const searchUserInfoByBusiness = (content: string) => {
  return request.post<{ users: BusinessUserInfo[]; total: number }>(
    "/user/search/full",
    JSON.stringify({
      keyword: content,
      pagination: {
        pageNumber: 1,
        showNumber: 20,
      },
    }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );
};

// new
export const getAppConfig = (): Promise<{ data: { config: AppConfig } }> => {
  return request.post(
    "/client_config/get",
    JSON.stringify({
      operationID: Date.now() + "",
    }),
    {
      baseURL: getChatUrl(),
    }
  );
};

export const setConversationExConfig = (userID: string, conversationParams: {
  "conversationID": string,
  "conversationType": SessionType,
  "userID": string,
  "ex": string
}) =>
  request.post<any>(
    "/translate/config/set",
    JSON.stringify({
      'userIDs': [userID],
      'conversation': conversationParams
    }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );

export const getConversationsExConfig = (ownerUserID: string, conversationIDs: string[]) =>
  request.post<any>(
    "/translate/config/get",
    JSON.stringify({
      'conversationIDs': conversationIDs,
      'ownerUserID': ownerUserID
    }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );

export const translateMessage = (params: {
  userID: string,
  ClientMsgID: string,
  Query: string,
  TargetLang: string
}) =>
  request.post<any>(
    "/translate/do",
    JSON.stringify(params),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );
