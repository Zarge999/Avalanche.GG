// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA9IaJUs4KAV3IbcapUdBjKn-57hQ4gPpo",
    authDomain: "avalanche-b78c6.firebaseapp.com",
    projectId: "avalanche-b78c6",
    storageBucket: "avalanche-b78c6.firebasestorage.app",
    messagingSenderId: "806793807458",
    appId: "1:806793807458:web:67c5655465f7f6facb733b",
    measurementId: "G-KK5GCBWLLB"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Show password form for admin access
function showPasswordForm() {
    document.getElementById("passwordForm").style.display = "block";
}

// Check password and load messages for admin
function checkPassword() {
    const password = document.getElementById("password").value;

    if (password === "846972") {
        document.getElementById("messagesSection").style.display = "block";
        fetchMessages(); // Fetch messages after correct password
    } else {
        alert("Incorrect password");
    }
}

// Fetch messages from Firestore and display them
async function fetchMessages() {
    const messagesContainer = document.getElementById("messagesContainer");
    messagesContainer.innerHTML = ""; // Clear current messages

    try {
        const querySnapshot = await db.collection("messages").get();
        querySnapshot.forEach(doc => {
            const messageData = doc.data();
            const messageElement = document.createElement("div");
            messageElement.innerHTML = `
                <p><strong>${messageData.name}</strong>: ${messageData.message}</p>
                <button class="delete-btn" onclick="deleteMessage('${doc.id}')">Delete</button>
            `;
            messagesContainer.appendChild(messageElement);
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
    }
}

// Delete a message from Firestore
async function deleteMessage(messageId) {
    try {
        await db.collection("messages").doc(messageId).delete();
        fetchMessages(); // Reload messages after deletion
    } catch (error) {
        console.error("Error deleting message:", error);
    }
}

// Handle form submission to store messages in Firestore
document.getElementById("contactForm").addEventListener("submit", async function(e) {
    e.preventDefault(); // Prevent default form submission

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    try {
        // Save message to Firestore
        await db.collection("messages").add({
            name: name,
            email: email,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp() // Add a timestamp
        });

        // Clear form and alert the user
        document.getElementById("contactForm").reset();
        alert("Message sent successfully!");

        // Optionally, refresh the admin messages section if they are viewing it
        if (document.getElementById("messagesSection").style.display === "block") {
            fetchMessages();
        }
    } catch (error) {
        console.error("Error sending message:", error);
        alert("Error sending message. Please try again.");
    }
});
