import { useState, useEffect, useRef, useContext } from "react";
import NewChat from "./NewChat";
import Panel from "../svg/Panel";
import Spinner from "../svg/Spinner";
import Pages from "../Conversations/Pages";
import Conversations from "../Conversations";
import NavLinks from "./NavLinks";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useGetConversationsQuery } from "~/data-provider";
import useDebounce from "~/hooks/useDebounce";
import store from "~/store";
import { useAuthContext } from "~/hooks/AuthContext";
import { ThemeContext } from "~/hooks/ThemeContext";
import { cn } from "~/utils/";
import ConversationsList from "./ConversationsList";

// import resolveConfig from 'tailwindcss/resolveConfig';
// const tailwindConfig = import('../../../tailwind.config.cjs');
// const fullConfig = resolveConfig(tailwindConfig);

// export const getBreakpointValue = (value) =>
//   +fullConfig.theme.screens[value].slice(0, fullConfig.theme.screens[value].indexOf('px'));

// export const getCurrentBreakpoint = () => {
//   let currentBreakpoint;
//   let biggestBreakpointValue = 0;
//   for (const breakpoint of Object.keys(fullConfig.theme.screens)) {
//     const breakpointValue = getBreakpointValue(breakpoint);
//     if (breakpointValue > biggestBreakpointValue && window.innerWidth >= breakpointValue) {
//       biggestBreakpointValue = breakpointValue;
//       currentBreakpoint = breakpoint;
//     }
//   }
//   return currentBreakpoint;
// };

export default function Nav({ navVisible, setNavVisible }) {
  const [isHovering, setIsHovering] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const { theme } = useContext(ThemeContext);
  const containerRef = useRef(null);
  const scrollPositionRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  // current page
  const [limit, setLimit] = useState(100);

  // data provider
  const getConversationsQuery = useGetConversationsQuery("abc-123", limit, {
    enabled: true || isAuthenticated,
  }); // todo

  const { newConversation, searchPlaceholderConversation } =
    store.useConversation();
  const { setConversationsStore } = store.useConversations();

  // current conversation
  const conversation = useRecoilValue(store.conversation);
  const { conversationId } = conversation || {};
  const refreshConversationsHint = useRecoilValue(
    store.refreshConversationsHint
  );

  const [isFetching, setIsFetching] = useState(false);

  const moveToTop = () => {
    const container = containerRef.current;
    if (container) {
      scrollPositionRef.current = container.scrollTop;
    }
  };

  useEffect(() => {
    if (getConversationsQuery.data) {
      let { data: conversations } = getConversationsQuery.data;
      console.log(getConversationsQuery, "conversations");
      setConversations(conversations);
      setConversationsStore(conversations);
    }
  }, [getConversationsQuery.isSuccess, getConversationsQuery.data]);

  useEffect(() => {
    getConversationsQuery.refetch();
  }, [conversationId, refreshConversationsHint]);

  const toggleNavVisible = () => {
    setNavVisible((prev) => !prev);
  };

  const isMobile = () => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  };

  useEffect(() => {
    if (isMobile()) {
      setNavVisible(false);
    } else {
      setNavVisible(true);
    }
  }, [conversationId, setNavVisible]);

  const sharedChats = [
    {
      id: "abc-Shared",
      name: "Placeholder: Shared with me",
    },
  ];

  const publishedChats = [
    {
      id: "abc-publishedChats",
      name: "Placeholder: Published with me",
    },
  ];

  const containerClasses = getConversationsQuery.isLoading
    ? "flex flex-col gap-2 text-gray-100 text-sm h-full justify-center items-center"
    : "flex flex-col gap-2 text-gray-100 text-sm h-full";

  return (
    <>
      <div
        className={
          "nav  bg-white  dark:bg-gray-900 md:inset-y-0" +
          (navVisible ? " active" : "")
        }
      >
        <div className="flex h-full min-h-0 flex-col ">
          <div className="scrollbar-trigger relative flex h-full w-full flex-1 items-start dark:border-white/20 border-r border-gray-200 dark:border-gray-700">
            <nav className="relative flex h-full flex-1 flex-col space-y-1">
              {/* <div className="p-2">
                <NewChat />
              </div> */}
              <div
                className={`flex-1 p-2 flex-col overflow-y-auto h-full ${
                  isHovering ? "" : "scrollbar-transparent"
                } border-b dark:border-white/20`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                ref={containerRef}
              >
                <div className={containerClasses}>
                  {/* {getConversationsQuery.isLoading || isFetching ? (
                    <Spinner />
                  ) : (
                    <Conversations
                      conversations={conversations}
                      conversationId={conversationId}
                      moveToTop={moveToTop}
                    />
                  )} */}
                  <ConversationsList
                    myChats={conversations}
                    sharedChats={sharedChats}
                    publishedChats={publishedChats}
                    isLoading={getConversationsQuery.isLoading}
                    isFetching={isFetching}
                    conversationId={conversationId}
                    moveToTop={moveToTop}
                  />
                </div>
              </div>
              <div>
                <NavLinks />
              </div>
            </nav>
          </div>
        </div>
        <button
          type="button"
          className={cn(
            "nav-close-button -ml-0.5 -mt-2.5 inline-flex h-10 w-10 items-center justify-center rounded-md focus:outline-none focus:ring-white md:-ml-1 md:-mt-2.5",
            theme === "dark"
              ? "text-gray-500 hover:text-gray-400"
              : "text-gray-400 hover:text-gray-500"
          )}
          onClick={toggleNavVisible}
        >
          <span className="sr-only">Close sidebar</span>
          <Panel />
        </button>
      </div>
      {!navVisible && (
        <button
          type="button"
          className="nav-open-button fixed left-2 top-0.5 z-10 inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-white dark:text-gray-500 dark:hover:text-gray-400"
          onClick={toggleNavVisible}
        >
          <span className="sr-only">Open sidebar</span>
          <Panel open={true} />
        </button>
      )}

      <div
        className={"nav-mask " + (navVisible ? " active" : "")}
        onClick={toggleNavVisible}
      ></div>
    </>
  );
}
