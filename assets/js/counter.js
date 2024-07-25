//get elements from the DOM
const counters = document.querySelectorAll(".counters span")
const container = document.querySelector(".counters")

let activated = false;

// Add scroll event to the page
window.addEventListener("scroll", () => {
    /*If the page is scrolled to the containers element
    and the counters are not activated */
    if(
        pageYOffset > container.offsetTop - container.offsetHeight - 200 
        && activated === false
    ) {
        //select all counters
        counters.forEach(counter => {
            //set counter values to zero
            counter.innerText = 0;
            /*Set count variable to
            track the count*/
            let count = 0;

            //Update count function
            function updateCount() {
                //Get counter target number to count to
                const target = parseInt(counter.dataset.count);
                //As long as the count is below the target number
                if (count < target) {
                    //Increment the count 
                    count++
                    //set the counter text to the count
                    counter.innerText = count;
                    //Repeat this every 10 milliseconds
                    setTimeout(updateCount, 10); /*count speed*/
                // And when the target is reached
                } else {
                    counter.innerText = target;
                }
            }
            //Run the function initially
            updateCount();
            //Set activated to true
            activated = true;
        });
    /*if the page is scrolled back a
    certain amount or to the topand activated is true*/
    } else if(
        pageYOffset < container.offsetTop - container.offsetHeight - 500 
        || pageYOffset === 0 
        && activated === true
    ) {
        //select all counter
        counters.forEach(counter => {
            //Set counter text back to zero
            counter.innerText = 0;
        });
        //set activated to false
        activated = false;
    }
});