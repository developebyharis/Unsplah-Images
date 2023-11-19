const firebaseConfig = {
  apiKey: "AIzaSyDNUTqemNNjDIyrJCqZLaBVsIA9YIUsgwU",
  authDomain: "piclabbyharis.firebaseapp.com",
  projectId: "piclabbyharis",
  storageBucket: "piclabbyharis.appspot.com",
  messagingSenderId: "256448243497",
  appId: "1:256448243497:web:a30de222138916be97b938",
  measurementId: "G-MJ9WZ5V6TL",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

document.addEventListener("DOMContentLoaded", function () {
  // console.log("DOM content loaded");
  function profileToggle() {
    // console.log("profileToggle function called");
    const userInfoElement = document.getElementById("userInfo");
    if (userInfoElement.classList.contains("hidden")) {
      userInfoElement.classList.remove("hidden");
    } else {
      userInfoElement.classList.add("hidden");
    }
  }

  function LogoutUser() {
    // console.log("LogoutUser function called");
    firebase
      .auth()
      .signOut()
      .then(() => {
        // console.log("User signed out successfully");
        userProfileContainer.style.display = "block"; // Hide the user profile container
      })
      .catch((e) => {
        // console.error("Logout error:", e);
      });
  }

  const userProfileContainer = document.getElementById("authContainer");

  function showUserDetails(user) {
    // console.log("showUserDetails function called");

    userProfileContainer.innerHTML = user
      ? `
              <div class="userProfile">
                  <img 
                      src="${user.photoURL}"
                      id="profileImage" 
                      class=" profile mx-2 w-[40px] h-[40px] rounded-full cursor-pointer outline outline-offset-2 outline-2 outline-blue-500"/> 
                  <div id="userInfo" class="hidden">
                      <div class="sub-item">
                          <h4>Welcome, <span class="font-bold">${user.displayName}</span></h4>
                      </div>
                      <div class="sub-item">
                          <button class="bg-red-500 hover:bg-red-700 w-full items-center justify-center text-center rounded-full px-2 text-white py-2" id="logout">Logout</button>
                      </div>
                  </div>
              </div>
            `
      : `
              <div class="userProfile">
                  <img 
                      src="/images/user.png"
                      id="profileImage" 
                      class="profile mx-2 w-[40px] h-[40px] rounded-full cursor-pointer"/> 
                  <div id="userInfo" class="hidden">
                      <div class="sub-item">
                          <button id="login" class="bg-blue-500 hover:bg-blue-700 w-full items-center justify-center text-center rounded-full px-2 text-white py-2">Sign In</button>
                      </div>
                  </div>
              </div>
            `;

    // Add event listener to userProfileContainer for event delegation
    userProfileContainer.addEventListener("click", handleUserDetailsClick);
  }

  function handleUserDetailsClick(event) {
    const target = event.target;

    if (target.id === "profileImage") {
      // Handle click on profile image (you can call profileToggle here)
      profileToggle();
    } else if (target.id === "logout") {
      // Handle click on logout button
      LogoutUser();
    } else if (target.id === "login") {
      // Handle click on login button
      GoogleLogin();
    }
  }

  function checkAuthState() {
    // console.log("checkAuthState function called");
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // console.log("User is signed in:", user);
        showUserDetails(user);
      } else {
        // console.log("User is signed out");
        showUserDetails(user);
      }
    });
  }

  function GoogleLogin() {
    // console.log("GoogleLogin function called");
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((res) => {
        // console.log("Google sign-in successful:", res.user);
        showUserDetails(res.user);
      })
      .catch((e) => {
        // console.error("Google sign-in error:", e);
      });
  }

  checkAuthState();
});
