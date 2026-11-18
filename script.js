
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
