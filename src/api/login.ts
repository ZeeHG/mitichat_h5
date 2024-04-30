import request from "@utils/request";
import {
  ChangPasswordParams,
  DemoLoginParams,
  DemoRegisterParams,
  ModifyPasswordParams,
  SendSmsParams,
  VerifyCodeParams,
} from "./data";
import { getChatToken } from "@/utils/storage";

let platform = 5;

// new
export const sendSms = (params: SendSmsParams) =>
  request.post("/account/code/send", JSON.stringify({ ...params }));

// new
export const verifyCode = (params: VerifyCodeParams) =>
  request.post(
    "/account/code/verify",
    JSON.stringify({
      ...params,
      operationID: Date.now() + "",
    })
  );

// new
export const register = (params: DemoRegisterParams) => {
  return request.post(
    "/account/register",
    JSON.stringify({
      ...params,
      platform,
    })
  );
};

// new
export const modify = (params: ModifyPasswordParams) =>
  request.post(
    "/account/password/reset",
    JSON.stringify({
      ...params,
      platform,
    })
  );

// new
export const login = (params: DemoLoginParams) => {
  return request.post(
    "/account/login",
    JSON.stringify({
      ...params,
      deviceID: "",
      platform: 5,
      account: "",
    })
  );
};

export const businessModify = (params: ChangPasswordParams) => {
  return request.post(
    "/account/password/change",
    JSON.stringify({
      ...params,
      platform,
    }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );
};

export const PostThirdCode = async (
  idToken: string,
  registerType: number,
  clientId: string
) => {
  const response = await request.post(
    "http://10.25.2.24:10008/account/oauth",

    JSON.stringify({
      idToken: idToken,
      clientId: clientId,
      registerType: registerType,
      platform: 5,
      deviceID: "",
    }),

    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.data;
  return data;
};
