interface UserMessageProps {
  message: string;
}

const UserMessage = ({ message }: UserMessageProps) => {
  return (
    <div class="flex justify-center p-4">
      <div class="flex p-2 max-w-[50%]">
        <p class="flex">{message}</p>
      </div>
    </div>
  );
};

export default UserMessage;
