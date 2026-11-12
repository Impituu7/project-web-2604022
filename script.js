// Pertemuan 7 - logika kursi dari Pertemuan 6 dipindah ke antarmuka halaman
// Kapasitas 40 kursi, 27 sudah terdaftar.

console.log("JavaScript Pertemuan 7 aktif");

const eventName = "TechStarter Day";
const maxSeats = 40;
let registered = 27;

console.log(eventName);
console.log(maxSeats);
console.log(registered);

const remaining = maxSeats - registered;
console.log(`Sisa kursi: ${remaining}`);

// Cek apakah permintaan masih bisa dilayani tanpa mengubah state.
function checkSeats(requested) {
    const remaining = maxSeats - registered;

    if (!Number.isInteger(requested) || requested <= 0) {
        return "Masukkan jumlah kursi berupa bilangan bulat lebih dari 0.";
    }

    if (requested <= remaining) {
        return `Tersedia. Sisa saat ini ${remaining} kursi.`;
    }

    return `Tidak cukup. Hanya tersisa ${remaining} kursi.`;
}

// Versi yang benar-benar menambah state registered.
function registerSeats(requested) {
    const remaining = maxSeats - registered;

    if (!Number.isInteger(requested) || requested <= 0) {
        return "Input tidak valid.";
    }

    if (requested > remaining) {
        return `Gagal. Hanya tersisa ${remaining} kursi.`;
    }

    registered = registered + requested;
    return `Berhasil. Total terdaftar sekarang ${registered}.`;
}

// Selector: ambil elemen dari DOM sebelum dipakai.
const seatForm = document.querySelector("#seatForm");
const seatRequestInput = document.querySelector("#seatRequest");
const seatMessage = document.querySelector("#seatMessage");

console.log(seatForm);
console.log(seatRequestInput);
console.log(seatMessage);

// Satu pintu untuk mengubah teks dan class status.
function setStatus(message, type) {
    seatMessage.textContent = message;
    seatMessage.classList.remove("neutral", "success", "error");
    seatMessage.classList.add(type);
}

// Listener dipasang di form, bukan di tombol, supaya Enter ikut memproses.
seatForm.addEventListener("submit", function (event) {
    // Form punya perilaku bawaan reload. Dihentikan dulu.
    event.preventDefault();

    const rawValue = seatRequestInput.value;
    const requested = Number(rawValue);
    const remaining = maxSeats - registered;

    console.log(rawValue, typeof rawValue, requested, typeof requested);

    if (!Number.isInteger(requested) || requested <= 0) {
        setStatus("Masukkan jumlah kursi bulat lebih dari 0.", "error");
        return;
    }

    if (requested <= remaining) {
        setStatus(checkSeats(requested), "success");
    } else {
        setStatus(checkSeats(requested), "error");
    }
});

// Setiap perubahan input mengembalikan status ke netral.
seatRequestInput.addEventListener("input", function () {
    setStatus("Nilai berubah. Tekan Cek Kursi untuk memeriksa.", "neutral");
});
