// auth.js
let user = null;

function handleCredentialResponse(response) {
  const responsePayload = decodeJwtResponse(response.credential);
  console.log("Signed in as:", responsePayload);

  user = {
    id: responsePayload.sub,
    name: responsePayload.name,
    email: responsePayload.email,
    picture: responsePayload.picture
  };

  updateUI();
}

function decodeJwtResponse(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

function updateUI() {
  const userInfoDiv = document.getElementById('user-info');
  const signOutBtn = document.getElementById('signOutBtn');

  if (user) {
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
    if (signOutBtn) signOutBtn.style.display = "inline-block";
  } else {
    userInfoDiv.innerHTML = "";
    if (signOutBtn) signOutBtn.style.display = "none";
  }
}

function signOut() {
  google.accounts.id.disableAutoSelect();
  user = null;
  updateUI();
}
