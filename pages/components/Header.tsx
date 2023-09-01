import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

const App: React.FC = () => {
  return (
    <>
      <h1>Crowdfundoor</h1>
      <p>
        <a
          href="https://github.com/netdragonx/crowdfundoor"
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
};

export default App;
