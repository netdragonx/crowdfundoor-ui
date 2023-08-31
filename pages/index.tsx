import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Crowdfundoor_ABI from "./abi/crowdfundoor.json";
import ViewCampaign from "./components/ViewCampaign";
import NewCampaign from "./components/NewCampaign";

import "@rainbow-me/rainbowkit/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

const CONTRACT_ADDRESS = "0x213676Ad8C0beF9EF948eA185Bea1E03526eB15E";

const App: React.FC = () => {
  const [campaign, setCampaign] = useState<any>(null);

  const contractConfig = {
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: Crowdfundoor_ABI,
  };

  // const { config: config, error: writeError } = usePrepareContractWrite({
  //   enabled: true,
  //   ...contractConfig,
  //   functionName: contractFunction,
  //   args: [token.tokenId],
  //   overrides: {
  //     value: token.listPrice,
  //   },
  //   onError(e) {
  //     setContractFunction("");
  //   },
  // });

  // const { data, write, isLoading, isError } = useContractWrite(config);

  // const { isLoading: isLoadingTx, isError: isErrorTx } = useWaitForTransaction({
  //   hash: data && data.hash,
  //   wait: data && data.wait,
  //   onSuccess() {
  //     handleClose();
  //   },
  // });

  // const { data: ownerData } = useContractRead({
  //   ...contractConfig,
  //   functionName: "ownerOf",
  //   args: [token.tokenId],
  //   watch: true,
  // });

  // const { data: ownerEnsName } = useEnsName({
  //   address: String(ownerData),
  // });

  // const { data: balanceData } = useBalance({
  //   addressOrName: address,
  // });

  // const fetchCampaign = async (campaignId: string) => {
  //   if (contract) {
  //     try {
  //       const fetchedCampaign = await contract.methods
  //         .campaigns(campaignId)
  //         .call();
  //       if (
  //         fetchedCampaign.tokenAddress ===
  //         "0x0000000000000000000000000000000000000000"
  //       ) {
  //         alert("Campaign does not exist.");
  //         setCampaign(null);
  //       } else {
  //         fetchedCampaign.campaignId = campaignId;
  //         fetchedCampaign.amount = fetchedCampaign.amount.toString();
  //         fetchedCampaign.tokenId = fetchedCampaign.tokenId.toString();
  //         setCampaign(fetchedCampaign);
  //       }
  //     } catch (error) {
  //       console.error("Couldn't fetch campaign:", error);
  //     }
  //   }
  // };

  // const handleTransaction = async (transactionPromise) => {
  //   try {
  //     await transactionPromise;
  //     alert("Transaction successful!");
  //   } catch (error) {
  //     if (error.message.includes("User denied transaction signature")) {
  //       alert("Transaction rejected by user.");
  //     } else {
  //       console.error("Transaction failed:", error);
  //       alert("Transaction failed.");
  //     }
  //   }
  // };

  // const startCampaign = async (tokenAddress, tokenId, recipient) => {
  //   if (contract) {
  //     handleTransaction(
  //       contract.methods
  //         .startCampaign(tokenAddress, tokenId, recipient)
  //         .send({ from: accounts[0] })
  //     );
  //   }
  // };

  // const donate = async (campaignId, amount) => {
  //   if (contract) {
  //     handleTransaction(
  //       contract.methods
  //         .donate(campaignId)
  //         .send({ from: accounts[0], value: web3.utils.toWei(amount, "ether") })
  //     );
  //   }
  // };

  // const checkApproval = async (tokenAddress, tokenId) => {
  //   const nftContract = new web3.eth.Contract(ERC721_ABI, tokenAddress);
  //   const approvedAddress = await nftContract.methods
  //     .getApproved(tokenId)
  //     .call();
  //   return approvedAddress === CONTRACT_ADDRESS;
  // };

  // const approveToken = async (tokenAddress, tokenId) => {
  //   const nftContract = new web3.eth.Contract(ERC721_ABI, tokenAddress);
  //   await nftContract.methods
  //     .approve(CONTRACT_ADDRESS, tokenId)
  //     .send({ from: accounts[0] });
  // };

  // const accept = async (campaignId, minimumAmount) => {
  //   if (contract && campaign) {
  //     const isApproved = await checkApproval(
  //       campaign.tokenAddress,
  //       campaign.tokenId
  //     );

  //     if (!isApproved) {
  //       alert(
  //         "You must approve the Crowdfundoor contract for this specific token first."
  //       );
  //       await approveToken(campaign.tokenAddress, campaign.tokenId);
  //     }

  //     handleTransaction(
  //       contract.methods
  //         .accept(campaignId, web3.utils.toWei(minimumAmount, "ether"))
  //         .send({ from: accounts[0] })
  //     );
  //   }
  // };

  // const withdraw = async (campaignId) => {
  //   if (contract) {
  //     handleTransaction(
  //       contract.methods.withdraw(campaignId).send({ from: accounts[0] })
  //     );
  //   }
  // };

  return (
    <Container className="app">
      <Row>
        <Col className="app-header">
          <h1>Crowdfundoor</h1>
          <p>
            Crowdfundoor is a smart contract that allows users to crowdfund the
            purchase of an ERC721 token.
          </p>
          <p>The intended use is to help recover stolen assets.</p>

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
          <ConnectButton label="Connect Wallet" showBalance={true} />
        </Col>
      </Row>
      <Row>
        <Col>
          <NewCampaign contractAddress={CONTRACT_ADDRESS} />
        </Col>
      </Row>
      <Row>
        <Col>
          <ViewCampaign contractAddress={CONTRACT_ADDRESS} />
        </Col>
      </Row>
      {/* {campaign ? (
        <>
          <h2>Donate to Campaign #{campaign.campaignId}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              donate(campaign.campaignId, e.target.amount.value);
            }}
          >
            <input type="text" name="amount" placeholder="Amount in ETH" />
            <button type="submit">Donate</button>
          </form>

          <h2>Withdraw from Campaign #{campaign.campaignId}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              withdraw(campaign.campaignId);
            }}
          >
            <button type="submit">Withdraw</button>
            <p>
              You can withdraw your donation at any time, unless a campaign has
              been accepted.
            </p>
          </form>

          <h2>Accept Offer on Campaign #{campaign.campaignId}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              accept(campaign.campaignId, e.target.minimumAmount.value);
            }}
          >
            <input
              type="text"
              name="minimumAmount"
              placeholder="Min. Amount in ETH"
              defaultValue={web3.utils.fromWei(campaign.amount, "ether")}
            />
            <button type="submit">Accept</button>
            <p>
              If you hold the NFT, accept to receive{" "}
              {ethers.utils.formatEther(campaign.amount)} ETH in exchange for
              sending the NFT to the recipient.
            </p>
            <p>
              To prevent MEV bots from frontrunning withdrawals, Minimum Amount
              is set to the current offer total.
            </p>
          </form>
        </>
      ) : (
        <></>
      )} */}
    </Container>
  );
};

export default App;
