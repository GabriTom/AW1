import "bootstrap/dist/css/bootstrap.min.css";
import "../../ext/style.css";
import {Container, Button, Form, Table, Modal} from "react-bootstrap";
import { useState } from "react";
import dayjs from "dayjs";
import { useLocation, Link } from "react-router-dom";

function MainView(props){
    return (
    <Container className="align-self-start mt-3 ml-3">
        <MyTitle val={props.filter}/>
        <MyTable filterFunc={props.filterFunc} updateRating={props.updateRating} updateFav={props.updateFav} filter={props.filter} editFilm={props.editFilm} list={props.list} setList={props.setList}></MyTable>
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

    displayList = props.list.filter(filterList);
  
    if (displayList.length == 0) {
      ret = "No films found.";
    } else {
      ret = displayList.map((e) => (<MyRow e={e} updateRating={props.updateRating} delete={deleteRow} edit={props.editFilm} updateFav={props.updateFav} key={e.id}/>));
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
    let score, title, date;
    /*Form fields state*/
    //const [scoreE, setScore] = useState(e.rate);
  
    if (e.rate == null) {
      score = 0;
    } else {
      score = e.rate;
    }

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

    const ratingStars = (id, rate) => {
      let ratingStars = [];
      for (let i = 0; i < 5; i++) {
        if (i < rate) {
          ratingStars.push(<img src="../../ext/imgs/star-fill.svg" alt="star-fill" onClick={() => props.updateRating(id, i+1)} key={i}></img>);
        } else {
          ratingStars.push(<img src="../../ext/imgs/star.svg" alt="star-filled" onClick={() => props.updateRating(id, i+1)} key={i}></img>);
        }
      }
      return ratingStars;
    }

    
  
    return (
      <>
        <tr>
          <td><img src="../ext/imgs/trash3.svg" alt="trash bin" onClick={() => {props.delete(e.id);}}></img></td>
          <td><Link to={`/edit/${e.id}`}><img src="../ext/imgs/pencil.svg" alt="pencil"></img></Link></td>
          {title}
          <td><input type="checkbox" checked={e.fav} onChange={() => {props.updateFav(e.id);}}></input></td>
          <td>{date}</td>
          <td>{ratingStars(e.id, score)}</td>
        </tr>
      </>
    );
  }

  export default MainView;