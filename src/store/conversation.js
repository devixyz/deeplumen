import endpoints from "./endpoints";
import {
  atom,
  selector,
  atomFamily,
  useSetRecoilState,
  useResetRecoilState,
  useRecoilCallback,
} from "recoil";
import submission from "./submission.js";

// current conversation, can be null (need to be fetched from server)
// sample structure
// {
//   conversationId: 'new',
//   title: 'New Chat',
//   user: null,
//   // endpoint: [azureOpenAI, openAI, bingAI, chatGPTBrowser]
//   endpoint: 'azureOpenAI',
//   // for azureOpenAI, openAI, chatGPTBrowser only
//   model: 'gpt-3.5-turbo',
//   // for azureOpenAI, openAI only
//   chatGptLabel: null,
//   promptPrefix: null,
//   temperature: 1,
//   top_p: 1,
//   presence_penalty: 0,
//   frequency_penalty: 0,
//   // for bingAI only
//   jailbreak: false,
//   context: null,
//   systemMessage: null,
//   jailbreakConversationId: null,
//   conversationSignature: null,
//   clientId: null,
//   invocationId: 1,
//   toneStyle: null,
// };

const conversation = atom({
  key: "conversation",
  default: null,
});

// current messages of the conversation, must be an array
// sample structure
// [{text, sender, messageId, parentMessageId, isCreatedByUser}]
const messages = atom({
  key: "messages",
  default: [],
});

const latestMessage = atom({
  key: "latestMessage",
  default: null,
});

const messagesSiblingIdxFamily = atomFamily({
  key: "messagesSiblingIdx",
  default: 0,
});

const useConversation = () => {
  const setConversation = useSetRecoilState(conversation);
  const setMessages = useSetRecoilState(messages);
  const setSubmission = useSetRecoilState(submission.submission);
  const resetLatestMessage = useResetRecoilState(latestMessage);

  const switchToConversation = useRecoilCallback(
    ({}) =>
      async (_conversation, messages = null) => {
        _switchToConversation(_conversation, messages);
      },
    []
  );

  const _switchToConversation = (conversation, messages = null) => {
    console.log(conversation, "conversation", messages);
    setConversation(conversation);
    setMessages(messages);
    setSubmission({});
    resetLatestMessage();
  };

  const newConversation = (template = {}, preset) => {
    console.log("123");
    switchToConversation(
      {
        // id: "new",
        // name: "New Chat",
        // ...template,
      },
      []
    );
  };

  return {
    newConversation,
    switchToConversation,
  };
};

export default {
  conversation,
  messages,
  latestMessage,
  messagesSiblingIdxFamily,
  useConversation,
};
