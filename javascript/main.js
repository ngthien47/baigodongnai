document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("slider");
  const woodList = document.querySelector(".wood_list");
  const items = document.querySelectorAll(".wood_item");
  const prevBtn = document.querySelector(".slider_btn.prev");
  const nextBtn = document.querySelector(".slider_btn.next");

  if (!items.length) return; // Dừng lại nếu không có item nào

  let currentIndex = 0;
  let itemsToShow = 0;
  let totalItems = items.length;
  let slideWidth = 0;

  function updateSlider() {
    const itemStyle = window.getComputedStyle(items[0]);
    const itemMarginRight = parseFloat(itemStyle.marginRight) || 20;
    slideWidth = items[0].offsetWidth + itemMarginRight;
    itemsToShow = Math.round(slider.offsetWidth / slideWidth);
    let maxIndex = totalItems - itemsToShow;
    if (maxIndex < 0) {
      maxIndex = 0;
    }
    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }
    const offset = -currentIndex * slideWidth;
    woodList.style.transform = `translateX(${offset}px)`;
    updateButtonsState();
  }

  function updateButtonsState() {
    let maxIndex = totalItems - itemsToShow;
    if (maxIndex < 0) {
      maxIndex = 0;
    }
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  nextBtn.addEventListener("click", () => {
    let maxIndex = totalItems - itemsToShow;
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateSlider();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  window.addEventListener("resize", updateSlider);

  // --- PHẦN CODE THÊM VỀ HIỆU ỨNG VUỐT ---

  let isSwiping = false;
  let startX = 0;
  let endX = 0;
  const swipeThreshold = 50; // Khoảng cách vuốt tối thiểu (50px) để tính là next/prev

  // Hàm xử lý khi bắt đầu vuốt/chạm
  function handleSwipeStart(e) {
    isSwiping = true;
    // Lấy tọa độ X ban đầu (cho cả touch và mouse)
    startX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    // Ngăn các hành vi mặc định như kéo-thả ảnh
    e.preventDefault();
  }

  // Hàm xử lý khi kết thúc vuốt/chạm
  function handleSwipeEnd(e) {
    if (!isSwiping) return;
    isSwiping = false;

    // Lấy tọa độ X cuối cùng
    endX = e.type.includes("mouse") ? e.pageX : e.changedTouches[0].clientX;

    const swipeDistance = startX - endX;

    // Nếu vuốt sang trái đủ xa -> Next
    if (swipeDistance > swipeThreshold) {
      nextBtn.click(); // Tái sử dụng logic của nút Next
    }
    // Nếu vuốt sang phải đủ xa -> Prev
    else if (swipeDistance < -swipeThreshold) {
      prevBtn.click(); // Tái sử dụng logic của nút Prev
    }
  }

  // Gắn các sự kiện cho cả chuột và cảm ứng
  woodList.addEventListener("mousedown", handleSwipeStart);
  woodList.addEventListener("mouseup", handleSwipeEnd);
  woodList.addEventListener("mouseleave", () => (isSwiping = false)); // Hủy vuốt khi chuột ra ngoài

  woodList.addEventListener("touchstart", handleSwipeStart, { passive: false });
  woodList.addEventListener("touchend", handleSwipeEnd);

  // --- KẾT THÚC PHẦN CODE VUỐT ---

  // Khởi tạo slider lần đầu
  updateSlider();
});
