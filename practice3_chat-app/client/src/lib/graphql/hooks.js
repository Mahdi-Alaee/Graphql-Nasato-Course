import { useMutation, useQuery } from "@apollo/client";
import { addMessageMutation, messagesQuery } from "./queries";

export function useAddMessage() {
  const [mutate] = useMutation(addMessageMutation);

  const addMessage = async (text) => {
    const {
      data: { message },
    } = await mutate({
      variables: { text },
      update: (cache, { data: { message } }) => {
        cache.updateQuery(
          {
            query: messagesQuery,
          },
          (oldData) => ({
            messages: [...oldData.messages, message],
          })
        );
      },
      // update: (cache, {data}) => {
      //   console.log(data);
      //   cache.writeQuery({
      //     query: messagesQuery,
      //     data: {messages: [data.message]},
      //   })
      // }
    });
    return message;
  };

  return { addMessage };
}

export function useMessages() {
  const { data } = useQuery(messagesQuery);
  return {
    messages: data?.messages ?? [],
  };
}
