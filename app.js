let controller;
let slideScene;

function animateSlides() {
  //init controller
  controller = new ScrollMagic.Controller();
  //select
  const sliders = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav_header");
  //loop over each slide
  sliders.forEach((slide) => {
    const revealImg = slide.querySelector(".reveal_img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal_text");
    //GSAP
    slideTl = gsap.timeline({
      defaults: { duration: 1, ease: "sine" },
    });
    slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%" });
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, "-=1");
    slideTl.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
    slideTl.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.5");
  });
}

animateSlides();
