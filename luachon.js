// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAcZ3XkZs1GmYYqiwWoyLW39MRJP-7X0hc",
    authDomain: "doan2-d5264.firebaseapp.com",
    databaseURL: "https://doan2-d5264-default-rtdb.firebaseio.com/",
    projectId: "doan2-d5264",
    storageBucket: "doan2-d5264.appspot.com",
    messagingSenderId: "789428680797",
    appId: "1:789428680797:web:f9481319ff0862677675b4",
    measurementId: "G-NPZ2JDGE7T",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const dbRef = firebase.database().ref("slots");

// Biến lưu trữ ô đang chọn
let selectedSlot = null;

// Hàm cập nhật trạng thái vị trí từ Firebase và cập nhật giao diện
function updateSlotStatus(slotId, status) {
    const slotElement = document.getElementById(slotId);
    if (status === 0) {
        slotElement.classList.remove("occupied", "selected");
        slotElement.classList.add("empty");
        slotElement.onclick = () => toggleSelectSlot(slotId); // Cho phép nhấp nếu ô trống
    } else if (status === 1) {
        slotElement.classList.remove("empty", "selected");
        slotElement.classList.add("occupied");
        slotElement.onclick = () => alert("Vị trí này đã có xe. Vui lòng chọn vị trí trống khác.");
    }
}

// Lắng nghe thay đổi từ Firebase và cập nhật các vị trí
dbRef.on("value", (snapshot) => {
    const data = snapshot.val();
    for (const slotId in data) {
        updateSlotStatus(slotId, data[slotId]);
    }
});

// Hàm để chọn hoặc bỏ chọn một ô đậu xe
function toggleSelectSlot(slotId) {
    const slotElement = document.getElementById(slotId);

    // Chỉ cho phép chọn ô trống (empty), không cho phép chọn ô đã đầy (occupied)
    if (slotElement.classList.contains("selected")) {
        slotElement.classList.remove("selected");
        slotElement.classList.add("empty");
        selectedSlot = null; // Xóa lựa chọn
    } else {
        // Bỏ chọn ô trước đó nếu có
        if (selectedSlot) {
            document.getElementById(selectedSlot).classList.remove("selected");
            document.getElementById(selectedSlot).classList.add("empty");
        }

        // Chọn ô mới và chuyển màu sang vàng
        selectedSlot = slotId;
        slotElement.classList.remove("empty");
        slotElement.classList.add("selected");
    }
}

// Hàm xác nhận vị trí đậu xe đã chọn
function confirmSelection() {
    if (selectedSlot) {
        const slotElement = document.getElementById(selectedSlot);

        // Chuyển ô từ màu vàng (selected) sang màu đỏ (occupied)
        slotElement.classList.remove("selected");
        slotElement.classList.add("occupied");

        // Cập nhật trạng thái trong Firebase là 1 (đã có xe)
        dbRef
            .child(selectedSlot)
            .set(1)
            .then(() => {
                alert(`Bạn đã đặt chỗ ${selectedSlot}!`);
                selectedSlot = null; // Xóa lựa chọn hiện tại sau khi xác nhận
            })
            .catch((error) => {
                console.error("Lỗi khi cập nhật Firebase:", error);
            });
    } else {
        alert("Vui lòng chọn một vị trí trước khi xác nhận.");
    }
}
