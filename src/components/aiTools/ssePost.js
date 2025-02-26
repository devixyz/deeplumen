import { toast } from "react-toastify";

const ContentType = {
  json: "application/json",
  stream: "text/event-stream",
  audio: "audio/mpeg",
  form: "application/x-www-form-urlencoded; charset=UTF-8",
  download: "application/octet-stream", // for download
  upload: "multipart/form-data", // for upload
};

const baseOptions = {
  method: "GET",
  mode: "cors",
  credentials: "include", // always send cookies、HTTP Basic authentication.
  headers: new Headers({
    "Content-Type": ContentType.json,
  }),
  redirect: "follow",
};

function unicodeToChar(text) {
  if (!text) return "";

  return text.replace(/\\u[0-9a-f]{4}/g, (_match, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  });
}

const handleStream = (
  response,
  onData,
  onCompleted,
  onMessageEnd,
  onMessageReplace,
  onFile
) => {
  if (!response.ok) throw new Error("Network response was not ok");

  const reader = response.body?.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let isFirstMessage = true;

  function read() {
    reader
      ?.read()
      .then((result) => {
        if (result.done) {
          onCompleted && onCompleted();
          return;
        }

        buffer += decoder.decode(result.value, { stream: true });
        const lines = buffer.split("\n");
        console.log(lines, "lines");

        lines.slice(0, -1).forEach((message) => {
          if (message.trim()) {
            processMessage(message);
          }
        });

        buffer = lines[lines.length - 1];
        read();
      })
      .catch((error) => {
        handleError(error);
      });
  }

  function processMessage(message) {
    try {
      if (!message.startsWith("data: ")) {
        console.log(message, "!message.startsWith:message");
      } else {
        console.log(message, "message");
        const bufferObj = JSON.parse(message.replace(/^data: /, ""));
        handleEvent(bufferObj);
      }
    } catch (e) {
      handleError(e);
    }
  }

  function handleEvent(bufferObj) {
    if (bufferObj.status === 400 || !bufferObj.event) {
      onData("", false, {
        conversationId: undefined,
        messageId: "",
        errorMessage: bufferObj?.message,
        errorCode: bufferObj?.code,
      });
      onCompleted?.(true, bufferObj?.message);
      return;
    }

    switch (bufferObj.event) {
      case "message":
      case "agent_message":
        onData(unicodeToChar(bufferObj.answer), isFirstMessage, {
          conversationId: bufferObj.conversation_id,
          taskId: bufferObj.task_id,
          messageId: bufferObj.id,
        });
        isFirstMessage = false;
        break;
      case "message_file":
        onFile?.(bufferObj);
        break;
      case "message_end":
        onMessageEnd?.(bufferObj);
        break;
      case "message_replace":
        onMessageReplace?.(bufferObj);
        break;
    }
  }

  function handleError(error, bufferObj = {}) {
    console.error("Error processing stream:", error);
    onData("", false, {
      conversationId: undefined,
      messageId: "",
      errorMessage: `${error}`,
    });
    onCompleted?.(true, error.toString());
  }

  read();
};

export const ssePost = (
  url,
  fetchOptions,
  {
    onData,
    onCompleted,
    onFile,
    onMessageEnd,
    onMessageReplace,
    onError,
    getAbortController,
  }
) => {
  const abortController = new AbortController();

  const options = Object.assign(
    {},
    baseOptions,
    {
      method: "POST",
      signal: abortController.signal,
    },
    fetchOptions
  );

  const contentType = options.headers.get("Content-Type");
  if (!contentType) options.headers.set("Content-Type", ContentType.json);

  getAbortController?.(abortController);

  // const urlWithPrefix = "http://network.jancsitech.net:1510/api/chat-messages" || `${url.startsWith("/") ? url : `/${url}`}`;
  const urlWithPrefix = `${url.startsWith("/") ? url : `/${url}`}`;

  const { body } = options;
  if (body) options.body = JSON.stringify(body);

  fetch(urlWithPrefix, options)
    .then((res) => {
      if (!/^(2|3)\d{2}$/.test(String(res.status))) {
        res.json().then((data) => {
          toast.error(data.message || "Server Error");
          console.log(data, "data");
        });
        onError?.("Server Error");
        return;
      }
      return handleStream(
        res,
        (str, isFirstMessage, moreInfo) => {
          if (moreInfo.errorMessage) {
            onError?.(moreInfo.errorMessage, moreInfo.errorCode);
            if (
              moreInfo.errorMessage !==
              "AbortError: The user aborted a request."
            )
              //   Toast.notify({ type: "error", message: moreInfo.errorMessage });
              return;
          }
          onData?.(str, isFirstMessage, moreInfo);
        },
        onCompleted,
        onMessageEnd,
        onMessageReplace,
        onFile
      );
    })
    .catch((e) => {
      if (e.toString() !== "AbortError: The user aborted a request.")
        throw new Error(e);
      onError?.(e);
    });
};

// 辅助函数：生成带有统一前缀的URL
export function getChatApiUrl() {
  return `/api/v1/chat-messages`;
}

export default ssePost;
