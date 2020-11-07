export function onError(error) {
  let message = error.toString;
  // Amplify.Auth errors
  if (!(error instanceof Error) && error.message) {
    message = error.message;
  }
  alert(message);
}