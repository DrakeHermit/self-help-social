type Props = {
  children?: React.ReactNode;
};

export const MainContent = ({ children }: Props) => {
  return <main className="min-w-0 flex-1 p-4 pb-24 md:pb-4">{children}</main>;
};
