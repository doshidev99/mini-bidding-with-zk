import path from "path";
import fs from "fs";
import { getProofBid } from "../../zk-next/zk";

export default async function handler(req: any, res: any) {
  console.log("hello");
  try {
    const dir = path.join(process.cwd(), "src/zk-next");
    const fileContents = fs.readFileSync(dir + "/proving.key");
    const proof = await getProofBid(
      req.body.bidValue,
      new Uint8Array(fileContents as any),
      req.body.isReveal
    );
    res.status(200).json(proof);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}
