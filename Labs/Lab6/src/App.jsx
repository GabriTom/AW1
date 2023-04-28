import "bootstrap/dist/css/bootstrap.min.css";
import "../ext/style.css";
import {Col, Container, Row, Button, Form, Table, Figure, Navbar, Modal} from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import { useState } from "react";
import dayjs from "dayjs";

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
  const [list, setList] = useState(fl.films);

  const addToList = (e) => {
    console.log(e);
    setList((oldList) => [...oldList, e]);
  };

  const editList = (e) => {
    setList((oldList) => {
      console.log(e);
      let i,
        found = false;
      for (i = 0; i < oldList.length; i++) {
        if (e.id == oldList[i].id) {
          found = true;
          break;
        }
      }
      if (found) {
        oldList[i] = e;
      } else {
        console.log("WTF Non ha trovato il film da modificare ma WTF");
      }
      return [...oldList];
    });
  };

  return (
    <Container fluid className="p-0 m-0 ml-0" style={{ height: "100%" }}>
      <Header />
      <MainContent list={list} editFilm={editList} setList={setList} />
      <Footer addToList={addToList} />
    </Container>
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
  const initialFilter = "all";
  const [filter, setFilter] = useState(initialFilter);

  return (
    <Container className="d-flex justify-content-between p-0 m-0" style={{ height: "92.4%" }}>
      <ListGroup defaultActiveKey="#link1" id="leftP" className="p-3" style={{ width: "50%", height: "100%" }} variant="flush">
        <ListGroup.Item action href="#link1" className="leftP item" onClick={() => setFilter(initialFilter)}>All</ListGroup.Item>
        <ListGroup.Item action href="#link2" className="leftP item" onClick={() => setFilter("fav")}>Favourites</ListGroup.Item>
        <ListGroup.Item action href="#link3" className="leftP item" onClick={() => setFilter("bestRated")}>Best rated</ListGroup.Item>
        <ListGroup.Item action href="#link4" className="leftP item" onClick={() => setFilter("seenLastMonth")}>Seen last month</ListGroup.Item>
        <ListGroup.Item action href="#link5" className="leftP item" onClick={() => setFilter("unseen")}>Unseen</ListGroup.Item>
      </ListGroup>
      <Container className="align-self-start mt-3 ml-3">
        <MyTitle val={filter}/>
        <MyTable filter={filter} editFilm={props.editFilm} list={props.list} setList={props.setList}></MyTable>
      </Container>
    </Container>
  );
}

function MyTitle(props) {
  switch (props.val) {
    case "all": {
      return <h1>All</h1>;
    }
    case "fav": {
      return <h1>Favourites</h1>;
    }
    case "bestRated": {
      return <h1>Best Rated</h1>;
    }
    case "seenLastMonth": {
      return <h1>Seen Last Month</h1>;
    }
    case "unseen": {
      return <h1>Unseen</h1>;
    }
  }
}

function MyTable(props) {
  const filter = props.filter;
  let filterList, displayList, ret;

  function deleteRow(id) {
    props.setList((oldList) => {
      let i,
        found = false;
      for (i = 0; i < oldList.length; i++) {
        if (oldList[i].id == id) {
          found = true;
          break;
        }
      }
      if (found) {
        const x = oldList.splice(i, 1);
      }
      return [...oldList];
    });
  }

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

  switch (filter) {
    case "all": {
      filterList = (f) => {
        return true;
      };
      break;
    }
    case "fav": {
      filterList = (f) => {
        return f.fav;
      };
      break;
    }
    case "bestRated": {
      filterList = (f) => {
        return f.rate == 5;
      };
      break;
    }
    case "seenLastMonth": {
      filterList = (f) => {
        let mindate = dayjs().subtract(30, "day").format("YYYY/MM/DD");
        if (dayjs(f.date).format("YYYY/MM/DD") > mindate && f.date != null) {
          return f;
        }
      };
      break;
    }
    case "unseen": {
      filterList = (f) => {
        return f.date == null;
      };
      break;
    }
  }

  displayList = props.list.filter(filterList)

  if (displayList.length == 0) {
    ret = "No films found.";
  } else {
    ret = displayList.map((e, i) => (<MyRow e={e} delete={deleteRow} edit={props.editFilm} updateFav={updateFav} key={i}/>));
  }

  return (
    <div>
      <Table>
        <tbody>{ret}</tbody>
      </Table>
    </div>
  );
}

function MyRow(props) {
  const { e } = props;

  let scoreEdit, title, rate="", date;

  //States used to display modal
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /*Form fields state*/
  const [titleE, setTitle] = useState(e.name);
  const [favE, setFav] = useState(e.fav);
  const [wdateE, setWDate] = useState(e.date);
  const [scoreE, setScore] = useState(e.rate);

  const handleTitle = (event) => setTitle(event.target.value);
  const handleFav = (event) => setFav(event.target.value);
  const handleWDate = (event) => setWDate(event.target.value);
  const handleScore = (event) => setScore(event.target.value);

  if (scoreE == null) {
    scoreEdit = 0;
  } else {
    scoreEdit = scoreE;
  }

  let chk = (
    <input type="checkbox" checked={e.fav} onChange={() => {props.updateFav(e.id);}}></input>
  );

  if (e.fav) {
    title = <td style={{color: "red"}}>{e.name}</td>;
  } else {
    title = <td>{e.name}</td>;
  }

  if (!e.date) {
    date = "";
  } else {
    date = dayjs(e.date).format("DD/MM/YYYY");
  }
  for (let i = 0; i < 5; i++) {
    if (i < e.rate) {
      rate = rate.concat("\u2605");
    } else {
      rate = rate.concat("\u2606");
    }
  }

  function handleEditSubmit() {
    let ok = true, watchDate;

    /*Checking fields domain*/
    if (scoreE < 0 || scoreE > 5) {
      ok = false;
    } else if (scoreE == NaN) {
      //varScore=0;
    }
    if (favE == "on") {
      varFav = true;
    } else {
      varFav = false;
    }
    if (titleE == "") {
      ok = false;
    }
    if (wdateE == "" || wdateE == null) {
      watchDate = "";
    } else {
      watchDate = dayjs(wdateE).format("MM/DD/YYYY");
    }
    if (ok) {
      const e = {
        id: props.e.id,
        name: titleE,
        fav: favE,
        date: watchDate,
        rate: parseInt(scoreE),
      };
      console.log(e);
      props.edit(e);
      handleClose();
    }
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>New Film</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" defaultValue={titleE} required={true} onChange={handleTitle} autoFocus/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Watch Date</Form.Label>
              <div className="input-group mb-2">
                <div className="input-group-prepend">
                  <div className="input-group-text">
                    <input type="checkbox" checked={favE} onChange={handleFav}></input>
                  </div>
                </div>
                <input type="date" className="form-control" max={dayjs().format("YYYY-MM-DD")} defaultValue={dayjs(wdateE).format("YYYY-MM-DD")} onChange={handleWDate}></input>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Score</Form.Label>
              <div className="form-outline">
                <input type="number" min="0" max="5" step="1" defaultValue={scoreEdit} className="form-control form-icon-trailing" onChange={handleScore}/>
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" type="submit">Submit</Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <tr>
        <td><img src="../ext/imgs/trash3.svg" alt="trash bin" onClick={() => {props.delete(e.id);}}></img></td>
        <td><img src="../ext/imgs/pencil.svg" alt="pencil" onClick={handleShow}></img></td>
        {title}
        <td>{chk}</td>
        <td>{date}</td>
        <td>{rate}</td>
      </tr>
    </>
  );
}

function Footer(props) {
  let btn;
  //Statse used to display input form
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  /*Form fileds state*/
  const [title, setTitle] = useState("");
  const [fav, setFav] = useState(false);
  const [wdate, setWDate] = useState("");
  const [score, setScore] = useState(0);

  const handleTitle = (event) => setTitle(event.target.value);
  const handleFav = (event) => setFav(event.target.value);
  const handleWDate = (event) => setWDate(event.target.value);
  const handleScore = (event) => setScore(event.target.value);

 

  if (show) {
    btn = (<Container fluid><Button id="btnNewFilm" style={{ display: "none" }} onClick={handleShow}>+</Button></Container>);
  } else {
    btn = (<Container fluid><Button id="btnNewFilm" onClick={handleShow}>+</Button></Container>);
  }

  function handleSubmit(event) {
    let ok = true;
    let watchDate, varFav, varScore;

    /*Checking fields domain*/
    if (score < 0 || score > 5) {
      ok = false;
    } else if (score == NaN) {
      //varScore=0;
    }
    if (fav == "on") {
      varFav = true;
    } else {
      varFav = false;
    }
    if (title == "") {
      ok = false;
    }
    if (wdate == "") {
      watchDate = null;
    } else {
      watchDate = dayjs(wdate).format("MM/DD/YYYY");
    }
    if (ok) {
      const e = {
        id: fl.length,
        name: title,
        fav: varFav,
        date: watchDate,
        rate: parseInt(score),
      };
      console.log(e);
      props.addToList(e);
      handleClose();
    }
  }

  return (
    <>
      {btn}
      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>New Film</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" required={true} onChange={handleTitle}autoFocus/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Watch Date</Form.Label>
              <div className="input-group mb-2">
                <div className="input-group-prepend">
                  <div className="input-group-text">
                    <input type="checkbox" onChange={handleFav}></input>
                  </div>
                </div>
                <input type="date" className="form-control" max={dayjs().format("YYYY-MM-DD")} onChange={handleWDate}></input>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Score</Form.Label>
              <div className="form-outline">
                <input type="number" min="0" max="5" defaultValue="0" className="form-control form-icon-trailing" onChange={handleScore}/>
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default App;