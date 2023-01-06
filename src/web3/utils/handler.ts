import path from "path";
import fs from "fs";
import { getProofBid } from "../../zk-next/zk";

export async function encryptData(payload: any) {
  console.log("hello");
  const dir = path.join(process.cwd(), "src/zk-next");
  const fileContents = fs.readFileSync(dir + "/proving.key");
  const proof = await getProofBid(
    payload.bidValue,
    new Uint8Array(fileContents as any),
    payload.isReveal
  );
  return proof;
  // res.status(200).json(proof);
}
