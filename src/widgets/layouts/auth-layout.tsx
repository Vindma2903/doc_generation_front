import { Card, CardBody, CardHeader } from "@nextui-org/react";

export const AuthLayout = ({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <Card className="max-w-lg w-full px-8 py-6 rounded-md shadow-lg">
        <CardHeader className="px-6">
          <h1 className="text-2xl font-semibold">{name}</h1>
        </CardHeader>
        <CardBody className="p-6">{children}</CardBody>
      </Card>
    </div>
  );
};
