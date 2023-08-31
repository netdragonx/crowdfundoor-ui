import { FormEvent, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { BarLoader } from "react-spinners";
import { useContractRead } from "wagmi";
import { Campaign } from "../../types";
import contractInterface from "../abi/crowdfundoor.json";
import CampaignCard from "./CampaignCard";
import DonateCard from "./DonateCard";
import WithdrawCard from "./WithdrawCard";
import AcceptCard from "./AcceptCard";

interface Props {
  contractAddress: `0x${string}`;
}

export default function ViewCampaign({ contractAddress }: Props) {
  const [campaignId, setCampaignId] = useState<number>();
  const [campaign, setCampaign] = useState<Campaign>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useContractRead({
    enabled: campaignId != null,
    address: contractAddress,
    abi: contractInterface,
    functionName: "campaigns",
    args: [campaignId],
    onSettled(data, error) {
      setIsLoading(false);
    },
    onSuccess(data: any) {
      const _campaign = {
        campaignId,
        amount: data[0].toString(),
        tokenId: data[1].toString(),
        tokenAddress: data[2].toString(),
        recipient: data[3].toString(),
        isAccepted: data[4] as boolean,
      };

      if (
        _campaign?.tokenAddress == "0x0000000000000000000000000000000000000000"
      ) {
        setCampaign(undefined);
        setError("Campaign does not exist.");
      } else {
        setCampaign(_campaign);
      }
    },
    onError(error) {
      setError(error.message);
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;

    if (target.campaignId.value == "") {
      return false;
    }

    setError(undefined);
    setIsLoading(true);
    setCampaignId(target.campaignId.value);
  };

  return (
    <>
      <h2>Donate to Existing Campaign</h2>

      <Container className="form-container">
        <Row>
          <Col sm>
            <Form onSubmit={onSubmit}>
              <input type="text" name="campaignId" placeholder="Campaign ID" />
              <Button type="submit">View Campaign</Button>
            </Form>
          </Col>
        </Row>
        {campaign ? (
          <>
            <Row>
              <Col sm>
                <CampaignCard campaign={campaign} />
              </Col>
            </Row>
            <Row>
              <Col lg={3}>
                <DonateCard
                  campaign={campaign}
                  contractAddress={contractAddress}
                />
              </Col>
              <Col lg={3}>
                <WithdrawCard
                  campaign={campaign}
                  contractAddress={contractAddress}
                />
              </Col>
              <Col lg={6}>
                <AcceptCard
                  campaign={campaign}
                  contractAddress={contractAddress}
                />
              </Col>
            </Row>
          </>
        ) : (
          <></>
        )}
        {isLoading && (
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
        {error && (
          <div>
            <div>{error}</div>
          </div>
        )}
      </Container>
    </>
  );
}
