// accordion script
(function () {
    "use strict";
    document.querySelectorAll("[data-accordion]").forEach(dl =>
        dl.addEventListener("click", ({ target }) => {

            if (target.parentElement.classList.contains("active")) {
                target.parentElement.classList.toggle('active');
                return
            }

            document.querySelectorAll(".active").forEach(function (element) {
                if (element.classList.contains("active")) {
                    element.classList.toggle("active");
                }
            });

            // if (!target.matches("button")) return
            target.parentElement.classList.toggle("active")
        })
    )
})();