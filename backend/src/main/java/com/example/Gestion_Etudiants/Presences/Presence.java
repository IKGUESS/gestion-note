package com.example.Gestion_Etudiants.Presences;

import jakarta.persistence.*;
import com.example.Gestion_Etudiants.Etudiants.Etudiant;
import com.example.Gestion_Etudiants.Modules.Module;

@Entity
@Table(name = "Absence")
public class Presence {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idAbs;

	@ManyToOne
	@JoinColumn(name = "cin", referencedColumnName = "cin")
	private Etudiant etudiant;

	@ManyToOne
	@JoinColumn(name = "codeMod", referencedColumnName = "codeMod")
	private Module module;

	private int nbAbsences;
	private int nbRetards;

	// Constructeurs
	public Presence() {}

	// Getters et Setters
	public Long getIdAbs() { return idAbs; }
	public void setIdAbs(Long idAbs) { this.idAbs = idAbs; }
	public Etudiant getEtudiant() { return etudiant; }
	public void setEtudiant(Etudiant etudiant) { this.etudiant = etudiant; }
	public Module getModule() { return module; }
	public void setModule(Module module) { this.module = module; }
	public int getNbAbsences() { return nbAbsences; }
	public void setNbAbsences(int nbAbsences) { this.nbAbsences = nbAbsences; }
	public int getNbRetards() { return nbRetards; }
	public void setNbRetards(int nbRetards) { this.nbRetards = nbRetards; }
}