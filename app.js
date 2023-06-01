let controller;
let slideScene;
let pageScene;
let detailScene;

//home slide anim
function animateSlides() {
  //init controller
  controller = new ScrollMagic.Controller();
  //select
  const sliders = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav_header");
  //loop over each slide
  sliders.forEach((slide, index, slides) => {
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
    //create Scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .setTween(slideTl)
      /*.addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "slide",
      })*/
      .addTo(controller);
    //new Animation
    const pageTl = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
    //create New Scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      /*.addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "page",
        indent: 200,
      })*/
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addTo(controller);
  });
}
const mouse = document.querySelector(".cursor");
const mouseTxt = mouse.querySelector("span");
const burger = document.querySelector(".burger");
function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}
function activeCursor(e) {
  const item = e.target;
  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav_active");
  } else {
    mouse.classList.remove("nav_active");
  }
  if (item.classList.contains("explore")) {
    mouse.classList.add("explore_active");
    gsap.to(".title_swipe", 1, { y: "0%" });
    mouseTxt.innerText = "Tap";
  } else {
    mouse.classList.remove("explore_active");
    mouseTxt.innerText = "";
    gsap.to(".title_swipe", 1, { y: "100%" });
  }
}
function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "black" });
    gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "black" });
    gsap.to("#logo", 1, { color: "black" });
    gsap.to(".nav_bar", 1.4, { clipPath: "circle(2500px at 100% -10% )" });
    document.body.classList.add("hide");
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".nav_bar", 1.4, { clipPath: "circle(50px at 100% -10% )" });
    document.body.classList.remove("hide");
  }
}
//BarbaJS page transitions
const logo = document.querySelector("#logo");
barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animateSlides();
        logo.href = "./index.html";
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        logo.href = "../index.html";
        detailAnimation();
      },
      beforeLeave() {
        controller.destroy();
        detailScene.destroy();
      },
    },
  ],
  transitions: [
    {
      leave(data) {
        let done = this.async();
        //animation
        const tl = gsap.timeline({ defaults: { ease: "power2inOut" } });
        tl.fromTo(data.current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          { x: "0%", onComplete: done },
          "-=0.5"
        );
      },
      enter(data) {
        let done = this.async();
        //scroll to top
        window.scroll(0, 0);
        //animation
        const tl = gsap.timeline({ defaults: { ease: "power2inOut" } });
        tl.fromTo(
          ".swipe",
          1,
          { x: "0%" },
          { x: "100%", stagger: 0.25, onComplete: done }
        );
        tl.fromTo(data.next.container, 1, { opacity: 0 }, { opacity: 1 });
        tl.fromTo(
          ".nav_header",
          1,
          { y: "-100%" },
          { y: "0%", ease: "power2inOut" },
          "-=1.5"
        );
        tl.fromTo(
          ".model_text h2 span",
          1.2,
          { opacity: 0, y: "-35%" },
          { opacity: 1, y: "0%", ease: Power0 }
        );
        tl.fromTo(
          ".model_text h2",
          1.2,
          { opacity: 0, y: "-35%" },
          { opacity: 1, y: "0%", ease: Power0 },
          "-=1.3"
        );
        tl.fromTo(
          ".detail_slide p",
          1.5,
          { opacity: 0 },
          { opacity: 1, ease: Power0 },
          "-=0.25"
        );
      },
    },
  ],
});
//subpage scroll anim
function detailAnimation() {
  const slides = document.querySelectorAll(".detail_slide");
  slides.forEach((slide, index, slides) => {
    const slideTl = gsap.timeline({ defaults: { duration: 1 } });
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    const nextImg = nextSlide.querySelector("img");
    slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=1");
    slideTl.fromTo(nextImg, { x: "25%", opacity: 0 }, { x: "0%", opacity: 1 });
    slideTl.fromTo(
      ".fashion_text h1",
      { x: "-20%", opacity: 0 },
      { x: "0%", opacity: 1 },
      "-=1.3"
    );
    slideTl.fromTo(
      ".fashion_text p",
      { x: "-20%", opacity: 0 },
      { x: "0%", opacity: 1 },
      "-=1.3"
    );
    //ScrollMagic
    controller = new ScrollMagic.Controller();
    //create Scene
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTl)
      /*.addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "detailScene",
      })*/
      .addTo(controller);
  });
}
//Event listeners
burger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
