import { SESV2 } from "aws-sdk";
import axios from "axios";
import {
  SES_EMAIL_SOURCE,
  SES_TEMPLATE_NAME,
  SES_TO_ADDRESSES,
} from "../lib/constants";
import { QuoteAPIResponseBody } from "../lib/types";
import { getRandomInt } from "../lib/utils";

const sesClient = new SESV2({ region: "ap-southeast-2" });

export const handler = async () => {
  try {
    console.log("start");

    const { data } = await axios.get<QuoteAPIResponseBody[]>(
      "https://type.fit/api/quotes"
    );
    const { text, author } = data[getRandomInt(0, 1500)];

    console.log("sending email");
    await sesClient
      .sendEmail({
        FromEmailAddress: SES_EMAIL_SOURCE,
        Destination: {
          ToAddresses: SES_TO_ADDRESSES,
        },
        Content: {
          Template: {
            TemplateName: SES_TEMPLATE_NAME,
            TemplateData: JSON.stringify({ QUOTE: text, AUTHOR: author }),
          },
        },
      })
      .promise();
    console.log("sent email");
  } catch (error) {
    console.error("Error while sending email");
    console.error(error);
  }
};
