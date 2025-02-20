/*
 * @Description:
 * @Author: Devin
 * @Date: 2025-02-20 15:30:07
 */
import conversation from "./conversation";
import conversations from "./conversations";
import endpoints from "./endpoints";
import user from "./user";
import text from "./text";
import submission from "./submission";
import preset from "./preset";
import token from "./token";

export default {
  ...conversation,
  ...conversations,
  ...endpoints,
  ...user,
  ...text,
  ...submission,
  ...preset,
  ...token,
};
