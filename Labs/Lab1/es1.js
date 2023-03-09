"use strict";
const dayjs=require("dayjs");

//Es1
function Film(id, name, fav=false, date=null, rate=null){
    this.id=id;
    this.name=name;
    this.fav=fav;
    this.date=date;
    this.rate=rate;

    this.str= function(){
        return `${this.id} ${this.name}: Fav: ${this.fav} Viewed on ${this.date} Rated: ${this.rate}`;
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

    this.sortByDate()=function(){};
    this.deletedFilms()=function(){};
    this.resetWatchedFilms()=function(){};
    this.getRated()=function(){};
}

const f1 = new Film(1, "Pulp Fiction", true, dayjs("03/10/2023"), 5);
const f2 = new Film(2, "21 Grams", true, dayjs("03/17/2023"), 5);
const f3 = new Film(3, "Star Wars", false);
const f4 = new Film(4, "Matrix", false);
const f5 = new Film(5, "Shrek", false, dayjs("21/03/2023"), 5);
const fl = new FilmLibrary();
fl.addNewFilm(f1);
fl.addNewFilm(f2);
fl.addNewFilm(f3);
fl.addNewFilm(f4);
fl.addNewFilm(f5);

fl.str();

//Extension - Es2

