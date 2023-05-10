import "bootstrap/dist/css/bootstrap.min.css";
import "../../ext/style.css";
import {Col, Container, Row, Button, Form, Table, Figure, Navbar, Modal} from "react-bootstrap";
import { useState } from "react";
import dayjs from "dayjs";
import { Link, useNavigate, useParams } from 'react-router-dom';

function FormView(props){
    props.hide();
    const navigate = useNavigate();
    const { fId } = useParams();

    let frmTitle, crtName, crtFav, crtWDate, crtRate, newFilm, varScore;

    //TRUE case: NEW film - - - | - - - FALSE case: EDIT film
    if(fId == undefined){
      newFilm=true;
      frmTitle="New film";

      crtName='';
      crtFav=false;
      crtWDate=''
      crtRate=0;
    }else{
      newFilm=false;
      //Può essere che la checkbox non funzioni perchè cerco sull'ogetto al posto che sulla list????
      let current = props.list[fId-1];

      frmTitle="Edit film";
      crtName=current.name;
      crtFav=current.fav;
      if(current.date != undefined){
        crtWDate=dayjs(current.date).format("YYYY-MM-DD");
      }else{
        crtWDate=""
      }
      if(current.rate==null){
        varScore=0;
      }else{
        varScore=parseInt(current.rate);
      }
      crtRate=parseInt(varScore);
    }

    const [title, setTitle] = useState(crtName);
    const [fav, setFav] = useState(crtFav);
    const [wdate, setWDate] = useState(crtWDate);
    const [score, setScore] = useState(crtRate);

    const handleTitle = (event) => setTitle(event.target.value);
    const handleFav = (event) => setFav(event.target.checked);
    const handleWDate = (event) => setWDate(event.target.value);
    const handleScore = (event) => setScore(event.target.value);

    function handleSubmit(event) {
        let ok = true;
        let watchDate;
    
        /*Checking fields domain*/
        if (score < 0 || score > 5) {
          ok = false;
        }
        if (title == "") {
          ok = false;
        }
        if (wdate == "") {
          watchDate = null;
        } else {
          watchDate = dayjs(wdate).format("YYYY-MM-DD");
        }
        navigate('/');
        if (ok) {
          const e = {
            id: '',
            name: title,
            fav: fav,
            date: watchDate,
            rate: parseInt(score),
          };
          props.updateFav(fav);
          console.log("e.rate "+e.rate);
          props.updateRating(e.rate);
          if(newFilm){
            e.id=props.list.length+1;
            props.addToList(e);
          }else{
            e.id=fId;
            props.editList(e);
          }
        }
      }

    return (
        <Form style={{marginLeft:'2em', marginTop:'2em', width:'80%'}} onSubmit={handleSubmit}>
            <h1>{frmTitle}</h1>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" required={true} defaultValue={title} onChange={handleTitle} autoFocus/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Watch Date</Form.Label>
              <div className="input-group mb-2">
                <div className="input-group-prepend">
                  <div className="input-group-text">
                    <input type="checkbox" defaultChecked={fav} onChange={handleFav}></input>
                  </div>
                </div>
                <input type="date" className="form-control" defaultValue={wdate} max={dayjs().format("YYYY-MM-DD")} onChange={handleWDate}></input>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Score</Form.Label>
              <div className="form-outline">
                <input type="number" min="0" max="5" defaultValue={score} className="form-control form-icon-trailing" onChange={handleScore}/>
              </div>
            </Form.Group>
            <Link to='/'><Button variant="secondary" onClick={props.show}>Close</Button></Link>
            <Button variant="primary" type="submit">Submit</Button>
        </Form>
    );
}

export default FormView;