
/* =====================================
   SCRIPTURE QUEST V1.0
   BIBLE SEARCH ENGINE
===================================== */

// BIBLE TRANSLATIONS

const translations = {
    kjv: "King James Version",
    web: "World English Bible",
    bsb: "Berean Standard Bible",
    asv: "American Standard Version",
    bbe: "Bible in Basic English",
    darby: "Darby Bible",
    dra: "Douay-Rheims Bible",
    ylt: "Young's Literal Translation",
    "oeb-us": "Open English Bible",
    webbe: "World English Bible British"
};


// OPENING ANIMATION

window.addEventListener("load", () => {

    setTimeout(() => {
        const intro = document.getElementById("intro");

        if (intro) {
            intro.classList.add("hide");
        }

    }, 3500);

});


// BIBLE SEARCH

async function searchBible() {

    const input = document.getElementById("verseInput");
    const version = document.getElementById("version");
    const button = document.getElementById("searchButton");
    const message = document.getElementById("message");
    const result = document.getElementById("result");

    const reference = input.value.trim();

    if (!reference) {
        message.textContent = "Please enter a Bible verse first.";
        result.style.display = "none";
        return;
    }

    button.disabled = true;
    button.textContent = "SEARCHING SCRIPTURES...";
    message.textContent = "Opening the Bible...";

    result.style.display = "none";

    try {

        const url =
            "https://bible-api.com/" +
            encodeURIComponent(reference) +
            "?translation=" +
            encodeURIComponent(version.value);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Passage not found.");
        }

        const data = await response.json();

        if (!data.text) {
            throw new Error("No scripture returned.");
        }

        // DISPLAY SCRIPTURE

        document.getElementById("reference").textContent =
            data.reference;

        document.getElementById("versionName").textContent =
            data.translation_name ||
            translations[version.value];

        document.getElementById("verseText").textContent =
            data.text.trim();

        result.style.display = "block";

        message.textContent = "";

        result.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

    catch (error) {

        message.textContent =
            "We couldn't find that passage. Check the reference and try again.";

    }

    finally {

        button.disabled = false;

        button.textContent =
            "✦ SEARCH THE SCRIPTURES ✦";

    }

}


// ENTER KEY SEARCH

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("verseInput");

    if (input) {

        input.addEventListener("keydown", event => {

            if (event.key === "Enter") {
                searchBible();
            }

        });

    }

});


// COPY VERSE

function copyVerse() {

    const reference =
        document.getElementById("reference").textContent;

    const verse =
        document.getElementById("verseText").textContent;

    const version =
        document.getElementById("versionName").textContent;

    const text =
        reference + "\n" +
        verse + "\n" +
        version;

    navigator.clipboard.writeText(text)

        .then(() => {

            const button =
                document.querySelector(".small-button");

            button.textContent = "COPIED! ✓";

            setTimeout(() => {
                button.textContent = "COPY VERSE";
            }, 2000);

        })

        .catch(() => {

            document.getElementById("message").textContent =
                "Copy wasn't available in this browser.";

        });

}


/* =====================================
   SCRIPTURE QUEST READY
===================================== */

console.log("✝ SCRIPTURE QUEST V1.0 ONLINE");
console.log("Bible search engine initialized.");
console.log("Ready to explore God's Word.");

/* =====================================
   SCRIPTURE QUEST - VERSE OF THE DAY
   ===================================== */

const DAILY_VERSE_KEY = "scriptureQuestDailyVerse";

const DAILY_BIBLE_URL =
    "https://api.getbible.net/v3/kjv.json";

function getLocalDateKey() {
    const now = new Date();

    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0")
    ].join("-");
}

function getDailyVerseNumber() {
    const startDate = Date.UTC(2026, 10, 18);

    const now = new Date();

    const today = Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    const daysPassed = Math.max(
        0,
        Math.floor((today - startDate) / 86400000)
    );

    return daysPassed % 31102;
}

function displayDailyVerse(verse) {
    document.getElementById("dailyVerseStatus").textContent =
        "A scripture for today";

    document.getElementById("dailyVerseText").textContent =
        verse.text;

    document.getElementById("dailyVerseReference").textContent =
        verse.reference;

    document.getElementById("dailyVerseDate").textContent =
        new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });
}

async function loadDailyVerse() {
    const savedDate = getLocalDateKey();

    const savedVerse = localStorage.getItem(DAILY_VERSE_KEY);

    // Use today's saved verse if it has already been loaded.
    if (savedVerse) {
        try {
            const saved = JSON.parse(savedVerse);

            if (saved.date === savedDate) {
                displayDailyVerse(saved.verse);
                return;
            }
        } catch (error) {
            console.log("Loading a fresh daily verse.");
        }
    }

    const status = document.getElementById("dailyVerseStatus");

    status.textContent = "Loading the complete Bible...";

    try {
        const response = await fetch(DAILY_BIBLE_URL);

        if (!response.ok) {
            throw new Error("Bible data could not be loaded.");
        }

        const bible = await response.json();

        const allVerses = [];

        // Go through all 66 books, chapters, and verses.
        bible.books.forEach(book => {
            book.chapters.forEach(chapter => {
                chapter.verses.forEach(verse => {
                    allVerses.push({
                        text: verse.text,
                        reference:
                            book.name + " " +
                            chapter.chapter + ":" +
                            verse.verse
                    });
                });
            });
        });

        if (allVerses.length !== 31102) {
            throw new Error("The Bible data was incomplete.");
        }

        // Pick the verse corresponding to today's position.
        const verseNumber = getDailyVerseNumber();

        const selectedVerse = allVerses[verseNumber];

        const savedData = {
            date: savedDate,
            verse: selectedVerse
        };

        localStorage.setItem(
            DAILY_VERSE_KEY,
            JSON.stringify(savedData)
        );

        displayDailyVerse(selectedVerse);

        console.log(
            "Daily verse loaded:",
            selectedVerse.reference
        );

    } catch (error) {
        console.error("Daily verse error:", error);

        status.textContent =
            "Today's verse couldn't load. Please refresh and try again.";
    }
}

// Start the daily verse feature.
document.addEventListener("DOMContentLoaded", loadDailyVerse);
