import { ethers } from "ethers";
import { Row, Col } from "react-bootstrap";
import { Campaign } from "../../types";
import EtherscanLink from "./EtherscanLink";
import OpenSeaLink from "./OpenSeaLink";

interface Props {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: Props) {
  if (!campaign) return null;

  const truncateString = (str: string | `0x${string}` | undefined) => {
    if (!str) {
      return "";
    }

    if (str.length > 20) {
      return str.slice(0, 8) + "..." + str.slice(-6);
    }

    return str;
  };

  return (
    <div className="card campaign-details">
      <h4>Campaign #{campaign.campaignId} </h4>
      {!campaign.isAccepted ? (
        <p>
          <span className="total-donated">
            {ethers.utils.formatEther(ethers.BigNumber.from(campaign.amount))}{" "}
            ETH
          </span>
          <br />
          <span className="badge bg-success">Total Donated</span>
        </p>
      ) : (
        <p>
          <span className="badge bg-danger">Campaign Ended</span>
        </p>
      )}
      <Row className="campaign-details-footer">
        <Col md={2}></Col>
        <Col md={8}>
          <Row>
            <Col md={5}>
              <strong>To help fund the recovery of</strong>
              <br />
              <OpenSeaLink
                tokenAddress={campaign.tokenAddress}
                tokenId={campaign.tokenId}
                showBadge={true}
              >
                {truncateString(campaign.tokenId)}
              </OpenSeaLink>
            </Col>
            <Col md={2}>
              <h1>&rarr;</h1>
            </Col>
            <Col md={5}>
              <strong>To be delivered to</strong>
              <br />
              <EtherscanLink address={campaign.recipient} showBadge={true}>
                {truncateString(campaign.recipient)}
              </EtherscanLink>
            </Col>
          </Row>
        </Col>
        <Col md={2}></Col>
      </Row>
    </div>
  );
}
