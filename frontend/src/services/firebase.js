const firebaseConfig = {
  apiKey: "AIzaSyC8s4GHOU-tOqRDSOP8d2ORcLxxd98mTcM",
  authDomain: "vehicle-management-syste-1b65d.firebaseapp.com",
  projectId: "vehicle-management-syste-1b65d",
  storageBucket: "vehicle-management-syste-1b65d.firebasestorage.app",
  messagingSenderId: "1073546857512",
  appId: "1:1073546857512:web:41d2cfba57c7fc1e2db91d",
  measurementId: "G-NYRL6S1J71",
};

let appPromise;
let authPromise;

const loadFirebaseModule = (moduleName) =>
  import(
    /* @vite-ignore */ `https://www.gstatic.com/firebasejs/12.15.0/${moduleName}.js`
  );

export const getFirebaseApp = async () => {
  if (!appPromise) {
    appPromise = loadFirebaseModule("firebase-app").then(({ initializeApp }) =>
      initializeApp(firebaseConfig),
    );
  }

  return appPromise;
};

export const getFirebaseAuth = async () => {
  if (!authPromise) {
    authPromise = Promise.all([
      getFirebaseApp(),
      loadFirebaseModule("firebase-auth"),
    ]).then(([app, { getAuth }]) => getAuth(app));
  }

  return authPromise;
};

export const auth = getFirebaseAuth();

export const initializeFirebaseAnalytics = async () => {
  try {
    const app = await getFirebaseApp();
    const { getAnalytics, isSupported } =
      await loadFirebaseModule("firebase-analytics");

    if (await isSupported()) {
      getAnalytics(app);
    }
  } catch {
    // Analytics can be blocked by browser privacy settings; auth can still work.
  }
};

export const onAuthStateChanged = async (onUserChanged, onError) => {
  const authInstance = await auth;
  const { onAuthStateChanged } = await loadFirebaseModule("firebase-auth");

  return onAuthStateChanged(authInstance, onUserChanged, onError);
};

export const registerWithEmail = async ({ email, password, displayName }) => {
  const authInstance = await auth;
  const {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    updateProfile,
  } = await loadFirebaseModule("firebase-auth");
  const credential = await createUserWithEmailAndPassword(
    authInstance,
    email,
    password,
  );

  await updateProfile(credential.user, { displayName });
  await sendEmailVerification(credential.user);
  await signOut(authInstance);

  return credential.user;
};

export const loginWithEmail = async ({ email, password }) => {
  const authInstance = await auth;
  const { signInWithEmailAndPassword, signOut } =
    await loadFirebaseModule("firebase-auth");
  const credential = await signInWithEmailAndPassword(
    authInstance,
    email,
    password,
  );

  if (!credential.user.emailVerified) {
    await signOut(authInstance);
    throw Object.assign(new Error("Please verify your email before logging in."), {
      code: "auth/email-not-verified",
    });
  }

  return credential.user;
};

export const signInWithGoogle = async () => {
  const authInstance = await auth;
  const { GoogleAuthProvider, signInWithPopup } =
    await loadFirebaseModule("firebase-auth");
  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: "select_account",
  });

  try {
    const credential = await signInWithPopup(authInstance, provider);

    return credential.user;
  } catch (error) {
    if (error?.code === "auth/popup-closed-by-user") {
      console.info("Google sign-in popup was closed before completion.");
    } else {
      console.error("Google sign-in failed:", error);
    }

    throw error;
  }
};

export const loginWithGoogle = signInWithGoogle;

export const signOut = async () => {
  const authInstance = await auth;
  const { signOut } = await loadFirebaseModule("firebase-auth");

  await signOut(authInstance);
};
