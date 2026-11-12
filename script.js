// Pertemuan 8 - registrasi TechStarter Day disimpan di localStorage
// Jumlah kursi terpakai dihitung dari daftar registrasi, bukan angka tetap.

const STORAGE_KEY = "techstarter.registrations.v1";
const MAX_SEATS = 40;

const registrationForm = document.querySelector("#registrationForm");
const participantNameInput = document.querySelector("#participantName");
const seatRequestInput = document.querySelector("#seatRequest");
const seatMessage = document.querySelector("#seatMessage");
const registrationList = document.querySelector("#registrationList");
const registrationSummary = document.querySelector("#registrationSummary");
const cancelEditButton = document.querySelector("#cancelEdit");

// State: satu-satunya sumber data yang dipakai untuk render.
let registrations = loadRegistrations();
let editingId = null;

console.log("JavaScript Pertemuan 8 aktif");

// ---------------------------------------------------------------- persistence
function loadRegistrations() {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw === null) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Data localStorage tidak valid:", error);
        return [];
    }
}

function saveRegistrations() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
}

// ---------------------------------------------------------------- helper
function getUsedSeats(excludeId) {
    return registrations.reduce(function (total, item) {
        if (item.id === excludeId) {
            return total;
        }
        return total + item.seats;
    }, 0);
}

function setStatus(message, type) {
    seatMessage.textContent = message;
    seatMessage.classList.remove("neutral", "success", "error");
    seatMessage.classList.add(type);
}

// ---------------------------------------------------------------- render
function renderRegistrations() {
    registrationList.replaceChildren();

    if (registrations.length === 0) {
        const empty = document.createElement("li");
        empty.className = "registration-empty";
        empty.textContent = "Belum ada registrasi.";
        registrationList.append(empty);
    }

    for (const item of registrations) {
        const li = document.createElement("li");
        li.className = "registration-item";

        const label = document.createElement("span");
        label.textContent = `${item.name} : ${item.seats} kursi`;

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", function () {
            startEdit(item);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Hapus";
        deleteButton.addEventListener("click", function () {
            deleteRegistration(item.id);
        });

        li.append(label, editButton, deleteButton);
        registrationList.append(li);
    }

    const used = getUsedSeats();
    registrationSummary.textContent =
        `${registrations.length} registrasi • ${used}/${MAX_SEATS} kursi terpakai • sisa ${MAX_SEATS - used} kursi`;
}

// ---------------------------------------------------------------- CRUD
function deleteRegistration(id) {
    registrations = registrations.filter(function (item) {
        return item.id !== id;
    });
    saveRegistrations();
    renderRegistrations();
    setStatus("Registrasi dihapus.", "success");
}

function startEdit(item) {
    editingId = item.id;
    participantNameInput.value = item.name;
    seatRequestInput.value = item.seats;
    cancelEditButton.hidden = false;
    participantNameInput.focus();
    setStatus("Mode edit aktif. Ubah data lalu tekan Simpan Registrasi.", "neutral");
}

function stopEdit() {
    editingId = null;
    cancelEditButton.hidden = true;
    registrationForm.reset();
    setStatus("Mode edit dibatalkan.", "neutral");
}

registrationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = participantNameInput.value.trim();
    const seats = Number(seatRequestInput.value);

    if (name.length < 2) {
        setStatus("Nama minimal 2 karakter.", "error");
        return;
    }

    if (!Number.isInteger(seats) || seats <= 0) {
        setStatus("Jumlah kursi harus bilangan bulat positif.", "error");
        return;
    }

    // Saat mengedit, kursi record yang sedang diedit tidak boleh dihitung dua kali.
    const usedWithoutCurrent = getUsedSeats(editingId);

    if (usedWithoutCurrent + seats > MAX_SEATS) {
        setStatus(`Kursi tidak mencukupi. Sisa ${MAX_SEATS - usedWithoutCurrent} kursi.`, "error");
        return;
    }

    if (editingId === null) {
        registrations.push({ id: Date.now(), name: name, seats: seats });
        setStatus("Registrasi ditambahkan.", "success");
    } else {
        const index = registrations.findIndex(function (item) {
            return item.id === editingId;
        });

        if (index !== -1) {
            registrations[index] = { ...registrations[index], name: name, seats: seats };
        }

        editingId = null;
        cancelEditButton.hidden = true;
        setStatus("Registrasi diperbarui.", "success");
    }

    saveRegistrations();
    renderRegistrations();
    registrationForm.reset();
});

cancelEditButton.addEventListener("click", stopEdit);

renderRegistrations();
