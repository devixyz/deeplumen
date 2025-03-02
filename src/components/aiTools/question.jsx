/*
 * @Description:
 * @Author: Devin
 * @Date: 2024-08-26 09:42:55
 */
import { memo } from "react";
import CopyBtn from "~/components/copy-btn";
import ImageGallery from "./image-uploader/image-gallery";
import Content from "./Content/Content";

const Question = ({ item, questionIcon }) => {
  const { content, message_files } = item;

  const imgSrcs = message_files?.length
    ? message_files.map((item) => item.url)
    : [];
  return (
    <div className="flex justify-end mb-2 last:mb-0 sm:pl-10">
      <div className="group relative mr-4 w-max-[90%]">
        <div
          className={"absolute flex justify-end gap-1 -top-4 right-6"}
          // style={(!hasWorkflowProcess && positionRight) ? { left: contentWidth + 8 } : {}}
        >
          <CopyBtn value={content} className="hidden group-hover:block" />
        </div>
        <div
          className="px-4 py-1 bg-[#e8e8e880] dark:bg-[#2f2f2f] rounded-2xl text-gray-900 dark:text-white   leading-[1.75] text-[1rem]"
          style={{
            fontFamily:
              "ui-sans-serif, -apple-system, system-ui, Segoe UI, Helvetica, Apple Color Emoji, Arial, sans-serif, Segoe UI Emoji, Segoe UI Symbol",
          }}
        >
          {!!imgSrcs.length && <ImageGallery srcs={imgSrcs} />}
          {/* <Markdown content={content} /> */}
          <Content content={content}></Content>
        </div>
        <div className="mt-1 h-[18px]" />
      </div>
      <div className="shrink-0 relative w-10 h-10">
        {questionIcon || (
          <div className="flex items-center justify-center w-full h-full rounded-full border-black/5 border-[0.5px]  text-md bg-[#a94136] text-white ">
            {/* <img src={logoIcon} alt="icon" /> */}Y
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Question);
