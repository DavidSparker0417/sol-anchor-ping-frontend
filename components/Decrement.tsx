import { Button } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import * as anchor from '@coral-xyz/anchor';
import idl from '../idl.json'
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

export interface Props {
  counter
  setTransactionUrl
}

export const Decrement:FC<Props> = ({counter, setTransactionUrl}) => {
  const [program, setProgram] = useState(null)
  const {connection} = useConnection()
  const wallet = useAnchorWallet()

  useEffect(() => {
    let provider: anchor.Provider
    try {
      provider = anchor.getProvider()
    } catch {
      provider = new anchor.AnchorProvider(connection, wallet as anchor.Wallet)
      anchor.setProvider(provider)
    }
    const program = new anchor.Program(idl as anchor.Idl)
    setProgram(program)
  }, [])
  
  const onClick = async() => {
    const sig = await program.methods
      .decrement()
      .accounts({
        counter: counter,
        user: wallet.publicKey
      })
      .rpc()
    
    setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`)
  }
  return(<Button onClick={onClick}>Decrement</Button>)
}