window.onload = () => {
  loadUserInfo();
  loadSavedfavourites();
};

async function loadUserInfo() {
  const resp = await fetch("/userInfo");
  if (resp.status === 200) {
    const user = await resp.json();
    
    const hiTitle = document.createElement("h3");
    hiTitle.textContent = `Hi, ${user.username}`;
    document.querySelector("#hi").appendChild(hiTitle);

    const hiIcon = document.createElement('img');
    
    hiIcon.src = `${user.profile_picture}`;
    hiIcon.alt = `${user.name}`;
   hiIcon.width = 50;
   hiIcon.height = 50;
   
    document.querySelector("#hi-icon-container").appendChild(hiIcon)


  }
}

async function loadSavedfavourites() {
  const resp1 = await fetch("/listings/loadfavoured");
  const favouredItems = await resp1.json();
  console.log("favouredItem: ", favouredItems);

  const resp2 = await fetch("/userInfo/favourites");
  const userFav = await resp2.json();
  console.log("userFav: ", userFav);

  const sliderContainer = document.querySelector("#slider-container");
  //console.log("silderContainer: ", sliderContainer);
  let allSliderContainer = document.querySelectorAll("#slider-container div");
  //console.log("allsilderContainer: ", allSliderContainer);
  allSliderContainer.forEach((child) => sliderContainer.removeChild(child));
  // for (let i = 0; i < favouredItems.length; i++) {
  //   let itemObj = favouredItems[i];
  //   let listing_id = favouredItems[i].listing_id;
  //console.log("listingid", listing_id);
  for (let i = 0; i < userFav.length; i++) {
    let itemObj = userFav[i];
    let listing_id = userFav[i].id;

    // console.log(itemObj )
    // console.log(listing_id)

    const uploadRecordEle = document.createElement("div");
    uploadRecordEle.className = "recordBox";
    uploadRecordEle.setAttribute('listing-id', `${itemObj.id}`)
    uploadRecordEle.setAttribute('listing-user-id', `${itemObj.user_id}`)
    //uploadRecordEle.textContent = listing_id;
    //console.log(listing_id)
    sliderContainer.appendChild(uploadRecordEle);

    const favImgContainer = document.createElement("div");
    favImgContainer.className = "favImgContainer";
    uploadRecordEle.appendChild(favImgContainer);

    const favImage = document.createElement("img");
    favImage.src = `${userFav[i].image}`;
    favImage.alt = `${userFav[i].name}`;
    favImgContainer.appendChild(favImage);

    const detailArea = document.createElement("div");
    detailArea.className = "detail-div";
    uploadRecordEle.appendChild(detailArea);

    const favName = document.createElement("div");
    favName.classList.add("favName");
    favName.innerText = `${userFav[i].name}`;
    detailArea.appendChild(favName);

    const favCondition = document.createElement("div");
    favCondition.classList.add("favCondition");
    if (userFav[i].is_brand_new === true) {
      favCondition.innerText = "全新";
    } else {
      favCondition.innerText = "已用過";
    }
    detailArea.appendChild(favCondition);

    const priceLikeContainer = document.createElement("div");
    priceLikeContainer.className = "price-like-container";
    detailArea.appendChild(priceLikeContainer);

    const favPrice = document.createElement("div");
    favPrice.classList.add("favPrice");
    favPrice.textContent = `HK$ ${userFav[i].price}`;
    priceLikeContainer.appendChild(favPrice);



    // give heart
    const likeButton = document.createElement("i");
    const favouredChecking = favouredItems.filter(
      (item) => item.listing_id === userFav[i].id
    );
    console.log("favouredChecking: ", favouredChecking);
    if (favouredChecking.length > 0) {
      
      likeButton.classList.add(
        "bi",
        "bi-heart-fill",
        "likeIcon",
        "text-danger"
      );
    } else {
      
      likeButton.classList.add("bi", "bi-heart", "likeIcon");
    }
    likeButton.setAttribute("data-id", userFav[i].id);
    likeButton.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      // e.preventDefault()
      e.target.classList.toggle("bi-heart");
      e.target.classList.toggle("bi-heart-fill");
      e.target.classList.toggle("text-danger");
  
      setFavourite(e, listing_id);
    });
    priceLikeContainer.appendChild(likeButton);
  }

  // document.querySelectorAll(".likeIcon").forEach((heartIcon) => {
  //   heartIcon.addEventListener("click", (e) => {
  //     console.log("test")
  //     e.stopImmediatePropagation();
  //     // e.preventDefault()
  //     e.target.classList.toggle("bi-heart");
  //     e.target.classList.toggle("bi-heart-fill");
  //     e.target.classList.toggle("text-danger");
  
  //     setFavourite(e);
  //   });
  // });
}

async function setFavourite(e, listing_id) {
  //   const resp = await fetch("/:listingId/favoured");
  //   const savedFavourite = await resp.json();

  // let is_favoured = false;
  if (e.target.classList === "text-danger" || "bi-heart-fill") {
    // is_favoured = true;
    const url = `/userInfo/favoured/${listing_id}`;
    const resp = await fetch(url);
    const respJson = await resp.json();
  }
}
// allSliderContainer.forEach((child) => sliderContainer.removeChild(child));



document.querySelector('#slider-container').addEventListener('click', (e) => {
	
  e.preventDefault();
  const itemDiv = e.target
  const item = itemDiv.closest('.recordBox');
  const itemId = item.getAttribute('listing-id')
  const userId = item.getAttribute('listing-user-id')
  console.log(itemId)
  console.log(userId)

  window.location.href = `/item-details-with-login.html?listing_id=${itemId}&user_id=${userId}`


})