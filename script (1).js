let ipad = document.getElementById("ipad");
let detail = document.getElementById("detailsData");
let detailsData = document.getElementById("detailsData");
let getData = document.getElementById("getData");
let mapingArr = document.getElementById("mapingArr");
let dataIsHere = document.querySelector(".dataIsHere");
let search = document.getElementById("search");

let url;
let DetailsArr;

fetch("https://api.ipify.org/?format=json")
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    ipad.innerText = data.ip;
    // token apna use karo
    url = `https://ipinfo.io/${data.ip}?token=${"token"}`;
  })
  .catch((err) => {
    console.log(err);
  });

function gettingData() {
  console.log(url);
  getData.style.display = "none";
  fetch(url)
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      console.log(data);
      navigator.geolocation.getCurrentPosition((position) => {
        fetch(`https://api.postalpincode.in/pincode/${data["postal"]} `)
          .then((res) => {
            return res.json();
          })
          .then((dataDetail) => {
            console.log(dataDetail);
            DetailsArr = dataDetail;
            renderElement(data, position, dataDetail);
            renderDetailItem(DetailsArr);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function renderElement(data, position, dataDetail) {
  let lat = position.coords.latitude;
  let log = position.coords.longitude;
  const mapUrl = `https://maps.google.com/maps?q=${lat},${log}&output=embed`;

  let timez = data["timezone"];
  console.log(timez);

  let chicago_datetime_str = new Date().toLocaleString("en-US", {
    timeZone: timez,
  });

  // create new Date object
  let date_chicago = new Date(chicago_datetime_str);
  console.log(date_chicago.getHours());
  let h = date_chicago.getHours();
  let min = date_chicago.getMinutes();
  let sec = date_chicago.getSeconds();

  let times = h + " - " + min + " - " + sec;
  console.log(times);

  // year as (YYYY) format
  let year = date_chicago.getFullYear();

  // month as (MM) format
  let month = ("0" + (date_chicago.getMonth() + 1)).slice(-2);

  // date as (DD) format
  let date = ("0" + date_chicago.getDate()).slice(-2);
  console.log(date);

  // date time in YYYY-MM-DD format
  let date_time = year + "-" + month + "-" + date;

  // "2021-03-22"
  console.log(date_time);
  // console.log(date_time.getHours());

  detailsData.style.display = "block";
  detailsData.innerHTML = "";

  detailsData.innerHTML = `<div class="uper">
    <div class="fuper">
      <h3 class="lat">Lat: ${position.coords.latitude}</h3>
      <h3 class="city">City: ${data["city"]}</h3>
      <h3 class="org">Organization: ${data["org"]}</h3>
    </div>
    <div class="luper">
      <h3 class="long">Long: ${position.coords.longitude}</h3>
      <h3 class="reg">Region:  ${data["region"]}</h3>
      <h3 class="host">Hostname:</h3>
    </div>
  </div>
  <div class="mid">
  <iframe src=${mapUrl} frameborder="0" class="frames"></iframe>
  </div>
  <div class="lower">
    <h3 class="time_zone">Time Zone: ${data["timezone"]}</h3>
    <h3 class="date_time">Date And Time: ${date_time}  and ${times}</h3>
    <h3 class="pin">Pincode: ${data["postal"]}</h3>
    <h3 class="Message">Message: <span>${dataDetail[0]["Message"]}</span> </h3>
  </div>`;
  mapingArr.style.display = "block";
}

search.addEventListener("input", () => {
  var searchVal = search.value.trim().toLocaleLowerCase();
  let arr = DetailsArr[0]["PostOffice"];
  let filterArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (
      arr[i]["Name"].toLocaleLowerCase().includes(searchVal) ||
      arr[i]["BranchType"].toLocaleLowerCase().includes(searchVal)
    ) {
      console.log(arr[i]);
      filterArr.push(arr[i]);
    }
  }
  // console.log(filterArr);
  displayData(filterArr);
});

function renderDetailItem(Arr) {
  console.log(Arr);
  let dataArr = Arr[0]["PostOffice"];
  console.log(dataArr);
  displayData(dataArr);
}

function displayData(arr) {
  dataIsHere.innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    dataIsHere.innerHTML += `<div class="data-box">
       <div>
       <span class="fs">Name:</span>
       <span class="ls">${arr[i]["Name"]}</span>
       </div>
       <div>
       <span class="fs">Branch Type:</span>
       <span class="ls">${arr[i]["BranchType"]}</span>
       </div>
       <div>
       <span class="fs">Delivery Status:</span>
       <span class="ls">${arr[i]["DeliveryStatus"]}</span>
       </div>
       <div>
       <span class="fs">District:</span>
       <span class="ls">${arr[i]["District"]}</span>
       </div>
       <div>
       <span class="fs">Division:</span>
       <span class="ls">${arr[i]["Division"]}</span>
       </div>
       
       </div>`;
  }
}
