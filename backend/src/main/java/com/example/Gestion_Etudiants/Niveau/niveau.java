package com.example.Gestion_Etudiants.Niveau;

import jakarta.persistence.*;
import java.util.List;
import com.example.Gestion_Etudiants.Filieres.Filiere;

@Entity
@Table(name = "Niveau")
public class niveau {

	@Id
	private String codeNiv;
	private String designation;
	private String statut;

	@OneToMany(mappedBy = "niveau")
	private List<Filiere> filieres;

	// Constructeurs
	public niveau() {}

	public niveau(String codeNiv, String designation, String statut) {
		this.codeNiv = codeNiv;
		this.designation = designation;
		this.statut = statut;
	}

	// Getters et Setters
	public String getCodeNiv() { return codeNiv; }
	public void setCodeNiv(String codeNiv) { this.codeNiv = codeNiv; }
	public String getDesignation() { return designation; }
	public void setDesignation(String designation) { this.designation = designation; }
	public String getStatut() { return statut; }
	public void setStatut(String statut) { this.statut = statut; }
	public List<Filiere> getFilieres() { return filieres; }
	public void setFilieres(List<Filiere> filieres) { this.filieres = filieres; }
}