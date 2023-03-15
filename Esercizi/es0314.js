"use strict";
const sqlite = require('sqlite');

//Asynchronous programming
const sussi=function(){
    console.log("AAAAAAAAAAAAAAAAAAAAAses");
}
setTimeout(sussi, 2000);

//SQLite programming
const db = new sqlite.Database('exams.sqlit', (err) => { if (err) throw err; });
let result = [];
let sql = "SELECT * FROM course LEFT JOIN score ON course.code=score.coursecode" ;

db.all(sql, (err,rows)=>{
    if(err) throw err ;
    for (let row of rows) {
        console.log(row);
        result.push(row);
    }
});
/*
Se qua non aspettassi lui va avanti, quindi mi stampa
******** e non la risposta del server perchè essa è gestita in maniera asincrona
*/

//Questa cosa si risolve con le promise.
console.log('*************');
for (let row of result) {
    console.log(row);
}
console.log('****** END OF DB ******');