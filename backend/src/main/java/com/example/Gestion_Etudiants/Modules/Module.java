package com.example.Gestion_Etudiants.Modules;

import jakarta.persistence.*;
import com.example.Gestion_Etudiants.NiveauEtude.niveauEtd;

@Entity
@Table(name = "Module")
public class Module {

	@Id
	private String codeMod;
	private String nomMod;
	private int nbExams;
	private int nbTps;
	private int nbControles;
	private double coeffControles;
	private double coeffTps;
	private double coeffExams;

	@ManyToOne
	@JoinColumn(name = "codeNivSco", referencedColumnName = "codeNivSco")
	private niveauEtd niveauEtd;

	// Constructeurs
	public Module() {}

	// Getters et Setters
	public String getCodeMod() { return codeMod; }
	public void setCodeMod(String codeMod) { this.codeMod = codeMod; }
	public String getNomMod() { return nomMod; }
	public void setNomMod(String nomMod) { this.nomMod = nomMod; }
	public int getNbExams() { return nbExams; }
	public void setNbExams(int nbExams) { this.nbExams = nbExams; }
	public int getNbTps() { return nbTps; }
	public void setNbTps(int nbTps) { this.nbTps = nbTps; }
	public int getNbControles() { return nbControles; }
	public void setNbControles(int nbControles) { this.nbControles = nbControles; }
	public double getCoeffControles() { return coeffControles; }
	public void setCoeffControles(double coeffControles) { this.coeffControles = coeffControles; }
	public double getCoeffTps() { return coeffTps; }
	public void setCoeffTps(double coeffTps) { this.coeffTps = coeffTps; }
	public double getCoeffExams() { return coeffExams; }
	public void setCoeffExams(double coeffExams) { this.coeffExams = coeffExams; }
	public niveauEtd getNiveauEtd() { return niveauEtd; }
	public void setNiveauEtd(niveauEtd niveauEtd) { this.niveauEtd = niveauEtd; }
}