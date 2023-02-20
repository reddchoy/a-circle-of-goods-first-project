window.onload = () => {
	// initLoginForm();
  // loadUserInfo();
	loadListings();
	loadSearchResult()
  
}

// // function initLoginForm() {
// // 	document
// // 		.querySelector('#form-login')
// // 		.addEventListener('submit', async (e) => {
// // 			e.preventDefault()
// // 			const form = e.target
// // 			console.log(`check`)
// // 			const formBody = {
// // 				username: form.username.value,
// // 				password: form.password.value
// // 			}
// // 			const resp = await fetch('/login', {
// // 				method: 'POST',
// // 				headers: {
// // 					'content-type': 'application/json;charset=utf-8'
// // 				},
// // 				body: JSON.stringify(formBody)
// // 			})
// // 			if (resp.status === 200) {
// // 				window.location = '/logined.html'
// // 			} else {
// // 				const data = await resp.json()
// // 				alert(data.message)
// // 			}
// // 		})
// // }


// //<<<<<<< HEAD
// function initLoginForm() {
//     document
//       .querySelector("#form-login")
//       .addEventListener("submit", async (e) => {
//         e.preventDefault();
//         const form = e.target;
//         console.log(`check`)
//         const formBody = {
//           username: form.username.value,
//           password: form.password.value,
//         };
//         const resp = await fetch("/login", {
//           method: "POST",
//           headers: {
//             "content-type": "application/json;charset=utf-8",
//           },
//           body: JSON.stringify(formBody),
//         });
//         if (resp.status === 200) {
//           window.location = "/logined.html";
//         } else {
//           const data = await resp.json();
//           alert(data.message);
//         }
//       });
//   }

//   function initRegisterForm(){
//     document.querySelector("#form-register").addEventListener("submit",async (e)=>{
//       e.preventDefault();
//       const form = e.target;
//       console.log('check register')
//       const formBody = {
//         username: form.username.value,
//         password: form.password.value,
//         email: form.email.value,
//       };
//       const resp = await fetch ("/register",{
//         method: "POST",
//         headers:{
//           "content-type": "application/json;charset=utf-8",
//         },
//         body: JSON.stringify(formBody),
//       });
//       if (resp.status === 200) {
//         window.location = "/logined.html";
//       } else {
//         const data = await resp.json();
//         alert(data.message);
//       }
//     })
//   }


// //<<<<<<< HEAD
// function initLoginForm() {
//     document
//       .querySelector("#form-login")
//       .addEventListener("submit", async (e) => {
//         e.preventDefault();
//         const form = e.target;
//         console.log(`check`)
//         const formBody = {
//           username: form.username.value,
//           password: form.password.value,
//         };
//         const resp = await fetch("/login", {
//           method: "POST",
//           headers: {
//             "content-type": "application/json;charset=utf-8",
//           },
//           body: JSON.stringify(formBody),
//         });
//         if (resp.status === 200) {
//           window.location = "/logined.html";
//         } else {
//           // const data = await resp.json();
//           // alert(data.message);
          
//             const rejectLoginContent = document.createElement('h6');
//             rejectLoginContent.textContent = `Invalid username or password!`;
//             document.querySelector('#rejectLogin').appendChild(rejectLoginContent);
//             // const warning = document.querySelector('#rejectRegister')
//             // console.log('warning:',warning)
//         }
//         }
//       );
//   }
//-----Load Listings Data-----

async function loadListings() {
	const resp = await fetch('/listings');
    const listings = await resp.json();


    const listingArea = document.querySelector("#listing-area");
    listingArea.innerHTML = "";

    for (let listing of listings) {

	  const itemBox = document.createElement("div");
      itemBox.className = "item-box";
      itemBox.setAttribute('listing-id', `${listing.id}`)
	  itemBox.setAttribute('user-id', `${listing.user_id}`)
      
	  const imageContainer = document.createElement("div");
      imageContainer.className = "image-container";

	  const itemImage = document.createElement("img")
      itemImage.src = `./${listing.image}`;
	  itemImage.alt = `alt="${listing.name}`
      itemImage.className = "item-image"

	  
      const itemDetails = document.createElement("div");
	  itemDetails.className = "item-info";

      const itemName = document.createElement("div");
      itemName.className = "item-name";
	  itemName.innerText = `${listing.name}`;

      const itemCondition = document.createElement("div");
      itemCondition.className = "item-condition";
	  if (listing.is_brand_new === true) {
		itemCondition.innerText = "全新"
	  } else {
		itemCondition.innerText = "已用過"
	  };
	  
	  

      const priceLikeContainer = document.createElement("div");
      priceLikeContainer.className = "price-like-container";

	  const itemPrice = document.createElement("div");
      itemPrice.className = "item-price";
	  itemPrice.innerText = "HK$" + `${listing.price}`

	//   const likeButton = document.createElement("i")
	//   likeButton.classList.add("bi", "bi-heart")

      listingArea.appendChild(itemBox);
      itemBox.appendChild(imageContainer);
	  imageContainer.appendChild(itemImage)
	  itemBox.appendChild(itemDetails);
	  itemDetails.appendChild(itemName);
	  itemDetails.appendChild(itemCondition);
	  itemDetails.appendChild(priceLikeContainer);
	  priceLikeContainer.appendChild(itemPrice);
	//   priceLikeContainer.appendChild(likeButton)




	// -- Version 1--
	//   if (listing.is_brand_new.value = true) {
	// 	 condition = "Brand New"
	//   } else {
	// 	condition = "Used"
	//   };

	//   listingArea.innerHTML +=  /*html*/
	//   `<div class="col-md-3 listing-box">
	// 	  <div class="image-container">
	// 		  <img src="./uploads/${listing.image}" alt ="${listing.name}" class="item-image">
	// 	  </div>
	// 	  <div class="item-details">
	// 		  <div class="item-name">${listing.name}</div>
	// 		  <div class="item-condition">${condition}</div>
	// 		  <div class="price-like-container">
	// 			  <div class="item-price">HK$${listing.price}</div>
	// 			  <i class="bi bi-heart"></i>
	// 		  </div>
	// 	  </div>
	//   </div>`

    }
}

//---- Click to specific item for linking to details page----

document.querySelector('#listing-area').addEventListener('click', (e) => {
	
  e.preventDefault();
  const itemDiv = e.target
  const item = itemDiv.closest('.item-box');
  const itemId = item.getAttribute('listing-id')
  const userId = item.getAttribute('user-id')
  console.log(itemId)
  console.log(userId)

  window.location.href = `/item-details.html?listing_id=${itemId}&user_id=${userId}`


})


//---------load search results------------//
function loadSearchResult() {
	let search = document.querySelector("#searchBar");
	
	search.addEventListener("submit", async (e) => {
	  e.preventDefault();
	  const form = e.target;
	  //console.log("keyword:", form.keyword.value);
  
	  const resp = await fetch(`/searchAllResults/keyword/${form.keyword.value}`);
	  const results = await resp.json();
	  //console.log('results:',results)
	  
  
	  const searchResultArea = document.querySelector("#searchResultArea");
  
	  let allSearchResultArea = document.querySelectorAll(
		"#searchResultArea div");
  
	  allSearchResultArea.forEach((child) => searchResultArea.removeChild(child));
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
		resultPrice.innerHTML = `${result.price}`;
		detailArea.appendChild(resultPrice);
  
		uploadRecordEle.appendChild(detailArea);
		searchResultArea.appendChild(uploadRecordEle);
	  }
	  
	});
  }