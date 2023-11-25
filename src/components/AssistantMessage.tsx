interface AssistantMessageProps {
  message: string;
}

const AssistantMessage = ({ message }: AssistantMessageProps) => {
  return (
    <>
      <div>{message}</div>
    </>
  );
};

export default AssistantMessage;
