const apiKey = "QMkA5-MaRqXGO-QGDsfIcjYmr8jsLcrp8QV7Stna2o8";
const apiUrl = "https://api.unsplash.com/photos";
const searchUrl = "https://api.unsplash.com/search/photos";

async function getImages() {
  try {
    let res = await fetch(`${apiUrl}?client_id=${apiKey}`);
    return await res.json();
  } catch (error) {
    console.error(error);
  }
}

async function saveDefaultImages() {
  const defaultImages = await getImages();
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

  renderImages(combinedImages);
}

async function renderImages(images) {
  try {
    let html = "";
    images.forEach((image) => {
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
  } catch (error) {
    console.error(error);
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
  renderImages(parsedImages);
} else {
  // Use default images if no search term is present
  getDefaultImages().then((defaultImages) => {
    localStorage.setItem("defaultImages", JSON.stringify(defaultImages));
    renderImages(defaultImages);
  });
}
