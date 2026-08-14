function generateNumber() {

  db.ref("customers").once("value")
  .then(function(snapshot) {

    let max = 0;

    snapshot.forEach(function(child) {

      let code = child.key || "";

      if(code.startsWith("CODE")) {

        let num =
        parseInt(code.replace("CODE","")) || 0;

        if(num > max){
          max = num;
        }

      }

    });


    let next = max + 1;


    let input = document.getElementById("id");

    if(input){

      input.value =
      "CODE" + String(next).padStart(3,"0");

    }


  })

  .catch(function(error){

    alert("خطأ في توليد الكود: " + error.message);

  });

}




function loadCustomers(){

  db.ref("customers").once("value")

  .then(function(snapshot){


    const select =
    document.getElementById("customerList");


    if(!select) return;



    select.innerHTML =
    '<option value="">اختر العميل</option>';



    snapshot.forEach(function(child){


      let id = child.key;

      let data = child.val() || {};



      let option =
      document.createElement("option");



      option.value = id;


      option.textContent =
      id + " - " + (data.name || "بدون اسم");



      select.appendChild(option);



    });



  })


  .catch(function(error){

    alert("خطأ تحميل العملاء: " + error.message);

  });

}




function selectCustomer(){

  let id =
  document.getElementById("customerList").value;


  if(id){

    document.getElementById("searchId").value = id;

    loadCustomer();

  }

}




function loadCustomer(){


  let id =
  document.getElementById("searchId").value.trim();



  if(!id){

    alert("اكتب كود العميل");

    return;

  }



  db.ref("customers/" + id)

  .once("value")


  .then(function(snapshot){


    let data = snapshot.val();



    if(!data){

      alert("العميل غير موجود");

      return;

    }



    document.getElementById("id").value=id;

    document.getElementById("name").value=data.name || "";

    document.getElementById("description").value=data.description || "";

    document.getElementById("logo").value=data.logo || "";

    document.getElementById("whatsapp").value=data.whatsapp || "";

    document.getElementById("facebook").value=data.facebook || "";

    document.getElementById("instagram").value=data.instagram || "";

    document.getElementById("website").value=data.website || "";

    document.getElementById("instapay").value=data.instapay || "";

    document.getElementById("vodafonecash").value=data.vodafonecash || "";



    document.getElementById("customerList").value=id;


  })


  .catch(function(error){

    alert("خطأ تحميل العميل: " + error.message);

  });


}





function saveCustomer(){


  let code =
  document.getElementById("id").value.trim();



  if(!code){

    alert("لا يوجد كود للعميل");

    return;

  }



  let data = {


    name:
    document.getElementById("name").value,


    description:
    document.getElementById("description").value,


    logo:
    document.getElementById("logo").value,


    whatsapp:
    document.getElementById("whatsapp").value,


    facebook:
    document.getElementById("facebook").value,


    instagram:
    document.getElementById("instagram").value,


    website:
    document.getElementById("website").value,


    instapay:
    document.getElementById("instapay").value,


    vodafonecash:
    document.getElementById("vodafonecash").value

  };




  db.ref("customers/" + code)

  .set(data)


  .then(function(){


    alert("تم حفظ العميل ✅");


    loadCustomers();

    generateNumber();


  })


  .catch(function(error){

    alert("خطأ الحفظ: " + error.message);

  });



}





function deleteCustomer(){


  let id =
  document.getElementById("id").value.trim();



  if(!id){

    alert("اختر عميل");

    return;

  }



  if(confirm("حذف "+id+" ؟")){


    db.ref("customers/" + id)

    .remove()


    .then(function(){


      alert("تم الحذف ✅");


      loadCustomers();

      generateNumber();



    })


    .catch(function(error){

      alert("خطأ الحذف: " + error.message);

    });


  }

}
