package com.example.Gestion_Etudiants.Professeurs;

import jakarta.persistence.*;
import com.example.Gestion_Etudiants.Modules.Module;

@Entity
@Table(name = "Professeur")
public class Professeur {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true)
	private String cin;


	private String nom;
	private String prenom;
	private String email;
	private String telephone;
	private String statut;
	private String section;


	// Constructeurs
	public Professeur() {}

	// Getters et Setters
	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public String getCin() { return cin; }
	public void setCin(String cin) { this.cin = cin; }
	public String getNom() { return nom; }
	public void setNom(String nom) { this.nom = nom; }
	public String getPrenom() { return prenom; }
	public void setPrenom(String prenom) { this.prenom = prenom; }
	public String getEmail() { return email; }
	public void setEmail(String email) { this.email = email; }
	public String getTelephone() { return telephone; }
	public void setTelephone(String telephone) { this.telephone = telephone; }
	public String getStatut() { return statut; }
	public void setStatut(String statut) { this.statut = statut; }
	public String getSection() { return section; }
	public void setSection(String section) { this.section = section; }
}