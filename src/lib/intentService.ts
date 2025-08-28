// lib/intentService.ts
import { getIntentsClient } from "./dialogflow";
import * as protos from "@google-cloud/dialogflow/build/protos/protos";
import { SessionsClient } from "@google-cloud/dialogflow";

const intentsClient = getIntentsClient();
const projectId = process.env.DIALOGFLOW_PROJECT_ID as string;
const sessionClient = new SessionsClient();

export async function detectIntent(text: string, sessionId = "test-session") {
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: "en",
      },
    },
  };

  const [response] = await sessionClient.detectIntent(request);
  const result = response.queryResult;

  // Return the first fulfillment text
  return result?.fulfillmentText || "No response from Dialogflow";
}


export async function createIntent(
  displayName: string,
  trainingPhrases: string[],
  responses: string[]
) {
  const intentsClient = getIntentsClient();
  const projectId = process.env.DIALOGFLOW_PROJECT_ID as string;
  const agentPath = intentsClient.projectAgentPath(projectId);

  const trainingPhrasesParts = ((trainingPhrases || []).filter(Boolean).length > 0
    ? trainingPhrases
    : ["default phrase"])
    .map((phrase) => ({
      type: protos.google.cloud.dialogflow.v2.Intent.TrainingPhrase.Type.EXAMPLE,
      parts: [{ text: phrase }],
    }));


  const intent = {
    displayName,
    trainingPhrases: trainingPhrasesParts,
    messages: [{ text: { text: responses } }],
  };

  const request = {
    parent: agentPath,
    intent,
  };

  const response = await intentsClient.createIntent(request);
  return response;
}

export async function listIntents() {
  const agentPath = intentsClient.projectAgentPath(projectId);
  const [response] = await intentsClient.listIntents({ parent: agentPath });
  return response;
}

export async function deleteIntent(intentId: string) {
  const intentPath = intentsClient.projectAgentIntentPath(projectId, intentId);
  const [response] = await intentsClient.deleteIntent({ name: intentPath });
  return response;
}
