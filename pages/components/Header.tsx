import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import EtherscanLink from "./EtherscanLink";

interface Props {
  contractAddress: `0x${string}`;
}

export default function Header({ contractAddress }: Props) {
  return (
    <>
      <h1>Crowdfundoor</h1>
      <p>
        <EtherscanLink address={contractAddress}>Contract</EtherscanLink>
        &nbsp;&middot;&nbsp;
        <a
          href="https://github.com/netdragonx/crowdfundoor-ui"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        &nbsp;&middot;&nbsp;
        <a
          href="https://twitter.com/netdragon0x"
          target="_blank"
          rel="noreferrer"
        >
          Twitter
        </a>
      </p>
      <p>
        Crowdfundoor is a smart contract that allows users to crowdfund the
        purchase of an ERC721 token.
      </p>
      <p>The intended use is to help recover stolen assets.</p>

      <ConnectButton label="Connect Wallet" showBalance={true} />
    </>
  );
}
