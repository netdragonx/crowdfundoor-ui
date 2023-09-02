import { FormEvent, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
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

export default function WithdrawCard({ contractAddress, campaign }: Props) {
  const { isConnected } = useAccount();
  const [doWrite, setDoWrite] = useState(false);

  const { config: config, error: writeError } = usePrepareContractWrite({
    enabled: campaign != null && campaign.campaignId != null && doWrite,
    address: contractAddress,
    abi: contractInterface,
    functionName: "withdraw",
    args: [campaign?.campaignId],
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
      setDoWrite(false);
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
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
        <h2>Withdraw</h2>
        <Form onSubmit={onSubmit}>
          <p>
            You may withdraw your donation at any time until a campaign offer
            has been&nbsp;accepted.
          </p>
          <br />
          {!isLoading && !isLoadingTx && (
            <Button
              type="submit"
              disabled={!isConnected || campaign.isAccepted}
            >
              Withdraw
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
