async function _sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

function start_auth() {
  lightdm.cancel_authentication();

  const default_username = lightdm.users[0].username;
  document.getElementById("current-user").innerText = default_username;
  lightdm.authenticate(default_username);
}

async function auth_complete() {
  if (lightdm.is_authenticated) {
    lightdm.start_session(lightdm.sessions[0].key);
  } else {
    document.getElementById("greeter-output").innerHTML =
      "auth failed ☹<br>try again";
    start_auth();
  }
}

function password_submitted(event) {
  event.preventDefault();
  const submitForm = document.getElementById("password-form");
  const promptOutput = document.getElementById("prompt");
  promptOutput.innerText = "attempting...";

  lightdm.respond(submitForm.password.value);
}

function show_message(text, type) {
  const messageOutput = document.getElementById("greeter-output");
  messageOutput.innerHTML = text;

  // kinda a gross hack but whatever
  if (text === "Failed to match fingerprint") {
    messageOutput.innerText = "failed to match fingerprint, try again";
    start_auth();
  }
}

function show_prompt(text, type) {
  const promptOutput = document.getElementById("prompt");
  promptOutput.innerHTML = text.toLowerCase();
}

async function main() {
  console.log("Greeter initializing...");
  lightdm.authentication_complete.connect(auth_complete);
  lightdm.show_message.connect(show_message);
  lightdm.show_prompt.connect(show_prompt);
  start_auth();
}

window.addEventListener("GreeterReady", main);
