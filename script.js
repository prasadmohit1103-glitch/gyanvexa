/* ==========================================
   GYANVEXA — WEBSITE FUNCTIONALITY
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ---------- ELEMENTS ----------

    const welcomeScreen = document.getElementById("welcomeScreen");
    const mainWebsite = document.getElementById("mainWebsite");
    const startLearningButton = document.getElementById(
    "startLearningBtn"
);

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    const resourceSearchForm = document.getElementById(
        "resourceSearchForm"
    );

    const resourceSearchInput = document.getElementById(
        "resourceSearchInput"
    );

    const resourceGrid = document.getElementById("resourceGrid");
    const resourceCards = Array.from(
        document.querySelectorAll(".resource-card")
    );

    const resultCount = document.getElementById("resultCount");
    const noResults = document.getElementById("noResults");
    const clearSearchButton = document.getElementById("clearSearchButton");

    const toast = document.getElementById("toast");


    // ---------- CURRENT YEAR ----------

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    // ---------- WELCOME SCREEN ----------

    function openWebsite() {

        if (!welcomeScreen || !mainWebsite) {
            return;
        }

        welcomeScreen.classList.add("is-hidden");
        mainWebsite.classList.add("is-visible");

        // Remove the welcome screen after its fade animation.
        window.setTimeout(function () {
            welcomeScreen.style.display = "none";
        }, 750);

        // Move keyboard focus to the main content area.
        if (mainWebsite) {
            mainWebsite.setAttribute("tabindex", "-1");
        }

        window.setTimeout(function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }, 100);

    }


    if (startLearningButton) {

        startLearningButton.addEventListener("click", function () {
            openWebsite();
        });

    }


    // ---------- TOAST NOTIFICATION ----------

    let toastTimer;

    function showToast(message) {

        if (!toast) {
            return;
        }

        window.clearTimeout(toastTimer);

        toast.textContent = message;
        toast.classList.add("show");

        toastTimer = window.setTimeout(function () {
            toast.classList.remove("show");
        }, 4200);

    }


    // ---------- MOBILE NAVIGATION ----------

    function closeMobileMenu() {

        if (!menuToggle || !mainNav) {
            return;
        }

        mainNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.textContent = "☰";

        document.body.classList.remove("menu-open");

    }


    if (menuToggle && mainNav) {

        menuToggle.addEventListener("click", function () {

            const menuIsOpen = mainNav.classList.toggle("is-open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(menuIsOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                menuIsOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

            menuToggle.textContent = menuIsOpen ? "✕" : "☰";

            document.body.classList.toggle("menu-open", menuIsOpen);

        });


        // Close the menu after clicking a navigation link.

        const navigationLinks = mainNav.querySelectorAll("a");

        navigationLinks.forEach(function (link) {

            link.addEventListener("click", function () {
                closeMobileMenu();
            });

        });


        // Close the menu if the screen becomes wider.

        window.addEventListener("resize", function () {

            if (window.innerWidth > 800) {
                closeMobileMenu();
            }

        });

    }


    // ---------- ACTIVE NAVIGATION LINK ----------

    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.forEach(function (item) {
                item.classList.remove("active");
            });

            link.classList.add("active");

        });

    });


    // ---------- RESOURCE SEARCH ----------

    function searchResources(searchTerm) {

        const query = searchTerm.trim().toLowerCase();

        let matchingCount = 0;

        resourceCards.forEach(function (card) {

            const keywords = (
                card.getAttribute("data-keywords") || ""
            ).toLowerCase();

            const cardText = card.textContent.toLowerCase();

            const searchableText = keywords + " " + cardText;

            const matches = (
                query === "" ||
                searchableText.includes(query)
            );

            card.classList.toggle("is-hidden", !matches);

            if (matches) {
                matchingCount++;
            }

        });


        // Update the result count.

        if (resultCount) {

            resultCount.textContent =
                matchingCount +
                (matchingCount === 1 ? " resource" : " resources");

        }


        // Display an empty-results message when necessary.

        if (noResults && resourceGrid) {

            noResults.hidden = matchingCount !== 0;
            resourceGrid.hidden = matchingCount === 0;

        }


        return matchingCount;

    }


    // Search when the form is submitted.

    if (resourceSearchForm && resourceSearchInput) {

        resourceSearchForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const query = resourceSearchInput.value.trim();

            searchResources(query);

            if (query === "") {

                showToast("Enter a class, subject, or exam to search.");

                return;

            }

            if (searchResources(query) > 0) {

                showToast(
                    "Found matching learning resources for: " + query
                );

            } else {

                showToast(
                    "No matching resources yet. Try another search term."
                );

            }

        });


        // Update results while the user types.

        resourceSearchInput.addEventListener("input", function () {

            searchResources(resourceSearchInput.value);

        });

    }


    // ---------- POPULAR SEARCH CHIPS ----------

    const searchChips = document.querySelectorAll(".search-chip");

    searchChips.forEach(function (chip) {

        chip.addEventListener("click", function () {

            const query = chip.getAttribute("data-search") || "";

            if (resourceSearchInput) {
                resourceSearchInput.value = query;
            }

            searchResources(query);

            document.getElementById("resources").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });


    // ---------- CLASS / EXAM QUICK LINKS ----------

    const resourceSearchLinks = document.querySelectorAll(
        ".resource-search-link"
    );

    resourceSearchLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            const query = link.getAttribute("data-query");

            if (!query) {
                return;
            }

            if (resourceSearchInput) {
                resourceSearchInput.value = query;
            }

            searchResources(query);

        });

    });


    // ---------- CLEAR SEARCH ----------

    if (clearSearchButton) {

        clearSearchButton.addEventListener("click", function () {

            if (resourceSearchInput) {
                resourceSearchInput.value = "";
            }

            searchResources("");

            document.getElementById("resources").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    }


    // ---------- RESOURCE BUTTONS ----------

    const resourceButtons = document.querySelectorAll(".resource-button");

    resourceButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const resourceName =
                button.getAttribute("data-resource") ||
                "This resource";

            showToast(
                resourceName +
                " is a placeholder in this version. " +
                "Real learning links can be added next."
            );

        });

    });


    // ---------- INITIAL SEARCH STATE ----------

    searchResources("");


});
