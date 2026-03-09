const loginBtn = document.getElementById("login-btn");
loginBtn.addEventListener('click', function () {
  // get the username

  const username = document.getElementById("username-input");
  const cotactNumber=username.value;
  // get the pin number
  
  const pinNumber = document.getElementById("pin-input");
  const pin = pinNumber.value;
  console.log(cotactNumber, pin);
  // match both of them
  if (cotactNumber === "admin" && pin === "admin123") {

    alert("login successful");
      sessionStorage.setItem('isLoggedIn', 'true')
    window.location.assign("home.html")
  }
    else {
    alert("Invalid username or pin");
    return;
    }
})