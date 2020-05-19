import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const config = () => {
  const subscriptionKey = "f79e6bf693d84c748d30eda5daa9e88d";

  const serviceRegion = "eastus2"; // e.g., "westus"
  return sdk.SpeechTranslationConfig.fromSubscription(
    subscriptionKey,
    serviceRegion
  );
};

export async function recognize(): Promise<sdk.SpeechRecognitionResult> {
  console.log("Now trying to listen");

  const audioConfig = sdk.AudioConfig.fromMicrophoneInput();

  const speechConfig = config();
  speechConfig.speechRecognitionLanguage = "en-US";

  let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  return new Promise((resolve, reject) => {
    recognizer.recognizeOnceAsync(
      function (result) {
        console.log(result);
        recognizer.close();
        resolve(result);
      },
      function (err) {
        console.trace("err - " + err);
        recognizer.close();
        reject(err);
      }
    );
  });
}

export async function speak(text: string) {
  console.log("SPEAK: " + text);
}
