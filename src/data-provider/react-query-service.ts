/*
 * @Description:
 * @Author: Devin
 * @Date: 2025-02-20 15:30:07
 */
import {
  UseQueryOptions,
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
  QueryObserverResult,
} from "@tanstack/react-query";
import * as t from "./types";
import * as dataService from "./data-service";
import axios from "axios";

export enum QueryKeys {
  messages = "messsages",
  allConversations = "allConversations",
  conversation = "conversation",
  user = "user",
  presets = "presets",
  searchResults = "searchResults",
  tokenCount = "tokenCount",
}

export const useAbortRequestWithMessage = (): UseMutationResult<
  void,
  Error,
  { endpoint: string; abortKey: string; message: string }
> => {
  return useMutation(({ endpoint, abortKey, message }) =>
    dataService.abortRequestWithMessage(endpoint, abortKey, message)
  );
};

export const useGetUserQuery = (
  config?: UseQueryOptions<t.TUser>
): QueryObserverResult<t.TUser> => {
  return useQuery<t.TUser>([QueryKeys.user], () => dataService.getUser(), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
    ...config,
  });
};

export const useGetMessagesByConvoId = (
  id: string,
  config?: UseQueryOptions<t.TMessage[]>
): QueryObserverResult<t.TMessage[]> => {
  return useQuery<t.TMessage[]>(
    [QueryKeys.messages, id],
    () => dataService.getMessagesByConvoId(id),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...config,
    }
  );
};

export const useGetConversationByIdQuery = (
  id: string,
  config?: UseQueryOptions<t.TConversation>
): QueryObserverResult<t.TConversation> => {
  return useQuery<t.TConversation>(
    [QueryKeys.conversation, id],
    () => dataService.getConversationById(id),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...config,
    }
  );
};

//This isn't ideal because its just a query and we're using mutation, but it was the only way
//to make it work with how the Chat component is structured
export const useGetConversationByIdMutation = (
  id: string
): UseMutationResult<t.TConversation> => {
  const queryClient = useQueryClient();
  return useMutation(() => dataService.getConversationById(id), {
    onSuccess: (res: t.TConversation) => {
      queryClient.invalidateQueries([QueryKeys.conversation, id]);
    },
  });
};

export const useUpdateConversationMutation = (
  id: string
): UseMutationResult<
  t.TUpdateConversationResponse,
  unknown,
  t.TUpdateConversationRequest,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: t.TUpdateConversationRequest) =>
      dataService.updateConversation(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.conversation, id]);
        queryClient.invalidateQueries([QueryKeys.allConversations]);
      },
    }
  );
};

export const useDeleteConversationMutation = (
  id?: string,
  user: string = "abc-123"
): UseMutationResult<any> => {
  const queryClient = useQueryClient();
  return useMutation(() => dataService.deleteConversation(id, user), {
    onSuccess: () => {
      // queryClient.invalidateQueries([QueryKeys.conversation, id]);
      // queryClient.invalidateQueries([QueryKeys.allConversations]);
    },
  });
};

export const useClearConversationsMutation = (
  user: string = "abc-123"
): UseMutationResult<unknown> => {
  const queryClient = useQueryClient();

  const fetchAllConversations = async () => {
    try {
      const data = await dataService.getConversations(user, "100");
      console.log(data, "fetched conversations");
      return data;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  };

  const deleteConversation = async (conversationId: string) => {
    // 假设这是删除单个聊天信息的 API 调用
    return await dataService.deleteConversation(conversationId, user);
  };

  return useMutation(
    async () => {
      const { data: conversations } = await fetchAllConversations();

      for (const conversation of conversations) {
        await deleteConversation(conversation.id);
      }
    },
    {
      onSuccess: () => {
        console.log("Conversations cleared successfully");
        queryClient.invalidateQueries([QueryKeys.allConversations]);
      },
      onError: (error: any) => {
        console.error("Error clearing conversations:", error);
      },
    }
  );
};

export const useGetConversationsQuery = (
  user: string,
  limit: string,
  config?: UseQueryOptions<t.TConversation[]>
): QueryObserverResult<t.TConversation[]> => {
  return useQuery<t.TConversation[]>(
    [QueryKeys.allConversations, user, limit],
    () => dataService.getConversations(user, limit),
    {
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: 1,
      ...config,
    }
  );
};

export const useCreatePresetMutation = (): UseMutationResult<
  t.TPreset[],
  unknown,
  t.TPreset,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: t.TPreset) => dataService.createPreset(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.presets]);
      },
    }
  );
};

export const useUpdatePresetMutation = (): UseMutationResult<
  t.TPreset[],
  unknown,
  t.TPreset,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: t.TPreset) => dataService.updatePreset(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.presets]);
      },
    }
  );
};

export const useGetPresetsQuery = (
  config?: UseQueryOptions<t.TPreset[]>
): QueryObserverResult<t.TPreset[], unknown> => {
  return useQuery<t.TPreset[]>(
    [QueryKeys.presets],
    () => dataService.getPresets(),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      ...config,
    }
  );
};

export const useDeletePresetMutation = (): UseMutationResult<
  t.TPreset[],
  unknown,
  t.TPreset | {},
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: t.TPreset | {}) => dataService.deletePreset(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.presets]);
      },
    }
  );
};

export const useUpdateTokenCountMutation = (): UseMutationResult<
  t.TUpdateTokenCountResponse,
  unknown,
  string,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation((text: string) => dataService.updateTokenCount(text), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.tokenCount]);
    },
  });
};

export const useLoginUserMutation = (): UseMutationResult<
  t.TLoginUserResponse,
  unknown,
  t.TLoginUserRequest,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: t.TLoginUserRequest) => dataService.login(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.user]);
      },
    }
  );
};

export const useRegisterUserMutation = (): UseMutationResult<
  t.TRegisterUserResponse,
  unknown,
  t.TRegisterUser,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation(
    (payload: t.TRegisterUser) => dataService.register(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.user]);
      },
    }
  );
};

export const useLogoutUserMutation = (): UseMutationResult<unknown> => {
  const queryClient = useQueryClient();
  return useMutation(() => dataService.logout(), {
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeys.user]);
    },
  });
};

export const useRefreshTokenMutation = (): UseMutationResult<
  t.TRefreshTokenResponse,
  unknown,
  unknown,
  unknown
> => {
  return useMutation(() => dataService.refreshToken(), {});
};

export const useRequestPasswordResetMutation =
  (): UseMutationResult<unknown> => {
    return useMutation((payload: t.TRequestPasswordReset) =>
      dataService.requestPasswordReset(payload)
    );
  };

export const useResetPasswordMutation = (): UseMutationResult<unknown> => {
  return useMutation((payload: t.TResetPassword) =>
    dataService.resetPassword(payload)
  );
};
