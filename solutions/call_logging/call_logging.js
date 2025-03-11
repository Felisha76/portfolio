// Generate a unique number when the page loads
window.onload = () => {
    const now = new Date();
    const uniqueNumber = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}${now.getSeconds().toString().padStart(2,'0')}`;
    document.getElementById('number').value = uniqueNumber;
  };

  function copyToClipboard() {
    const number = document.getElementById('number').value;
    const username = document.getElementById('username').value;
    const userid = document.getElementById('userid').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const description = document.getElementById('description').value;

    const tableText =
      `Number:\t${number}\n` +
      `User's name:\t${username}\n` +
      `User ID:\t${userid}\n` +
      `Phone number:\t${phone}\n` +
      `Email address:\t${email}\n` +
      `Problem description:\t${description}`;

    navigator.clipboard.writeText(tableText)
      .then(() => alert('Copied to clipboard!'))
      .catch(err => alert('Failed to copy: ' + err));
  }