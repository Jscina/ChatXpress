interface UserMessageProps {
  message: string;
}

const UserMessage = ({ message }: UserMessageProps) => {
  return (
    <div class="flex justify-center items-center">
      <p>{message}</p>
    </div>
  );
};
