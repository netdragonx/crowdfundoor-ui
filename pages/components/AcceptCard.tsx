import { FormEvent, useEffect, useState } from "react";
import { ethers } from "ethers";
import { Campaign } from "../../types";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import contractInterface from "../abi/crowdfundoor.json";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { BarLoader } from "react-spinners";

interface Props {
  contractAddress: `0x${string}`;
  campaign: Campaign;
}

export default function AcceptCard({ contractAddress, campaign }: Props) {
  const [minimumAmount, setMinimumAmount] = useState<string>();
  const { isConnected } = useAccount();

  const { config: config, error: writeError } = usePrepareContractWrite({
    enabled:
      campaign != null &&
      campaign.campaignId != null &&
      minimumAmount != null &&
      Number(minimumAmount) > 0,
    address: contractAddress,
    abi: contractInterface,
    functionName: "accept",
    args: [
      campaign?.campaignId,
      ethers.utils.parseEther(minimumAmount || "0").toBigInt(),
    ],
  });

  const { data, write, isLoading, isError } = useContractWrite(config);

  const { isLoading: isLoadingTx, isError: isErrorTx } = useWaitForTransaction({
    hash: data && data.hash,
    onSuccess() {
      console.log("Transaction successful!");
      setMinimumAmount(undefined);
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    setMinimumAmount(target.amount.value);
  };

  useEffect(() => {
    write?.();
  }, [write]);

  return (
    <>
      <div className="campaign-action">
        <h2>Accept Offer</h2>
        <Form onSubmit={onSubmit}>
          <p>
            If you are the holder of this NFT, click accept to receive{" "}
            <strong>
              {ethers.utils.formatEther(campaign?.amount || "0")}
              &nbsp;ETH
            </strong>{" "}
            in exchange for sending the NFT to the recipient listed above. You
            will be prompted to approve Crowdfundoor to transfer this token
            only.
          </p>
          <Button type="submit" disabled={!isConnected || campaign.isAccepted}>
            Accept
          </Button>
        </Form>
      </div>
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
        </div>
      )}
    </>
  );
}
