import { ethers } from "ethers";
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
  campaign: Campaign;
}

export default function DonateCard({ contractAddress, campaign }: Props) {
  const [amount, setAmount] = useState<string>();
  const [doWrite, setDoWrite] = useState(false);
  const { isConnected } = useAccount();

  const { config: config, error: writeError } = usePrepareContractWrite({
    enabled:
      campaign != null &&
      campaign.campaignId != null &&
      amount != null &&
      Number(amount) > 0 &&
      doWrite,
    address: contractAddress,
    abi: contractInterface,
    functionName: "donate",
    args: [campaign?.campaignId],
    value: ethers.utils.parseEther(amount || "0").toBigInt(),
  });

  const { data, write, isLoading, isError } = useContractWrite(config);

  const { isLoading: isLoadingTx, isError: isErrorTx } = useWaitForTransaction({
    hash: data && data.hash,
    onSuccess() {
      console.log("Transaction successful!");
    },
    onError(error) {
      console.log(error);
    },
    onSettled(data, error) {
      setAmount(undefined);
      setDoWrite(false);
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    setAmount(target.amount.value);
    setDoWrite(true);
  };

  useEffect(() => {
    if (doWrite) {
      setDoWrite(false);
      write?.();
    }
  }, [write, doWrite]);

  return (
    <>
      <div className="card campaign-action">
        <h2>Donate</h2>
        <Form onSubmit={onSubmit}>
          <p>Help raise funds for this&nbsp;campaign.</p>

          <input
            type="text"
            name="amount"
            placeholder="Amount in ETH"
            disabled={!isConnected}
          />

          {!isLoading && !isLoadingTx && (
            <Button
              type="submit"
              disabled={!isConnected || campaign.isAccepted}
            >
              Donate
            </Button>
          )}

          {(isLoading || isLoadingTx) && (
            <BarLoader
              width="65%"
              cssOverride={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "1rem",
                marginBottom: "1rem",
              }}
            />
          )}
          {(isError || isErrorTx) && (
            <div>
              <div>{isError || isErrorTx}</div>
            </div>
          )}
        </Form>
      </div>
    </>
  );
}
