document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener("DOMContentLoaded", async () => {
        try {
            const response = await fetch('imageConfig.json'); // Assuming you have a JSON file to fetch configurations
            const data = await response.json();
            setupSlider(data.images);
        } catch (error) {
            console.error('Failed to load image configuration:', error);
        }
    });
    
    function setupSlider(images) {
        const slider = document.querySelector('.slider');
        slider.innerHTML = images.map(img => `<img src="${img.src}" alt="${img.alt}" class="doctor-img">`).join('');
        activateSlider();
    }
    
    function activateSlider() {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slider img');
        slides[currentSlide].classList.add('active');
    
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 3000);
    }
    

    // Function to show standard slides (for images, gifs, and videos)
    function showSlides() {
        slides.forEach(slide => slide.style.display = 'none');
        if (slides.length > 0) {
            slides[slideIndex].style.display = 'block';
        }

        // Check if the current slide is the video
        if (slides[slideIndex].contains(videoSlide)) {
            clearTimeout(slideTimer);  // Stop automatic sliding
            videoSlide.play();  // Play the video
            videoSlide.onended = function() {  // When video ends, continue slideshow
                slideTimer = setTimeout(nextSlide, 4000);  // Resume automatic sliding after 4 seconds
            };
        } else if (slides[slideIndex].querySelector('img[src$=".gif"]')) {
            // Handle GIFs
            const gif = slides[slideIndex].querySelector('img[src$=".gif"]');
            getGifDuration(gif.src).then(duration => {
                slideTimer = setTimeout(nextSlide, duration);
            });
        } else {
            slideTimer = setTimeout(nextSlide, 5000);  // Default duration for non-GIF slides
        }
    }

    function nextSlide() {
        slideIndex = (slideIndex + 1) % slides.length;
        showSlides();
    }

    function prevSlide() {
        slideIndex = (slideIndex - 1 + slides.length) % slides.length;
        showSlides();
    }

    function resetTimer() {
        clearTimeout(slideTimer);
        showSlides();
    }

    if (prev) {
        prev.addEventListener('click', function() {
            prevSlide();
            resetTimer();
        });
    }

    if (next) {
        next.addEventListener('click', function() {
            nextSlide();
            resetTimer();
        });
    }

    showSlides();

    // Function to get GIF duration
    function getGifDuration(src) {
        return new Promise((resolve) => {
            let img = new Image();
            img.onload = () => {
                // Approximate duration (assuming 10 frames per second for typical GIFs)
                let duration = (img.naturalWidth / img.width) * 35000; 
                resolve(duration);
            };
            img.src = src;
        });
    }

    // HMO Slideshow functions
    function showHmoSlide(index) {
        hmoSlides.forEach((slide, i) => {
            slide.style.transform = `translateX(${(i - index) * 100}%)`;
        });
    }

    nextHmoButton.addEventListener('click', () => {
        currentHmoIndex = (currentHmoIndex + 1) % hmoSlides.length;
        showHmoSlide(currentHmoIndex);
    });

    prevHmoButton.addEventListener('click', () => {
        currentHmoIndex = (currentHmoIndex - 1 + hmoSlides.length) % hmoSlides.length;
        showHmoSlide(currentHmoIndex);
    });

    // Initialize the HMO slideshow with the first slide visible
    showHmoSlide(currentHmoIndex);

    // Auto-sliding functionality for HMO logos
    function autoSlideHmo() {
        const maxScrollLeft = hmoSlideshow.scrollWidth - hmoSlideshow.clientWidth;
        scrollAmount += 1;  // Adjust this value to control the speed

        if (scrollAmount >= maxScrollLeft) {
            scrollAmount = 0;  // Reset the scroll amount when the end is reached
        }

        hmoSlideshow.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }

    // Start auto-sliding every 20 milliseconds
    autoSlideTimer = setInterval(autoSlideHmo, 20);

    // Dragging functionality for .hmo-slideshow
    let isDown = false;
    let startX;
    let scrollLeft;

    hmoSlideshow.addEventListener('mousedown', (e) => {
        isDown = true;
        hmoSlideshow.classList.add('active');
        startX = e.pageX - hmoSlideshow.offsetLeft;
        scrollLeft = hmoSlideshow.scrollLeft;
        clearInterval(autoSlideTimer); // Pause auto-slide when dragging
    });

    hmoSlideshow.addEventListener('mouseleave', () => {
        isDown = false;
        hmoSlideshow.classList.remove('active');
        autoSlideTimer = setInterval(autoSlideHmo, 20); // Resume auto-slide
    });

    hmoSlideshow.addEventListener('mouseup', (e) => {
        isDown = false;
        hmoSlideshow.classList.remove('active');

        const x = e.pageX - hmoSlideshow.offsetLeft;
        const walk = (x - startX);
        const threshold = hmoSlideshow.clientWidth / 4; // Drag threshold to change slides

        if (walk > threshold) {
            prevHmoButton.click();
        } else if (walk < -threshold) {
            nextHmoButton.click();
        }

        autoSlideTimer = setInterval(autoSlideHmo, 20); // Resume auto-slide
    });

    hmoSlideshow.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - hmoSlideshow.offsetLeft;
        const walk = (x - startX) * 3; // Adjust scroll speed
        hmoSlideshow.scrollLeft = scrollLeft - walk;
    });

    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            backToTopButton.style.display = window.scrollY > 300 ? 'block' : 'none';
        });

        backToTopButton.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = document.getElementById('navigation');

    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', function() {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !expanded);
            navigation.classList.toggle('active');
        });
    }
});




// Doctors

// Add debug logs to confirm event listeners
console.log("Script loaded");

// Handle "Page 2" button click
document.getElementById("page2-btn").addEventListener("click", function () {
    $("#page1-content").fadeOut(function() {
        $("#page2-content").fadeIn();
    });
});

// Handle "Back to Page 1" button click
document.getElementById("back-btn").addEventListener("click", function () {
    $("#page2-content").fadeOut(function() {
        $("#page1-content").fadeIn();
    });
});

function searchSpecialization() {
    const specialization = document.getElementById('specialization').value.toLowerCase();
    
    // Redirect to the search results page with query parameters
    window.location.href = `doctors.html?specialization=${encodeURIComponent(specialization)}`;
}

filterDoctors();

function filterDoctors() {
    var value = findGetParameter('specialization');
debugger;
    if(value != null) {
        
        if(value == 'internal-medical-team') {
            $("#page1-content").show();
            $('#internal-medical-team').show();
            $('#obstetrics-team').hide();
            $('#pediatrician').hide();
            $('#others').hide();
        } else if (value == 'obstetrics-team') {
            $("#page1-content").show();
            $('#internal-medical-team').hide();
            $('#obstetrics-team').show();
            $('#pediatrician').hide();
            $('#others').hide();
        } else if (value == 'pediatrician') {
            $("#page2-content").show();
            $('#internal-medical-team').hide();
            $('#obstetrics-team').hide();
            $('#pediatrician').show();
            $('#others').hide();
        } else if (value == 'others') {
            $("#page2-content").show();
            $('#internal-medical-team').hide();
            $('#obstetrics-team').hide();
            $('#pediatrician').hide();
            $('#others').show();
        }
      
       $(".page-btn").hide();
        

    }
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}



