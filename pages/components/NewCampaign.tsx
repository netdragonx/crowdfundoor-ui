import { FormEvent, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { BarLoader } from "react-spinners";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { Campaign } from "../../types";
import contractInterface from "../abi/crowdfundoor.json";

interface Props {
  contractAddress: `0x${string}`;
}

export default function NewCampaign({ contractAddress }: Props) {
  const [campaign, setCampaign] = useState<Campaign>();
  const [newCampaignId, setNewCampaignId] = useState<number>();
  const [doWrite, setDoWrite] = useState(false);
  const { isConnected } = useAccount();

  const { config: config, error: writeError } = usePrepareContractWrite({
    enabled:
      campaign != null &&
      campaign.tokenAddress != undefined &&
      campaign.recipient != undefined &&
      campaign.tokenId != undefined &&
      doWrite,
    address: contractAddress,
    abi: contractInterface,
    functionName: "startCampaign",
    args: [campaign?.tokenAddress, campaign?.tokenId, campaign?.recipient],
  });

  const { data, write, isLoading, isError } = useContractWrite(config);

  const {
    isLoading: isLoadingTx,
    isError: isErrorTx,
    isSuccess: isSuccessTx,
  } = useWaitForTransaction({
    hash: data && data.hash,
    onSuccess(data: any) {
      setNewCampaignId(parseInt(data.logs[0].topics[1]));
    },
    onError(error) {
      console.log(error);
    },
    onSettled(data, error) {
      setCampaign(undefined);
      setDoWrite(false);
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;

    setCampaign({
      tokenAddress: target.tokenAddress.value,
      tokenId: target.tokenId.value,
      recipient: target.recipient.value,
    });

    setDoWrite(true);
  };

  useEffect(() => {
    if (doWrite) {
      write?.();
    }
  }, [write, doWrite]);

  return (
    <>
      <h2>Start new campaign</h2>

      <Container className="form-container">
        <Row>
          <Col sm>
            <Form onSubmit={onSubmit}>
              <input
                type="text"
                name="tokenAddress"
                placeholder="Token Address"
              />
              <input type="text" name="tokenId" placeholder="Token ID" />
              <input
                type="text"
                name="recipient"
                placeholder="Recipient Address"
              />
              <Button type="submit">Start Campaign</Button>
            </Form>

            {(isLoading || isLoadingTx) && (
              <BarLoader
                width="65%"
                cssOverride={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: "1rem",
                  marginBottom: "0.5rem",
                }}
              />
            )}
            {(isError || isErrorTx) && (
              <div>
                <div>{isError || isErrorTx}</div>
                {writeError && <div>{writeError.message}</div>}
              </div>
            )}
          </Col>
        </Row>
        {(isSuccessTx || newCampaignId) && (
          <Row>
            <Col className="paddingTop">
              <h4>Success.</h4>
              <p>
                You just started <strong>Campaign #{newCampaignId}</strong>.
              </p>
              <p>Tell your friends!</p>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}
