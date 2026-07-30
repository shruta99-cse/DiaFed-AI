// =====================================================
// DiaFed AI
// Clinical Doctor Dashboard
// =====================================================


// =====================================================
// MOBILE SIDEBAR
// =====================================================

const menuButton =
    document.getElementById("menuButton");

const sidebar =
    document.getElementById("sidebar");


// Open / close sidebar

if (menuButton && sidebar) {

    menuButton.addEventListener("click", () => {

        sidebar.classList.toggle("open");

    });

}


// =====================================================
// CLOSE SIDEBAR AFTER CLICKING NAVIGATION
// =====================================================

const sidebarLinks =
    document.querySelectorAll(".sidebar-link");


sidebarLinks.forEach((link) => {

    link.addEventListener("click", () => {

        if (window.innerWidth <= 768) {

            sidebar.classList.remove("open");

        }

    });

});


// =====================================================
// ACTIVE SIDEBAR LINK
// =====================================================

sidebarLinks.forEach((link) => {

    link.addEventListener("click", () => {

        sidebarLinks.forEach((item) => {

            item.classList.remove("active");

        });

        link.classList.add("active");

    });

});


// =====================================================
// SEARCH SHORTCUT
// Press "/" to focus search
// =====================================================

const searchInput =
    document.querySelector(".search-box input");


document.addEventListener("keydown", (event) => {

    if (
        event.key === "/" &&
        document.activeElement.tagName !== "INPUT"
    ) {

        event.preventDefault();

        if (searchInput) {

            searchInput.focus();

        }

    }

});


// =====================================================
// ESCAPE KEY
// Close mobile sidebar
// =====================================================

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        if (sidebar) {

            sidebar.classList.remove("open");

        }

    }

});