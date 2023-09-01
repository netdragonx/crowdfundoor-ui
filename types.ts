export interface Campaign {
  campaignId?: number;
  amount?: string;
  tokenId?: string;
  tokenAddress?: `0x${string}`;
  recipient?: `0x${string}`;
  isAccepted?: boolean;
}
