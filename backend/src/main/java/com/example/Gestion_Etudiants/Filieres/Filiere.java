package com.example.Gestion_Etudiants.Filieres;

import jakarta.persistence.*;
import java.util.List;
import com.example.Gestion_Etudiants.Niveau.niveau;
import com.example.Gestion_Etudiants.NiveauEtude.niveauEtd;
import com.example.Gestion_Etudiants.Responsable.Responsable;

@Entity
@Table(name = "Filiere")
public class Filiere {

	@Id
	private String codeFil;
	private String designation;
	private String statut;

	@ManyToOne
	@JoinColumn(name = "codeNiv", referencedColumnName = "codeNiv")
	private niveau niveau;

	@OneToMany(mappedBy = "filiere")
	private List<niveauEtd> niveauxScolaires;

	@ManyToOne
	@JoinColumn(name = "responsable_id")
	private Responsable responsable;

	// Constructeurs
	public Filiere() {}

	// Getters et Setters
	public String getCodeFil() { return codeFil; }
	public void setCodeFil(String codeFil) { this.codeFil = codeFil; }
	public String getDesignation() { return designation; }
	public void setDesignation(String designation) { this.designation = designation; }
	public String getStatut() { return statut; }
	public void setStatut(String statut) { this.statut = statut; }
	public niveau getNiveau() { return niveau; }
	public void setNiveau(niveau niveau) { this.niveau = niveau; }
	public List<niveauEtd> getNiveauxScolaires() { return niveauxScolaires; }
	public void setNiveauxScolaires(List<niveauEtd> niveauxScolaires) { this.niveauxScolaires = niveauxScolaires; }
	public Responsable getResponsable() { return responsable; }
	public void setResponsable(Responsable responsable) { this.responsable = responsable; }
}