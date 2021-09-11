import React, { ReactNode, useState } from "react";
import { Button, Popover, Form, InputNumber } from 'antd';
import "./MintPopover.css";
import { useContractContext } from "../../context/contract-context";
import ContractService from "../../service/ContractService";

type MintPopoverProps = {
  children: ReactNode;
}

const MintPopover: React.FC<MintPopoverProps> = ({
  children,
}): React.ReactElement=> {
  const { account, contracts } = useContractContext();
  const { DecimalsContract } = contracts;
  const [clicked, setClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickChange = (visible: boolean) => {
    setClicked(visible);
  };

  type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

  function validateMintNumber(
    number: number,
  ): { validateStatus: ValidateStatus; errorMsg: string | null } {
    if (number < 1) {
      return {
        validateStatus: 'error',
        errorMsg: 'Mint count has to be greater than 0',
      };
    } else if (number > 3) {
      return {
        validateStatus: 'error',
        errorMsg: 'Mint count has to be less than 3',
      };
    }
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }

  const RawForm = () => {
    const [number, setNumber] = useState<{
      value: number;
      validateStatus?: ValidateStatus;
      errorMsg?: string | null;
    }>({
      value: 1,
    });

    const onNumberChange = (value: number) => {
      setNumber({
        ...validateMintNumber(value),
        value,
      });
    };

    const onFinish = async () => {
      const nftCount = number.value

      setIsLoading(true);
      await ContractService.mintDecimals(DecimalsContract, nftCount, account);
      setIsLoading(false);
    };
    const ref = React.createRef<any>();
  return (
    <Form ref={ref} id="MintPopover" onFinish={onFinish}>
      <Form.Item
        style={{textAlign:"center", minWidth:"100"}}
        validateStatus={number.validateStatus}
        help={number.errorMsg}
        >
        <InputNumber style={{textAlign:"center"}} min={1} max={3} value={number.value} onChange={onNumberChange} />
      </Form.Item>
      <Form.Item style={{textAlign: "end"}}>
        <Button type="primary" htmlType="submit" disabled={isLoading} loading={isLoading}>
          Mint {number.value} Decimals Now
        </Button>
      </Form.Item>
    </Form>);
  };

  const title = 'We can only mint maximum 3 per session.';
  const hoverTitle = <b>{title}</b>;
  const hoverContent = <div>{RawForm()}</div>;

  return (
    <Popover
      content={hoverContent}
      title={hoverTitle}
      trigger={"click"}
      visible={clicked}
      onVisibleChange={handleClickChange}
    >
      {children}
    </Popover>
  );
};
export default MintPopover;

