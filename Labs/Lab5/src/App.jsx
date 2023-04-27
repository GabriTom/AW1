import 'bootstrap/dist/css/bootstrap.min.css';
import '../ext/style.css'
import { Col, Container, Row, Button, Form, Table, Figure, Navbar, Nav } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import { useState } from 'react';
import dayjs from 'dayjs';

function Film(id, name, fav = false, date = null, rate = null) {
  this.id = id;
  this.name = name;
  this.fav = fav;
  this.date = date;
  this.rate = rate;

  this.str = function () {
      return `${this.id} ${this.name}: Fav: ${this.fav} Viewed on ${this.date} Rated: ${this.rate}`;
  }

  this.setFav = function(val) {
    console.log(this.id);
    this.fav=val;
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
  }

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
}

let f1 = new Film(1, "Pulp Fiction", true, dayjs("03/10/2023"), 5);
let f2 = new Film(2, "21 Grams", true, dayjs("01/17/2023"), 4);
let f3 = new Film(3, "Star Wars", false);
let f4 = new Film(4, "Matrix", false);
let f5 = new Film(5, "Shrek", false, dayjs("03/21/2023"), 3);
let fl = new FilmLibrary();
fl.addNewFilm(f1);
fl.addNewFilm(f2);
fl.addNewFilm(f3);
fl.addNewFilm(f4);
fl.addNewFilm(f5);

function App() {
    return (
        <Container fluid className='p-0 m-0 ml-0' style={{height: '100%'}}>
            <Header />
            <MainContent />
            <Footer />
        </Container>
    )
}

function Header() {
    return (
        <Navbar className='bg-primary text-white pt-3'>
            <Container fluid>
                <Row className='d-flex justify-content-between' style={{width: '100%'}}>
                    <Col className='pl-0'>
                        <Figure>
                            <Figure.Image width={22} height={22} style={{paddingTop: '3px', filter:'invert(1)'}} alt="Film library" src="../ext/imgs/collection-play.svg"/>
                        </Figure> Film Library
                    </Col>
                    <Col>
                        <input type='text' placeholder='Search' style={{width: '100%'}}></input>
                    </Col>
                    <Col style={{display:'flex', justifyContent:'flex-end', paddingRight:'0px'}}>
                        <Figure>
                            <Figure.Image width={22} height={22} style={{paddingTop: '3px', filter:'invert(1)'}} alt="User log" src="../ext/imgs/person-circle.svg"/>
                        </Figure>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
}

function MyRow(props){
    const {e} = props;

    let title;
    let rate="";
    let date;

    let chk=<input type="checkbox" checked={e.fav} onChange={() => {props.updateFav(e.id)}}></input>

    if(e.fav){
        title=<td style={{color: 'red'}}>{e.name}</td>
    }else{
        title=title=<td>{e.name}</td>
    }

    if(!e.date){
        date='';
    }else{
        date=dayjs(e.date).format("DD/MM/YYYY");
    }
    for (let i = 0; i < 5; i++) {
        if (i < e.rate) {
            rate=rate.concat('\u2605');
        } else {
            rate=rate.concat('\u2606');
        }
    }
    return (
        <tr>
            {title}
            <td>{chk}</td>
            <td>{date}</td>
            <td>{rate}</td>
        </tr>
    )
}

function MyTitle(props){
    switch(props.val){
        case 'all':{
            return (<h1>All</h1>)
        }
        case 'fav':{
            return (<h1>Favorites</h1>)
        }
        case 'bestRated':{
            return (<h1>Best Rated</h1>)
        }
        case 'seenLastMonth':{
            return (<h1>Seen Last Month</h1>)
        }
        case 'unseen':{
            return (<h1>Unseen</h1>)
        }
    }
}

function MyTable(props){
    const filter = props.filter;

    let filterList;

    function updateFav(id){
        console.log("update on id "+ id);
        props.setList((oldList) => {
            return oldList.map((e) => {
                if(e.id===id){
                    return {...e, fav: !e.fav};
                }else{
                    return e;
                }
            })
        });
    }

    switch(filter){
        case 'all':{
            filterList = (f) => {
                return true;
            }
            break;
        }
        case 'fav':{
            filterList = (f) => {
                console.log(f.str());
                return f.fav;
            }
            break;
        }
        case 'bestRated':{
            filterList = (f) => {
                return f.rate==5;
            }
            break;
        }
        case 'seenLastMonth':{
            filterList = (f) => {
                let mindate = dayjs().subtract(30, 'day').format('YYYY/MM/DD');
                if (dayjs(f.date).format('YYYY/MM/DD') > mindate && f.date!=null) {
                    return f;
                }
            }
            break;
        }
        case 'unseen':{
            filterList = (f) => {
                return f.date==null;
            }
            break;
        }
    }
    return (
    <div>
        <Table>
            <tbody>
                {
                    props.list.filter(filterList).map((e, i) => <MyRow e={e} updateFav={updateFav} key={i}/>)
                }
            </tbody>
        </Table>
    </div>
    )
}

function MainContent() {
    const initialFilter = "all";
    const [filter, setFilter] = useState(initialFilter);
    const [list, setList] = useState(fl.films);

    return (
        <Container className='d-flex justify-content-between p-0 m-0' style={{height:"92.4%"}}>
            <ListGroup defaultActiveKey="#link1" id="leftP" className="p-3" style={{width: "50%", height:"100%"}} variant="flush">
                <ListGroup.Item action href="#link1" onClick={() => setFilter(initialFilter)}>
                    All
                </ListGroup.Item>
                <ListGroup.Item action href="#link2" onClick={() => setFilter('fav')}>
                    Favourite
                </ListGroup.Item>
                <ListGroup.Item action href="#link3" onClick={() => setFilter('bestRated')}>
                    Best rated
                </ListGroup.Item>
                <ListGroup.Item action href="#link4" onClick={() => setFilter('seenLastMonth')}>
                    Seen last month
                </ListGroup.Item>
                <ListGroup.Item action href="#link5" onClick={() => setFilter('unseen')}> 
                    Unseen
                </ListGroup.Item>
            </ListGroup>
            <Container className='align-self-start mt-3 ml-3'>
                <MyTitle val={filter}/>
                <MyTable filter={filter} list={list} setList={setList}></MyTable>
            </Container>
        </Container>
    );
}

function Footer () {
    return (
        <Container fluid>
                <Button id='btnNewFilm'>+</Button>
        </Container>
    );
}

export default App
