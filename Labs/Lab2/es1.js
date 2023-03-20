"use strict";
const sqlite=require("sqlite3");
const dayjs=require("dayjs");

function Film(id, title, fav=false, date=null, rate=null){
    this.id=id;
    this.title=title;
    this.fav=fav;
    this.date=date;
    this.rate=rate;

    this.str= function(){
        return `${this.id} ${this.title}: Fav: ${this.fav} Viewed on ${this.date} Rated: ${this.rate}`;
    }
}

function FilmLibrary(){
    this.films=[];

    this.addNewFilm= function(f){
        this.films.push(f);
    }

    this.str=function(){
        for(let f of this.films){
            console.log(f.str());
        }
    }

    this.sortByDate=function(){
        let retV=[], retNV=[];
        for(let f of this.films){
            if(f.date==null){
                retNV.push(f)
            }else{
                retV.push(f)
            }
        }
        for(let i=0; i<retV.length; i++){
            for(let j=i+1; j<retV.length; j++){
                if(retV[i].date.diff(retV[j].date)>0){
                    let f=retV[j];
                    retV[j]=retV[i];
                    retV[i]=f;
                }
            }
        }
        return retV.concat(retNV);
    };

    this.deleteFilm=function(fId){
        let i, found=false;
        for(i=0; i<this.films.length; i++){
            if(this.films[i].id==fId){
                found=true;
                break;
            }
        }
        if(found){
            this.films.splice(i, 1);
        }
        console.log(`No film with ID= ${fId}`);
    };

    this.resetWatchedFilms=function(){
        for(let i=0; i<this.films.length; i++){
            if(this.films[i].score!=null || this.films[i].date!=null){
                this.films[i].score=null;
                this.films[i].date=null;
            }
        }
    };

    this.getRated=function(){
        return this.films.filter((e)=>{
            if(e!=null && e.date!=null){
                return e;
            }
        });
    };
}

async function query(db, query, params){
    return new Promise((resolve, reject)=>{
        let result=[];
        if(Array.isArray(params)){
            db.all(sql,... params, (err, rows)=>{
                if(err){
                    reject(err);
                }else{
                    if(Array.isArray(rows)){
                        for (let row of rows) {
                            let f=new Film(row.id, row.title, row.favorite, row.watchdate, row.rating);
                            result.push(f);
                        }
                    }else if(typeof rows=="undefined"){
                        console.log(`No rows found.`);
                    }else{
                        let f=new Film(rows.id, rows.title, rows.favorite, rows.watchdate, rows.rating);
                        result.push(f);
                    }
                    resolve(result);
                }
            });
        }else{
            db.all(query, params, (err, rows)=>{
                if(err){
                    reject(err);
                }else{
                    if(Array.isArray(rows)){
                        if(rows.length==0){
                            console.log(`No rows found.`);
                        }else{
                            for (let row of rows) {
                                let f=new Film(row.id, row.title, row.favorite, row.watchdate, row.rating);
                                result.push(f);
                            }
                        }
                    }else if(typeof rows=="undefined"){
                        console.log(`No rows found.`);
                    }else{
                        let f=new Film(rows.id, rows.title, rows.favorite, rows.watchdate, rows.rating);
                        result.push(f);
                    }
                    resolve(result);
                }
            });
        }
    });
}

async function storeDel(db, stmt){
    return new Promise((resolve, reject)=>{
        let sql = db.run(stmt, null, function (err, ret){
            if(err){
                reject(err);
            }else{
                resolve(ret);
            }
        });
    });
}

async function readAll(db){
    return query(db, "SELECT * FROM films");
}

async function readFavorites(db){
    return query(db, "SELECT * FROM films WHERE favorite<>0");
}

async function readWatchedDate(db, date){
    return query(db, "SELECT * FROM films WHERE watchdate=?", date);
}

async function readWatchedBeforeDate(db, date){
    return query(db, "SELECT * FROM films WHERE watchdate<=?", date);
}

async function readOverRating(db, rate){
    return query(db, "SELECT * FROM films WHERE rating>=?", rate);
}

async function readOverSubstring(db, subStr){
    let result=[];
    let rows=await query(db, "SELECT * FROM films");
    if(Array.isArray(rows)){
        for (let row of rows) {
            if(row.title.toLowerCase().includes(subStr.toLowerCase())){
                let f=new Film(row.id, row.title, row.favorite, row.watchdate, row.rating);
                result.push(f);
            }
        }
    }else if(typeof rows=="undefined"){
        console.log(`No film containing ${subStr}.`);
    }else{
        if(row.title.toLowerCase().includes(subStr.toLowerCase())){
            let f=new Film(rows.id, rows.title, rows.favorite, rows.watchdate, rows.rating);
            result.push(f);
        }
    }
    return result;
}

async function main(){
    //const fl=new FilmLibrary();
    //Es 1
    const db = new sqlite.Database('films.db', (err) => { if (err) throw err; });
    console.log("Tu no fa cassino: readALL");
    let ret = await readAll(db);
    ret.forEach((f)=>console.log(f.str()));
    console.log("\nTu no fa cassino: readFavorites");
    let ret1 = await readFavorites(db);
    ret1.forEach((f)=>console.log(f.str()));
    console.log("\nTu no fa cassino: readWatchedDate");
    let ret2 = await readWatchedDate(db, dayjs().format("YYYY-MM-DD"));
    ret2.forEach((f)=>console.log(f.str()));
    console.log("\nTu no fa cassino: readWatchedBeforeDate");
    let ret3 = await readWatchedBeforeDate(db, dayjs().format("YYYY-MM-DD"));
    ret3.forEach((f)=>console.log(f.str()));
    console.log("\nTu no fa cassino: readOverRating");
    let ret4 = await readOverRating(db, 4);
    ret4.forEach((f)=>console.log(f.str()));
    console.log("\nTu no fa cassino: readOverSubstring");
    let ret5 = await readOverSubstring(db, "mat");
    ret5.forEach((f)=>console.log(f.str()));

    //Es 2
    storeDel(db, `INSERT INTO films (title, favorite, watchdate, rating) VALUES ${"Back to the future"}, ${1}, ${null}, ${5}`);
    console.log("\nTu no fa cassino: readALL");
    ret = await readAll(db);
    ret.forEach((f)=>console.log(f.str()));
    db.close();
}

main();