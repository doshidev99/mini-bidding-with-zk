import { Button, notification } from "antd";
import { ContractReceipt } from "ethers";
import React from "react";
import { toast } from "react-hot-toast";
import { useToggle } from "../../hooks/useToggle";

interface IndexProps {
  method: () => void;
  children: React.ReactNode;
  callback?: (data: ContractReceipt) => void;
  [key: string]: any;
}

const AppButton = ({ method, children, callback, ...rest }: IndexProps) => {
  const [loading, setLoading] = useToggle(false);

  const handleClick = async () => {
    setLoading();
    try {
      const tx = (await method()) as any;
      toast.promise(tx.wait(), {
        loading: "Loading",
        success: "Got the data",
        error: "Error when fetching",
      });
      return Promise.resolve(null);
    } catch (err) {
      console.log({ err });
    } finally {
      setLoading();
    }
  };
  return (
    <>
      <Button type="primary" loading={loading} onClick={handleClick} {...rest}>
        {children}
      </Button>
    </>
  );
};
export default AppButton;
