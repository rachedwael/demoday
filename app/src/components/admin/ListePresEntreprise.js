
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { connect } from 'react-redux';
import './../../App.css'
import axios from 'axios'
import Modal from "react-responsive-modal";
class ListePresEntreprise extends Component {

    constructor(props) {
        super(props)
        this.state = {
            list: [],
            open: false,
            type: '',
            idModif:""
        }
    }

    onOpenModal = (el) => {
        this.setState({
            open: true,
            idModif: el._id
        });
        console.log("nik omek ", el._id)
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };




    componentWillMount() {
        axios
            .get("/api/users/list")
            .then(res =>
                this.setState({
                    list: res.data
                })
            )
            .catch(err => console.log("err"));
    }

    aprovedUser = (el) => {
        console.log(el._id)
        console.log(el.aproved)
        axios.put("/api/users/aproved_user/" + el._id, true).then(res =>
            axios.get("/api/users/list").then(res => this.updateUserList(res.data))
        )
            .catch(err => alert(err));
    }

    changeType = (type) => {
        axios.put("/api/users/update_type_user/" + this.state.idModif, type).then(res =>
            axios.get("/api/users/list").then(res => this.updateUserList(res.data))
        )
            .catch(err => alert(err));
            console.log(type)
        this.onCloseModal()
    }

    deleteItem = (el) => {
        if (window.confirm("voulez vous supprime???")) {
            axios.delete("/api/users/delete-user/" + el._id)
                .then(res =>
                    axios.get("/api/users/list").then(res => this.updateUserList(res.data))
                )
                .catch(err => alert(err));
        }
    }


    updateUserList = (value) => {
        this.setState({ list: value })
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    render() {
        const { auth } = this.props
        const { list } = this.state
        return (
            <div className="">
                <table class="table table-dark table-contact">
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Nom de l'entreprise</th>
                            <th scope="col">Email</th>
                            <th scope="col">Téléphone</th>
                            <th scope="col">Secteur d'activité</th>
                            <th scope="col">Pays</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((el, i) => {
                            return (
                                <tr className="contact-line">
                                    <th scope="row">{i + 1}</th>
                                    <td>{el.name}</td>
                                    <td>{el.email}</td>
                                    <td>{el.phone}</td>
                                    <td>{el.secteur}</td>
                                    <td>{el.pays}</td>
                                    <td>
                                        <button class="btn btn-success btn-contact" data-toggle="confirmation" onClick={() => this.aprovedUser(el)}>Approuver</button>
                                        <button type="button" class="btn btn-primary btn-contact" onClick={() => this.onOpenModal(el)} >Modifier</button>
                                        <button type="button" class="btn btn-danger btn-contact" onClick={() => { this.deleteItem(el) }}>supprimer</button>
                                    </td>
                                </tr>


                            )

                        })}

                        <div >
                            <Modal open={this.state.open} onClose={this.onCloseModal} center>
                                <div className="wrap-input100 validate-input m-b-26 modal-type" >
                                    <select className="form-control" type="text"
                                        name="type"
                                        onChange={(e) => this.handleInputChange(e)}
                                        value={this.state.type}
                                    >
                                        <option value="entreprise" >Entreprise</option>
                                        <option value="admin" >Admin</option>
                                        <option value="chefDelegation">Chef Delegation</option>
                                    </select>
                                    <button type="button" class="btn btn-primary btn-modifier-type" onClick={()=> this.changeType(this.state.type) }>Modifier</button>
                                </div>
                            </Modal>
                        </div>


                    </tbody>
                </table>

            </div>
        );
    }
}




const mapStateToProps = (state) => ({
    auth: state.auth
})
const ListePresEntrepriseContainer = connect(mapStateToProps)(ListePresEntreprise)
export default ListePresEntrepriseContainer
