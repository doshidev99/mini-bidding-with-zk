import * as openpgp from "openpgp";

const options = {
  userIds: [{ name: "truong pham", email: "truong.sgr@gmail.com" }],
  numBits: 2048,
  passphrase: "DeBidding",
  rsaBits: 4096,
};

export const generateKeyPair = async () => {
  const { publicKey } = await openpgp.generateKey({
    curve: "ed25519",
    userIDs: [
      {
        name: "Jon Smith",
        email: "jon@example.com",
        comment: "This key is for public sharing",
      },
    ],
    passphrase: "super long and hard to guess secret",
  });

  console.log(publicKey);
};
