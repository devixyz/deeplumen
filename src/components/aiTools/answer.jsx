/*
 * @Description:
 * @Author: Devin
 * @Date: 2024-08-26 09:42:55
 */
import { memo, useEffect, useRef, useState } from "react";
// import More from './more'
import { Markdown } from "./markdown";
// import logoIcon from "~/assets/logo-icon.svg";
import CopyBtn from "~/components/copy-btn";
// import LoadingAnim from "~/components/loading-anim";
import ArIcon from "~/components/arIcon";
import Content from "./Content/Content";

const BasicContent = ({ item }) => {
  const { content } = item;

  return (
    // <Markdown
    //   content={content}
    //   className={`${item.isError && "!text-[#F04438]"}`}
    // />
    <Content content={content}></Content>
  );
};

const Answer = ({ item, answerIcon, responding, chatAnswerContainerInner }) => {
  const { content, more } = item;

  const containerRef = useRef(null);
  const contentRef = useRef(null);

  return (
    <div className="flex mb-2 last:mb-0">
      <div className="shrink-0 relative w-10 h-10">
        {answerIcon || (
          <div className="flex items-center justify-center w-full h-full rounded-full bg-[#d5f5f6] border-[0.5px] border-black/5 text-xl">
            🤖
            {/* <img src={logoIcon} alt="icon" /> */}
          </div>
        )}
      </div>
      <div
        className="chat-answer-container group grow w-0 ml-4"
        ref={containerRef}
      >
        {content && (
          <div className={`group relative pr-10 ${chatAnswerContainerInner}`}>
            <div
              ref={contentRef}
              className={`
              relative inline-block px-4 py-0 max-w-full rounded-2xl text-gray-900 dark:text-white leading-[1.75]  text-[1rem]
            `}
              style={{
                fontFamily:
                  "ui-sans-serif, -apple-system, system-ui, Segoe UI, Helvetica, Apple Color Emoji, Arial, sans-serif, Segoe UI Emoji, Segoe UI Symbol",
              }}
            >
              <div
                className={"absolute flex justify-end gap-1 -top-4 right-6"}
                // style={(!hasWorkflowProcess && positionRight) ? { left: contentWidth + 8 } : {}}
              >
                <CopyBtn value={content} className="hidden group-hover:block" />
              </div>
              {/* {responding && !content && (
              <div className="flex items-center justify-center w-6 h-5">
                <LoadingAnim type="text" />
              </div>
            )} */}
              <BasicContent item={item} />
            </div>
            <div className="mt-1 h-[18px]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Answer);
