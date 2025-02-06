const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const exchangeIcon = document.querySelector(".exchange");
const selectTag = document.querySelectorAll("select");
const icons = document.querySelectorAll(".row i");
const translateBtn = document.querySelector("button");

// Adding the language dropdown
selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0
            ? (country_code === "en-GB" ? "selected" : "")
            : (country_code === "fr-FR" ? "selected" : "");
        let option = `<option ${selected} value="${countries[country_code]}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

//Swap button to change the languages
exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value;
    let tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

//Clearing translation on Empty input
fromText.addEventListener("keyup", () => {
    if (!fromText.vaue) {
        toText.value = "";
    }
});

//Translation API button
translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim();
    let translateFrom = selectTag[0].value;
    let translateTo = selectTag[1].value;
    if (!text) return;
    toText.setAttribute("placeholder", "Translating...");

    let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            toText.value = data.responseData.translatedText || "Translation error";
            toText.setAttribute("placeholder", "Translation");
        })
        .catch(error => {
            toText.value = "Error in translation.";
            console.error("Translation API Error:", error);
        })
});

//Copy and speak button functionality
icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(target.classList.contains("fa-copy")) {
            let textToCopy = target.id === "from" ? fromText.value : toText.value;
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy);
                alert("Copied to clipbaord!")
            }
        }   else {
            let utterance = new SpeechSynthesisUtterance(target.id === "from" ? fromText.value : toText.value);
            utterance.lang = target.id === "from" ? selectTag[0].value : selectTag[1].value;
            speechSynthesis.speak(utterance)
        }
    })
});