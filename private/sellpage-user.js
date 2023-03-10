window.onload = async () => {
  loadUserInfo();
}
//-----------Hi, xxx and icon---------//
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
   hiIcon.className = "icon"
   
    document.querySelector("#hi-icon-container").appendChild(hiIcon)


  }
}

// Preview upload image
const loadFile = function (event) {
  const reader = new FileReader();
  reader.onload = function () {
    const output = document.querySelector(".item-image-box > img");
    console.log(reader.result);
    output.src = reader.result;
  };
  console.log(event.target.files[0]);
  reader.readAsDataURL(event.target.files[0]);
};





// POST ---upload listing---

function oneCheckedBox(checkbox_id) {
    if (document.getElementById(checkbox_id).checked) {
        for (var i = 1; i < 3; i++) {
            document.getElementById("CheckId"+i).checked = false;
        }
        document.getElementById(checkbox_id).checked = true;
    }
}


document.querySelector("#sell-form").addEventListener("submit", async (e) => {

    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData();
    const previewImageBox = document.querySelector('.item-image-box')
  
    formData.append("image", form.image.files[0]);
    formData.append("name", form.name.value);
    formData.append("description", form.description.value);
    formData.append("price", form.price.value);
    formData.append("category", form.category.value)
    formData.append("brand_new", form.brand_new.checked)
    formData.append("used", form.used.checked)
    formData.append("postage", form.postage.checked)
    formData.append("meet_up", form.meet_up.checked)
    formData.append("meet_up_location", form.meet_up_location.value)
    

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: '?????????????????',
      text: "???????????????????????????",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '??????',
      cancelButtonText: '??????',
     
    }).then( async (result) => {
      if (result.isConfirmed) {

        const resp = await fetch("/listings", {
          method: "POST",
          body: formData,
        });
        
    
        const dbResult = await resp.json();
    
        if (resp.status !== 201) {
          alert("Missing Name / Price")
        } else {
          console.log(dbResult);
          form.reset();
        }

        swalWithBootstrapButtons.fire(
          '??????????????????????????????!',
          '??????????????????ACG????????????????????? ',
          'success'
        )
      } else if (
  
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          '?????????',
          '???????????????????????????',
          'error'
        )
      }
    })

    if (!form.image.files[0]) {
      Swal.fire({
        icon: 'error',
        title: '??????...',
        text: '???????????????????????????????????????',
      })
    }

    if (!form.name.value || !form.price.value) {
      Swal.fire({
        icon: 'error',
        title: '??????...',
        text: '??????????????????????????????????????? / ??????',
      })
    }


  
  });