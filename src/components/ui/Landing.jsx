import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import useDocumentTitle from "~/hooks/useDocumentTitle";
import Templates from "../ui/Templates";
import SunIcon from "../svg/SunIcon";
import LightningIcon from "../svg/LightningIcon";
import CautionIcon from "../svg/CautionIcon";
import ChatIcon from "../svg/ChatIcon";

import HotTopicsIcon from "../svg/HotTopicsIcon";
import ForYouIcon from "../svg/ForYouIcon";
import FavoritesIcon from "../svg/FavoritesIcon";
import LandingPng from "../../assets/images/landing.png";

import store from "~/store";

export default function Landing() {
  const [showingTemplates, setShowingTemplates] = useState(false);
  const setText = useSetRecoilState(store.text);
  const conversation = useRecoilValue(store.conversation);
  const { title = "New Chat" } = conversation || {};

  useDocumentTitle(title);

  const clickHandler = (e) => {
    e.preventDefault();
    const { innerText } = e.target;
    const quote = innerText.split('"')[1].trim();
    setText(quote);
  };

  const showTemplates = (e) => {
    e.preventDefault();
    setShowingTemplates(!showingTemplates);
  };

  return (
    <div className="flex h-full flex-col items-center overflow-y-auto pt-0 text-sm dark:bg-gray-900">
      <div className="w-full px-6 text-gray-900 dark:text-gray-100 md:flex md:max-w-2xl md:flex-col lg:max-w-3xl">
        <h1
          id="landing-title"
          // className="mb-10 ml-auto mr-auto mt-6 flex items-center justify-center gap-2 text-center text-4xl font-semibold sm:mb-16 md:mt-[10vh]"
          className="flex items-center justify-center w-[24rem] w-[24rem] mb-8 ml-auto mr-auto mt-6 font-semibold  md:mt-[16vh]"
        >
          <img src={LandingPng} alt="Landing" />
          {/* {import.meta.env.VITE_APP_TITLE || 'DeepLumen'} */}
        </h1>
        <div className="items-start gap-3.5 text-center md:flex">
          <div className="mb-8 flex flex-1 flex-col gap-3.5 md:mb-auto">
            <h2 className="m-auto flex items-center gap-3 text-lg font-normal md:flex-col md:gap-2">
              <HotTopicsIcon />
              Hot Topics
            </h2>
            <ul className="m-auto flex w-full flex-col gap-3.5 sm:max-w-md">
              <li className="w-full rounded-md bg-gray-50 py-1 dark:bg-white/5">
                How to use AI to help you learn programming language?
              </li>
              <li className="w-full rounded-md bg-gray-50 py-1 dark:bg-white/5">
                Can you help to remove the background of this picture?
              </li>
              <li className="w-full rounded-md bg-gray-50 py-1 dark:bg-white/5">
                Coca-Cola: “Open Happiness.” 20% Discount toddy.(Ad)
              </li>
            </ul>
          </div>
          <div className="mb-8 flex flex-1 flex-col gap-3.5 md:mb-auto">
            <h2 className="m-auto flex items-center gap-3 text-lg font-normal md:flex-col md:gap-2">
              <ForYouIcon />
              For You
            </h2>
            <ul className="m-auto flex w-full flex-col gap-3.5 sm:max-w-md">
              <button
                onClick={clickHandler}
                className="w-full rounded-md bg-gray-50 p-3  py-1 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-black line-clamp-2"
              >
                &quot;StarGate: $500B AI project, leaded by OpenAI, SoftBank,
                Oracle&quot;
              </button>
              <button
                onClick={clickHandler}
                className="w-full rounded-md bg-gray-50 p-3 py-1 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-black"
              >
                &quot;Training cost of DeepSeek R1 is as low as $6M?&quot;
              </button>
              <button
                onClick={clickHandler}
                className="w-full rounded-md bg-gray-50 p-3 py-1 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-black"
              >
                &quot;Nike: “Just Do It.” Buy one, one free on Black Friday.
                (Ad)?&quot;
              </button>
            </ul>
          </div>

          <div className="mb-8 flex flex-1 flex-col gap-3.5 md:mb-auto">
            <h2 className="m-auto flex items-center gap-3 text-lg font-normal md:flex-col md:gap-2">
              <FavoritesIcon />
              Favorites
            </h2>
            <ul className="m-auto flex w-full flex-col gap-3.5 sm:max-w-md">
              <li className="w-full rounded-md bg-gray-50 p-3 py-1 dark:bg-white/5">
                Can you help to write a proposal of PhD reseach?
              </li>
              <li className="w-full rounded-md bg-gray-50 p-3 py-1  dark:bg-white/5">
                How to use python to write a trading strategy of crypo?
              </li>
              <li className="w-full rounded-md bg-gray-50 p-3 py-1 dark:bg-white/5">
                KFC: “Finger Lickin’ Good.” Crazy Thursday for discount.(Ad)
              </li>
            </ul>
          </div>
        </div>
        {/* {!showingTemplates && (
          <div className="mt-8 mb-4 flex flex-col items-center gap-3.5 md:mt-16">
            <button
              onClick={showTemplates}
              className="btn btn-neutral justify-center gap-2 border-0 md:border"
            >
              <ChatIcon />
              Show Prompt Templates
            </button>
          </div>
        )}
        {!!showingTemplates && <Templates showTemplates={showTemplates}/>} */}
        {/* <div className="group h-32 w-full flex-shrink-0 dark:border-gray-900/50 dark:bg-gray-900 md:h-48" /> */}
      </div>
    </div>
  );
}
