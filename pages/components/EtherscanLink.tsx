import { useNetwork } from "wagmi";

const etherscanBasePaths: Record<string, string> = {
  homestead: "https://etherscan.io",
  matic: "https://polygonscan.com",
  goerli: "https://goerli.etherscan.io",
  sepolia: "https://sepolia.etherscan.io",
};

export default function EtherscanLink({
  address,
  children,
  showBadge,
}: {
  address?: `0x${string}`;
  children: React.ReactNode;
  showBadge?: boolean;
}) {
  const { chain } = useNetwork();

  const network = chain && chain.network != "" ? chain.network : "homestead";

  return (
    <>
      {address != undefined && (
        <>
          <a
            href={`${etherscanBasePaths[network]}/address/${address}`}
            target="_blank"
            rel="noreferrer"
            className="link-etherscan"
          >
            {children}
            {showBadge && (
              <>
                {" "}
                <span className="badge rounded-pill bg-secondary">
                  Etherscan
                </span>
              </>
            )}
          </a>
        </>
      )}
    </>
  );
}
