function login() {

  const pass =
    document.getElementById("password").value;


  if (pass === "CODE010951") {

    document.getElementById("login").style.display = "none";

    document.getElementById("panel").style.display = "block";


    generateNumber();

    loadCustomers();


  } else {

    alert("كلمة المرور غير صحيحة");

  }

}




document.addEventListener("DOMContentLoaded", () => {

  setTimeout(() => {

    document
      .querySelectorAll("input,select,textarea")
      .forEach(el => {


        el.addEventListener("input", () => {

          if (typeof createQR === "function") {

            createQR();

          }

        });



        el.addEventListener("change", () => {

          if (typeof createQR === "function") {

            createQR();

          }

        });


      });


  },500);


});






document.addEventListener("DOMContentLoaded", () => {


  const btns =
    document.querySelectorAll(".tab-buttons button");


  const sections =
    document.querySelectorAll("[data-tab]");



  btns.forEach((btn,index)=>{


    btn.addEventListener("click",()=>{


      btns.forEach(b=>{

        b.classList.remove("active");

      });



      btn.classList.add("active");



      sections.forEach(sec=>{

        sec.style.display="none";

      });



      if(sections[index]){

        sections[index].style.display="block";

      }


    });


  });



  if(btns.length){

    btns[0].click();

  }


});
