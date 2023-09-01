import { ethers } from "ethers";

import { Campaign } from "../../types";

interface Props {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: Props) {
  if (!campaign) return null;

  return (
    <div className="campaign-details">
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
        <strong>Recipient:</strong> {campaign.recipient}
      </p>
      <p>
        <strong>Token Address:</strong> {campaign.tokenAddress}
      </p>
      <p>
        <strong>Token ID:</strong> {campaign.tokenId}
      </p>
    </div>
  );
}
