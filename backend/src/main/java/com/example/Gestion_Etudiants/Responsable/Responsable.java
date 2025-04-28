package com.example.Gestion_Etudiants.Responsable;

import jakarta.persistence.*;
import java.sql.Date;
import java.util.Collection;
import com.example.Gestion_Etudiants.Filieres.Filiere;

@Entity
@Table(name = "Responsable")
public class Responsable {

	@Id
	private String cin;
	private String nom;
	private String prenom;
	private Date dateNaissance;
	private String telephone;
	private String email;
	private String nationalite;
	private String ville;
	private String sexe;
	private String statut;
	private String login;
	private String password;

	@OneToMany(mappedBy = "responsable")
	private Collection<Filiere> filieres;

	// Constructeurs
	public Responsable() {}

	public Responsable(String cin, String nom, String prenom, Date dateNaissance,
					   String telephone, String email, String nationalite,
					   String ville, String sexe, String statut,
					   String login, String password) {
		this.cin = cin;
		this.nom = nom;
		this.prenom = prenom;
		this.dateNaissance = dateNaissance;
		this.telephone = telephone;
		this.email = email;
		this.nationalite = nationalite;
		this.ville = ville;
		this.sexe = sexe;
		this.statut = statut;
		this.login = login;
		this.password = password;
	}

	// Getters et Setters
	public String getCin() { return cin; }
	public void setCin(String cin) { this.cin = cin; }
	public String getNom() { return nom; }
	public void setNom(String nom) { this.nom = nom; }
	public String getPrenom() { return prenom; }
	public void setPrenom(String prenom) { this.prenom = prenom; }
	public Date getDateNaissance() { return dateNaissance; }
	public void setDateNaissance(Date dateNaissance) { this.dateNaissance = dateNaissance; }
	public String getTelephone() { return telephone; }
	public void setTelephone(String telephone) { this.telephone = telephone; }
	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }
	public String getNationalite() { return nationalite; }
	public void setNationalite(String nationalite) { this.nationalite = nationalite; }
	public String getVille() { return ville; }
	public void setVille(String ville) { this.ville = ville; }
	public String getSexe() { return sexe; }
	public void setSexe(String sexe) { this.sexe = sexe; }
	public String getStatut() { return statut; }
	public void setStatut(String statut) { this.statut = statut; }
	public String getLogin() { return login; }
	public void setLogin(String login) { this.login = login; }
	public String getPassword() { return password; }
	public void setPassword(String password) { this.password = password; }
	public Collection<Filiere> getFilieres() { return filieres; }
	public void setFilieres(Collection<Filiere> filieres) { this.filieres = filieres; }
}