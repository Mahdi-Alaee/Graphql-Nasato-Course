import { useMutation, useQuery, useSubscription } from "@apollo/client";
import {
  addMessageMutation,
  messageAddedSubscribtion,
  messagesQuery,
} from "./queries";

export function useAddMessage() {
  const [mutate] = useMutation(addMessageMutation);

  const addMessage = async (text) => {
    const {
      data: { message },
    } = await mutate({
      variables: { text },
    });
    return message;
  };

  return { addMessage };
}

export function useMessages() {
  const { data } = useQuery(messagesQuery);

  useSubscription(messageAddedSubscribtion, {
    onData: ({ data, client }) => {
      const newMessage = data.data.message;
      client.cache.updateQuery(
        {
          query: messagesQuery,
        },
        (data) => ({
          messages: [...data.messages, newMessage],
        })
      );
    },
  });

  return {
    messages: data?.messages ?? [],
  };
}
