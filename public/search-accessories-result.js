window.onload = async () => {
  loadSearchResult();
  const data = await getListings()
  updateResultUI(data)
}
function loadSearchResult() {
  let search = document.querySelector("#search");
  search.value='';
  search.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    //console.log("keyword:", form.keyword.value);

    const resp = await fetch(`/searchAccResults/keyword/${form.keyword.value}`);
    const results = await resp.json();
    //console.log('results:',results)
    

    const searchResultArea = document.querySelector('#accessories-search-result')//("#searchResultArea");

    let allSearchResultArea = document.querySelectorAll(
      "#accessories-search-result div");
      searchResultArea.innerHTML = '';
    //allSearchResultArea.forEach((child) => searchResultArea.removeChild(child));
    for (let result of results.data) {
      const uploadRecordEle = document.createElement("div");
      uploadRecordEle.className = "recordBox";

      const resultImgContainer = document.createElement("div");
      resultImgContainer.className = "resultImgContainer";
      uploadRecordEle.appendChild(resultImgContainer);

      const resultImg = document.createElement("img");
      resultImg.src = `${result.image}`;
      resultImg.alt = `${result.name}`;
      resultImgContainer.appendChild(resultImg);
      console.log("result,img: ", result.image);
      const detailArea = document.createElement("div");
      detailArea.className = "detail-div";
      uploadRecordEle.appendChild(detailArea);

      const resultName = document.createElement("div");
      resultName.className = "resultName";
      resultName.innerHTML = `${result.name}`;
      detailArea.appendChild(resultName);

      const resultPrice = document.createElement("div");
      resultPrice.className = "resultPrice";
      resultPrice.innerHTML = `HK$ ${result.price}`;
      detailArea.appendChild(resultPrice);

      uploadRecordEle.appendChild(detailArea);
      searchResultArea.appendChild(uploadRecordEle);
    }
    
  });
}
async function getListings(){
    const category = "accessories"
    const url = `/getAccessoriesbycategory?category=${category}`
    const respJson = await fetch(url)
    const resp = await respJson.json()
    console.log('server response: ', resp)
    return resp
}

function updateResultUI(inputArray){
  const resultArea = document.querySelector('#accessories-search-result') 
  resultArea.innerHTML = "";
  for (let input of inputArray){
    const itemBox = document.createElement('div');
    itemBox.className = "item-box";
    itemBox.setAttribute("data-id", `${input.id}`);
    itemBox.setAttribute('user-id', `${input.user_id}`);
   

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    const itemImage = document.createElement("img")
    itemImage.src = `./${input.image}`
    itemImage.alt = `alt="${input.name}`
    itemImage.className = "item-image"
    console.log("123",itemImage.src)

    const itemDetails = document.createElement("div");
	  itemDetails.className = "item-info";

    const itemName = document.createElement("div");
    itemName.className = "item-name";
	  itemName.innerText = `${input.name}`;

    const itemCondition = document.createElement("div");
      itemCondition.className = "item-condition";
	  if (input.is_brand_new === true) {
		itemCondition.innerText = "全新"
	  } else {
		itemCondition.innerText = "已用過"
    };

    const priceLikeContainer = document.createElement("div");
    priceLikeContainer.className = "price-like-container";

    const itemPrice = document.createElement("div");
    itemPrice.className = "item-price";
	  itemPrice.innerText = "HK$" + `${input.price}`

    // const likeButton = document.createElement("i")
	  // likeButton.classList.add("bi", "bi-heart")

    resultArea.appendChild(itemBox);
    itemBox.appendChild(imageContainer);
	  imageContainer.appendChild(itemImage)
	  itemBox.appendChild(itemDetails);
	  itemDetails.appendChild(itemName);
	  itemDetails.appendChild(itemCondition);
	  itemDetails.appendChild(priceLikeContainer);
	  priceLikeContainer.appendChild(itemPrice);
	  //priceLikeContainer.appendChild(likeButton)

  }
}

document.querySelector('#accessories-search-result').addEventListener('click', (e) => {
  e.preventDefault();
    const itemDiv = e.target
    const item = itemDiv.closest('.item-box')
    const itemId = item.getAttribute('data-id')
    const userId = Number(item.getAttribute('user-id'));
    
  
    window.location.href = `/item-details.html?listing_id=${itemId}&user_id=${userId}`;
})