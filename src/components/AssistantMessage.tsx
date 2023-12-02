interface AssistantMessageProps {
  message: string;
}

const AssistantMessage = ({ message }: AssistantMessageProps) => {
  return (
    <>
      <div class="flex justify-center p-4">
        <div class="flex p-2 max-w-[50%]">{message}</div>
      </div>
    </>
  );
};

export default AssistantMessage;
