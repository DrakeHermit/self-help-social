type Props = {
  children?: React.ReactNode;
};

export const MainContent = ({ children }: Props) => {
  return <main className="flex-1 p-4">{children}</main>;
};
