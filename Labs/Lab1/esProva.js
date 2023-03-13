"use strict";

let vec = ["spring", "s", "it"];

for (let e of vec){
    if (e.length>1){
        console.log(e.slice(0, 2) + e.slice(e.length-2));
    }else{
        console.log("");
    }
}