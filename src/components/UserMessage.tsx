interface UserMessageProps {
  message: string;
}

const UserMessage = ({ message }: UserMessageProps) => {
  if (message === "") {
    return null;
  }

  return (
    <div class="flex justify-center p-4 bg-neutral-200 dark:bg-neutral-600">
      <div class="flex p-2 max-w-[50%] w-full">
        <div class="flex max-w-screen-lg">
          <p class="flex">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
