import { ACTIONS_CORS_HEADERS, Action } from "@solana/actions";

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
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const POST = async (req: Request) => {
  console.log(req.body);

  return Response.json("", {
    headers: ACTIONS_CORS_HEADERS,
  });
};

// DO NOT FORGET TO INCLUDE THE `OPTIONS` HTTP METHOD
// THIS WILL ENSURE CORS WORKS FOR BLINKS
export const OPTIONS = GET;
