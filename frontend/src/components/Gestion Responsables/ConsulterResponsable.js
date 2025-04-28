import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import responsableService from './ResponsableService';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Pagination } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import moment from 'moment';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import 'bootstrap/dist/css/bootstrap.min.css';

class ConsulterResponsable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responsable: [],
      allResponsables: [],
      searchTerm: '',
      currentPage: 1,
      itemsPerPage: 15,
    };
    this.ModifierResponsable = this.ModifierResponsable.bind(this);
    this.DeleteResponsable = this.DeleteResponsable.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.reinitialiserPage = this.reinitialiserPage.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(page) {
    this.setState({ currentPage: page });
  }

  DeleteResponsable(cin) {
    if (window.confirm('Voulez-vous vraiment supprimer ce Responsable ?')) {
      responsableService.deleteRespo(cin).then(() => {
        const updatedResponsables = this.state.allResponsables.filter((responsabl) => responsabl.cin !== cin);
        this.setState({
          responsable: updatedResponsables.filter((responsabl) =>
            responsabl.cin.toLowerCase().includes(this.state.searchTerm.toLowerCase())
          ),
          allResponsables: updatedResponsables,
        });
        toast.success('Responsable supprimé avec succès !', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    }
  }

  ModifierResponsable(cin) {
    if (window.confirm('Voulez-vous vraiment mettre à jour ce Responsable ?')) {
      this.props.history.push(`/modifier-responsable/${cin}`);
    }
  }

  componentDidMount() {
    responsableService.getResponsable().then((res) => {
      this.setState({ responsable: res.data, allResponsables: res.data });
    });
  }

  handleSearch(event) {
    const searchTerm = event.target.value;
    const filteredResponsables = this.state.allResponsables.filter((responsabl) =>
      responsabl.cin.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.setState({ searchTerm, responsable: filteredResponsables, currentPage: 1 });
  }

  reinitialiserPage() {
    this.setState({
      searchTerm: '',
      responsable: this.state.allResponsables,
      currentPage: 1,
    });
  }

  render() {
    const { responsable, currentPage, itemsPerPage, searchTerm } = this.state;
    const totalPages = Math.ceil(responsable.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const displayedResponsables = responsable.slice(startIndex, endIndex);

    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#e7f1ff',
          animation: 'fadeIn 1s ease-in',
        }}
      >
        <HeaderAdmin />
        <div className="container py-5">
          <h3
            className="text-center mb-4"
            style={{
              fontWeight: '600',
              background: 'linear-gradient(90deg, #4dabf7, #1a91ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Consulter les Responsables
          </h3>
          <div
            className="mb-4"
            style={{
              animation: 'slideIn 0.5s ease-in',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '10px',
              padding: '1.5rem',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              border: '2px solid #4dabf7',
            }}
          >
            <div className="form-group d-flex align-items-center">
              <label
                htmlFor="search"
                style={{
                  fontWeight: '500',
                  color: '#343a40',
                  marginRight: '1rem',
                  fontSize: '0.9rem',
                }}
              >
                CIN :
              </label>
              <input
                type="text"
                className="form-control"
                id="search"
                placeholder="Rechercher par CIN"
                value={searchTerm}
                onChange={this.handleSearch}
                style={{
                  width: '60%',
                  borderRadius: '8px',
                  border: '2px solid #4dabf7',
                  padding: '0.5rem',
                  fontSize: '0.9rem',
                  transition: 'border-color 0.3s ease',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
                aria-label="Rechercher par CIN"
              />
              <button
                className="btn"
                onClick={this.reinitialiserPage}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid #ff6b6b',
                  color: '#343a40',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  marginLeft: '1rem',
                  fontWeight: '500',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                  animation: 'pulse 2s infinite',
                  backdropFilter: 'blur(5px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.borderColor = '#e63946';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#ff6b6b';
                }}
                aria-label="Réinitialiser la recherche"
              >
                Réinitialiser
              </button>
            </div>
          </div>
          <div
            style={{
              animation: 'slideIn 0.5s ease-in',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '10px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              border: '2px solid #4dabf7',
              overflowX: 'auto',
            }}
          >
            <table
              className="table table-bordered"
              style={{
                borderRadius: '10px',
                overflow: 'hidden',
                borderCollapse: 'separate',
                fontSize: '0.9rem',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: '#4dabf7',
                    color: '#fff',
                    fontWeight: '500',
                  }}
                >
                  <th>CIN</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th style={{ width: '15%' }}>Date de naissance</th>
                  <th>Téléphone</th>
                  <th>Email</th>
                  <th>Statut</th>
                  <th style={{ width: '10%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedResponsables.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center" style={{ color: '#343a40' }}>
                      Aucun Responsable disponible
                    </td>
                  </tr>
                ) : (
                  displayedResponsables.map((responsable) => (
                    <tr
                      key={responsable.cin}
                      style={{
                        transition: 'background-color 0.3s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f9ff')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td>{responsable.cin}</td>
                      <td>{responsable.nom}</td>
                      <td>{responsable.prenom}</td>
                      <td>{moment(responsable.dateNaissance).format('DD/MM/YYYY')}</td>
                      <td>{responsable.telephone}</td>
                      <td>{responsable.email}</td>
                      <td>{responsable.statut}</td>
                      <td>
                        <EditOutlined
                          style={{
                            color: '#28a745',
                            cursor: 'pointer',
                            fontSize: '22px',
                            marginRight: '15px',
                            transition: 'transform 0.3s ease',
                          }}
                          onClick={() => this.ModifierResponsable(responsable.cin)}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                          aria-label={`Modifier le responsable ${responsable.cin}`}
                        />
                        <DeleteOutlined
                          style={{
                            color: '#dc3545',
                            cursor: 'pointer',
                            fontSize: '22px',
                            transition: 'transform 0.3s ease',
                          }}
                          onClick={() => this.DeleteResponsable(responsable.cin)}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                          aria-label={`Supprimer le responsable ${responsable.cin}`}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <button
              className="btn"
              onClick={() => this.props.history.push('/interface-responsable')}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid #4dabf7',
                color: '#343a40',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                fontWeight: '500',
                width: '120px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
                animation: 'pulse 2s infinite',
                backdropFilter: 'blur(5px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.borderColor = '#1a91ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#4dabf7';
              }}
              aria-label="Retour à l'interface responsable"
            >
              Retour
            </button>
            <Pagination
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                padding: '0.5rem',
                border: '2px solid #4dabf7',
                backdropFilter: 'blur(5px)',
              }}
            >
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => this.handlePageChange(currentPage - 1)}
                style={{
                  border: '2px solid #4dabf7',
                  borderRadius: '8px',
                  marginRight: '0.5rem',
                  backgroundColor: currentPage === 1 ? '#e9ecef' : 'transparent',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseEnter={(e) => !currentPage === 1 && (e.currentTarget.style.borderColor = '#1a91ff')}
                onMouseLeave={(e) => !currentPage === 1 && (e.currentTarget.style.borderColor = '#4dabf7')}
                aria-label="Page précédente"
              >
                <FaChevronLeft />
              </Pagination.Prev>
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => this.handlePageChange(index + 1)}
                  style={{
                    border: '2px solid #4dabf7',
                    borderRadius: '8px',
                    margin: '0 0.2rem',
                    backgroundColor: index + 1 === currentPage ? '#4dabf7' : 'transparent',
                    color: index + 1 === currentPage ? '#fff' : '#343a40',
                    transition: 'border-color 0.3s ease, background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (index + 1 !== currentPage) {
                      e.currentTarget.style.borderColor = '#1a91ff';
                      e.currentTarget.style.backgroundColor = '#f1f9ff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index + 1 !== currentPage) {
                      e.currentTarget.style.borderColor = '#4dabf7';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                  aria-label={`Page ${index + 1}`}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => this.handlePageChange(currentPage + 1)}
                style={{
                  border: '2px solid #4dabf7',
                  borderRadius: '8px',
                  marginLeft: '0.5rem',
                  backgroundColor: currentPage === totalPages ? '#e9ecef' : 'transparent',
                  transition: 'border-color 0.3s ease',
                }}
                onMouseEnter={(e) => !currentPage === totalPages && (e.currentTarget.style.borderColor = '#1a91ff')}
                onMouseLeave={(e) => !currentPage === totalPages && (e.currentTarget.style.borderColor = '#4dabf7')}
                aria-label="Page suivante"
              >
                <FaChevronRight />
              </Pagination.Next>
            </Pagination>
          </div>
        </div>
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideIn {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.03); }
              100% { transform: scale(1); }
            }
          `}
        </style>
      </div>
    );
  }
}

export default withRouter(ConsulterResponsable);