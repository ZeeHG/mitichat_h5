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

export const PostThirdCode = async (idToken: string) => {
  try {
    const response = await request.post(
      "http://10.25.2.24:10008",
      {
        idToken: idToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.data;
    // 处理后端返回的数据
  } catch (error) {
    // 处理错误情况
  }
};
