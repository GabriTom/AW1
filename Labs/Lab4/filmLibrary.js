"use strict";

//const dayjs=require("dayjs");

//Es1
function Film(id, name, fav = false, date = null, rate = null) {
    this.id = id;
    this.name = name;
    this.fav = fav;
    this.date = date;
    this.rate = rate;

    this.str = function () {
        return `${this.id} ${this.name}: Fav: ${this.fav} Viewed on ${this.date} Rated: ${this.rate}`;
    }
}

function FilmLibrary() {
    this.films = [];

    this.addNewFilm = function (f) {
        this.films.push(f);
    }

    this.str = function () {
        for (let f of this.films) {
            console.log(f.str());
        }
    }

    this.sortByDate = function () {
        let retV = [], retNV = [];
        for (let f of this.films) {
            if (f.date == null) {
                retNV.push(f)
            } else {
                retV.push(f)
            }
        }
        for (let i = 0; i < retV.length; i++) {
            for (let j = i + 1; j < retV.length; j++) {
                if (retV[i].date.diff(retV[j].date) > 0) {
                    let f = retV[j];
                    retV[j] = retV[i];
                    retV[i] = f;
                }
            }
        }
        return retV.concat(retNV);
    };

    this.deleteFilm = function (fId) {
        console.log(`ENtered with id = ${fId}`);
        let i, found = false;
        for (i = 0; i < this.films.length; i++) {
            if (this.films[i].id == fId) {
                found = true;
                break;
            }
        }
        if (found) {
            this.films.splice(i, 1);
        }
        console.log(`No film with ID= ${fId}`);
    };

    this.resetWatchedFilms = function () {
        for (let i = 0; i < this.films.length; i++) {
            if (this.films[i].score != null || this.films[i].date != null) {
                this.films[i].score = null;
                this.films[i].date = null;
            }
        }
    };

    this.getAllFilms = function(){
        this.displayFilms(this.films);
    };

    this.getFavorites = function(){
        this.displayFilms(this.films.filter(e => {
            return e.fav==true;
        }));
    };

    this.getRated = function() {
        this.displayFilms(this.films.filter((e) => {
            if (e != null && e.rate == 5) {
                return e;
            }
        }));
    };

    this.getSeenLastMonth = function() {
        let mindate = dayjs().subtract(30, 'day').format('YYYY/MM/DD');
        this.displayFilms(this.films.filter((e) => {
            if (dayjs(e.date).format('YYYY/MM/DD') > mindate && e.date!=null) {
                return e;
            }
        }));
    };

    this.getUnseen = function(){
        this.displayFilms(this.films.filter((e) => {
            if (e.date == null) {
                return e;
            }
        }));
    };

    this.displayFilms = function(filmsList){
        let ul = document.getElementById('rightMenu');

        if(ul.innerHTML!=null){
            ul.innerHTML=null;
        }

        if(filmsList.length==0){
            ul.innerHTML="No films found.";
        }else{
            filmsList.forEach(e => {
                let li = document.createElement('li');
                li.className = "nav-item";
            
                let table = document.createElement('table');
                table.className = "tFilm";
            
                let tr = document.createElement('tr');
            
                let tdTitle = document.createElement('td');
                //switch tra immagine e titolo, rendila un link
                let tdTrash = document.createElement('img');
                tdTrash.setAttribute('src', './imgs/trash3.svg');
                tdTrash.setAttribute('alt', './imgs/trash3.svg');
                tdTrash.setAttribute('name', 'imgTrash');
                tdTrash.setAttribute('onclick', 'delFilm('+e.id+')');
                tdTitle.innerText = e.name;
                tdTitle.append(tdTrash);
            
                let tdFav = document.createElement('td');
                if (e.fav == true) {
                    tdFav.innerHTML = "<input type=\"checkbox\" checked=\"true\"> Favorite</input>";
                    tdTitle.className = "fTitle fav";
                } else {
                    tdFav.innerHTML = "<input type=\"checkbox\"> Favorite</input>";
                    tdTitle.className = "fTitle";
                }
            
                let tdWDate = document.createElement('td');
                if(e.date!==null){
                    tdWDate.innerText = e.date.format('DD/MM/YYYY');
                }else{
                    tdWDate.innerText = e.date;
                }
            
                let tdRate = document.createElement('td');
                let rateHtml = "";
                for (let i = 0; i < 5; i++) {
                    if (i < e.rate) {
                        rateHtml=rateHtml.concat("<span class=\"star filled\">&#10017;</span>");
                    } else {
                        rateHtml=rateHtml.concat("<span class=\"star\">&#10017;</span>");
                    }
                }
                tdRate.innerHTML = rateHtml;
            
                tr.appendChild(tdTitle);
                tr.appendChild(tdFav);
                tr.appendChild(tdWDate);
                tr.appendChild(tdRate);
            
                table.appendChild(tr);
            
                li.appendChild(table)
            
                ul.appendChild(li);
            });
        }
    };
}

const f1 = new Film(1, "Pulp Fiction", true, dayjs("03/10/2023"), 5);
const f2 = new Film(2, "21 Grams", true, dayjs("01/17/2023"), 4);
const f3 = new Film(3, "Star Wars", false);
const f4 = new Film(4, "Matrix", false);
const f5 = new Film(5, "Shrek", false, dayjs("03/21/2023"), 3);
const fl = new FilmLibrary();
fl.addNewFilm(f1);
fl.addNewFilm(f2);
fl.addNewFilm(f3);
fl.addNewFilm(f4);
fl.addNewFilm(f5);

function changeView(param){
    let title=document.getElementById('rightPTitle');
    if(param=="all"){
        title.innerText="All";
        fl.getAllFilms();
    }else if(param=="fav"){
        title.innerText="Favourites";
        fl.getFavorites();
    }else if(param=="rate"){
        title.innerText="Rated";
        fl.getRated();
    }else if(param=="lm"){
        title.innerText="Viewed last month";
        fl.getSeenLastMonth();
    }else if(param=="unsees"){
        title.innerText="Unseen";
        fl.getUnseen();
    }
}

function delFilm(fId){
    let currentMenu=document.getElementsByClassName('list-group-item-action active')[0];
    fl.deleteFilm(fId);
    currentMenu.click();
}

var leftP = document.getElementById("leftP");
var links = leftP.getElementsByClassName("list-group-item");
for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("active");
        current[0].className = current[0].className.replace(" active", "");
        this.className += " active";
    });
}

changeView('all');

//Extension - Es2
/*console.log("------------------ Es 2 ------------------");
let ordered=fl.sortByDate();
let deleted=fl.deleteFilm(3);
let rated=fl.getRated();
let reseted=fl.resetWatchedFilms();*/