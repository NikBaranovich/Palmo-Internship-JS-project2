const flipCard = document.getElementsByClassName("flip-card")[0];
const carousel = document.getElementsByClassName("carousel")[0];
console.log();
const carouselInner = document.getElementsByClassName("carousel-inner")[0];

const caoruselButtonPrev = document.getElementsByClassName("carousel-control-prev")[0];
const caoruselButtonNext = document.getElementsByClassName("carousel-control-next")[0];

let rotationDegree = 0;

carouselInner.onclick = (event) => {
  const activeSlide = carouselInner.querySelector(".carousel-item.active");
  const flipCardInner = activeSlide.querySelector(".flip-card-inner");
  rotationDegree = rotationDegree == 0 ? 180 : 0;
  flipCardInner.style.transform = `rotateY(${rotationDegree}deg)`;
};

carousel.addEventListener("slid.bs.carousel", function (e) {
  console.log(carouselInner.childElementCount);
  if (e.direction == "left" && e.to == carouselInner.childElementCount - 1) {
    console.log("End");
    caoruselButtonNext.disabled = true;
  } else {
    caoruselButtonNext.disabled = false;
  }
  if (e.direction == "right" && e.to == 0) {
    console.log("Start");
    caoruselButtonPrev.disabled = true;
  } else {
    caoruselButtonPrev.disabled = false;
  }
});
