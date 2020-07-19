import React, { Component } from 'react';

import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

const urlPost="https://camilo12345.000webhostapp.com/insert.php";
const urlDelete="https://camilo12345.000webhostapp.com/delete.php";
const urlGet="https://camilo12345.000webhostapp.com/read.php";
const urlPut="https://camilo12345.000webhostapp.com/update.php";




class Appp extends Component{
  

  state={
    data:[],
    modalInsertar:false,
    modalEliminar:false,
    form:{
      id:'',
      namee:'',
      usernamee:'',
      tipoModal:'',
    }
  }

  peticionGet=()=>{
    axios.get(urlGet).then(response=>{
      this.setState({data:response.data});
    }).catch(error=>{
      console.log(error.message);
    })
  }
  modalInsertar=()=>{
    this.setState({modalInsertar:!this.state.modalInsertar});
  }
  handleChange=async e=>{
    e.persist();
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }
  peticionPost= async ()=>{
    delete this.state.form.id;
    await axios.post(urlPost,this.state.form).then(response=>{
      this.modalInsertar();
      this.peticionGet();
    }).catch(error=>{
      console.log(error.message);
    })
  }
  peticionPut=()=>{
    axios.put(urlPut+this.state.form.id, this.state.form).then(response=>{
      this.modalInsertar();
      this.peticionGet();
    })
  }
  peticionDelete=()=>{
    axios.delete(urlDelete+this.state.form.id).then(response=>{
      this.setState({modalEliminar:false});
      this.peticionGet();
    })
  }
  seleccionarUser=(user)=>{
    this.setState({
      tipoModal: 'actulizar',
      form:{
        id: user.id,
        namee: user.namee,
        usernamee: user.usernamee
      }
    })
  }

  componentDidMount(){
    this.peticionGet();
  }

  render(){
    const {form}=this.state;
  return (
    <div className="App">
      <br/>
      <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal:'insertar'}); this.modalInsertar()}}>agregar usuario</button>
      <br/><br/>
      <table className="table">
        <thead>
          <tr>
            <th>id</th>
            <th>namee</th>
            <th>usernamee</th>
            <th>acciones</th>
          </tr>
        </thead>
        <tbody>
          {this.state.data.map(user=>{
            return(
              <tr>
                <td>{user.id}</td>
                <td>{user.namee}</td>
                <td>{user.usernamee}</td>
                <td>
                  <button className="btn btn-primary" onClick={()=>{this.seleccionarUser(user); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                  {'   '}
                  <button className="btn btn-danger" onClick={()=>{this.seleccionarUser(user); this.setState({modalEliminar:true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                </td>
              </tr>

            )
          })}
        </tbody>
      </table>


      <Modal isOpen={this.state.modalInsertar}>
        <ModalHeader style={{display:'block'}}>
          <span style={{float:'right'}}>x</span>
        </ModalHeader>
      
      <ModalBody>
        <div className="form-group">
          <label htmlFor='id'>id</label>
          <input className='form-control' type='text' name='id' id='id' readOnly onChange={this.handleChange} value={form ? form.id: this.state.data.length+1}/>
          <br/>
          <label htmlFor='namee'>namee</label>
          <input className='form-control' type='text' name='namee' id='namee' onChange={this.handleChange} value={form?form.namee : ''}/>
          <br/>
          <label htmlFor='usernamee'>usernamee</label>
          <input className='form-control' type='text' name='usernamee' id='usernamee' onChange={this.handleChange} value={form?form.usernamee: ''}/>
          <br/>

        </div>
      </ModalBody>
      <ModalFooter>
        {this.state.tipoModal=='insertar'?
          <button className="btn btn-success" onClick={()=>this.peticionPost()}>insertar</button>:
          <button className="btn btn-primary" onClick={()=>this.peticionPut()}>actualizar</button>

        }
          <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>cancelar</button>
      </ModalFooter>
      </Modal>

      <Modal isOpen={this.state.modalEliminar}>
        <ModalBody>
           esta seguro de que quiere eliminar {form && form.user}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>si</button>
          <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar:false})}>no</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
}

export default Appp;
