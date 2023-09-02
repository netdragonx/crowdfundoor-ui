import { ethers } from "ethers";

import { Campaign } from "../../types";
import EtherscanLink from "./EtherscanLink";
import OpenSeaLink from "./OpenSeaLink";

interface Props {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: Props) {
  if (!campaign) return null;

  return (
    <div className="card campaign-details">
      <h4>Campaign #{campaign.campaignId} </h4>
      {!campaign.isAccepted ? (
        <>
          <p style={{ color: "green" }}>Active</p>
          <p>
            <span className="total-donated">
              {ethers.utils.formatEther(ethers.BigNumber.from(campaign.amount))}{" "}
              ETH
            </span>
            <br />
            <strong>Total Donated</strong>
          </p>
        </>
      ) : (
        <p style={{ color: "red" }}>Ended</p>
      )}
      <p>
        <strong>Recipient:</strong>{" "}
        <EtherscanLink address={campaign.recipient} showBadge={true}>
          {campaign.recipient}
        </EtherscanLink>
      </p>
      <p>
        <strong>Token Address:</strong>{" "}
        <EtherscanLink address={campaign.tokenAddress} showBadge={true}>
          {campaign.tokenAddress}
        </EtherscanLink>{" "}
      </p>
      <p>
        <strong>Token ID:</strong>{" "}
        <OpenSeaLink
          tokenAddress={campaign.tokenAddress}
          tokenId={campaign.tokenId}
          showBadge={true}
        >
          {campaign.tokenId}
        </OpenSeaLink>
      </p>
    </div>
  );
}
