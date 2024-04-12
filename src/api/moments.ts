import { WorkMoments, WorkMomentsResponse } from "@/types/moment";
import { getChatToken } from "@/utils/storage";
import request from "@utils/request";



export const fetchUserMoments = (
  pageNumber: number,
  userID?: string,
  momentType: API.Moments.MomentType = 1
) => {
  const url = `/office/work_moment/find/${!userID ? "recv" : "send"}`;
  return request.post<{ workMoments: WorkMoments[] }>(
    url,
    JSON.stringify({
      userID,
      pagination: {
        pageNumber,
        showNumber: 20,
      },
      momentType,
    }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );
};

export const getMomentLogs = (
  pageNumber: number,
  momentType: API.Moments.MomentType = 1
) => {
  return request.post<{ workMoments: WorkMoments[] }>(
    "/office/work_moment/logs",
    JSON.stringify({
      pagination: {
        pageNumber,
        showNumber: 20,
      },
      momentType,
    }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );
};

export const publishMoment = (
  params: API.Moments.PublishMomentsParams
) => {
  return request.post(
    "/office/work_moment/add",
    JSON.stringify({
      ...params,
    }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );
};

export const getMomentsByID = (
  workMomentID: string,
  momentType: API.Moments.MomentType = 1
) => {
  return request.post<{ workMoment: WorkMoments }>(
    "/office/work_moment/get",
    JSON.stringify({
      workMomentID,
      momentType,
    }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );
};

export const deleteComment = (workMomentID: string, commentID: string) => {
  return request.post<{ workMoments: WorkMoments[] }>(
    "/office/work_moment/comment/del",
    JSON.stringify({
      workMomentID,
      commentID,
    }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );
};

export const deleteMoment = (workMomentID: string) => {
  return request.post<{ workMoments: WorkMoments[] }>(
    "/office/work_moment/del",
    JSON.stringify({
      workMomentID,
    }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );
};

export const createComment = (params: API.Moments.CreateCommentParams) => {
  return request.post<{ workMoments: WorkMoments[] }>(
    "/office/work_moment/comment/add",
    JSON.stringify({
      ...params,
    }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );
};

export const likeMoment = (params: { workMomentID: string; like: boolean }) => {
  return request.post<{ workMoments: WorkMoments[] }>(
    "/office/work_moment/like",
    JSON.stringify({
      ...params,
    }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );
};

export const getMomentsUnreadCount = (
  momentType: API.Moments.MomentType = 1
) => {
  return request.post(
    "/office/work_moment/unread/count",
    JSON.stringify({
      momentType,
    }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );
};

export enum MomentsClearType {
  Count = 1,
  List = 2,
  All = 3,
}

export const clearUnreadMoments = (type: MomentsClearType,  momentType: API.Moments.MomentType) => {
  return request.post(
    "/office/work_moment/unread/clear",
    JSON.stringify({
      type,
      momentType,
    }),
    {
      headers: {
        token: getChatToken(),
      },
    }
  );
};
