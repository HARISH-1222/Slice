const personForm = document.getElementById("person-form");

const noOfPerson = document.querySelector(".no-of-person");

const inpForCretUser = document.querySelector(".inputForCreatePerson");

noOfPerson.addEventListener("click",createPerson);

async function createPerson(){
    let noOfLenders =  inpForCretUser.value;
    console.log(noOfLenders);
    for(let i=1;i<=noOfLenders;i++){
        personForm.innerHTML += `
        <div class="box">
        <div class="box-title">
          <h2>Person ${i} : </h2>
        </div>
        <form class="personDetail">
        <label>Person ${i} :</label>

        <label>Enter the Name :</label>
        <input class="person-name inp-box" type="text" placeholder="ex : p${i}" ><br>

        <label>Enter the total Money of Lendes : </label>
        <input class="person-totLend inp-box" type="number" placeholder="ex : 130" ><br>

        <lable>Enter the total Money of spend :"</lable>
        <input class="person-acquire inp-box" type="number" placeholder="ex : 13" >
        <button type="submit" class="inner-box">Insert</button>
        <br><br>
        
        </form>
        </div>
        `;
    }
    let AllDatas = await getinput();
// let AllDatas = [

//   {name: 'A', lend: '500', spend: '750'},
//   {name: 'B', lend: '2000', spend: '750'},
//   {name: 'C', lend: '500', spend: '1250'},
//   {name: 'D', lend: '1000', spend: '1750'},
//   {name: 'E', lend: '100', spend: '100'},
//   {name: 'F', lend: '900', spend: '1000'},
//   {name: 'G', lend: '2500', spend: '1900'},
//   {name: 'H', lend: '500', spend: '1250'},
//   {name: 'I', lend: '1000', spend: '525'},
//   {name: 'J', lend: '1000', spend: '725'}
// ]
console.log("after getInput");
    process(AllDatas);
  }


function getinput(){
    return new Promise((resolve, reject) => {
        const forms = document.querySelectorAll(".personDetail");
        let submitCount = 0;
        let allDatas = [];
    
        for (let i = 0; i < forms.length; i++) {
          forms[i].addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(forms[i]);
            const data = Object.fromEntries(formData.entries());
            
            const personName = document.getElementsByClassName("person-name")[i].value;
            const personLend = document.getElementsByClassName("person-totLend")[i].value;
            const personSpend = document.getElementsByClassName("person-acquire")[i].value;
    
            const obj = {
              name: personName,
              lend: personLend,
              spend: personSpend,
                // detail : []
            };
    
            allDatas.push(obj);
            submitCount++;
    
            if (submitCount === forms.length) {
              resolve(allDatas);
            }
          });
        }
      });
    }


function process(AllDatas){
    let sum=0;
    for(let i = 0;i<AllDatas.length;i++){
        let temp =  AllDatas[i].lend - AllDatas[i].spend;
        let tempObj = {balance :temp,givenBy:[],givesTo:[]};
        AllDatas[i].tempObj = tempObj;
        sum+=temp;
    }
    if(sum != 0) {
        alert("Enter the Correct Data !");
        location.reload();
    }
    console.log(AllDatas[0].tempObj.balance);
    // AllDatas.sort((a,b)=>{return (a.tempObj.balance - b.tempObj.balance)});

    console.log(AllDatas);
    
    let wantToGive = [];
    let wantToRecive = [];
    for(let i=0;i<AllDatas.length;i++){
      if(AllDatas[i].tempObj.balance > 0){
        // console.log("wantToRecive : ",AllDatas[i]);
        wantToRecive.push(AllDatas[i]);
      }else if(AllDatas[i].tempObj.balance < 0){
        // console.log("wantToGive : ",AllDatas[i]);
        wantToGive.push(AllDatas[i]);
      }
    }

    wantToGive.sort((a,b)=>{return (a.tempObj.balance - b.tempObj.balance)});
    wantToRecive.sort((a,b)=>{return (a.tempObj.balance - b.tempObj.balance)}).reverse();
    
    console.log("wantToGive : ",wantToGive);

    console.log("wantToRecive :",wantToRecive);

      // for(r in wantToRecive){
    let tempWant = 0;
    // for(let g=0;g< wantToGive.length;g++){
      // console.log(wantToRecive[r].tempObj.balance," - ",AllDatas[g]);
    for(let r=0,g=0;r< wantToRecive.length || g< wantToGive.length;){
      console.log(wantToRecive[r].tempObj.balance+" "+wantToGive[g].tempObj.balance);
        let tempGive = (wantToRecive[r].tempObj.balance) + wantToGive[g].tempObj.balance;
        console.log(tempGive);
        let tempGiven = Math.abs(wantToGive[g].tempObj.balance);
        wantToGive[g].tempObj.balance = 0;
        console.log(tempGiven);
        console.log("\n\n");

        if(tempGive < 0){
          console.log("1 : "+wantToGive[g].name+" "+wantToRecive[r].tempObj.balance+" to "+wantToRecive[r].name);
          wantToRecive[r].tempObj.givenBy.push({"name":wantToGive[g].name,"amount":wantToRecive[r].tempObj.balance});
          wantToGive[g].tempObj.balance = tempGive;
          wantToRecive[r].tempObj.balance = 0;
          r++;
        }else if(tempGive > 0){
          wantToRecive[r].tempObj.balance = tempGive;
          console.log("2 : "+wantToGive[g].name+" "+tempGiven);
          wantToRecive[r].tempObj.givenBy.push({"name":wantToGive[g].name,"amount":tempGiven});
          tempWant=0;
          g++;
        }else{
          wantToRecive[r].tempObj.givenBy.push({"name":wantToGive[g].name,"amount":tempGiven});
          wantToRecive[r].tempObj.balance = 0;
          tempWant=0;
          r++;
          g++;
        }
      }
      // }
      // console.log

    console.log("wantToGive : ",wantToGive);

    console.log("wantToRecive :",wantToRecive);

    const msg = document.getElementById("msg");
    console.log("----------");
    for(let i of wantToRecive){
      for(let j of i.tempObj.givenBy){
        msg.innerHTML += `<h3>${j.name} want to give ${j.amount} to ${i.name}</h3>`;
        console.log(`${j.name} want to give ${j.amount} to ${i.name}`);
      }
    }
}