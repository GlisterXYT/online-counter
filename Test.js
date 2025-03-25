const puppeteer = require('puppeteer');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK with the service account key
const serviceAccount = require('C:/onlinecounter-20056-firebase-adminsdk-fbsvc-c6a460d5f9.json'); // Updated path to your service account file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://onlinecounter-20056.firebaseio.com' // Replace with your Firebase Realtime Database URL
});

const db = admin.database();
const counterRef = db.ref('counter');  // Firebase database reference for the counter

// Function to increment the counter when a user visits the website
async function incrementCounter() {
  const counterSnapshot = await counterRef.once('value');
  let currentCount = counterSnapshot.val() || 0;
  currentCount++;

  // Update the counter in Firebase
  await counterRef.set(currentCount);
  console.log('User count incremented:', currentCount);
}

// Function to decrement the counter when a user leaves or closes the page
async function decrementCounter() {
  const counterSnapshot = await counterRef.once('value');
  let currentCount = counterSnapshot.val() || 0;
  currentCount--;

  // Update the counter in Firebase
  await counterRef.set(currentCount);
  console.log('User count decremented:', currentCount);
}

// Puppeteer Script
(async () => {
  const browser = await puppeteer.launch({
    headless: false,  // Run in non-headless mode so you can see the browser
    args: [
      '--no-sandbox', // Run with no sandbox for security
      '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();
  await page.goto('https://onlinecounter-20056.web.app');  // Replace with your actual URL

  console.log('Navigated to your website.');

  // Increment counter when the user visits the page
  await incrementCounter();

  // Listen for the close event to decrement the counter
  page.on('close', async () => {
    console.log('Browser closed.');
    await decrementCounter();
  });

  // Keep the page open for a while to simulate interaction
  await page.waitForTimeout(10000);  // Keep open for 10 seconds
  await browser.close();
})();
