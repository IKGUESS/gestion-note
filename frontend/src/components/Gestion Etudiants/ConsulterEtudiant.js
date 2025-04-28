import React, { Component } from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import etudiantService from './EtudiantService';
import { toast } from 'react-toastify';
import { Pagination } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import HeaderAdmin from '../../Header and Footer/HeaderAdmin';
import 'bootstrap/dist/css/bootstrap.min.css';

class ConsulterEtudiant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      etudiants: [],
      searchTerm: '',
      currentPage: 1,
      itemsPerPage: 15,
    };
    this.ModifierEtudiant = this.ModifierEtudiant.bind(this);
    this.DeleteEtudiant = this.DeleteEtudiant.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.reinitialiserPage = this.reinitialiserPage.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(page) {
    this.setState({ currentPage: page });
  }

  // DeleteEtudiant(Cin){
  //   const updatedEtudiants = this.state.etudiants.map(etudiant => {
  //     if (etudiant.cin === Cin) {
  //       return { ...etudiant, statut: "Terminer" }; // Modification du statut de l'étudiant
  //     }
  //     return etudiant;
  //   });
  //   this.setState({ etudiants: updatedEtudiants });
  // }

  DeleteEtudiant(Cin) {
    if (window.confirm('Voulez-vous vraiment supprimer cet Etudiant ?')) {
      etudiantService.deleteEtudiant(Cin).then(() => {
        const updatedEtudiants = this.state.etudiants.filter(
          (etudiant) => etudiant.cin !== Cin
        );
        this.setState({ etudiants: updatedEtudiants });
        toast.success('Etudiant supprimé avec succès !', {
          position: toast.POSITION.TOP_CENTER,
        });
      });
    }
  }

  ModifierEtudiant(Cin) {
    if (window.confirm('Voulez-vous vraiment mettre à jour cet Etudiant ?')) {
      window.location.href = `/modifier-etudiant/${Cin}`;
    }
  }

  componentDidMount() {
    etudiantService
      .getEtudiant()
      .then((res) => {
        this.setState({ etudiants: res.data });
      })
      .catch((err) => console.log(err));
  }

  handleSearch(event) {
    const searchTerm = event.target.value;
    this.setState({ searchTerm });
    etudiantService.getEtudiant().then((res) => {
      const results = res.data.filter((etudiant) =>
        etudiant.cin.toLowerCase().includes(searchTerm.toLowerCase())
      );
      this.setState({ etudiants: results });
    });
  }

  reinitialiserPage() {
    this.setState({ searchTerm: '', currentPage: 1 });
    etudiantService
      .getEtudiant()
      .then((res) => {
        this.setState({ etudiants: res.data });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { etudiants, currentPage, itemsPerPage, searchTerm } = this.state;
    const totalPages = Math.ceil(etudiants.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const displayedEtudiants = etudiants.slice(startIndex, endIndex);

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
            Consulter les Étudiants
          </h3>
          <div
            className="mb-4"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '10px',
              padding: '1.5rem',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              border: '2px solid #4dabf7',
              animation: 'slideIn 0.5s ease-in',
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
                placeholder="Entrez CIN"
                value={searchTerm}
                onChange={this.handleSearch}
                style={{
                  borderRadius: '8px',
                  border: '2px solid #4dabf7',
                  fontSize: '0.9rem',
                  width: '50%',
                  transition: 'border-color 0.3s ease',
                }}
                aria-label="Rechercher par CIN"
                onFocus={(e) => (e.target.style.borderColor = '#1a91ff')}
                onBlur={(e) => (e.target.style.borderColor = '#4dabf7')}
              />
              <button
                className="btn"
                onClick={this.handleSearch}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid #4dabf7',
                  color: '#343a40',
                  borderRadius: '8px',
                  marginLeft: '1rem',
                  padding: '0.5rem 1rem',
                  fontWeight: '500',
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
                aria-label="Rechercher"
              >
                Rechercher
              </button>
              <button
                className="btn"
                onClick={this.reinitialiserPage}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid #ff6b6b',
                  color: '#343a40',
                  borderRadius: '8px',
                  marginLeft: '1rem',
                  padding: '0.5rem 1rem',
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
                aria-label="Réinitialiser"
              >
                Réinitialiser
              </button>
            </div>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '10px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
              border: '2px solid #4dabf7',
              animation: 'slideIn 0.5s ease-in',
              overflowX: 'auto',
            }}
          >
            <table
              className="table table-striped table-bordered"
              style={{
                marginBottom: 0,
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <thead
                style={{
                  backgroundColor: '#4dabf7',
                  color: '#fff',
                  fontWeight: '600',
                }}
              >
                <tr>
                  <th>CIN</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th style={{ width: '8%' }}>Statut</th>
                  <th>Niveau</th>
                  <th>Filière</th>
                  <th>Section</th>
                  <th style={{ width: '9%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedEtudiants.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center" style={{ color: '#343a40', padding: '1.5rem' }}>
                      Aucun Étudiant disponible
                    </td>
                  </tr>
                ) : (
                  displayedEtudiants.map((etudiant) => (
                    <tr
                      key={etudiant.cin}
                      style={{
                        transition: 'background-color 0.3s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f9ff')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td>{etudiant.cin}</td>
                      <td>{etudiant.nom}</td>
                      <td>{etudiant.prenom}</td>
                      <td>{etudiant.email}</td>
                      <td>{etudiant.statut}</td>
                      <td>{etudiant.filiere.niveau.designation}</td>
                      <td>{etudiant.filiere.designation}</td>
                      <td>{etudiant.section}</td>
                      <td>
                        <EditOutlined
                          style={{
                            color: '#28a745',
                            cursor: 'pointer',
                            fontSize: '22px',
                            marginRight: '15px',
                            transition: 'transform 0.3s ease',
                          }}
                          onClick={() => this.ModifierEtudiant(etudiant.cin)}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                          aria-label="Modifier l'étudiant"
                        />
                        <DeleteOutlined
                          style={{
                            color: '#dc3545',
                            cursor: 'pointer',
                            fontSize: '22px',
                            transition: 'transform 0.3s ease',
                          }}
                          onClick={() => this.DeleteEtudiant(etudiant.cin)}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                          aria-label="Supprimer l'étudiant"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <Pagination>
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => this.handlePageChange(currentPage - 1)}
                style={{
                  border: '2px solid #4dabf7',
                  borderRadius: '8px',
                  color: '#343a40',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  transition: 'border-color 0.3s ease, transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1a91ff';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#4dabf7';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
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
                    color: '#343a40',
                    backgroundColor: index + 1 === currentPage ? '#4dabf7' : 'rgba(255, 255, 255, 0.9)',
                    transition: 'border-color 0.3s ease, transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#1a91ff';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#4dabf7';
                    e.currentTarget.style.transform = 'scale(1)';
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
                  color: '#343a40',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  transition: 'border-color 0.3s ease, transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1a91ff';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#4dabf7';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                aria-label="Page suivante"
              >
                <FaChevronRight />
              </Pagination.Next>
            </Pagination>
            <a href="/interface-etudiant">
              <button
                className="btn"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '2px solid #4dabf7',
                  color: '#343a40',
                  borderRadius: '8px',
                  padding: '0.5rem 1.5rem',
                  fontWeight: '500',
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
                aria-label="Retour à l'interface étudiant"
              >
                Retour
              </button>
            </a>
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

export default ConsulterEtudiant;