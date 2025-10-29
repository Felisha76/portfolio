// Google Sign-In callback
function handleCredentialResponse(response) {
	// A JWT token érkezik vissza, ezt dekódolhatod vagy elküldheted szerverre
	// Itt csak kiírjuk a konzolra a felhasználó adatait
	const data = parseJwt(response.credential);
	console.log('Google user:', data);
	// Példa: felhasználó nevét kiírjuk az oldalra
	document.querySelector('.login-container').innerHTML = `<h2>Szia, ${data.name}!</h2><p>Sikeres bejelentkezés Google fiókkal.</p>`;
	// Átirányítás a főoldalra
	setTimeout(function() {
		window.location.href = "../main/main.html";
	}, 1200); // 1.2 másodperc után
}

// JWT dekódoló segédfüggvény
function parseJwt (token) {
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
	var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));
	return JSON.parse(jsonPayload);
}
// ...existing code...
