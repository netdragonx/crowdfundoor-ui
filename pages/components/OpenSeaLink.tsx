import { useNetwork } from "wagmi";

const openseaBasePaths: Record<string, string> = {
  homestead: "https://opensea.io/assets/ethereum",
  matic: "https://opensea.io/assets/matic",
  goerli: "https://testnets.opensea.io/assets/goerli",
  sepolia: "https://testnets.opensea.io/assets/sepolia",
};

export default function OpenSeaLink({
  tokenAddress,
  tokenId,
  children,
  showBadge,
}: {
  tokenAddress?: `0x${string}`;
  tokenId?: string;
  children: React.ReactNode;
  showBadge?: boolean;
}) {
  const { chain } = useNetwork();
  const network = chain && chain.network != "" ? chain.network : "homestead";

  return (
    <>
      {tokenAddress != undefined && tokenId != undefined && (
        <>
          <a
            href={`${openseaBasePaths[network]}/${tokenAddress}/${tokenId}`}
            target="_blank"
            rel="noreferrer"
          >
            {children}
          </a>
          {showBadge && (
            <>
              {" "}
              <span className="badge rounded-pill bg-primary">OpenSea</span>
            </>
          )}
        </>
      )}
    </>
  );
}
