// lib/dialogflow.ts
import * as dialogflow from "@google-cloud/dialogflow";
import { v4 as uuid } from "uuid";

// Make sure you set GOOGLE_APPLICATION_CREDENTIALS in your .env
// Example: GOOGLE_APPLICATION_CREDENTIALS=./gcloud-key.json

const projectId = process.env.DIALOGFLOW_PROJECT_ID as string;

// Sessions client for detecting intent
export function getSessionClient() {
  return new dialogflow.SessionsClient();
}

// Intents client for managing intents
export function getIntentsClient() {
  return new dialogflow.IntentsClient();
}

// Entity types client for managing entities
export function getEntityTypesClient() {
  return new dialogflow.EntityTypesClient();
}

// Create a session path
export function getSessionPath(sessionId?: string) {
  const sessionClient = getSessionClient();
  return sessionClient.projectAgentSessionPath(projectId, sessionId || uuid());
}
