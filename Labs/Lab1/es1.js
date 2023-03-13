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

    this.sortByDate()=function(){
        let i, j, k, film;
        let ret=[];
        for(i=0; i<this.films.lenght; i++){
            film=this.films[i];
            if(film.date==null){
                //E' giusto questo continue???
                continue;
            }
            k=i;
            for (j=i+1; j<this.films.lenght; j++){
                if(this.films[i].date.diff(this.films[j].date)>0){
                    film=this.films[j];
                    k=j;
                }
            }
            ret.push(film);
            this.films.splice(k);
        }
        return ret;
    };

    this.deleteFilm(fId)=function(){
        for(let i=0; i<this.films.length; i++){
            if(this.films[i].id==fid){
                this.films.splice(i);
                break;
            }
        }
        console.log(`No film with ID= ${fId}`);
    };

    this.resetWatchedFilms()=function(){
        for(let i=0; i<this.films.length; i++){
            if(this.films[i].score!=null){
                this.films[i].score=null;
            }
        }
    };

    this.getRated()=function(){
        return this.films.filter((e)=>e.score!=null);
    };
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

fl.sortByDate().str();
fl.deleteFilm(3);
fl.str();
fl.getRated().str();
fl.resetWatchedFilms();
fl.str();