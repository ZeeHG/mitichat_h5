export enum WorkMomentLogType {
  Like = 1,
  At = 2,
  Commit = 3,
}

export enum MomentContentType {
  TextWithImage = 0,
  TextWithVideo = 1,
}

export type MomentMeta = {
  original: string;
  thumb: string;
  width: number;
  height: number;
};

export enum MomentPermission {
  Public,
  Private,
  AssignCanSee,
  AssignCanNotSee,
}

export type WorkMoments = {
  workMomentID: string;
  userID: string;
  content: {
    metas: MomentMeta[];
    text: string;
    type: MomentContentType;
  };
  likeUsers: Users[];
  comments: Comments[];
  faceURL: string;
  nickname: string;
  atUsers: Users[];
  permissionUsers?: Users[];
  createTime: number;
  permission: MomentPermission;
  type?: WorkMomentLogType;
  uuid?: string;
};

export type Content = {
  // 0text 1video
  type: 0 | 1;
  text: string;
  metas: {
    thumb: string;
    original: string;
  }[];
};

export type Users = {
  userID: string;
  nickname: string;
  faceURL?: string;
};

export type Comments = {
  userID: string;
  nickname: string;
  replyUserID: string;
  replyNickname: string;
  commentID: string;
  content: string;
  createTime: number;
  faceURL: string;
  replyFaceURL: string;
};

export type WorkMomentsResponse = {
  workMoments: WorkMoments[];
};
