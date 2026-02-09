// accordion script
// (function () {
//     "use strict";
//     document.querySelectorAll("[data-accordion]").forEach(dl =>
//         dl.addEventListener("click", ({ target }) => {

//             if (target.parentElement.classList.contains("active")) {
//                 target.parentElement.classList.toggle('active');
//                 return
//             }

//             document.querySelectorAll(".active").forEach(function (element) {
//                 if (element.classList.contains("active")) {
//                     element.classList.toggle("active");
//                 }
//             });

//             // if (!target.matches("button")) return
//             target.parentElement.classList.toggle("active")
//         })
//     )
// })();
(function () {
    "use strict";
    
    document.querySelectorAll("[data-accordion]").forEach(button => {
        button.addEventListener("click", function() {
            const accordion = this.closest(".accordion");
            const isActive = accordion.classList.contains("active");
            
            // Close all other accordions
            document.querySelectorAll(".accordion.active").forEach(item => {
                if (item !== accordion) {
                    item.classList.remove("active");
                    item.querySelector("[data-accordion]").setAttribute("aria-expanded", "false");
                }
            });
            
            // Toggle current accordion
            accordion.classList.toggle("active");
            this.setAttribute("aria-expanded", !isActive);
        });
    });
})();