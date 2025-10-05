// auth.js
import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

let user = null;
const provider = new GoogleAuthProvider();

// Configure Google provider
provider.setCustomParameters({
  prompt: 'select_account'
});

function initAuth() {
  // Listen for authentication state changes
  onAuthStateChanged(window.auth, (firebaseUser) => {
    if (firebaseUser) {
      user = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        picture: firebaseUser.photoURL
      };
      console.log("Signed in as:", user);
    } else {
      user = null;
    }
    updateUI();
  });
}

async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(window.auth, provider);
    // User info is handled by onAuthStateChanged
    console.log("Google sign-in successful");
  } catch (error) {
    console.error("Google sign-in error:", error);
    alert("Sign-in failed: " + error.message);
  }
}

async function signOut() {
  try {
    await firebaseSignOut(window.auth);
    console.log("Signed out successfully");
  } catch (error) {
    console.error("Sign-out error:", error);
  }
}

function updateUI() {
  const userInfoDiv = document.getElementById('user-info');
  const signOutBtn = document.getElementById('signOutBtn');
  const signInBtn = document.getElementById('signInBtn');

  if (user) {
    if (userInfoDiv) {
      userInfoDiv.innerHTML = `
        <div class="user-profile">
          <div class="user-info">
            <img src="${user.picture}" class="user-avatar" alt="Profile Picture">
            <div>
              <div class="user-name">${user.name}</div>
              <div class="user-email">${user.email}</div>
            </div>
          </div>
        </div>
      `;
    }
    if (signOutBtn) signOutBtn.style.display = "inline-block";
    if (signInBtn) signInBtn.style.display = "none";
  } else {
    if (userInfoDiv) userInfoDiv.innerHTML = "";
    if (signOutBtn) signOutBtn.style.display = "none";
    if (signInBtn) signInBtn.style.display = "inline-block";
  }
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);

// Export functions for global use
window.signInWithGoogle = signInWithGoogle;
window.signOut = signOut;
