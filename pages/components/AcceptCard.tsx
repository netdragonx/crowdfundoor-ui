import { FormEvent, useEffect, useState } from "react";
import { ethers } from "ethers";
import { Campaign } from "../../types";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import contractInterface from "../abi/crowdfundoor.json";
import nftInterface from "../abi/erc721.json";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { BarLoader } from "react-spinners";

interface Props {
  contractAddress: `0x${string}`;
  campaign: Campaign;
}

export default function AcceptCard({ contractAddress, campaign }: Props) {
  const [minimumAmount, setMinimumAmount] = useState<string>();
  const [doWrite, setDoWrite] = useState(false);
  const [doWriteApproval, setDoWriteApproval] = useState(false);
  const [isHodler, setIsHodler] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const { address, isConnected } = useAccount();

  // Hodler check
  useContractRead({
    enabled: campaign != null && campaign.campaignId != null,
    address: campaign?.tokenAddress,
    abi: nftInterface,
    functionName: "ownerOf",
    args: [campaign?.tokenId],
    onSuccess(data: any) {
      setIsHodler(data == address);
    },
    onError() {
      setIsHodler(false);
    },
  });

  // GetApproval check
  useContractRead({
    enabled: campaign != null && campaign.campaignId != null && isHodler,
    address: campaign?.tokenAddress,
    abi: nftInterface,
    functionName: "getApproved",
    args: [campaign?.tokenId],
    onSuccess(data: any) {
      console.log("getApproved success: ", data);
      setIsApproved(data == contractAddress);
    },
    onError(error) {
      setIsApproved(false);
      console.error("getApproved error: ", error);
    },
  });

  // Approval tx
  const { config: configApproval, error: writeApprovalError } =
    usePrepareContractWrite({
      enabled:
        campaign != null &&
        campaign.campaignId != null &&
        doWriteApproval &&
        isHodler &&
        !isApproved,
      address: campaign?.tokenAddress,
      abi: nftInterface,
      functionName: "approve",
      args: [contractAddress, campaign?.tokenId],
    });

  const {
    data: dataApproval,
    write: writeApproval,
    isLoading: isLoadingApproval,
    isError: isErrorApproval,
  } = useContractWrite(configApproval);

  const { isLoading: isLoadingApprovalTx, isError: isErrorApprovalTx } =
    useWaitForTransaction({
      hash: dataApproval && dataApproval.hash,
      onSuccess() {
        console.log("Approval transaction successful!");
        setIsApproved(true);
        setDoWrite(true);
      },
      onError(error) {
        console.log(error);
        setIsApproved(false);
        setDoWrite(false);
      },
    });

  // Accept tx
  const { config: config, error: writeError } = usePrepareContractWrite({
    enabled:
      campaign != null &&
      campaign.campaignId != null &&
      minimumAmount != null &&
      Number(minimumAmount) > 0 &&
      isHodler &&
      isApproved,
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

    const target = e.target as HTMLFormElement;

    if (!isApproved) {
      setDoWriteApproval(true);
    } else {
      if (target.minimumAmount?.value == "") {
        target.className = target.className + " error";
        return false;
      }

      setMinimumAmount(target.minimumAmount.value);
      setDoWrite(true);
    }
  };

  useEffect(() => {
    if (doWrite) {
      setDoWrite(false);
      write?.();
    }
  }, [write, doWrite]);

  useEffect(() => {
    if (doWriteApproval) {
      setDoWriteApproval(false);
      writeApproval?.();
    }
  }, [writeApproval, doWriteApproval]);

  return (
    <>
      <div className="card campaign-action">
        <h2>Accept</h2>
        <Form onSubmit={onSubmit}>
          <p>
            Receive{" "}
            <strong>
              {ethers.utils.formatEther(campaign?.amount || "0")}
              &nbsp;ETH
            </strong>{" "}
            in exchange for sending the NFT to the intended&nbsp;recipient.
          </p>

          {!isLoading &&
            !isLoadingTx &&
            !isLoadingApproval &&
            !isLoadingApprovalTx && (
              <>
                {isHodler ? (
                  <>
                    {!isApproved && (
                      <>
                        <br />
                        <Button
                          type="submit"
                          disabled={!isConnected || campaign.isAccepted}
                        >
                          Approve Crowdfundoor
                        </Button>
                      </>
                    )}
                    {isApproved && (
                      <>
                        <input
                          type="text"
                          name="minimumAmount"
                          placeholder="Enter current offer in ETH (MEV bot protection)"
                        />
                        <Button
                          type="submit"
                          disabled={!isConnected || campaign.isAccepted}
                        >
                          Accept &amp; Transfer NFT
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <br />
                    <Button type="submit" disabled>
                      Your wallet doesn&apos;t hodl the NFT
                    </Button>
                  </>
                )}
              </>
            )}
          {(isLoading ||
            isLoadingTx ||
            isLoadingApproval ||
            isLoadingApprovalTx) && (
            <>
              <BarLoader
                width="65%"
                cssOverride={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  marginTop: "2.75rem",
                  marginBottom: "3rem",
                }}
              />
            </>
          )}
        </Form>
      </div>
    </>
  );
}
