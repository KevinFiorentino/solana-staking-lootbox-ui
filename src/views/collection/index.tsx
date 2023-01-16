import { FC } from "react"
import { FetchCollection } from "../../components/FetchCollection"

export const CollectionView: FC = ({}) => {
  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
          Pink Floyd Collection
        </h1>
        <div className="text-center">
          <FetchCollection />
        </div>
      </div>
    </div>
  )
}