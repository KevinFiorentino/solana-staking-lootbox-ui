import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { Metaplex, walletAdapterIdentity, CandyMachineV2 } from "@metaplex-foundation/js"
import { FC, useEffect, useState } from "react"
import styles from "../styles/custom.module.css"

export const FetchCandyMachine: FC = () => {
  const [candyMachineAddress, setCandyMachineAddress] = useState("EffvnFd2wSJEGYphmV7a6Nta4W8rNntkF94WxLeTwoPF")
  const [candyMachineData, setCandyMachineData] = useState<CandyMachineV2>(null)
  const [pageItems, setPageItems] = useState(null)
  const [page, setPage] = useState(1)

  const walletAdapter = useWallet()
  const { connection } = useConnection()

  // const metaplex = Metaplex.make(connection)
  const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter))

  const [isMinting, setIsMinting] = useState(false)

  // fetch candymachine by address
  const fetchCandyMachine = async () => {

    // Set page to 1 - we wanna be at the first page whenever we fetch a new Candy Machine
    setPage(1)

    // fetch candymachine data
    try {
      const candyMachine = await metaplex
        .candyMachinesV2()
        .findByAddress({ address: new PublicKey(candyMachineAddress) })

      setCandyMachineData(candyMachine)
    } catch (e) {
      alert("Please submit a valid CMv2 address.")
    }
  }

  // paging
  const getPage = async (page, perPage) => {
    const pageItems = candyMachineData.items.slice(
      (page - 1) * perPage,
      page * perPage
    )

    // fetch metadata of NFTs for page
    let nftData = []
    for (let i = 0; i < pageItems.length; i++) {
      let fetchResult = await fetch(pageItems[i].uri)
      let json = await fetchResult.json()
      nftData.push(json)
    }

    // set state
    setPageItems(nftData)
  }

  // previous page
  const prev = async () => {
    if (page - 1 < 1) {
      setPage(1)
    } else {
      setPage(page - 1)
    }
  }

  // next page
  const next = async () => {
    setPage(page + 1)
  }

  // fetch placeholder candy machine on load
  useEffect(() => {
    fetchCandyMachine()
  }, [])

  // fetch metadata for NFTs when page or candy machine changes
  useEffect(() => {
    if (!candyMachineData) {
      return
    }
    getPage(page, 9)
  }, [candyMachineData, page])

  // Mint NFTS
  const mintNewNFT = async () => {
    setIsMinting(true)

    console.log(candyMachineData)

    const nft = await metaplex.candyMachinesV2().mint({ candyMachine: candyMachineData })
    setIsMinting(false)
  }

  return (
    <div>
      {/* <input
        type="text"
        className="form-control block mb-2 w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none text-center"
        placeholder="Enter Candy Machine v2 Address"
        onChange={(e) => setCandyMachineAddress(e.target.value)}
      /> */}
      <button
        className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
        onClick={mintNewNFT}
      >
        Mint NFT
      </button>

      {candyMachineData && (
        <div className="flex flex-col items-center justify-center p-5">
          <ul>Candy Machine Address: {candyMachineData.address.toString()}</ul>
        </div>
      )}

      {pageItems && (
        <div>
          <div className={styles.gridNFT}>
            {pageItems.map((nft) => (
              <div>
                <ul>{nft.name}</ul>
                <img src={nft.image} />
              </div>
            ))}
          </div>
          <button
            className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
            onClick={prev}
          >
            Prev
          </button>
          <button
            className="px-8 m-2 btn animate-pulse bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
            onClick={next}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
