(function () {
"use strict";
/* =========================================================
   SENSOFOOD
   Food Sensory Research Platform
   PIECE 1 — CORE
   ========================================================= */

const SENSOFOOD = {

    appName: "SensoFood",

    totalQuestions: 20,

    storage: {
        language: "sensofood_language",
        participant: "sensofood_participant",
        assessment: "sensofood_assessment",
        results: "sensofood_results",
        participants: "sensofood_participants"
    },

    pages: {
        home: "index.html",
        consent: "consent.html",
        about: "about.html",
        participants: "participants.html",
        assessment: "assessment.html",
        result: "result.html",
        dashboard: "dashboard.html"
    }

};


/* =========================================================
   BASIC DOM HELPERS
   ========================================================= */

function getElement(selector) {

    return document.querySelector(selector);

}


function getElements(selector) {

    return Array.from(
        document.querySelectorAll(selector)
    );

}


/* =========================================================
   CURRENT PAGE
   ========================================================= */

function getCurrentPage() {

    let page =
        window.location.pathname
            .split("/")
            .pop();

    if (!page) {

        page = "index.html";

    }

    return page.toLowerCase();

}


/* =========================================================
   SAFE LOCAL STORAGE
   ========================================================= */

function saveData(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    } catch (error) {

        console.error(
            "SensoFood: Unable to save data.",
            error
        );

    }

}


function loadData(key, defaultValue) {

    try {

        const value =
            localStorage.getItem(key);

        if (value === null) {

            return defaultValue;

        }

        return JSON.parse(value);

    } catch (error) {

        console.error(
            "SensoFood: Unable to load data.",
            error
        );

        return defaultValue;

    }

}


/* =========================================================
   APPLICATION START
   ========================================================= */

function startSensoFood() {

    console.log(
        "SensoFood JavaScript is working."
    );

    console.log(
        "Current page:",
        getCurrentPage()
    );

}


/* =========================================================
   RUN WHEN PAGE IS READY
   ========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startSensoFood
    );

} else {

    startSensoFood();

}

})();
/* =========================================================
SENSOFOOD
   PIECE 2 — LANGUAGE SYSTEM
   ========================================================= */

(function () {
    "use strict";

    const LANGUAGES = {

        en: {
            name: "English",
            direction: "ltr"
        },

        ar: {
            name: "العربية",
            direction: "rtl"
        },

        fr: {
            name: "Français",
            direction: "ltr"
        },

        es: {
            name: "Español",
            direction: "ltr"
        },

        de: {
            name: "Deutsch",
            direction: "ltr"
        },

        it: {
            name: "Italiano",
            direction: "ltr"
        },

        tr: {
            name: "Türkçe",
            direction: "ltr"
        },

        zh: {
            name: "中文",
            direction: "ltr"
        },

        ja: {
            name: "日本語",
            direction: "ltr"
        }

    };


    /* =====================================================
       GET CURRENT LANGUAGE
       ===================================================== */

    function getLanguage() {

        const savedLanguage =
            localStorage.getItem("sensofood_language");

        if (
            savedLanguage &&
            LANGUAGES[savedLanguage]
        ) {
            return savedLanguage;
        }

        return "en";
    }


    /* =====================================================
       SAVE LANGUAGE
       ===================================================== */

    function setLanguage(language) {

        if (!LANGUAGES[language]) {
            return;
        }

        localStorage.setItem(
            "sensofood_language",
            language
        );

        applyLanguage(language);
    }


    /* =====================================================
       APPLY LANGUAGE DIRECTION
       ===================================================== */

    function applyLanguage(language) {

        const selectedLanguage =
            LANGUAGES[language] || LANGUAGES.en;

        document.documentElement.lang =
            language;

        document.documentElement.dir =
            selectedLanguage.direction;

        document.body.dir =
            selectedLanguage.direction;
    }


    /* =====================================================
       CREATE LANGUAGE SELECTOR
       ===================================================== */

    function createLanguageSelector() {

        if (
            document.querySelector(
                ".sf-language-selector"
            )
        ) {
            return;
        }

        const select =
            document.createElement("select");

        select.className =
            "sf-language-selector";

        select.setAttribute(
            "aria-label",
            "Select language"
        );


        Object.keys(LANGUAGES).forEach(
            function (languageCode) {

                const option =
                    document.createElement("option");

                option.value =
                    languageCode;

                option.textContent =
                    LANGUAGES[languageCode].name;

                select.appendChild(option);

            }
        );


        const currentLanguage =
            getLanguage();

        select.value =
            currentLanguage;


        select.addEventListener(
            "change",
            function () {

                setLanguage(
                    this.value
                );

                /*
                 * Reload keeps the language
                 * on every page.
                 */

                window.location.reload();

            }
        );


        const header =
            document.querySelector(".header");

        const navbar =
            document.querySelector(".navbar");

        const target =
            header || navbar;


        if (target) {

            target.appendChild(select);

        } else {

            document.body.prepend(select);

        }

    }


    /* =====================================================
       INITIALIZE LANGUAGE SYSTEM
       ===================================================== */

    function initializeLanguageSystem() {

        const language =
            getLanguage();

        applyLanguage(language);

        createLanguageSelector();

        console.log(
            "SensoFood language:",
            language
        );

    }


    /* =====================================================
       START PIECE 2
       ===================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeLanguageSystem
        );

    } else {

        initializeLanguageSystem();

    }

})();
/* =========================================================
SENSOFOOD
   PIECE 3 — ASSESSMENT SYSTEM
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       QUESTIONS
       ===================================================== */

    const questions = [
        {
            number: 1,
            category: "Olfactory",
            categoryAr: "الشم",
            en: "Imagine smelling this food. How pleasant would you find its smell?",
            ar: "تخيل أنك تشم رائحة هذا الطعام. ما مدى استمتاعك برائحته؟"
        },
        {
            number: 2,
            category: "Olfactory",
            categoryAr: "الشم",
            en: "How sensitive are you to food smells?",
            ar: "ما مدى حساسيتك لروائح الطعام؟"
        },
        {
            number: 3,
            category: "Olfactory",
            categoryAr: "الشم",
            en: "How strongly do food odors affect your appetite?",
            ar: "إلى أي مدى تؤثر روائح الطعام في شهيتك؟"
        },
        {
            number: 4,
            category: "Olfactory",
            categoryAr: "الشم",
            en: "How easily can you distinguish different food smells?",
            ar: "ما مدى سهولة تمييزك بين روائح الأطعمة المختلفة؟"
        },

        {
            number: 5,
            category: "Taste",
            categoryAr: "التذوق",
            en: "How pleasant do you usually find the taste of new foods?",
            ar: "ما مدى استمتاعك عادةً بطعم الأطعمة الجديدة؟"
        },
        {
            number: 6,
            category: "Taste",
            categoryAr: "التذوق",
            en: "How sensitive are you to strong flavors?",
            ar: "ما مدى حساسيتك للنكهات القوية؟"
        },
        {
            number: 7,
            category: "Taste",
            categoryAr: "التذوق",
            en: "How easily do you notice small changes in taste?",
            ar: "ما مدى سهولة ملاحظتك للتغيرات الصغيرة في الطعم؟"
        },
        {
            number: 8,
            category: "Taste",
            categoryAr: "التذوق",
            en: "How often do you reject food because of its taste?",
            ar: "كم مرة ترفض الطعام بسبب طعمه؟"
        },

        {
            number: 9,
            category: "Texture",
            categoryAr: "القوام",
            en: "How pleasant do you find the texture of most foods?",
            ar: "ما مدى استمتاعك بقوام معظم الأطعمة؟"
        },
        {
            number: 10,
            category: "Texture",
            categoryAr: "القوام",
            en: "How sensitive are you to food textures?",
            ar: "ما مدى حساسيتك لقوام الطعام؟"
        },
        {
            number: 11,
            category: "Texture",
            categoryAr: "القوام",
            en: "How much does texture influence your food choices?",
            ar: "إلى أي مدى يؤثر القوام في اختياراتك الغذائية؟"
        },
        {
            number: 12,
            category: "Texture",
            categoryAr: "القوام",
            en: "How often do you avoid foods because of their texture?",
            ar: "كم مرة تتجنب أطعمة بسبب قوامها؟"
        },

        {
            number: 13,
            category: "Visual",
            categoryAr: "المظهر البصري",
            en: "How important is food appearance to you?",
            ar: "ما مدى أهمية مظهر الطعام بالنسبة لك؟"
        },
        {
            number: 14,
            category: "Visual",
            categoryAr: "المظهر البصري",
            en: "How sensitive are you to the color of food?",
            ar: "ما مدى حساسيتك للون الطعام؟"
        },
        {
            number: 15,
            category: "Visual",
            categoryAr: "المظهر البصري",
            en: "How much does presentation affect your appetite?",
            ar: "إلى أي مدى يؤثر تقديم الطعام في شهيتك؟"
        },
        {
            number: 16,
            category: "Visual",
            categoryAr: "المظهر البصري",
            en: "How often do you reject food because of its appearance?",
            ar: "كم مرة ترفض الطعام بسبب مظهره؟"
        },

        {
            number: 17,
            category: "Food Acceptance",
            categoryAr: "تقبل الطعام",
            en: "How willing are you to try unfamiliar foods?",
            ar: "ما مدى استعدادك لتجربة أطعمة غير مألوفة؟"
        },
        {
            number: 18,
            category: "Food Acceptance",
            categoryAr: "تقبل الطعام",
            en: "How easily do you accept changes in your meals?",
            ar: "ما مدى سهولة تقبلك للتغييرات في وجباتك؟"
        },
        {
            number: 19,
            category: "Food Acceptance",
            categoryAr: "تقبل الطعام",
            en: "How comfortable are you eating foods prepared differently?",
            ar: "ما مدى ارتياحك لتناول الأطعمة المحضرة بطرق مختلفة؟"
        },
        {
            number: 20,
            category: "Food Acceptance",
            categoryAr: "تقبل الطعام",
            en: "How likely are you to try a food recommended by someone else?",
            ar: "ما مدى احتمالية تجربتك لطعام يوصي به شخص آخر؟"
        }
    ];


    /* =====================================================
       ANSWER OPTIONS
       ===================================================== */

    const answersEnglish = [
        "Very Low",
        "Low",
        "Moderate",
        "High",
        "Very High"
    ];

    const answersArabic = [
        "منخفض جدًا",
        "منخفض",
        "متوسط",
        "مرتفع",
        "مرتفع جدًا"
    ];


    /* =====================================================
       VARIABLES
       ===================================================== */

    let currentQuestion = 1;

    let savedAnswers = {};


    /* =====================================================
       LOAD SAVED ANSWERS
       ===================================================== */

    try {
        const storedAnswers =
            localStorage.getItem("sensofood_assessment");

        if (storedAnswers) {
            savedAnswers = JSON.parse(storedAnswers);
        }
    } catch (error) {
        console.error(
            "SensoFood: Could not load saved answers.",
            error
        );

        savedAnswers = {};
    }


    /* =====================================================
       GET LANGUAGE
       ===================================================== */

    function getLanguage() {

        const language =
            localStorage.getItem("sensofood_language");

        if (language === "ar") {
            return "ar";
        }

        return "en";
    }


    /* =====================================================
       SAVE ANSWERS
       ===================================================== */

    function saveAnswers() {

        try {

            localStorage.setItem(
                "sensofood_assessment",
                JSON.stringify(savedAnswers)
            );

        } catch (error) {

            console.error(
                "SensoFood: Could not save answers.",
                error
            );

        }
    }


    /* =====================================================
       RENDER QUESTION
       ===================================================== */

    function renderQuestion() {

        const card =
            document.querySelector(".assessment-card");

        if (!card) {
            return;
        }


        const question =
            questions[currentQuestion - 1];

        if (!question) {
            return;
        }


        const language =
            getLanguage();


        const questionText =
            language === "ar"
                ? question.ar
                : question.en;


        const category =
            language === "ar"
                ? question.categoryAr
                : question.category;


        const answerList =
            language === "ar"
                ? answersArabic
                : answersEnglish;


        const savedValue =
            savedAnswers[currentQuestion] || null;


        let html = "";


        html += '<div class="assessment-question">';


        html +=
            '<div class="question-number">' +
            (language === "ar"
                ? "السؤال "
                : "Question ") +
            currentQuestion +
            (language === "ar"
                ? " من 20"
                : " of 20") +
            "</div>";


        html +=
            '<div class="question-category">' +
            category +
            "</div>";


        html +=
            '<h2 class="question-text">' +
            questionText +
            "</h2>";


        html +=
            '<div class="answer-options">';


        for (let i = 0; i < answerList.length; i++) {

            const value = i + 1;

            const checked =
                Number(savedValue) === value
                    ? "checked"
                    : "";


            html +=
                '<label class="answer-option">' +

                '<input ' +
                'type="radio" ' +
                'name="assessment-answer" ' +
                'value="' +
                value +
                '" ' +
                checked +
                '>' +

                '<span>' +
                answerList[i] +
                "</span>" +

                "</label>";
        }


        html += "</div>";


        html +=
            '<div class="assessment-navigation">';


        html +=
            '<button ' +
            'type="button" ' +
            'class="btn" ' +
            'id="previousQuestion" ' +
            (currentQuestion === 1
                ? "disabled"
                : "") +
            '>' +
            (language === "ar"
                ? "السابق"
                : "Previous") +
            "</button>";


        html +=
            '<button ' +
            'type="button" ' +
            'class="btn" ' +
            'id="nextQuestion">' +
            (currentQuestion === questions.length
                ? (
                    language === "ar"
                        ? "إنهاء"
                        : "Finish"
                )
                : (
                    language === "ar"
                        ? "التالي"
                        : "Next"
                )) +
            "</button>";


        html += "</div>";

        html += "</div>";


        card.innerHTML = html;


        updateProgress();

        connectButtons();
    }


    /* =====================================================
       UPDATE PROGRESS BAR
       ===================================================== */

    function updateProgress() {

        const progressBar =
            document.querySelector(".progress-bar");

        if (!progressBar) {
            return;
        }


        const percentage =
            (currentQuestion / questions.length) * 100;


        progressBar.style.width =
            percentage + "%";
    }


    /* =====================================================
       GET SELECTED ANSWER
       ===================================================== */

    function getSelectedAnswer() {

        const selected =
            document.querySelector(
                'input[name="assessment-answer"]:checked'
            );


        if (!selected) {
            return null;
        }


        return Number(selected.value);
    }


    /* =====================================================
       NEXT
       ===================================================== */

    function nextQuestion() {

        const answer =
            getSelectedAnswer();


        if (answer === null) {

            const language =
                getLanguage();


            alert(
                language === "ar"
                    ? "يرجى اختيار إجابة قبل المتابعة."
                    : "Please select an answer before continuing."
            );


            return;
        }


        savedAnswers[currentQuestion] =
            answer;


        saveAnswers();


        if (currentQuestion < questions.length) {

            currentQuestion++;

            renderQuestion();

            window.scrollTo(0, 0);

        } else {

            finishAssessment();

        }
    }


    /* =====================================================
       PREVIOUS
       ===================================================== */

    function previousQuestion() {

        if (currentQuestion <= 1) {
            return;
        }


        const answer =
            getSelectedAnswer();


        if (answer !== null) {

            savedAnswers[currentQuestion] =
                answer;

            saveAnswers();
        }


        currentQuestion--;


        renderQuestion();


        window.scrollTo(0, 0);
    }


    /* =====================================================
       FINISH
       ===================================================== */

    function finishAssessment() {

        saveAnswers();


        localStorage.setItem(
            "sensofood_assessment_completed",
            "true"
        );


        window.location.href =
            "result.html";
    }


    /* =====================================================
       CONNECT BUTTONS
       ===================================================== */

    function connectButtons() {

        const nextButton =
            document.getElementById("nextQuestion");


        const previousButton =
            document.getElementById(
                "previousQuestion"
            );


        if (nextButton) {

            nextButton.addEventListener(
                "click",
                nextQuestion
            );
        }


        if (previousButton) {

            previousButton.addEventListener(
                "click",
                previousQuestion
            );
        }
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    function initializeAssessment() {

        const card =
            document.querySelector(".assessment-card");


        if (!card) {
            return;
        }


        renderQuestion();


        console.log(
            "SensoFood: Piece 3 is working."
        );
    }


    /* =====================================================
       START
       ===================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeAssessment
        );

    } else {

        initializeAssessment();
    }

})();
/* =========================================================
SENSOFOOD
   PIECE 4 — RESULTS & SCORING SYSTEM
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       SETTINGS
       ===================================================== */

    const TOTAL_QUESTIONS = 20;

    const QUESTIONS_PER_CATEGORY = 4;


    /* =====================================================
       CATEGORY CONFIGURATION
       ===================================================== */

    const categories = {

        olfactory: {
            questions: [1, 2, 3, 4],
            name: "Olfactory",
            nameAr: "الشم"
        },

        taste: {
            questions: [5, 6, 7, 8],
            name: "Taste",
            nameAr: "التذوق"
        },

        texture: {
            questions: [9, 10, 11, 12],
            name: "Texture",
            nameAr: "القوام"
        },

        visual: {
            questions: [13, 14, 15, 16],
            name: "Visual",
            nameAr: "المظهر البصري"
        },

        foodAcceptance: {
            questions: [17, 18, 19, 20],
            name: "Food Acceptance",
            nameAr: "تقبل الطعام"
        }

    };


    /* =====================================================
       GET LANGUAGE
       ===================================================== */

    function getLanguage() {

        const language =
            localStorage.getItem(
                "sensofood_language"
            );

        if (language === "ar") {
            return "ar";
        }

        return "en";
    }


    /* =====================================================
       LOAD ASSESSMENT
       ===================================================== */

    function loadAssessment() {

        try {

            const data =
                localStorage.getItem(
                    "sensofood_assessment"
                );


            if (!data) {
                return {};
            }


            return JSON.parse(data);

        } catch (error) {

            console.error(
                "SensoFood: Could not load assessment.",
                error
            );

            return {};
        }
    }


    /* =====================================================
       CHECK COMPLETION
       ===================================================== */

    function isAssessmentComplete(answers) {

        for (
            let question = 1;
            question <= TOTAL_QUESTIONS;
            question++
        ) {

            if (
                !answers[question] ||
                Number(answers[question]) < 1 ||
                Number(answers[question]) > 5
            ) {

                return false;
            }
        }


        return true;
    }


    /* =====================================================
       CALCULATE CATEGORY SCORE
       ===================================================== */

    function calculateCategoryScore(
        questionNumbers,
        answers
    ) {

        let total = 0;


        for (
            let i = 0;
            i < questionNumbers.length;
            i++
        ) {

            const questionNumber =
                questionNumbers[i];


            total += Number(
                answers[questionNumber] || 0
            );
        }


        const maximumScore =
            questionNumbers.length * 5;


        if (maximumScore === 0) {
            return 0;
        }


        const percentage =
            (total / maximumScore) * 100;


        return Math.round(percentage);
    }


    /* =====================================================
       GET SCORE LABEL
       ===================================================== */

    function getScoreLabel(score) {

        if (score <= 39) {

            return {
                en: "Low",
                ar: "منخفض"
            };

        }


        if (score <= 59) {

            return {
                en: "Moderate",
                ar: "متوسط"
            };

        }


        if (score <= 79) {

            return {
                en: "High",
                ar: "مرتفع"
            };

        }


        return {
            en: "Very High",
            ar: "مرتفع جدًا"
        };

    }


    /* =====================================================
       CALCULATE ALL RESULTS
       ===================================================== */

    function calculateResults() {

        const answers =
            loadAssessment();


        if (
            !isAssessmentComplete(answers)
        ) {

            return null;
        }


        const results = {

            olfactory: 0,

            taste: 0,

            texture: 0,

            visual: 0,

            foodAcceptance: 0,

            overall: 0

        };


        const categoryKeys =
            Object.keys(categories);


        for (
            let i = 0;
            i < categoryKeys.length;
            i++
        ) {

            const key =
                categoryKeys[i];


            results[key] =
                calculateCategoryScore(
                    categories[key].questions,
                    answers
                );
        }


        const total =
            results.olfactory +
            results.taste +
            results.texture +
            results.visual +
            results.foodAcceptance;


        results.overall =
            Math.round(
                total / 5
            );


        return results;
    }


    /* =====================================================
       SAVE RESULTS
       ===================================================== */

    function saveResults(results) {

        if (!results) {
            return;
        }


        try {

            localStorage.setItem(
                "sensofood_results",
                JSON.stringify(results)
            );


            localStorage.setItem(
                "sensofood_assessment_completed",
                "true"
            );

        } catch (error) {

            console.error(
                "SensoFood: Could not save results.",
                error
            );
        }
    }


    /* =====================================================
       LOAD SAVED RESULTS
       ===================================================== */

    function loadResults() {

        try {

            const data =
                localStorage.getItem(
                    "sensofood_results"
                );


            if (!data) {
                return null;
            }


            return JSON.parse(data);

        } catch (error) {

            console.error(
                "SensoFood: Could not load results.",
                error
            );

            return null;
        }
    }


    /* =====================================================
       DISPLAY SCORE
       ===================================================== */

    function displayScore(
        selector,
        score
    ) {

        const element =
            document.querySelector(selector);


        if (!element) {
            return;
        }


        element.textContent =
            score + "%";
    }


    /* =====================================================
       DISPLAY CATEGORY RESULT
       ===================================================== */

    function displayCategoryResult(
        key,
        score
    ) {

        const language =
            getLanguage();


        const category =
            categories[key];


        if (!category) {
            return;
        }


        const label =
            getScoreLabel(score);


        /*
         * Possible HTML selectors:
         *
         * .olfactory-score
         * .taste-score
         * .texture-score
         * .visual-score
         * .food-acceptance-score
         */


        let selector = "";


        if (key === "olfactory") {
            selector = ".olfactory-score";
        }


        if (key === "taste") {
            selector = ".taste-score";
        }


        if (key === "texture") {
            selector = ".texture-score";
        }


        if (key === "visual") {
            selector = ".visual-score";
        }


        if (key === "foodAcceptance") {
            selector = ".food-acceptance-score";
        }


        displayScore(
            selector,
            score
        );


        /*
         * Display label if an element exists.
         */

        const labelSelector =
            selector
                ? selector.replace(
                    "-score",
                    "-label"
                )
                : "";


        const labelElement =
            document.querySelector(
                labelSelector
            );


        if (labelElement) {

            labelElement.textContent =
                language === "ar"
                    ? label.ar
                    : label.en;
        }
    }


    /* =====================================================
       DISPLAY OVERALL RESULT
       ===================================================== */

    function displayOverallResult(
        score
    ) {

        const language =
            getLanguage();


        const label =
            getScoreLabel(score);


        /*
         * Main score
         */

        const scoreElement =
            document.querySelector(
                ".result-score"
            );


        if (scoreElement) {

            scoreElement.textContent =
                score + "%";
        }


        /*
         * Main label
         */

        const labelElement =
            document.querySelector(
                ".result-label"
            );


        if (labelElement) {

            labelElement.textContent =
                language === "ar"
                    ? label.ar
                    : label.en;
        }
    }


    /* =====================================================
       DISPLAY RESULTS
       ===================================================== */

    function displayResults(results) {

        if (!results) {
            return;
        }


        displayOverallResult(
            results.overall
        );


        displayCategoryResult(
            "olfactory",
            results.olfactory
        );


        displayCategoryResult(
            "taste",
            results.taste
        );


        displayCategoryResult(
            "texture",
            results.texture
        );


        displayCategoryResult(
            "visual",
            results.visual
        );


        displayCategoryResult(
            "foodAcceptance",
            results.foodAcceptance
        );


        console.log(
            "SensoFood Results:",
            results
        );
    }


    /* =====================================================
       INITIALIZE RESULTS
       ===================================================== */

    function initializeResults() {

        const resultsPage =
            document.querySelector(
                ".result-score"
            );


        if (!resultsPage) {
            return;
        }


        let results =
            calculateResults();


        /*
         * If results were already calculated,
         * use the saved version.
         */

        if (!results) {

            results =
                loadResults();
        }


        if (!results) {

            console.warn(
                "SensoFood: No assessment results found."
            );

            return;
        }


        saveResults(results);

        displayResults(results);


        console.log(
            "SensoFood: Piece 4 is working."
        );
    }


    /* =====================================================
       START PIECE 4
       ===================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeResults
        );

    } else {

        initializeResults();
    }

})();
/* =========================================================
SENSOFOOD
   PIECE 5 — FINAL DESIGN FIX
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       FINAL STYLE
       ===================================================== */

    function addFinalStyle() {

        if (
            document.getElementById(
                "sensofood-piece5-style"
            )
        ) {
            return;
        }


        var style =
            document.createElement("style");


        style.id =
            "sensofood-piece5-style";


        style.textContent = `

        /* =================================================
           PAGE
           ================================================= */

        body {
            background-color: #f7f8fc !important;
            color: #252a41 !important;
        }


        /* =================================================
           HEADER
           ================================================= */

        .header {
            position: relative !important;
            z-index: 1000 !important;
            overflow: visible !important;
            box-sizing: border-box !important;

            padding-right: 175px !important;
        }


        .navbar {
            position: relative !important;
            z-index: 1000 !important;
            overflow: visible !important;
        }


        .navbar-container {
            position: relative !important;
            overflow: visible !important;
        }


        /* =================================================
           PLATFORM TITLE
           ================================================= */

        .logo,
        .logo-text {
            position: relative !important;
            z-index: 2 !important;

            max-width: 100% !important;
        }


        /* =================================================
           LANGUAGE SELECTOR
           ================================================= */

        .sf-language-selector {

            position: absolute !important;

            top: 18px !important;
            right: 20px !important;

            width: 140px !important;
            height: 40px !important;

            box-sizing: border-box !important;

            padding: 0 12px !important;

            border: 1px solid #d9ddec !important;

            border-radius: 10px !important;

            background-color: #ffffff !important;

            color: #303650 !important;

            font-family: inherit !important;

            font-size: 13px !important;

            font-weight: 600 !important;

            outline: none !important;

            cursor: pointer !important;

            z-index: 9999 !important;

            box-shadow:
                0 5px 15px
                rgba(40, 48, 80, 0.10) !important;
        }


        .sf-language-selector:hover {

            border-color: #6978d8 !important;

            box-shadow:
                0 7px 18px
                rgba(40, 48, 80, 0.14) !important;
        }


        .sf-language-selector:focus {

            border-color: #6978d8 !important;
        }


        /* =================================================
           ASSESSMENT CARD
           ================================================= */

        .assessment-card {

            position: relative !important;

            overflow: visible !important;

            box-sizing: border-box !important;

            background-color: #ffffff !important;

            border: 1px solid #e3e5ef !important;

            border-radius: 22px !important;

            padding: 40px !important;

            box-shadow:
                0 15px 40px
                rgba(40, 48, 80, 0.10) !important;
        }


        /* =================================================
           QUESTION NUMBER
           ================================================= */

        .question-number {

            display: inline-block !important;

            position: relative !important;

            width: auto !important;

            min-width: 125px !important;

            height: auto !important;

            min-height: 36px !important;

            box-sizing: border-box !important;

            padding: 8px 17px !important;

            margin-bottom: 12px !important;

            border-radius: 20px !important;

            background-color: #5b6ee1 !important;

            color: #ffffff !important;

            font-size: 14px !important;

            font-weight: 700 !important;

            line-height: 20px !important;

            text-align: center !important;

            white-space: nowrap !important;

            overflow: visible !important;

            visibility: visible !important;

            opacity: 1 !important;

            clip: auto !important;

            z-index: 5 !important;
        }


        /* =================================================
           CATEGORY
           ================================================= */

        .question-category {

            display: inline-block !important;

            padding: 6px 13px !important;

            margin-bottom: 14px !important;

            border-radius: 9px !important;

            background-color: #f0f2fc !important;

            color: #5968bd !important;

            font-size: 14px !important;

            font-weight: 700 !important;
        }


        /* =================================================
           QUESTION TEXT
           ================================================= */

        .question-text {

            color: #252a41 !important;

            font-size: 28px !important;

            font-weight: 700 !important;

            line-height: 1.5 !important;

            margin-top: 5px !important;

            margin-bottom: 30px !important;

            max-width: 900px !important;
        }


        /* =================================================
           ANSWER OPTIONS
           ================================================= */

        .answer-options {

            display: flex !important;

            flex-direction: column !important;

            gap: 12px !important;

            width: 100% !important;
        }


        .answer-option {

            display: flex !important;

            align-items: center !important;

            width: 100% !important;

            min-height: 55px !important;

            box-sizing: border-box !important;

            padding: 13px 17px !important;

            background-color: #fafbfe !important;

            border: 1px solid #e1e3ec !important;

            border-radius: 13px !important;

            cursor: pointer !important;

            transition:
                background-color 0.2s ease,
                border-color 0.2s ease,
                transform 0.2s ease !important;
        }


        .answer-option:hover {

            background-color: #f2f4fc !important;

            border-color: #9da7df !important;

            transform: translateY(-1px) !important;
        }


        .answer-option input {

            width: 19px !important;

            height: 19px !important;

            margin-right: 13px !important;

            flex-shrink: 0 !important;

            accent-color: #5b6ee1 !important;

            cursor: pointer !important;
        }


        .answer-option span {

            color: #353a52 !important;

            font-size: 16px !important;

            font-weight: 600 !important;

            line-height: 1.5 !important;
        }


        /* =================================================
           NAVIGATION
           ================================================= */

        .assessment-navigation {

            display: flex !important;

            justify-content: space-between !important;

            align-items: center !important;

            gap: 15px !important;

            margin-top: 32px !important;

            padding-top: 24px !important;

            border-top:
                1px solid #e7e8ef !important;
        }


        .assessment-navigation .btn {

            min-width: 120px !important;

            min-height: 46px !important;

            padding: 11px 22px !important;

            border: none !important;

            border-radius: 11px !important;

            font-family: inherit !important;

            font-size: 15px !important;

            font-weight: 700 !important;

            cursor: pointer !important;

            transition:
                background-color 0.2s ease,
                transform 0.2s ease,
                box-shadow 0.2s ease !important;
        }


        /* =================================================
           NEXT BUTTON
           ================================================= */

        #nextQuestion {

            background-color: #5b6ee1 !important;

            color: #ffffff !important;

            box-shadow:
                0 7px 18px
                rgba(91, 110, 225, 0.22) !important;
        }


        #nextQuestion:hover {

            background-color: #4f60cf !important;

            transform: translateY(-2px) !important;
        }


        /* =================================================
           PREVIOUS BUTTON
           ================================================= */

        #previousQuestion {

            background-color: #eceef5 !important;

            color: #454b65 !important;
        }


        #previousQuestion:hover {

            background-color: #e0e3ee !important;

            transform: translateY(-2px) !important;
        }


        #previousQuestion:disabled {

            opacity: 0.45 !important;

            cursor: not-allowed !important;

            transform: none !important;
        }


        /* =================================================
           PROGRESS BAR
           ================================================= */

        .progress-container {

            overflow: hidden !important;

            background-color: #e6e8f0 !important;

            border-radius: 20px !important;
        }


        .progress-bar {

            min-height: 8px !important;

            background-color: #5b6ee1 !important;

            border-radius: 20px !important;

            transition:
                width 0.4s ease !important;
        }


        /* =================================================
           GENERAL CARDS
           ================================================= */

        .card,
        .result-card,
        .info-box {

            border-radius: 18px !important;

            box-shadow:
                0 12px 35px
                rgba(40, 48, 80, 0.08) !important;
        }


        /* =================================================
           RTL
           ================================================= */

        html[dir="rtl"] .header {

            padding-right: 30px !important;

            padding-left: 175px !important;
        }


        html[dir="rtl"] .sf-language-selector {

            right: auto !important;

            left: 20px !important;
        }


        html[dir="rtl"] .answer-option {

            direction: rtl !important;
        }


        html[dir="rtl"] .answer-option input {

            margin-right: 0 !important;

            margin-left: 13px !important;
        }


        /* =================================================
           MOBILE
           ================================================= */

        @media (max-width: 768px) {

            .header {

                min-height: 135px !important;

                padding:
                    20px 20px 65px 20px !important;
            }


            html[dir="rtl"] .header {

                padding:
                    20px 20px 65px 20px !important;
            }


            .sf-language-selector {

                top: auto !important;

                right: 20px !important;

                bottom: 13px !important;

                width: 130px !important;

                height: 38px !important;

                font-size: 12px !important;
            }


            html[dir="rtl"] .sf-language-selector {

                right: auto !important;

                left: 20px !important;
            }


            .assessment-card {

                padding:
                    25px 18px !important;

                border-radius:
                    18px !important;
            }


            .question-number {

                min-width:
                    115px !important;

                font-size:
                    13px !important;
            }


            .question-text {

                font-size:
                    21px !important;

                line-height:
                    1.5 !important;
            }


            .answer-option {

                min-height:
                    53px !important;

                padding:
                    12px 14px !important;
            }


            .answer-option span {

                font-size:
                    15px !important;
            }


            .assessment-navigation {

                flex-direction:
                    column-reverse !important;
            }


            .assessment-navigation .btn {

                width:
                    100% !important;
            }

        }

        `;


        document.head.appendChild(style);
    }


    /* =====================================================
       FIX QUESTION NUMBER
       ===================================================== */

    function fixQuestionNumber() {

        var number =
            document.querySelector(
                ".question-number"
            );


        if (!number) {
            return;
        }


        number.style.display =
            "inline-block";


        number.style.width =
            "auto";


        number.style.height =
            "auto";


        number.style.minWidth =
            "125px";


        number.style.overflow =
            "visible";


        number.style.whiteSpace =
            "nowrap";


        number.style.visibility =
            "visible";


        number.style.opacity =
            "1";
    }


    /* =====================================================
       IMPROVE SELECTED ANSWER
       ===================================================== */

    function improveAnswers() {

        var options =
            document.querySelectorAll(
                ".answer-option"
            );


        for (
            var i = 0;
            i < options.length;
            i++
        ) {

            var input =
                options[i].querySelector(
                    "input"
                );


            if (!input) {
                continue;
            }


            if (input.checked) {

                options[i].style.backgroundColor =
                    "#eef0fc";

                options[i].style.borderColor =
                    "#5b6ee1";
            }


            input.addEventListener(
                "change",
                function () {

                    var all =
                        document.querySelectorAll(
                            ".answer-option"
                        );


                    for (
                        var j = 0;
                        j < all.length;
                        j++
                    ) {

                        all[j].style.backgroundColor =
                            "#fafbfe";

                        all[j].style.borderColor =
                            "#e1e3ec";
                    }


                    var parent =
                        this.parentElement;


                    if (parent) {

                        parent.style.backgroundColor =
                            "#eef0fc";

                        parent.style.borderColor =
                            "#5b6ee1";
                    }

                }
            );
        }
    }


    /* =====================================================
       WATCH QUESTION CHANGES
       ===================================================== */

    function watchAssessment() {

        var card =
            document.querySelector(
                ".assessment-card"
            );


        if (!card) {
            return;
        }


        var observer =
            new MutationObserver(
                function () {

                    fixQuestionNumber();

                    improveAnswers();

                }
            );


        observer.observe(
            card,
            {
                childList: true,
                subtree: true
            }
        );
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    function initializePiece5() {

        addFinalStyle();

        fixQuestionNumber();

        improveAnswers();

        watchAssessment();


        console.log(
            "SensoFood: Piece 5 loaded successfully."
        );
    }


    /* =====================================================
       START
       ===================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializePiece5
        );

    } else {

        initializePiece5();

    }

})();
(function () {
"use strict";
var SF6_LANGUAGES = {
        en: {
            name: "English",
            dir: "ltr"
        },
        ar: {
            name: "العربية",
            dir: "rtl"
        },
        fr: {
            name: "Français",
            dir: "ltr"
        },
        es: {
            name: "Español",
            dir: "ltr"
        },
        de: {
            name: "Deutsch",
            dir: "ltr"
        },
        it: {
            name: "Italiano",
            dir: "ltr"
        },
        tr: {
            name: "Türkçe",
            dir: "ltr"
        },
        zh: {
            name: "中文",
            dir: "ltr"
        },
        ja: {
            name: "日本語",
            dir: "ltr"
        }
    };

    function sf6GetLanguage() {
        var saved = localStorage.getItem("sensofood_language");

        if (saved && SF6_LANGUAGES[saved]) {
            return saved;
        }

        return "en";
    }

    function sf6SetDirection() {
        var language = sf6GetLanguage();
        var info = SF6_LANGUAGES[language];

        document.documentElement.lang = language;
        document.documentElement.dir = info.dir;
        document.body.dir = info.dir;
    }

    console.log("SensoFood Piece 6 - Part 1 OK");
    function sf6CreateLanguageSelector() {
var oldSelector = document.querySelector(".sf6-language-selector");

        if (oldSelector) {
            oldSelector.remove();
        }

        var select = document.createElement("select");

        select.className = "sf6-language-selector";
        select.setAttribute("aria-label", "Language");

        Object.keys(SF6_LANGUAGES).forEach(function (code) {
            var option = document.createElement("option");

            option.value = code;
            option.textContent = SF6_LANGUAGES[code].name;

            select.appendChild(option);
        });

        select.value = sf6GetLanguage();

        select.addEventListener("change", function () {
            localStorage.setItem(
                "sensofood_language",
                this.value
            );

            sf6SetDirection();

            window.location.reload();
        });

        var header = document.querySelector(".header");
        var navbar = document.querySelector(".navbar");

        if (header) {
            header.appendChild(select);
        } else if (navbar) {
            navbar.appendChild(select);
        } else {
            document.body.insertBefore(
                select,
                document.body.firstChild
            );
        }
    }

    console.log("SensoFood Piece 6 - Part 2 OK"); 
    var SF6_TRANSLATIONS = {
en: {
            "Home": "Home",
            "Assessment": "Assessment",
            "Results": "Results",
            "About": "About",
            "Participants": "Participants",
            "Dashboard": "Dashboard",
            "Consent": "Consent",
            "SensoFood": "SensoFood",
            "Food-Sensory Research Platform": "Food-Sensory Research Platform",
            "Start Assessment": "Start Assessment",
            "Start": "Start",
            "Continue": "Continue",
            "Previous": "Previous",
            "Next": "Next",
            "Finish": "Finish",
            "Question": "Question",
            "of": "of",
            "Overall Score": "Overall Score",
            "Interpretation": "Interpretation",
            "Low": "Low",
            "Moderate": "Moderate",
            "High": "High",
            "Very High": "Very High",
            "Olfactory": "Olfactory",
            "Taste": "Taste",
            "Texture": "Texture",
            "Visual": "Visual",
            "Food Acceptance": "Food Acceptance"
        },

        ar: {
            "Home": "الرئيسية",
            "Assessment": "التقييم",
            "Results": "النتائج",
            "About": "حول المنصة",
            "Participants": "المشاركون",
            "Dashboard": "لوحة التحكم",
            "Consent": "الموافقة",
            "SensoFood": "SensoFood",
            "Food-Sensory Research Platform": "منصة أبحاث حسية غذائية",
            "Start Assessment": "بدء التقييم",
            "Start": "ابدأ",
            "Continue": "متابعة",
            "Previous": "السابق",
            "Next": "التالي",
            "Finish": "إنهاء",
            "Question": "السؤال",
            "of": "من",
            "Overall Score": "النتيجة الإجمالية",
            "Interpretation": "التفسير",
            "Low": "منخفض",
            "Moderate": "متوسط",
            "High": "مرتفع",
            "Very High": "مرتفع جدًا",
            "Olfactory": "الشم",
            "Taste": "التذوق",
            "Texture": "القوام",
            "Visual": "المظهر",
            "Food Acceptance": "تقبل الطعام"
        },

        fr: {
            "Home": "Accueil",
            "Assessment": "Évaluation",
            "Results": "Résultats",
            "About": "À propos",
            "Participants": "Participants",
            "Dashboard": "Tableau de bord",
            "Consent": "Consentement",
            "SensoFood": "SensoFood",
            "Food-Sensory Research Platform": "Plateforme de recherche sensorielle alimentaire",
            "Start Assessment": "Commencer l'évaluation",
            "Start": "Commencer",
            "Continue": "Continuer",
            "Previous": "Précédent",
            "Next": "Suivant",
            "Finish": "Terminer",
            "Question": "Question",
            "of": "sur",
            "Overall Score": "Score global",
            "Interpretation": "Interprétation",
            "Low": "Faible",
            "Moderate": "Modéré",
            "High": "Élevé",
            "Very High": "Très élevé",
            "Olfactory": "Olfactif",
            "Taste": "Goût",
            "Texture": "Texture",
            "Visual": "Visuel",
            "Food Acceptance": "Acceptation alimentaire"
        },

        es: {
            "Home": "Inicio",
            "Assessment": "Evaluación",
            "Results": "Resultados",
            "About": "Acerca de",
            "Participants": "Participantes",
            "Dashboard": "Panel",
            "Consent": "Consentimiento",
            "SensoFood": "SensoFood",
            "Food-Sensory Research Platform": "Plataforma de investigación sensorial alimentaria",
            "Start Assessment": "Iniciar evaluación",
            "Start": "Comenzar",
            "Continue": "Continuar",
            "Previous": "Anterior",
            "Next": "Siguiente",
            "Finish": "Finalizar",
            "Question": "Pregunta",
            "of": "de",
            "Overall Score": "Puntuación general",
            "Interpretation": "Interpretación",
            "Low": "Bajo",
            "Moderate": "Moderado",
            "High": "Alto",
            "Very High": "Muy alto",
            "Olfactory": "Olfativo",
            "Taste": "Gusto",
            "Texture": "Textura",
            "Visual": "Visual",
            "Food Acceptance": "Aceptación alimentaria"
        },

        de: {
            "Home": "Startseite",
            "Assessment": "Bewertung",
            "Results": "Ergebnisse",
            "About": "Über uns",
            "Participants": "Teilnehmer",
            "Dashboard": "Dashboard",
            "Consent": "Zustimmung",
            "SensoFood": "SensoFood",
            "Food-Sensory Research Platform": "Forschungplattform für Lebensmittelsensorik",
            "Start Assessment": "Bewertung starten",
            "Start": "Starten",
            "Continue": "Weiter",
            "Previous": "Zurück",
            "Next": "Weiter",
            "Finish": "Beenden",
            "Question": "Frage",
            "of": "von",
            "Overall Score": "Gesamtergebnis",
            "Interpretation": "Interpretation",
            "Low": "Niedrig",
            "Moderate": "Mittel",
            "High": "Hoch",
            "Very High": "Sehr hoch",
            "Olfactory": "Geruch",
            "Taste": "Geschmack",
            "Texture": "Textur",
            "Visual": "Visuell",
            "Food Acceptance": "Lebensmittelakzeptanz"
        },

        it: {
            "Home": "Home",
            "Assessment": "Valutazione",
            "Results": "Risultati",
            "About": "Informazioni",
            "Participants": "Partecipanti",
            "Dashboard": "Dashboard",
            "Consent": "Consenso",
            "SensoFood": "SensoFood",
            "Food-Sensory Research Platform": "Piattaforma di ricerca sensoriale alimentare",
            "Start Assessment": "Inizia valutazione",
            "Start": "Inizia",
            "Continue": "Continua",
            "Previous": "Precedente",
            "Next": "Successivo",
            "Finish": "Fine",
            "Question": "Domanda",
            "of": "di",
            "Overall Score": "Punteggio complessivo",
            "Interpretation": "Interpretazione",
            "Low": "Basso",
            "Moderate": "Moderato",
            "High": "Alto",
            "Very High": "Molto alto",
            "Olfactory": "Olfattivo",
            "Taste": "Gusto",
            "Texture": "Consistenza",
            "Visual": "Visivo",
            "Food Acceptance": "Accettazione alimentare"
        },

        tr: {
            "Home": "Ana Sayfa",
            "Assessment": "Değerlendirme",
            "Results": "Sonuçlar",
            "About": "Hakkında",
            "Participants": "Katılımcılar",
            "Dashboard": "Kontrol Paneli",
            "Consent": "Onay",
            "SensoFood": "SensoFood",
            "Food-Sensory Research Platform": "Gıda-Duyusal Araştırma Platformu",
            "Start Assessment": "Değerlendirmeyi Başlat",
            "Start": "Başla",
            "Continue": "Devam",
            "Previous": "Önceki",
            "Next": "Sonraki",
            "Finish": "Bitir",
            "Question": "Soru",
            "of": "/",
            "Overall Score": "Genel Puan",
            "Interpretation": "Yorum",
            "Low": "Düşük",
            "Moderate": "Orta",
            "High": "Yüksek",
            "Very High": "Çok yüksek",
            "Olfactory": "Koku",
            "Taste": "Tat",
            "Texture": "Doku",
            "Visual": "Görsel",
            "Food Acceptance": "Gıda Kabulü"
        },

        zh: {
            "Home": "首页",
            "Assessment": "评估",
            "Results": "结果",
            "About": "关于",
            "Participants": "参与者",
            "Dashboard": "控制面板",
            "Consent": "同意",
            "SensoFood": "SensoFood",
            "Food-Sensory Research Platform": "食品感官研究平台",
            "Start Assessment": "开始评估",
            "Start": "开始",
            "Continue": "继续",
            "Previous": "上一题",
            "Next": "下一题",
            "Finish": "完成",
            "Question": "问题",
            "of": "/",
            "Overall Score": "总分",
            "Interpretation": "解释",
            "Low": "低",
            "Moderate": "中等",
            "High": "高",
            "Very High": "非常高",
            "Olfactory": "嗅觉",
            "Taste": "味觉",
            "Texture": "质地",
            "Visual": "视觉",
            "Food Acceptance": "食物接受度"
        },

        ja: {
            "Home": "ホーム",
            "Assessment": "評価",
            "Results": "結果",
            "About": "概要",
            "Participants": "参加者",
            "Dashboard": "ダッシュボード",
            "Consent": "同意",
            "SensoFood": "SensoFood",
            "Food-Sensory Research Platform": "食品官能研究プラットフォーム",
            "Start Assessment": "評価を開始",
            "Start": "開始",
            "Continue": "続行",
            "Previous": "前へ",
            "Next": "次へ",
            "Finish": "完了",
            "Question": "質問",
            "of": "/",
            "Overall Score": "総合スコア",
            "Interpretation": "解釈",
            "Low": "低い",
            "Moderate": "中程度",
            "High": "高い",
            "Very High": "非常に高い",
            "Olfactory": "嗅覚",
            "Taste": "味覚",
            "Texture": "食感",
            "Visual": "視覚",
            "Food Acceptance": "食品受容"
        }
    };

    function sf6Translate(text) {
        var language = sf6GetLanguage();
        var dictionary = SF6_TRANSLATIONS[language];

        if (!dictionary) {
            dictionary = SF6_TRANSLATIONS.en;
        }

        if (dictionary[text]) {
            return dictionary[text];
        }

        return text;
    }

    console.log("SensoFood Piece 6 - Part 3 OK");
    function sf6TranslateElements() {
var elements = document.querySelectorAll(
            "h1, h2, h3, h4, h5, p, span, a, button, label"
        );

        elements.forEach(function (element) {
            if (element.classList.contains("sf6-language-selector")) {
                return;
            }

            if (element.children.length > 0) {
                return;
            }

            var original = element.getAttribute(
                "data-sf6-original"
            );

            if (!original) {
                original = element.textContent.trim();

                if (original) {
                    element.setAttribute(
                        "data-sf6-original",
                        original
                    );
                }
            }

            if (!original) {
                return;
            }

            var translated = sf6Translate(original);

            if (translated !== original) {
                element.textContent = translated;
            }
        });
    }

    function sf6TranslateQuestionNumber() {
        var element = document.querySelector(
            ".question-number"
        );

        if (!element) {
            return;
        }

        var text = element.textContent.trim();
        var match = text.match(/(\d+)\s*(?:of|من|sur|de|von|di|\/)\s*(\d+)/i);

        if (!match) {
            match = text.match(/(\d+).*(\d+)/);
        }

        if (!match) {
            return;
        }

        var current = match[1];
        var total = match[2];
        var language = sf6GetLanguage();

        if (language === "ar") {
            element.textContent =
                "السؤال " + current + " من " + total;
        } else if (language === "fr") {
            element.textContent =
                "Question " + current + " sur " + total;
        } else if (language === "es") {
            element.textContent =
                "Pregunta " + current + " de " + total;
        } else if (language === "de") {
            element.textContent =
                "Frage " + current + " von " + total;
        } else if (language === "it") {
            element.textContent =
                "Domanda " + current + " di " + total;
        } else if (language === "tr") {
            element.textContent =
                "Soru " + current + " / " + total;
        } else if (language === "zh") {
            element.textContent =
                "问题 " + current + " / " + total;
        } else if (language === "ja") {
            element.textContent =
                "質問 " + current + " / " + total;
        } else {
            element.textContent =
                "Question " + current + " of " + total;
        }
    }

    console.log("SensoFood Piece 6 - Part 4 OK");
    function sf6Style() {
if (document.getElementById("sf6-style")) {
return;
        }

        var style = document.createElement("style");

        style.id = "sf6-style";

        style.textContent =
            ".sf6-language-selector{" +
            "position:relative;" +
            "z-index:9999;" +
            "width:130px;" +
            "min-width:130px;" +
            "height:38px;" +
            "padding:6px 10px;" +
            "margin:8px;" +
            "border-radius:12px;" +
            "border:1px solid rgba(100,120,140,.25);" +
            "background:rgba(255,255,255,.94);" +
            "font-size:14px;" +
            "cursor:pointer;" +
            "box-shadow:0 4px 16px rgba(0,0,0,.08);" +
            "}" +

            ".sf6-language-selector:hover{" +
            "box-shadow:0 6px 20px rgba(0,0,0,.12);" +
            "}" +

            ".sf6-language-selector:focus{" +
            "outline:none;" +
            "box-shadow:0 0 0 3px rgba(100,150,200,.18);" +
            "}" +

            ".question-number{" +
            "display:inline-flex;" +
            "align-items:center;" +
            "justify-content:center;" +
            "min-width:120px;" +
            "height:38px;" +
            "padding:6px 14px;" +
            "border-radius:12px;" +
            "box-sizing:border-box;" +
            "white-space:nowrap;" +
            "}" +

            ".answer-option{" +
            "transition:all .2s ease;" +
            "}" +

            ".answer-option:hover{" +
            "transform:translateY(-2px);" +
            "box-shadow:0 6px 18px rgba(0,0,0,.08);" +
            "}" +

            "@media(max-width:600px){" +
            ".sf6-language-selector{" +
            "width:110px;" +
            "min-width:110px;" +
            "font-size:13px;" +
            "}" +

            ".question-number{" +
            "min-width:110px;" +
            "font-size:13px;" +
            "}" +
            "}";

        document.head.appendChild(style);
    }

    console.log("SensoFood Piece 6 - Part 5 OK");
    function sf6Start() {
sf6SetDirection();
        sf6CreateLanguageSelector();
        sf6Style();
        sf6TranslateElements();
        sf6TranslateQuestionNumber();

        console.log("SensoFood Piece 6 is working.");
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            sf6Start
        );
    } else {
        sf6Start();
    }

})();
(function () {
"use strict";

    function sf7AddStyle() {
        if (document.getElementById("sf7-style")) {
            return;
        }

        var style = document.createElement("style");
        style.id = "sf7-style";

        style.textContent =
            "body{" +
            "transition:background .3s ease, color .3s ease;" +
            "}" +

            ".header,.navbar{" +
            "position:relative;" +
            "z-index:1000;" +
            "box-shadow:0 4px 20px rgba(0,0,0,.06);" +
            "}" +

            ".header a,.navbar a{" +
            "transition:all .2s ease;" +
            "}" +

            ".header a:hover,.navbar a:hover{" +
            "transform:translateY(-1px);" +
            "}" +

            ".hero{" +
            "position:relative;" +
            "overflow:hidden;" +
            "}" +

            ".hero:after{" +
            "content:'';" +
            "position:absolute;" +
            "width:280px;" +
            "height:280px;" +
            "border-radius:50%;" +
            "background:rgba(255,255,255,.08);" +
            "top:-120px;" +
            "right:-80px;" +
            "pointer-events:none;" +
            "}" +

            ".card,.assessment-card{" +
            "border-radius:20px;" +
            "box-shadow:0 8px 25px rgba(0,0,0,.07);" +
            "transition:transform .25s ease, box-shadow .25s ease;" +
            "}" +

            ".card:hover,.assessment-card:hover{" +
            "transform:translateY(-4px);" +
            "box-shadow:0 14px 35px rgba(0,0,0,.10);" +
            "}" +

            ".btn{" +
            "border-radius:12px;" +
            "transition:all .2s ease;" +
            "}" +

            ".btn:hover{" +
            "transform:translateY(-2px);" +
            "box-shadow:0 7px 18px rgba(0,0,0,.12);" +
            "}" +

            ".answer-option{" +
            "border-radius:14px;" +
            "transition:all .2s ease;" +
            "}" +

            ".answer-option:hover{" +
            "transform:translateX(3px);" +
            "}" +

            ".progress-container{" +
            "border-radius:20px;" +
            "overflow:hidden;" +
            "}" +

            ".progress-bar{" +
            "transition:width .4s ease;" +
            "}" ;

        document.head.appendChild(style);
    }

    function sf7Start() {
        sf7AddStyle();

        console.log("SensoFood Piece 7 - Part 1 OK");
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            sf7Start
        );
    } else {
        sf7Start();
    }

})();
(function () {
"use strict";
function sf7AddIcons() {
        var links = document.querySelectorAll(
            ".header a, .navbar a, nav a"
        );

        links.forEach(function (link) {
            var text = link.textContent.trim();

            if (!text) {
                return;
            }

            if (link.getAttribute("data-sf7-icon")) {
                return;
            }

            var icon = "";

            if (
                text === "Home" ||
                text === "الرئيسية" ||
                text === "Accueil" ||
                text === "Inicio" ||
                text === "Startseite" ||
                text === "Ana Sayfa" ||
                text === "首页" ||
                text === "ホーム"
            ) {
                icon = "⌂";
            }

            else if (
                text === "Assessment" ||
                text === "التقييم" ||
                text === "Évaluation" ||
                text === "Evaluación" ||
                text === "Bewertung" ||
                text === "Valutazione" ||
                text === "Değerlendirme" ||
                text === "评估" ||
                text === "評価"
            ) {
                icon = "◉";
            }

            else if (
                text === "Results" ||
                text === "النتائج" ||
                text === "Résultats" ||
                text === "Resultados" ||
                text === "Ergebnisse" ||
                text === "Risultati" ||
                text === "Sonuçlar" ||
                text === "结果" ||
                text === "結果"
            ) {
                icon = "▥";
            }

            else if (
                text === "About" ||
                text === "حول المنصة" ||
                text === "À propos" ||
                text === "Acerca de" ||
                text === "Über uns" ||
                text === "Informazioni" ||
                text === "Hakkında" ||
                text === "关于" ||
                text === "概要"
            ) {
                icon = "ⓘ";
            }

            else if (
                text === "Participants" ||
                text === "المشاركون" ||
                text === "Participants" ||
                text === "Participantes" ||
                text === "Teilnehmer" ||
                text === "Partecipanti" ||
                text === "Katılımcılar" ||
                text === "参与者" ||
                text === "参加者"
            ) {
                icon = "♙";
            }

            else if (
                text === "Dashboard" ||
                text === "لوحة التحكم" ||
                text === "Tableau de bord" ||
                text === "Panel" ||
                text === "Dashboard" ||
                text === "Kontrol Paneli" ||
                text === "控制面板"
            ) {
                icon = "▦";
            }

            else if (
                text === "Consent" ||
                text === "الموافقة" ||
                text === "Consentement" ||
                text === "Consentimiento" ||
                text === "Zustimmung" ||
                text === "Consenso" ||
                text === "Onay" ||
                text === "同意"
            ) {
                icon = "✓";
            }

            if (icon) {
                var span = document.createElement("span");

                span.className = "sf7-nav-icon";
                span.textContent = icon;
                span.setAttribute("aria-hidden", "true");

                link.insertBefore(
                    span,
                    link.firstChild
                );

                link.setAttribute(
                    "data-sf7-icon",
                    "true"
                );
            }
        });
    }

    function sf7IconStyle() {
        if (document.getElementById("sf7-icon-style")) {
            return;
        }

        var style = document.createElement("style");

        style.id = "sf7-icon-style";

        style.textContent =
            ".sf7-nav-icon{" +
            "display:inline-flex;" +
            "align-items:center;" +
            "justify-content:center;" +
            "width:24px;" +
            "height:24px;" +
            "margin-right:7px;" +
            "font-size:17px;" +
            "font-weight:600;" +
            "opacity:.85;" +
            "vertical-align:middle;" +
            "transition:transform .2s ease;" +
            "}" +

            "[dir='rtl'] .sf7-nav-icon{" +
            "margin-right:0;" +
            "margin-left:7px;" +
            "}" +

            ".header a:hover .sf7-nav-icon," +
            ".navbar a:hover .sf7-nav-icon," +
            "nav a:hover .sf7-nav-icon{" +
            "transform:scale(1.12);" +
            "}" ;

        document.head.appendChild(style);
    }

    function sf7Part2Start() {
        sf7AddIcons();
        sf7IconStyle();

        console.log(
            "SensoFood Piece 7 - Part 2 OK"
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            sf7Part2Start
        );
    } else {
        sf7Part2Start();
    }

})();
(function () {
"use strict";
function sf7BeautyCards() {
        var cards = document.querySelectorAll(
            ".card, .assessment-card, .result-card, .feature-card"
        );

        cards.forEach(function (card) {
            card.style.transition =
                "transform .25s ease, box-shadow .25s ease";

            card.addEventListener("mouseenter", function () {
                card.style.transform = "translateY(-4px)";
                card.style.boxShadow =
                    "0 14px 35px rgba(0,0,0,.10)";
            });

            card.addEventListener("mouseleave", function () {
                card.style.transform = "";
                card.style.boxShadow = "";
            });
        });
    }

    function sf7BeautyImages() {
        var images = document.querySelectorAll(
            "img"
        );

        images.forEach(function (image) {
            image.style.borderRadius = "18px";
            image.style.transition =
                "transform .3s ease, box-shadow .3s ease";

            image.addEventListener("mouseenter", function () {
                image.style.transform = "scale(1.02)";
                image.style.boxShadow =
                    "0 10px 25px rgba(0,0,0,.10)";
            });

            image.addEventListener("mouseleave", function () {
                image.style.transform = "";
                image.style.boxShadow = "";
            });
        });
    }

    function sf7BeautyResults() {
        var scores = document.querySelectorAll(
            ".result-score, .olfactory-score, .taste-score, .texture-score, .visual-score, .food-acceptance-score"
        );

        scores.forEach(function (score) {
            score.style.transition =
                "transform .2s ease";

            score.addEventListener("mouseenter", function () {
                score.style.transform = "scale(1.05)";
            });

            score.addEventListener("mouseleave", function () {
                score.style.transform = "";
            });
        });
    }

    function sf7Part3Start() {
        sf7BeautyCards();
        sf7BeautyImages();
        sf7BeautyResults();

        console.log(
            "SensoFood Piece 7 - Part 3 OK"
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            sf7Part3Start
        );
    } else {
        sf7Part3Start();
    }

})(); 
(function () {
"use strict";
function sf7AssessmentBeauty() {
        var buttons = document.querySelectorAll(
            "#nextQuestion, #previousQuestion, .assessment-navigation button, .btn"
        );

        buttons.forEach(function (button) {
            button.style.transition =
                "transform .2s ease, box-shadow .2s ease";

            button.addEventListener("mouseenter", function () {
                if (!button.disabled) {
                    button.style.transform = "translateY(-2px)";
                    button.style.boxShadow =
                        "0 7px 18px rgba(0,0,0,.12)";
                }
            });

            button.addEventListener("mouseleave", function () {
                button.style.transform = "";
                button.style.boxShadow = "";
            });
        });

        var options = document.querySelectorAll(
            ".answer-option"
        );

        options.forEach(function (option) {
            option.style.cursor = "pointer";

            option.addEventListener("click", function () {
                options.forEach(function (item) {
                    item.style.transform = "";
                });

                option.style.transform =
                    "translateY(-2px)";
            });
        });
    }

    function sf7Part4Start() {
        sf7AssessmentBeauty();

        console.log(
            "SensoFood Piece 7 - Part 4 OK"
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            sf7Part4Start
        );
    } else {
        sf7Part4Start();
    }

})();
(function () {
"use strict";
function sf7FinalStyle() {
        if (document.getElementById("sf7-final-style")) {
            return;
        }

        var style = document.createElement("style");
        style.id = "sf7-final-style";

        style.textContent =
            ".header,.navbar{" +
            "display:flex;" +
            "align-items:center;" +
            "flex-wrap:wrap;" +
            "gap:8px;" +
            "}" +

            ".header a,.navbar a,nav a{" +
            "display:inline-flex;" +
            "align-items:center;" +
            "min-height:36px;" +
            "padding:6px 10px;" +
            "border-radius:10px;" +
            "}" +

            ".header a:hover,.navbar a:hover,nav a:hover{" +
            "background:rgba(255,255,255,.10);" +
            "}" +

            ".sf6-language-selector{" +
            "margin-left:auto;" +
            "margin-right:8px;" +
            "}" +

            "[dir='rtl'] .sf6-language-selector{" +
            "margin-left:8px;" +
            "margin-right:auto;" +
            "}" +

            ".hero h1{" +
            "line-height:1.2;" +
            "}" +

            ".hero p{" +
            "line-height:1.7;" +
            "}" +

            ".question-text{" +
            "line-height:1.7;" +
            "}" +

            ".assessment-navigation{" +
            "display:flex;" +
            "align-items:center;" +
            "justify-content:space-between;" +
            "gap:12px;" +
            "flex-wrap:wrap;" +
            "}" +

            ".progress-container{" +
            "overflow:hidden;" +
            "border-radius:20px;" +
            "}" +

            ".progress-bar{" +
            "transition:width .4s ease;" +
            "}" +

            "@media(max-width:700px){" +

            ".header,.navbar{" +
            "justify-content:center;" +
            "padding:8px;" +
            "}" +

            ".header a,.navbar a,nav a{" +
            "font-size:14px;" +
            "padding:5px 8px;" +
            "}" +

            ".sf6-language-selector{" +
            "margin:5px auto;" +
            "}" +

            ".assessment-navigation{" +
            "justify-content:center;" +
            "}" +

            ".assessment-navigation button{" +
            "min-width:110px;" +
            "}" +

            ".card,.assessment-card{" +
            "width:100%;" +
            "box-sizing:border-box;" +
            "}" +

            "img{" +
            "max-width:100%;" +
            "height:auto;" +
            "}" +

            "}" +

            "@media(max-width:420px){" +

            ".header a,.navbar a,nav a{" +
            "font-size:13px;" +
            "padding:4px 6px;" +
            "}" +

            ".sf6-language-selector{" +
            "width:105px;" +
            "min-width:105px;" +
            "}" +

            ".question-number{" +
            "min-width:105px;" +
            "font-size:12px;" +
            "}" +

            "}";

        document.head.appendChild(style);
    }

    function sf7FinalStart() {
        sf7FinalStyle();

        console.log(
            "SensoFood Piece 7 - COMPLETE"
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            sf7FinalStart
        );
    } else {
        sf7FinalStart();
    }

})();
(function () {
"use strict";
function sf8Language() {
        var lang = localStorage.getItem("sensofood_language");

        if (!lang) {
            lang = "en";
        }

        return lang;
    }

    function sf8Dictionary() {
        return {
            en: {
                "Participant Information": "Participant Information",
                "Participant ID": "Participant ID",
                "Age": "Age",
                "Assessment Status": "Assessment Status",
                "Awaiting data": "Awaiting data",
                "Assessment Information": "Assessment Information",
                "The participant's food-sensory assessment data will appear here":
                    "The participant's food-sensory assessment data will appear here"
            },

            ar: {
                "Participant Information": "معلومات المشارك",
                "Participant ID": "رقم المشارك",
                "Age": "العمر",
                "Assessment Status": "حالة التقييم",
                "Awaiting data": "في انتظار البيانات",
                "Assessment Information": "معلومات التقييم",
                "The participant's food-sensory assessment data will appear here":
                    "ستظهر بيانات التقييم الحسي الغذائي للمشارك هنا"
            },

            fr: {
                "Participant Information": "Informations du participant",
                "Participant ID": "Identifiant du participant",
                "Age": "Âge",
                "Assessment Status": "Statut de l'évaluation",
                "Awaiting data": "En attente des données",
                "Assessment Information": "Informations sur l'évaluation",
                "The participant's food-sensory assessment data will appear here":
                    "Les données de l'évaluation sensorielle alimentaire du participant apparaîtront ici"
            },

            es: {
                "Participant Information": "Información del participante",
                "Participant ID": "ID del participante",
                "Age": "Edad",
                "Assessment Status": "Estado de la evaluación",
                "Awaiting data": "Esperando datos",
                "Assessment Information": "Información de la evaluación",
                "The participant's food-sensory assessment data will appear here":
                    "Los datos de la evaluación sensorial alimentaria del participante aparecerán aquí"
            },

            de: {
                "Participant Information": "Teilnehmerinformationen",
                "Participant ID": "Teilnehmer-ID",
                "Age": "Alter",
                "Assessment Status": "Bewertungsstatus",
                "Awaiting data": "Warten auf Daten",
                "Assessment Information": "Bewertungsinformationen",
                "The participant's food-sensory assessment data will appear here":
                    "Die Daten der sensorischen Lebensmittelbewertung des Teilnehmers werden hier angezeigt"
            },

            it: {
                "Participant Information": "Informazioni del partecipante",
                "Participant ID": "ID partecipante",
                "Age": "Età",
                "Assessment Status": "Stato della valutazione",
                "Awaiting data": "In attesa dei dati",
                "Assessment Information": "Informazioni sulla valutazione",
                "The participant's food-sensory assessment data will appear here":
                    "I dati della valutazione sensoriale alimentare del partecipante appariranno qui"
            },

            tr: {
                "Participant Information": "Katılımcı Bilgileri",
                "Participant ID": "Katılımcı Kimliği",
                "Age": "Yaş",
                "Assessment Status": "Değerlendirme Durumu",
                "Awaiting data": "Veriler bekleniyor",
                "Assessment Information": "Değerlendirme Bilgileri",
                "The participant's food-sensory assessment data will appear here":
                    "Katılımcının gıda duyusal değerlendirme verileri burada görünecektir"
            },

            zh: {
                "Participant Information": "参与者信息",
                "Participant ID": "参与者编号",
                "Age": "年龄",
                "Assessment Status": "评估状态",
                "Awaiting data": "等待数据",
                "Assessment Information": "评估信息",
                "The participant's food-sensory assessment data will appear here":
                    "参与者的食品感官评估数据将在此处显示"
            },

            ja: {
                "Participant Information": "参加者情報",
                "Participant ID": "参加者ID",
                "Age": "年齢",
                "Assessment Status": "評価ステータス",
                "Awaiting data": "データ待ち",
                "Assessment Information": "評価情報",
                "The participant's food-sensory assessment data will appear here":
                    "参加者の食品官能評価データがここに表示されます"
            }
        };
    }
    function sf8TranslateText() {
var lang = sf8Language();
        var dictionaries = sf8Dictionary();
        var dictionary = dictionaries[lang];

        if (!dictionary) {
            dictionary = dictionaries.en;
        }

        var elements = document.querySelectorAll(
            "h1, h2, h3, h4, h5, h6, p, span, label, button, a, div"
        );

        elements.forEach(function (element) {
            if (element.children.length > 0) {
                return;
            }

            var original = element.getAttribute(
                "data-sf8-original"
            );

            if (!original) {
                original = element.textContent.trim();

                if (original) {
                    element.setAttribute(
                        "data-sf8-original",
                        original
                    );
                }
            }

            if (
                original &&
                dictionary[original]
            ) {
                element.textContent =
                    dictionary[original];
            }
        });
    }

    function sf8Direction() {
        var lang = sf8Language();

        if (lang === "ar") {
            document.documentElement.dir = "rtl";
            document.body.dir = "rtl";
        } else {
            document.documentElement.dir = "ltr";
            document.body.dir = "ltr";
        }

        document.documentElement.lang = lang;
    }
    function sf8ParticipantFields() {
var page = window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

        if (page !== "participants.html") {
            return;
        }

        var idText = null;
        var ageText = null;

        var elements = document.querySelectorAll(
            "p, div, span, label, h3, h4"
        );

        elements.forEach(function (element) {
            var text = element.textContent
                .replace(/\s+/g, " ")
                .trim();

            if (
                !idText &&
                (
                    text.indexOf("Participant ID") !== -1 ||
                    text.indexOf("رقم المشارك") !== -1 ||
                    text.indexOf("Identifiant du participant") !== -1 ||
                    text.indexOf("ID del participante") !== -1
                )
            ) {
                idText = element;
            }

            if (
                !ageText &&
                (
                    text.indexOf("Age") !== -1 ||
                    text.indexOf("العمر") !== -1 ||
                    text.indexOf("Âge") !== -1 ||
                    text.indexOf("Edad") !== -1 ||
                    text.indexOf("Alter") !== -1 ||
                    text.indexOf("Età") !== -1
                )
            ) {
                ageText = element;
            }
        });

        if (idText && !document.getElementById("sf8-participant-id")) {
            var idInput = document.createElement("input");

            idInput.id = "sf8-participant-id";
            idInput.type = "text";
            idInput.placeholder = "Participant ID";
            idInput.autocomplete = "off";

            idInput.value =
                localStorage.getItem(
                    "sensofood_participant_id"
                ) || "";

            idInput.addEventListener("input", function () {
                localStorage.setItem(
                    "sensofood_participant_id",
                    this.value
                );
            });

            idText.appendChild(idInput);
        }

        if (ageText && !document.getElementById("sf8-age")) {
            var ageInput = document.createElement("input");

            ageInput.id = "sf8-age";
            ageInput.type = "number";
            ageInput.min = "1";
            ageInput.max = "120";
            ageInput.placeholder = "Age";
            ageInput.autocomplete = "off";

            ageInput.value =
                localStorage.getItem(
                    "sensofood_participant_age"
                ) || "";

            ageInput.addEventListener("input", function () {
                localStorage.setItem(
                    "sensofood_participant_age",
                    this.value
                );
            });

            ageText.appendChild(ageInput);
        }
    }
    function sf8Style() {
if (document.getElementById("sf8-style")) {
            return;
        }

        var style = document.createElement("style");

        style.id = "sf8-style";

        style.textContent =
            "#sf8-participant-id," +
            "#sf8-age{" +
            "display:block;" +
            "width:85%;" +
            "max-width:360px;" +
            "height:42px;" +
            "margin:10px auto;" +
            "padding:8px 14px;" +
            "box-sizing:border-box;" +
            "border:1px solid rgba(80,100,140,.25);" +
            "border-radius:12px;" +
            "background:#fff;" +
            "font-size:16px;" +
            "color:#26354a;" +
            "outline:none;" +
            "}" +

            "#sf8-participant-id:focus," +
            "#sf8-age:focus{" +
            "border-color:rgba(70,110,180,.55);" +
            "box-shadow:0 0 0 3px rgba(70,110,180,.12);" +
            "}" +

            "[dir='rtl'] #sf8-participant-id," +
            "[dir='rtl'] #sf8-age{" +
            "text-align:right;" +
            "}" +

            ".sf6-language-selector{" +
            "z-index:99999;" +
            "}" +

            "@media(max-width:600px){" +
            "#sf8-participant-id," +
            "#sf8-age{" +
            "width:95%;" +
            "}" +
            "}";

        document.head.appendChild(style);
    }

    function sf8Start() {
        sf8Direction();
        sf8TranslateText();
        sf8ParticipantFields();
        sf8Style();

        console.log(
            "SensoFood Piece 8 is working."
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            sf8Start
        );
    } else {
        sf8Start();
    }

})();
(function () {
if (!window.location.pathname.includes("participants")) {
        return;
    }

    function createParticipantForm() {

        /* إخفاء خانات الإدخال القديمة */
        var oldInputs = document.querySelectorAll("input");

        oldInputs.forEach(function (input) {
            input.style.display = "none";

            var parent = input.parentElement;

            if (parent) {
                parent.style.display = "none";
            }
        });

        /* إخفاء معلومات المشارك القديمة في الأسفل */
        var elements = document.querySelectorAll("body *");

        elements.forEach(function (element) {

            var text = element.textContent.trim();

            if (
                text === "Participant ID: —" ||
                text === "Age: —" ||
                text === "Participant ID: -" ||
                text === "Age: -"
            ) {
                element.style.display = "none";
            }

        });

        /* منع إنشاء النموذج أكثر من مرة */
        if (document.getElementById("sfParticipantForm")) {
            return;
        }

        /* إنشاء منطقة إدخال جديدة */
        var form = document.createElement("div");

        form.id = "sfParticipantForm";

        form.style.width = "320px";
        form.style.margin = "30px auto";
        form.style.padding = "20px";
        form.style.borderRadius = "15px";
        form.style.background = "#f7f7fb";
        form.style.boxShadow = "0 5px 20px rgba(0,0,0,0.08)";
        form.style.textAlign = "center";

        form.innerHTML =
            '<h3>Participant Information</h3>' +

            '<input id="sfParticipantIdInput" ' +
            'type="text" ' +
            'placeholder="Participant ID" ' +
            'style="width:90%;padding:12px;margin:8px;border-radius:8px;border:1px solid #ccc;">' +

            '<input id="sfAgeInput" ' +
            'type="number" ' +
            'placeholder="Age" ' +
            'style="width:90%;padding:12px;margin:8px;border-radius:8px;border:1px solid #ccc;">' +

            '<button id="sfSaveParticipant" ' +
            'style="padding:12px 25px;margin-top:10px;border:0;border-radius:8px;cursor:pointer;">' +
            'Save Participant' +
            '</button>';

        /* وضع النموذج في أعلى الصفحة */
        document.body.insertBefore(form, document.body.firstChild);

        /* زر الحفظ */
        document.getElementById("sfSaveParticipant")
            .addEventListener("click", function () {

                var participantId =
                    document.getElementById("sfParticipantIdInput").value.trim();

                var age =
                    document.getElementById("sfAgeInput").value.trim();

                if (!participantId) {
                    alert("Please enter Participant ID");
                    return;
                }

                localStorage.setItem(
                    "sensofood_participant_id",
                    participantId
                );

                localStorage.setItem(
                    "sensofood_participant_age",
                    age
                );

                alert("Participant information saved successfully");
            });
    }

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            createParticipantForm
        );

    } else {

        createParticipantForm();

    }

})();
(function () {
document.addEventListener("click", function (event) {

        if (event.target.id !== "sfSaveParticipant") {
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        var participantId =
            document.getElementById("sfParticipantIdInput").value.trim();

        var age =
            document.getElementById("sfAgeInput").value.trim();

        if (!participantId) {
            alert("Please enter Participant ID");
            return;
        }

        fetch("/api/participant", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                participant_id: participantId,
                age: age
            })
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            if (data.success) {
                alert("Participant saved successfully");
            } else {
                alert(data.message || "Error");
            }

        })
        .catch(function () {
            alert("Could not connect to Python");
        });

    }, true);

})();
(function () {
document.addEventListener("DOMContentLoaded", function () {

        var group =
            document.getElementById("participantGroup");

        if (!group) {
            return;
        }

        group.addEventListener("change", function () {

            localStorage.setItem(
                "sensofood_participant_group",
                group.value
            );

        });

    });

})();
document.addEventListener("DOMContentLoaded", function () {
    var group = document.getElementById("participantGroup");

    if (group) {
        group.style.display = "block";
        group.style.visibility = "visible";
        group.style.opacity = "1";
    }
});
/* Fix remaining English text */
document.addEventListener("DOMContentLoaded", () => {
    const lang = localStorage.getItem("sensofood_language");

    if (!lang) return;

    document.querySelectorAll("*").forEach(el => {
        if (el.children.length === 0 && el.textContent.trim()) {
            el.setAttribute("data-i18n", el.textContent.trim());
        }
    });

    if (typeof applyLanguage === "function") {
        applyLanguage(lang);
    }
}); 
(function () {

    const translations = {
        ar: {
            "Home": "الرئيسية",
            "About": "حول المنصة",
            "Assessment": "التقييم",
            "Results": "النتائج",
            "Dashboard": "لوحة التحكم",
            "Participants": "المشاركون",
            "Food-Sensory Assessment": "التقييم الحسي للغذاء",
            "Please answer each question using the scale from 1 to 5.": "يرجى الإجابة عن كل سؤال باستخدام المقياس من 1 إلى 5.",
            "Olfactory Perception": "الإدراك الشمي",
            "Taste Perception": "إدراك التذوق",
            "Texture and Oral Sensation": "القوام والإحساس الفموي",
            "Temperature Perception": "إدراك درجة الحرارة",
            "Visual Perception": "الإدراك البصري",
            "Finish Assessment": "إنهاء التقييم",
            "Previous": "السابق",
            "Next": "التالي",
            "Finish": "إنهاء",
            "Save": "حفظ",
            "Cancel": "إلغاء",
            "Submit": "إرسال",
            "Continue": "متابعة",
            "Back": "رجوع",
            "Language": "اللغة",
            "Select Language": "اختيار اللغة",
            "Loading": "جار التحميل...",
            "Low": "منخفض",
            "Moderate": "متوسط",
            "High": "مرتفع",
            "Very High": "مرتفع جدًا",
            "Participant": "المشارك",
            "Status": "الحالة",
            "Profile": "الملف الشخصي",
            "Score": "الدرجة",
            "Total Score": "الدرجة الكلية",
            "Question": "السؤال",
            "Answer": "الإجابة",
            "Age": "العمر",
            "Gender": "الجنس",
            "Male": "ذكر",
            "Female": "أنثى",
            "Menu": "القائمة",
            "Close": "إغلاق",
            "Open": "فتح"
        },

        fr: {
            "Home": "Accueil",
            "About": "À propos",
            "Assessment": "Évaluation",
            "Results": "Résultats",
            "Dashboard": "Tableau de bord",
            "Participants": "Participants",
            "Food-Sensory Assessment": "Évaluation sensorielle alimentaire",
            "Olfactory Perception": "Perception olfactive",
            "Taste Perception": "Perception gustative",
            "Texture and Oral Sensation": "Texture et sensation orale",
            "Temperature Perception": "Perception de la température",
            "Visual Perception": "Perception visuelle",
            "Finish Assessment": "Terminer l'évaluation",
            "Previous": "Précédent",
            "Next": "Suivant",
            "Finish": "Terminer",
            "Save": "Enregistrer",
            "Cancel": "Annuler",
            "Submit": "Envoyer",
            "Continue": "Continuer",
            "Back": "Retour",
            "Language": "Langue",
            "Low": "Faible",
            "Moderate": "Modéré",
            "High": "Élevé",
            "Very High": "Très élevé"
        },

        de: {
            "Home": "Startseite",
            "About": "Über uns",
            "Assessment": "Bewertung",
            "Results": "Ergebnisse",
            "Dashboard": "Dashboard",
            "Participants": "Teilnehmer",
            "Food-Sensory Assessment": "Sensorische Lebensmittelbewertung",
            "Olfactory Perception": "Geruchswahrnehmung",
            "Taste Perception": "Geschmackswahrnehmung",
            "Texture and Oral Sensation": "Textur und orale Wahrnehmung",
            "Temperature Perception": "Temperaturwahrnehmung",
            "Visual Perception": "Visuelle Wahrnehmung",
            "Finish Assessment": "Bewertung beenden",
            "Previous": "Zurück",
            "Next": "Weiter",
            "Finish": "Beenden",
            "Save": "Speichern",
            "Cancel": "Abbrechen",
            "Submit": "Absenden",
            "Continue": "Weiter",
            "Back": "Zurück",
            "Language": "Sprache",
            "Low": "Niedrig",
            "Moderate": "Mittel",
            "High": "Hoch",
            "Very High": "Sehr hoch"
        },

        zh: {
            "Home": "首页",
            "About": "关于",
            "Assessment": "评估",
            "Results": "结果",
            "Dashboard": "控制面板",
            "Participants": "参与者",
            "Food-Sensory Assessment": "食品感官评估",
            "Olfactory Perception": "嗅觉感知",
            "Taste Perception": "味觉感知",
            "Texture and Oral Sensation": "质地与口腔感觉",
            "Temperature Perception": "温度感知",
            "Visual Perception": "视觉感知",
            "Finish Assessment": "完成评估",
            "Previous": "上一步",
            "Next": "下一步",
            "Finish": "完成",
            "Save": "保存",
            "Cancel": "取消",
            "Submit": "提交",
            "Continue": "继续",
            "Back": "返回",
            "Language": "语言",
            "Low": "低",
            "Moderate": "中等",
            "High": "高",
            "Very High": "非常高"
        }
    };

    function forceTranslate() {

        const lang = localStorage.getItem("sensofood_language");

        if (!translations[lang]) return;

        const dict = translations[lang];

        document.querySelectorAll("body *").forEach(function (el) {

            if (el.children.length === 0) {

                const text = el.textContent.trim();

                if (dict[text]) {
                    el.textContent = dict[text];
                }

            }

        });

        /* buttons */

        document.querySelectorAll("button, input[type='button'], input[type='submit']").forEach(function (el) {

            const text = (el.innerText || el.value || "").trim();

            if (dict[text]) {

                if (el.tagName === "INPUT") {
                    el.value = dict[text];
                } else {
                    el.innerText = dict[text];
                }

            }

        });

    }

    /* تشغيل الترجمة مباشرة */
    forceTranslate();

    /* إعادة التطبيق عند تغيير الصفحة أو ظهور عناصر جديدة */
    setInterval(forceTranslate, 300);

})();   
/* ===== EXTRA WORDS FIX ===== */
(function () {

    const extra = {
        ar: {
            "Learn More": "اعرف المزيد",
            "Learn more": "اعرف المزيد",
            "Read More": "اقرأ المزيد",
            "Read more": "اقرأ المزيد",
            "Start Assessment": "بدء التقييم",
            "Take Assessment": "إجراء التقييم",
            "View Results": "عرض النتائج",
            "View Details": "عرض التفاصيل",
            "Get Started": "ابدأ الآن",
            "Learn More →": "اعرف المزيد ←",
            "Learn more →": "اعرف المزيد ←"
        },

        fr: {
            "Learn More": "En savoir plus",
            "Learn more": "En savoir plus",
            "Read More": "Lire la suite",
            "Read more": "Lire la suite",
            "Start Assessment": "Commencer l'évaluation",
            "Take Assessment": "Effectuer l'évaluation",
            "View Results": "Voir les résultats",
            "View Details": "Voir les détails",
            "Get Started": "Commencer",
            "Learn More →": "En savoir plus →",
            "Learn more →": "En savoir plus →"
        },

        de: {
            "Learn More": "Mehr erfahren",
            "Learn more": "Mehr erfahren",
            "Read More": "Mehr lesen",
            "Read more": "Mehr lesen",
            "Start Assessment": "Bewertung starten",
            "Take Assessment": "Bewertung durchführen",
            "View Results": "Ergebnisse anzeigen",
            "View Details": "Details anzeigen",
            "Get Started": "Jetzt starten",
            "Learn More →": "Mehr erfahren →",
            "Learn more →": "Mehr erfahren →"
        },

        zh: {
            "Learn More": "了解更多",
            "Learn more": "了解更多",
            "Read More": "阅读更多",
            "Read more": "阅读更多",
            "Start Assessment": "开始评估",
            "Take Assessment": "进行评估",
            "View Results": "查看结果",
            "View Details": "查看详情",
            "Get Started": "开始使用",
            "Learn More →": "了解更多 →",
            "Learn more →": "了解更多 →"
        }
    };

    function fixExtraWords() {

        const lang = localStorage.getItem("sensofood_language");
        const dict = extra[lang];

        if (!dict) return;

        document.querySelectorAll("body *").forEach(function (el) {

            if (el.children.length === 0) {

                const text = el.textContent.trim();

                if (dict[text]) {
                    el.textContent = dict[text];
                }

            }
        });

    }

    fixExtraWords();

    setInterval(fixExtraWords, 500);

})();   
/* ===== GOOGLE TRANSLATE - INDEPENDENT ===== */

(function () {
    if (document.getElementById("google_translate_element")) return;

    const box = document.createElement("div");
    box.id = "google_translate_element";

    box.style.cssText = `
        position: fixed;
        top: 15px;
        right: 15px;
        z-index: 99999;
        background: white;
        padding: 6px 10px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,.15);
    `;

    document.body.appendChild(box);

    window.googleTranslateElementInit = function () {
        new google.translate.TranslateElement(
            {
                pageLanguage: "en",
                includedLanguages: "ar,en,fr,de,es,it,tr,zh-CN,ja",
                autoDisplay: false
            },
            "google_translate_element"
        );
    };

    const script = document.createElement("script");
    script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;

    document.head.appendChild(script);
})();   
(function () {

    function addGoogleTranslate() {

        if (document.getElementById("google_translate_element")) return;

        const oldLanguage =
            document.querySelector(
                'select[id*="language" i], select[class*="language" i], [class*="language-selector"]'
            );

        if (!oldLanguage) return;

        const box = document.createElement("span");

        box.id = "google_translate_element";

        box.style.cssText = `
            display:inline-block;
            margin-left:10px;
            vertical-align:middle;
        `;

        oldLanguage.parentElement.appendChild(box);

        window.googleTranslateElementInit = function () {

            new google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "ar,en,fr,de,es,it,tr,zh-CN,ja",
                    autoDisplay: false
                },
                "google_translate_element"
            );

        };

        const script = document.createElement("script");

        script.src =
            "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

        script.async = true;

        document.head.appendChild(script);
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            addGoogleTranslate
        );
    } else {
        addGoogleTranslate();
    }

})();