const apiKey = "QMkA5-MaRqXGO-QGDsfIcjYmr8jsLcrp8QV7Stna2o8";
const apiUrl = "https://api.unsplash.com/photos";
const searchUrl = "https://api.unsplash.com/search/photos";
const tags = [
  "mountain",
  "wildlife",
  "abstract",
  "technology",
  "fashion",
  "food",
  "adventure",
  "travel",
  "sunset",
];

let currentPage = 1;
let imagesPerPage = 12;

async function getImages() {
  try {
    let res = await fetch(`${apiUrl}?client_id=${apiKey}`);
    return await res.json();
  } catch (error) {
    console.error(error);
  }
}

async function saveDefaultImages() {
  const defaultImages = await getImages(1);
  localStorage.setItem("defaultImages", JSON.stringify(defaultImages));
  return defaultImages;
}

async function searchImage() {
  const searchInput = document.getElementById("searchInput");
  const searchTerm = searchInput.value.trim().toLowerCase();

  let searchImages;

  if (searchTerm) {
    try {
      let res = await fetch(
        `${searchUrl}?query=${searchTerm}&client_id=${apiKey}`
      );
      let data = await res.json();
      searchImages = data.results;
    } catch (error) {
      console.error(error);
    }
  } else {
    searchImages = [];
  }

  const defaultImages = await getDefaultImages();
  const combinedImages = [...searchImages, ...defaultImages];
  localStorage.setItem("searchTerm", searchTerm);
  localStorage.setItem("combinedImages", JSON.stringify(combinedImages));

  renderImages(combinedImages, imagesPerPage, currentPage);
}

function renderTags() {
  const tagsContainer = document.getElementById("tagContainerInner");
  tagsContainer.innerHTML = "";

  tags.forEach((tag) => {
    tagsContainer.innerHTML += `<button class="tag bg-gray-200 text-back px-2 font-medium py-[2px] rounded-lg" onclick="searchImageByTag('${tag}')">${tag}</button>`;
  });
}

async function searchImageByTag(tag) {
  const searchInput = document.getElementById("searchInput");
  searchInput.value = tag;
  await searchImage();
}

// Call renderTags after defining the tags array
renderTags();

async function renderImages(images, perPage, page) {
  try {
    let html = "";
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const displayedImages = images.slice(startIndex, endIndex);
    displayedImages.forEach((image) => {
      let imageHTML = `
          <div class="overflow-hidden bg-gray-100 rounded-3xl shadow-md cursor-pointer overlay-container">
            <a href="${image.links.download}" class="block w-full h-full cursor-pointer">
              <img src="${image.urls.full}" alt="${image.alt_description}" class="w-full h-full object-cover rounded-3xl">
            </a>
          </div>
        `;

      html += imageHTML;
    });

    let imageContainer = document.getElementById("app");
    imageContainer.innerHTML = html;
    renderPagination(images.length);
  } catch (error) {
    console.error(error);
  }
}
function renderPagination(totalImages) {
  const totalPages = Math.ceil(totalImages / imagesPerPage);
  let paginationHtml = "";

  for (let i = 1; i <= totalPages; i++) {
    const isActive = i === currentPage;
    paginationHtml += `<button class="rounded-lg pageBtn px-4 py-2 text-white mx-1 ${
      isActive ? "active" : ""
    }" onclick="changePage(${i})">${i}</button>`;
  }

  let paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = paginationHtml;
}
function changePage(page) {
  currentPage = page;
  const storedSearchTerm = localStorage.getItem("searchTerm");
  const storedImages = localStorage.getItem("combinedImages");
  if (storedImages && storedSearchTerm) {
    const parsedImages = JSON.parse(storedImages);
    renderImages(parsedImages, imagesPerPage, currentPage);
  } else {
    getDefaultImages().then((defaultImages) => {
      localStorage.setItem("defaultImages", JSON.stringify(defaultImages));
      renderImages(defaultImages, imagesPerPage, currentPage);
    });
  }
}

async function getDefaultImages() {
  const storedDefaultImages = localStorage.getItem("defaultImages");
  if (storedDefaultImages) {
    return JSON.parse(storedDefaultImages);
  } else {
    return saveDefaultImages();
  }
}

// Retrieve search term and images from local storage
const storedSearchTerm = localStorage.getItem("searchTerm");
const storedImages = localStorage.getItem("combinedImages");
const imageContainer = document.getElementById("app");

if (storedImages && storedSearchTerm) {
  const parsedImages = JSON.parse(storedImages);
  renderImages(parsedImages, imagesPerPage, currentPage);
} else {
  getDefaultImages().then((defaultImages) => {
    localStorage.setItem("defaultImages", JSON.stringify(defaultImages));
    renderImages(defaultImages, imagesPerPage, currentPage);
  });
}
