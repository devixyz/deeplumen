import React, { useRef, useState } from 'react';
import Clipboard from '~/components/svg/Clipboard';
import CheckMark from '~/components/svg/CheckMark';

const CodeBlock = ({ lang, codeChildren }) => {
  const codeRef = useRef(null);

  return (
    <div className="rounded-md bg-[#f9f9f9] dark:text-gray-950 dark:bg-gray-950 mt-2">
      <CodeBar lang={lang} codeRef={codeRef} />
      <div className="overflow-y-auto p-4 dark:text-white">
        <code ref={codeRef} className={`hljs !whitespace-pre language-${lang}`}>
          {codeChildren}
        </code>
      </div>
    </div>
  );
};

const CodeBar = React.memo(({ lang, codeRef }) => {
  const [isCopied, setIsCopied] = useState(false);
  return (
    <div className="relative flex items-center rounded-tl-md rounded-tr-md  px-4 py-2 font-sans text-xs text-[#5d5d5d]  bg-[#f9f9f9] dark:text-[#5d5d5d] dark:bg-[#2f2f2f]">
      <span className="">{lang}</span>
      <button
        className="ml-auto flex gap-2"
        onClick={async () => {
          const codeString = codeRef.current?.textContent;
          console.log(codeString,'codeString')
          if (codeString)
            navigator.clipboard.writeText(codeString).then(() => {
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 3000);
            });
        }}
      >
        {isCopied ? (
          <>
            <CheckMark />
            Copied!
          </>
        ) : (
          <>
            <Clipboard />
            Copy code
          </>
        )}
      </button>
    </div>
  );
});
export default CodeBlock;
