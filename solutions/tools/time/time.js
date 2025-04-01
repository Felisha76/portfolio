document.addEventListener("DOMContentLoaded", function () {
    const clockCanvas = document.getElementById("clockCanvas");
    const ctx = clockCanvas.getContext("2d");
    const digitalHours = document.getElementById("digital-hours");
    const digitalMinutes = document.getElementById("digital-minutes");
    let hours = 12;
    let minutes = 0;
    let draggingHand = null;
    let timeFormat = "24";

    document.getElementById("timeFormat").addEventListener("change", function (e) {
        timeFormat = e.target.value;
        updateDigitalClock();
    });

    function drawClock() {
        ctx.clearRect(0, 0, clockCanvas.width, clockCanvas.height);
        ctx.beginPath();
        ctx.arc(100, 100, 90, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 1; i <= 12; i++) {
            let angle = (i * 30 - 90) * (Math.PI / 180);
            let x = 100 + Math.cos(angle) * 75;
            let y = 100 + Math.sin(angle) * 75;
            ctx.fillText(i, x - 5, y + 5);
        }

        let hourAngle = ((hours % 12) * 30 + minutes / 2) * (Math.PI / 180) - Math.PI / 2;
        let minuteAngle = (minutes * 6) * (Math.PI / 180) - Math.PI / 2;

        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(100 + 40 * Math.cos(hourAngle), 100 + 40 * Math.sin(hourAngle));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(100 + 60 * Math.cos(minuteAngle), 100 + 60 * Math.sin(minuteAngle));
        ctx.stroke();
    }

    clockCanvas.addEventListener("mousedown", function (event) {
        let rect = clockCanvas.getBoundingClientRect();
        let x = event.clientX - rect.left - 100;
        let y = event.clientY - rect.top - 100;
        let angle = Math.atan2(y, x) + Math.PI / 2;
        let min = Math.round((angle / (Math.PI * 2)) * 60) % 60;
        let hr = Math.round((angle / (Math.PI * 2)) * 12) % 12;
        
        if (Math.abs(min - minutes) < 5) {
            draggingHand = "minute";
        } else {
            draggingHand = "hour";
        }
    });

    clockCanvas.addEventListener("mousemove", function (event) {
        if (!draggingHand) return;
        let rect = clockCanvas.getBoundingClientRect();
        let x = event.clientX - rect.left - 100;
        let y = event.clientY - rect.top - 100;
        let angle = Math.atan2(y, x) + Math.PI / 2;

        if (draggingHand === "minute") {
            minutes = Math.round((angle / (Math.PI * 2)) * 60) % 60;
        } else {
            hours = Math.round((angle / (Math.PI * 2)) * 12) % 12;
        }
        updateDigitalClock();
        drawClock();
    });

    clockCanvas.addEventListener("mouseup", function () {
        draggingHand = null;
    });

    function updateDigitalClock() {
        digitalHours.value = timeFormat === "24" ? hours : hours % 12 || 12;
        digitalMinutes.value = minutes;
    }

    digitalHours.addEventListener("input", function () {
        hours = parseInt(digitalHours.value) || 0;
        drawClock();
    });
    
    digitalMinutes.addEventListener("input", function () {
        minutes = parseInt(digitalMinutes.value) || 0;
        drawClock();
    });

    drawClock();
});
