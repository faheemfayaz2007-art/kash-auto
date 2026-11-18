const firebaseConfig = {
  apiKey: "AIzaSyDbx1kVy82MasJbBLMQjJ0K8o68cWXlWew",
  authDomain: "kash-auto.firebaseapp.com",
  projectId: "kash-auto",
  storageBucket: "kash-auto.firebasestorage.app",
  messagingSenderId: "302972631703",
  appId: "1:302972631703:web:1b8c77c6acf19c9eedc7d2"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const phoneSection = document.getElementById("phoneSection");
const otpSection = document.getElementById("otpSection");

const phoneInput = document.getElementById("phone");
const otpInput = document.getElementById("otp");

let confirmationResult = null;
let recaptchaVerifier = null;

function createRecaptcha() {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
  }

  recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container",
    {
      size: "invisible"
    }
  );

  return recaptchaVerifier;
}

async function sendOTP() {
  const phone = phoneInput.value.trim();

  if (!/^[6-9]\d{9}$/.test(phone)) {
    alert("Please enter a valid Indian mobile number.");
    return;
  }

  try {
    const verifier = createRecaptcha();

    confirmationResult = await auth.signInWithPhoneNumber(
      "+91" + phone,
      verifier
    );

    phoneSection.hidden = true;
    otpSection.hidden = false;

    alert("OTP sent successfully!");

  } catch (error) {
    console.error(error);
    alert("OTP could not be sent: " + error.message);
  }
}

document.getElementById("sendOtpBtn").addEventListener(
  "click",
  sendOTP
);

document.getElementById("backBtn").addEventListener("click", function() {
  otpSection.hidden = true;
  phoneSection.hidden = false;
});

document.getElementById("resendBtn").addEventListener(
  "click",
  sendOTP
);

document.getElementById("verifyBtn").addEventListener(
  "click",
  async function() {
    const otp = otpInput.value.trim();

    if (!/^\d{6}$/.test(otp)) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }

    if (!confirmationResult) {
      alert("Please request OTP first.");
      return;
    }

    try {
      const result = await confirmationResult.confirm(otp);

      alert("Phone number verified successfully!");

      console.log("Logged in user:", result.user.uid);

    } catch (error) {
      console.error(error);
      alert("Invalid OTP. Please try again.");
    }
  }
);
