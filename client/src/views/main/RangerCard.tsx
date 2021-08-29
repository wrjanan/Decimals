import { Card, Button, Divider, Form, Input } from "antd";
import "../components/MintPopover.css";
import ETH from "../../utils/math-utils";
import { useEffect, useState } from "react";
import { FormOutlined, EditOutlined, CloseOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useContractContext } from "../../context/contract-context";

const { Meta } = Card;

export interface RangerCardProps {
  ranger : {
    owner?: boolean,
    rangerToken: number,
    rangerURI: string,
    rangerName: string,
    rangerDescription: string,
    rangerClaimableTokens: number,
    claimTokens?: () => void
  }
}

const RangerCard: React.FC<RangerCardProps> = ({ ranger
}): React.ReactElement => {
  const { account, contracts } = useContractContext();
  const [ isEditingName, setIsEditingName ] = useState(false);
  const [ isEditingDesc, setIsEditingDesc ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ tokenEstimate, setTokenEstimate ] = useState(0);
  const [ imageURI, setImageURI ] = useState("");
  const [form] = Form.useForm();
  const contract = contracts.CyberPunkRangersContract;
  const {
    owner,
    rangerToken,
    rangerURI,
    rangerName,
    rangerDescription,
    rangerClaimableTokens,
    claimTokens
  } = ranger;

useEffect(() => {
  const fetchImageURI = async () => {
    let fetchedImageURI = "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png";
    console.log(rangerURI);
    await fetch(rangerURI).then(function(response) {
      console.log(response);
      return response.text()
    }).then(function(text) {
      console.log(text);
      const jsonResponse = JSON.parse(text);
      console.log(jsonResponse);
      fetchedImageURI = `https://gateway.ipfs.io/ipfs/${jsonResponse.image.split("//")[1]}`;
    });
    setImageURI(fetchedImageURI);
  }
  if(rangerURI !== "" && !isLoading) {
    setIsLoading(true);
    fetchImageURI();
    setIsLoading(false);
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [ranger, isLoading])

  const toggleEditName = () => {
    setIsEditingName(true);
    setIsEditingDesc(false);
  }
  const toggleEditDesc = () => {
    setIsEditingDesc(true);
    setIsEditingName(false);
  }
  const toggleOffEdit = () => {
    setIsEditingDesc(false);
    setIsEditingName(false);
  }

  const onFinish = (values: any) => {
    console.log(values);
    if(isEditingName) {
      const name = values?.name || "";
      if(name.length > 0) {
        contract?.methods.changeName(rangerToken, name)
          .send({ from: account }).then((response:any) =>{
          console.log(response);
        })
      }
    }
    if(isEditingDesc) {
      const description = values?.description || "";
      if(description.length > 0) {
        contract?.methods.changeDescription(rangerToken, description)
          .send({ from: account }).then((response:any) =>{
          console.log(response);
        })
      }
    }
  };

  const estimateNameChangePrice = () => {
    const fields = form.getFieldsValue();
    const name = fields?.name || "";
    if((rangerName || "") !== name) {
      return 365;
    }
    return 0;
  }
  const estimateDescChangePrice = () => {
    const fields = form.getFieldsValue();
    const description = fields?.description || "";

    if((rangerDescription || "") !== description) {
      return description.length;
    }
    return 0;
  }

  const estimateChangePrice = () => {
    let priceEstimate = 0;
    if(isEditingName) {
      priceEstimate = estimateNameChangePrice();
    } else if(isEditingDesc) {
      priceEstimate =  estimateDescChangePrice();
    }
    setTokenEstimate(priceEstimate);
  }


  const trimSpaceValidator = async (rule: any, value: string) => {
    console.log(rule);
    console.log(value);
    if ((value.charAt(0) === " " ) ||
    (value.charAt(value.length-1) === " " )) {
      throw new Error('No spaces at start / end.');
    }
    return Promise.resolve();
  }
  const consecutiveSpaceValidator = async (rule: any, value: string) => {
    if (value.match(/[ ]{2,}/)) {
      throw new Error('No consecutive spaces.');
    }
    return Promise.resolve();
  }

  const contractStringValidation = () => {
    return [
      {
        pattern: /^[0-9a-zA-Z !"'.,?]*$/,
        message: `We can only use alphanumerics and ,.'"?! and space`,
      },
      {
        validator: trimSpaceValidator
      },
      {
        validator: consecutiveSpaceValidator
      }
    ]
  }

  const getRules = (isName: boolean) => {
    if(isEditingName && isName) {
      return ([
        {
          max: 25,
          message: "Our name has to be kept within 25 characters long"
        },
        ...contractStringValidation()
      ]);
    } else if(isEditingDesc && !isName) {
      return ([
        {
          max: 365,
          message: "Our description has to be kept within 365 characters long"
        },
        ...contractStringValidation()
      ])
    }
  }

  const printInfo = ()=>{
    if(isEditingName || isEditingDesc) {
      return (
        <>
          <Form form={form} name="nest-messages" onFinish={onFinish} >
            <Form.Item name={'name'} rules={getRules(true)} hidden={!isEditingName}>
              <Input
                placeholder="Name"
                onChange={estimateChangePrice}
                disabled={!isEditingName}
                value={rangerName}
                />
            </Form.Item>
            <Form.Item
              name={'description'}
              rules={getRules(false)}
              hidden={!isEditingDesc}
              >
              <Input.TextArea
                placeholder="Description"
                onChange={estimateChangePrice}
                disabled={!isEditingDesc}
                value={rangerDescription}
                />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          <Divider></Divider>
          <p>Tokens Estimated: {tokenEstimate}</p>
        </>
      );
    } else {
      return (
        <>
          <Meta
            style={{textAlign:"start"}}
            title={`Name: ${rangerName}`}
            description={`Description: ${rangerDescription}`} />
          { getOwnerClaim() }
        </>
        )
    }
  }

  const getOwnerClaim = () => {
    if(owner) {
      return (
        <>
          <Divider></Divider>
          <p>Tokens Accumulated: {ETH.prettifyEther(rangerClaimableTokens)}</p>
          { ETH.prettifyEther(rangerClaimableTokens) > 0.1 && <Button onClick={claimTokens}>Claim</Button> }
        </>
      )
    }
  }

  const printImage = () => {
    console.log("printing image");
    if(imageURI === "") {
      return <QuestionCircleOutlined style={{ fontSize: '160px', paddingTop:"24px", paddingBottom:"24px" }} />;
    } else {
      return <img alt="example" src={imageURI} className="ranger-image"/>
    }
  };

  const getActions = () => {
    if(owner) {
      return [
        <EditOutlined key="edit" onClick={toggleEditName}/>,
        <FormOutlined key="setting" onClick={toggleEditDesc}/>,
        <CloseOutlined key="Close" onClick={toggleOffEdit}/>,
      ]
    }
  }

  return (
    <Card
      hoverable
      loading={isLoading}
      style={{ width: 240 }}
      cover={ printImage() }
      actions={getActions()}
    >
      { printInfo() }
    </Card>
  );
}

export default RangerCard;
