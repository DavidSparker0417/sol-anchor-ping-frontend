import {
  useConnection,
  useWallet,
  useAnchorWallet,
} from "@solana/wallet-adapter-react"
import * as anchor from "@coral-xyz/anchor"
import { FC, useEffect, useState } from "react"
import idl from "../idl.json"
import { Button } from "@chakra-ui/react"

const PROGRAM_ID = new anchor.web3.PublicKey(
  `G2jNk58i9U7cDmQHbYQHysuBXmVhaSWCYTZEBkMeTQQ4`
)

export interface Props {
  setCounter
  setTransactionUrl
}

export const Initialize: FC<Props> = ({ setCounter, setTransactionUrl }) => {
  const [program, setProgram] = useState(null)
  const {connection} = useConnection()
  const wallet = useAnchorWallet()
  
  useEffect(() => {
    let provider: anchor.Provider

    try {
      provider = anchor.getProvider()
    } catch {
      provider = new anchor.AnchorProvider(connection, wallet as anchor.Wallet, {})
      anchor.setProvider(provider)
    }
    const program = new anchor.Program(idl as anchor.Idl)
    setProgram(program)
  }, [])

  const onClick = async () => {
    const newAccount: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    const sig = await program.methods
      .initialize()
      .accounts({
        counter: newAccount.publicKey,
        user: wallet.publicKey,
        systemAccount: anchor.web3.SystemProgram.programId
      })
      .signers([newAccount])
      .rpc()
    
    setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`)
    setCounter(newAccount.publicKey)
  }

  return <Button onClick={onClick}>Initialize Counter</Button>
}
