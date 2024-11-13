import {
  Action,
  ActionError,
  ActionPostRequest,
  ActionPostResponse,
  MEMO_PROGRAM_ID,
  createActionHeaders,
  createPostResponse,
} from "@solana/actions";
import {
  clusterApiUrl,
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

// create the standard headers for this route (including CORS)
const headers = createActionHeaders();

export const GET = async () => {
  const payload: Action = {
    icon: `https://image.lexica.art/full_webp/9a2fef40-6ec2-4e23-8865-f7c9d7b5ed80`,
    label: "Play Hand Cricket ☝️ ✌️ 🖐️",
    title: "Play Hand Cricket ☝️ ✌️ 🖐️",
    description: "Play the Hand Cricket game",
    links: {
      actions: [
        {
          type: "transaction",
          label: "Play Turn",
          parameters: [
            {
              type: "radio",
              name: "options",
              options: [
                {
                  label: "Play 1",
                  value: "1",
                  selected: false,
                },
                {
                  label: "Play 2",
                  value: "2",
                  selected: false,
                },
                {
                  label: "Play 3",
                  value: "3",
                  selected: false,
                },
                {
                  label: "Play 4",
                  value: "4",
                  selected: false,
                },
                {
                  label: "Play 5",
                  value: "5",
                  selected: false,
                },
                {
                  label: "Play 6",
                  value: "6",
                  selected: false,
                },
              ],
            },
          ],
          href: `/play/`,
        },
      ],
    },
    type: "action",
  };

  return Response.json(payload, {
    headers,
  });
};

export const POST = async (req: Request) => {
  try {
    const body: ActionPostRequest<{ options: string }> & {
      params: ActionPostRequest<{ options: string }>["data"];
    } = await req.json();

    console.log(body);

    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch {
      throw 'Invalid "account" provided';
    }
    const options = (body.params?.options || body.data?.options) as
      | string
      | undefined;
    if (options) {
      const intOptions = parseInt(options);
      const connection = new Connection(
        process.env.SOLANA_RPC! || clusterApiUrl("devnet")
      );

      const transaction = new Transaction().add(
        // note: `createPostResponse` requires at least 1 non-memo instruction
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 1000,
        }),
        new TransactionInstruction({
          programId: new PublicKey(MEMO_PROGRAM_ID),
          data: Buffer.from(intOptions.toString(), "utf8"),
          keys: [],
        })
      );
      transaction.feePayer = account;

      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      const payload: ActionPostResponse = await createPostResponse({
        fields: {
          transaction,
          message: "Post this memo on-chain",
          type: "transaction",
          // links: {
          //   /**
          //    * this `href` will receive a POST request (callback)
          //    * with the confirmed `signature`
          //    *
          //    * you could also use query params to track whatever step you are on
          //    */
          //   next: {
          //     type: "post",
          //     href: "/api/actions/chaining-basics/next-action",
          //   },
          // },
        },
        // no additional signers are required for this transaction
        // signers: [],
      });

      return Response.json(payload, {
        headers,
      });
    } else {
      throw 'Invalid "options" provided';
    }
  } catch (error) {
    console.log(error);
    const actionError: ActionError = { message: "An unknown error occurred" };
    if (typeof error == "string") actionError.message = error;
    return Response.json(actionError, {
      status: 400,
      headers,
    });
  }
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;
