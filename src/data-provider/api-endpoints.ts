/*
 * @Description:
 * @Author: Devin
 * @Date: 2025-02-20 09:57:11
 */
export const user = () => {
  return `/api/auth/user`;
};

export const messages = (id: string, user: string = "abc-123") => {
  return `/api/v1/messages?user=${user}&conversation_id=${id}`;
};

export const abortRequest = (endpoint: string) => {
  return `/api/ask/${endpoint}/abort`;
};

export const conversations = (user: string, limit: string = "20") => {
  return `/api/v1/conversations?user=${user}&&last_id=&limit=${limit}`;
};

export const conversationById = (id: string) => {
  return `/api/convos/${id}`;
};

export const updateConversation = () => {
  return `/api/convos/update`;
};

export const deleteConversation = () => {
  return `/api/convos/clear`;
};

export const search = (q: string, pageNumber: string) => {
  return `/api/search?q=${q}&pageNumber=${pageNumber}`;
};

export const presets = () => {
  return `/api/presets`;
};

export const deletePreset = () => {
  return `/api/presets/delete`;
};

export const tokenizer = () => {
  return `/api/tokenizer`;
};

export const login = () => {
  return "/api/auth/login";
};

export const logout = () => {
  return "/api/auth/logout";
};

export const register = () => {
  return "/api/auth/register";
};

export const loginFacebook = () => {
  return "/api/auth/facebook";
};

export const loginGoogle = () => {
  return "/api/auth/google";
};

export const refreshToken = () => {
  return "/api/auth/refresh";
};

export const requestPasswordReset = () => {
  return "/api/auth/requestPasswordReset";
};

export const resetPassword = () => {
  return "/api/auth/resetPassword";
};
