package com.example.Gestion_Etudiants.NiveauEtude;

import jakarta.persistence.*;
import java.util.List;
import com.example.Gestion_Etudiants.Filieres.Filiere;
import com.example.Gestion_Etudiants.Modules.Module;

@Entity
@Table(name = "NiveauEtude")
public class niveauEtd {

	@Id
	private String codeNivSco;
	private String designation;

	@ManyToOne
	@JoinColumn(name = "codeFil")
	private Filiere filiere;

	@OneToMany(mappedBy = "niveauEtd")
	private List<Module> modules;

	// Getters et Setters
	public String getCodeNivSco() { return codeNivSco; }
	public void setCodeNivSco(String codeNivSco) { this.codeNivSco = codeNivSco; }
	public String getDesignation() { return designation; }
	public void setDesignation(String designation) { this.designation = designation; }
	public Filiere getFiliere() { return filiere; }
	public void setFiliere(Filiere filiere) { this.filiere = filiere; }
	public List<Module> getModules() { return modules; }
	public void setModules(List<Module> modules) { this.modules = modules; }
}