import React from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState
} from 'recoil';

const refreshConversationsHint = atom({
  key: 'refreshConversationsHint',
  default: 1
});

const conversationsList = atom({
  key: 'conversationsState', // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});


const useConversations = () => {
  const setRefreshConversationsHint = useSetRecoilState(refreshConversationsHint);
  const setConversations = useSetRecoilState(conversationsList);
  
  const setConversationsStore = (conversations) => {
    console.log(conversations,'conversations')
    setConversations(conversations);
  };

  const refreshConversations = () => setRefreshConversationsHint((prevState) => prevState + 1);

  return { refreshConversations, setConversationsStore };
};

export default { refreshConversationsHint,conversationsList, useConversations };

