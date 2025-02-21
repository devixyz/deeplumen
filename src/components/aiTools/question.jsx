/*
 * @Description:
 * @Author: Devin
 * @Date: 2024-08-26 09:42:55
 */
import { memo } from "react";
import { Markdown } from "./markdown";
import ImageGallery from "./image-uploader/image-gallery";
import ArIcon from "~/components/arIcon";

const Question = ({ item, questionIcon }) => {
  const { content, message_files } = item;

  const imgSrcs = message_files?.length
    ? message_files.map((item) => item.url)
    : [];
  return (
    <div className="flex justify-end mb-2 last:mb-0 pl-10">
      <div className="group relative mr-4 w-max-[90%]">
        <div className="px-4 py-3 bg-[#D1E9FF]/50  rounded-2xl text-sm text-gray-900">
          {!!imgSrcs.length && <ImageGallery srcs={imgSrcs} />}
          <Markdown content={content} />
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
