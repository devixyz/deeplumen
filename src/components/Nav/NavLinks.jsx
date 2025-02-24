/*
 * @Description:
 * @Author: Devin
 * @Date: 2025-02-20 09:57:11
 */
import { useState } from "react";
import { useRecoilValue } from "recoil";
import TrashIcon from "../svg/TrashIcon";
import { Download } from "lucide-react";
import NavLink from "./NavLink";
import ExportModel from "./ExportConversation/ExportModel";
import ClearConvos from "./ClearConvos";
import DarkMode from "./DarkMode";
import Logout from "./Logout";
import { useAuthContext } from "~/hooks/AuthContext";
import { cn } from "~/utils/";
import DotsIcon from "../svg/DotsIcon";

import ClearHistoryIcon from "../svg/ClearHistoryIcon";
import UserIcon from "../svg/UserIcon";

import UpdatesIcon from "../svg/UpdatesIcon";

import store from "~/store";

export default function NavLinks() {
  const [showExports, setShowExports] = useState(false);
  const [showClearConvos, setShowClearConvos] = useState(false);
  const { user } = useAuthContext();

  const conversation = useRecoilValue(store.conversation) || {};

  const exportable =
    conversation?.conversationId &&
    conversation?.conversationId !== "new" &&
    conversation?.conversationId !== "search";

  const clickHandler = () => {
    if (exportable) setShowExports(true);
  };

  return (
    <>
      <ul className="w-full bg-white dark:bg-gray-900 py-1 px-2">
        {/* <li>
          <NavLink
            className={cn(
              'flex w-full items-center gap-3 px-3 py-3 text-sm transition-colors duration-200',
              exportable
                ? 'cursor-pointer text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                : 'cursor-not-allowed text-gray-400 dark:text-gray-400'
            )}
            svg={() => <Download size={16} />}
            text="Export conversation"
            clickHandler={clickHandler}
          />
        </li> */}
        <li>
          <NavLink
            className="flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-sm text-black dark:text-white transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            svg={() => <ClearHistoryIcon />}
            text="Clear conversations"
            clickHandler={() => setShowClearConvos(true)}
          />
        </li>
        <li>
          <DarkMode />
        </li>
        <li>
          <NavLink
            className="flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-sm text-black dark:text-white transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            svg={() => <UserIcon />}
            text="My account"
            clickHandler={() => {}}
          />
        </li>
        <li>
          <NavLink
            className="flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-sm text-black dark:text-white transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            svg={() => <UpdatesIcon />}
            text="Updates & FAQ"
            clickHandler={() => {}}
          />
        </li>

        <li>
          <Logout />
        </li>
      </ul>

      {showExports && (
        <ExportModel open={showExports} onOpenChange={setShowExports} />
      )}
      {showClearConvos && (
        <ClearConvos open={showClearConvos} onOpenChange={setShowClearConvos} />
      )}
    </>
  );
}
