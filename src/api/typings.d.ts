declare namespace API {
  declare namespace Login {
    enum UsedFor {
      Register = 1,
      Modify = 2,
      Login = 3,
    }
    type RegisterUserInfo = {
      nickname: string;
      faceURL: string;
      birth?: number;
      gender?: number;
      email?: string;
      account?: string;
      areaCode: string;
      phoneNumber: string;
      password: string;
    };
    type DemoRegisterType = {
      invitationCode?: string;
      verifyCode: string;
      deviceID?: string;
      autoLogin?: boolean;
      user: RegisterUserInfo;
    };
    type LoginParams = {
      verifyCode: string;
      deviceID?: string;
      phoneNumber: string;
      areaCode: string;
      account?: string;
      password: string;
    };
    type ModifyParams = {
      userID: string;
      currentPassword: string;
      newPassword: string;
    };
    type ResetParams = {
      phoneNumber: string;
      areaCode: string;
      verifyCode: string;
      password: string;
    };
    type VerifyCodeParams = {
      phoneNumber: string;
      areaCode: string;
      verifyCode: string;
      usedFor: UsedFor;
    };
    type SendSmsParams = {
      phoneNumber: string;
      areaCode: string;
      deviceID?: string;
      usedFor: UsedFor;
      invitationCode?: string;
    };
  }

  declare namespace User {}
  declare namespace Moments {
    type User = {
      userID: string;
      userName: string;
    };
    enum MomentType {
      circle = 1,
      xhs = 2,
    }
    type PublishMomentsParams = {
      content: {
        metas: {
          original: string;
          thumb: string;
        }[];
        text: string;
        type: number;
      };
      permission: number;
      atUserIDs: string[];
      permissionUserIDs: string[];
      permissionGroupIDs: string[];
      momentType: MomentType;
    };
    type DeleteCommentParams = {
      workMomentID: string;
      commentID: string;
    };
    type CreateCommentParams = {
      workMomentID: string;
      content: string;
      replyUserID: string;
      momentType: MomentType;
    };
  }
}
