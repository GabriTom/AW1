import "bootstrap/dist/css/bootstrap.min.css";
import "../ext/style.css";
import { Col, Container, Row, Button, Figure, Navbar } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import { useState } from "react";
import dayjs from "dayjs";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

import MainView from "./components/MainView";
import FormView from "./components/FormView";

function Film(id, name, fav = false, date = null, rate = null) {
  this.id = id;
  this.name = name;
  this.fav = fav;
  this.date = date;
  this.rate = rate;

  this.str = function () {
    return `${this.id} ${this.name}: Fav: ${this.fav} Viewed on ${this.date} Rated: ${this.rate}`;
  };
}

function FilmLibrary() {
  this.films = [];

  this.addNewFilm = function (f) {
    this.films.push(f);
  };

  this.str = function () {
    for (let f of this.films) {
      console.log(f.str());
    }
  };

  this.searchId = function(fId){
    let i, found = false;
    for (i = 0; i < this.films.length; i++) {
        if (this.films[i].id == fId) {
            found = true;
            break;
        }
    }
    if (found) {
        return this.films[i];
    }
    //Non dovrebbe capitare
    return null;
  };
}

let f1 = new Film(1, "Pulp Fiction", true, dayjs("03/10/2023"), 5);
let f2 = new Film(2, "21 Grams", true, dayjs("01/17/2023"), 4);
let f3 = new Film(3, "Star Wars", false);
let f4 = new Film(4, "Matrix", false);
let f5 = new Film(5, "Shrek", false, dayjs("03/21/2023"), 3);
let f6 = new Film(6, "sas", false);
let f7 = new Film(7, "ses", false);
let f8 = new Film(8, "sis", false,"",2);
let f9 = new Film(9, "siuuuuuus", false,"",2);
let fl = new FilmLibrary();
fl.addNewFilm(f1);
fl.addNewFilm(f2);
fl.addNewFilm(f3);
fl.addNewFilm(f4);
fl.addNewFilm(f5);
fl.addNewFilm(f6);
fl.addNewFilm(f7);
fl.addNewFilm(f8);
fl.addNewFilm(f9);


/*TO DO:
  - Implementa filtri con URL
*/

function App() {
  const [list, setList] = useState(fl.films);

  /* States of the add form */
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addToList = (e) => {
    setList((oldList) => [...oldList, e]);
  };

  const editList = (e) => {
    setList((oldList) => {
      let i, found = false;
      for (i = 0; i < oldList.length; i++) {
        if (e.id == oldList[i].id) {
          found = true;
          break;
        }
      }
      if (found) {
        oldList[i] = new Film(e.id, e.name, e.fav, e.date, e.rate);
      } else {
        console.log("WTF Non ha trovato il film da modificare ma WTF");
      }
      return [...oldList];
    });
  };  

  return (
    <BrowserRouter>
      <Container fluid className="p-0 m-0 ml-0" style={{ height: "100%" }}>
        <Header />
        <MainContent list={list} fl={fl} show={handleShow} hide={handleClose} addToList={addToList} editList={editList} setList={setList} />
        <Footer list={list} var={show} show={handleShow} hide={handleClose} />
      </Container>
    </BrowserRouter>
  );
}

function Header() {
  return (
    <Navbar className="bg-primary text-white pt-3">
      <Container fluid>
        <Row className="d-flex justify-content-between" style={{ width: "100%" }}>
          <Col className="pl-0">
            <Figure>
              <Figure.Image width={22} height={22} style={{ paddingTop: "3px", filter: "invert(1)" }} alt="Film library" src="../ext/imgs/collection-play.svg"/>
            </Figure>{" "}Film Library
          </Col>
          <Col>
            <input type="text" placeholder="Search" style={{ width: "100%" }} ></input>
          </Col>
          <Col style={{display: "flex", justifyContent: "flex-end", paddingRight: "0px"}}>
            <Figure>
              <Figure.Image width={22} height={22} style={{ paddingTop: "3px", filter: "invert(1)" }} alt="User log" src="../ext/imgs/person-circle.svg"/>
            </Figure>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

function MainContent(props) {
  const url = useLocation();
  let initialFilter = url.pathname.split("/")[1];
  if(initialFilter == undefined || initialFilter == ''){
    initialFilter="all";
  }
  const [filter, setFilter] = useState(initialFilter);

  function updateFav(id) {
    props.setList((oldList) => {
      return oldList.map((e) => {
        if (e.id === id) {
          return { ...e, fav: !e.fav };
        } else {
          return e;
        }
      });
    });
  }

  function updateRating(idF, newScore) {
    props.setList((oldList) => {
      return oldList.map((e) => {
        if (e.id === idF) {
          return { ...e, rate: newScore };
        } else {
          return e;
        }
      });
    });
  }

  return (
    <Container className="d-flex justify-content-between p-0 m-0" style={{ height: "92.4%" }}>
      <LeftMenu filter={filter} setFilter={setFilter}/>
      <Routes>
        <Route path="/" element= {<MainView updateFav={updateFav} updateRating={updateRating} filter={filter} setList={props.setList} list={props.list}/> } />
        <Route path="/all" element= {<MainView updateFav={updateFav} updateRating={updateRating} filter={filter} setList={props.setList} list={props.list}/> } />
        <Route path="/fav" element= {<MainView updateFav={updateFav} updateRating={updateRating} filter={filter} setList={props.setList} list={props.list}/> } />
        <Route path="/bestRated" element= {<MainView updateFav={updateFav} updateRating={updateRating} filter={filter} setList={props.setList} list={props.list}/> } />
        <Route path="/seenLastMonth" element= {<MainView updateFav={updateFav} updateRating={updateRating} filter={filter} setList={props.setList} list={props.list}/> } />
        <Route path="/unseen" element= {<MainView updateFav={updateFav} updateRating={updateRating} filter={filter} setList={props.setList} list={props.list}/> } />
        <Route path="/add" element={ <FormView updateFav={updateFav} updateRating={updateRating} show={props.show} hide={props.hide} list={props.list} addToList={props.addToList}/> }/>
        <Route path="/edit/:fId" element={ <FormView updateFav={updateFav} updateRating={updateRating} show={props.show} fl={props.fl} hide={props.hide} list={props.list} addToList={props.addToList} editList={props.editList}/> }/>
        <Route path="/*" element={ <DefaultRoute /> }/>
      </Routes>
    </Container>
  );
}

function DefaultRoute(){
  return(
    <Container className='App'>
      <h1>No data here...</h1>
      <h2>This is not the route you are looking for!</h2>
      <Link to='/'>Please go back to main page</Link>
    </Container>
  );
}

function LeftMenu(props){
  return(
    <ListGroup defaultActiveKey={props.filter} id="leftP" className="p-3" style={{ width: "50%", height: "100%" }} variant="flush">
      <Link to='/all'><ListGroup.Item action className="leftP item" onClick={() => props.setFilter("all")}>All</ListGroup.Item></Link>
      <Link to='/fav'><ListGroup.Item action className="leftP item" onClick={() => props.setFilter("fav")}>Favourites</ListGroup.Item></Link>
      <Link to='/bestRated'><ListGroup.Item action className="leftP item" onClick={() => props.setFilter("bestRated")}>Best rated</ListGroup.Item></Link>
      <Link to='/seenLastMonth'><ListGroup.Item action className="leftP item" onClick={() => props.setFilter("seenLastMonth")}>Seen last month</ListGroup.Item></Link>
      <Link to='/unseen'><ListGroup.Item action className="leftP item" onClick={() => props.setFilter("unseen")}>Unseen</ListGroup.Item></Link>
    </ListGroup>
  );
}

function Footer(props) {
  let btn;
  let show=props.var;

  if (show) {
    btn = (<Container fluid><Button id="btnNewFilm">+</Button></Container>);
  } else {
    btn = (<Container fluid><Button id="btnNewFilm" style={{ display: "none" }}>+</Button></Container>);
  }

  return (
    <>
      <Link to="/add">{btn}</Link>
    </>
  );
}

export default App;