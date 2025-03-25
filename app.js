import { getDatabase, ref, set, get } from "firebase/database";
import { db } from './firebase.js';

const counterRef = ref(db, 'counter');

// Increase the counter by 1
function incrementCount() {
  get(counterRef).then(snapshot => {
    let currentCount = snapshot.val() || 0; // Get the current count (default to 0 if not set)
    set(counterRef, currentCount + 1); // Update the counter in Firebase
  });
}

// Decrease the counter by 1
function decrementCount() {
  get(counterRef).then(snapshot => {
    let currentCount = snapshot.val() || 0;
    set(counterRef, currentCount - 1); // Update the counter in Firebase
  });
}

// Increment the counter when someone opens the page
incrementCount();

// Decrement the counter when someone leaves the page
window.addEventListener("beforeunload", decrementCount);

// Display the counter value on the page
function updateCounterDisplay() {
  get(counterRef).then(snapshot => {
    const count = snapshot.val();
    document.getElementById("counter").innerText = `Current count: ${count}`;
  });
}

// Update the counter every second
setInterval(updateCounterDisplay, 1000);
