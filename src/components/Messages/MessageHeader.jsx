import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import EndpointOptionsDialog from "../Endpoints/EndpointOptionsDialog";
import { cn } from "~/utils/";

import store from "~/store";

const MessageHeader = ({}) => {
  const [saveAsDialogShow, setSaveAsDialogShow] = useState(false);
  const conversation = useRecoilValue(store.conversation);
  const { name } = conversation;

  const getConversationTitle = () => {
    let _title = `${name}`;

    return _title;
  };

  return (
    <>
      <div
        className={cn(
          "dark:text-gray-450 w-full gap-1 border-b border-black/10 bg-gray-50 text-sm text-gray-500 transition-all hover:bg-gray-100 hover:bg-opacity-30 dark:border-gray-900/50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:bg-opacity-100 dark:text-gray-500",
          "cursor-pointer "
        )}
        onClick={() => setSaveAsDialogShow(true)}
      >
        <div className="d-block flex w-full items-center justify-center p-3">
          {getConversationTitle()}
        </div>
      </div>

      {/* <EndpointOptionsDialog
        open={saveAsDialogShow}
        onOpenChange={setSaveAsDialogShow}
        preset={conversation}
      /> */}
    </>
  );
};

export default MessageHeader;
