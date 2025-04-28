package com.example.Gestion_Etudiants.SectionFiliere;

import jakarta.persistence.*;
import com.example.Gestion_Etudiants.Filieres.Filiere;
import com.example.Gestion_Etudiants.Section.Section;

@Entity
@Table(name = "SectionFilier")
public class SectionFilier {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "codeFil", referencedColumnName = "codeFil")
	private Filiere filiere;

	@ManyToOne
	@JoinColumn(name = "codeSec", referencedColumnName = "codeSec")
	private Section section;

	// Constructeurs
	public SectionFilier() {}

	public SectionFilier(Filiere filiere, Section section) {
		this.filiere = filiere;
		this.section = section;
	}

	// Getters et Setters
	public Long getId() { return id; }
	public void setId(Long id) { this.id = id; }
	public Filiere getFiliere() { return filiere; }
	public void setFiliere(Filiere filiere) { this.filiere = filiere; }
	public Section getSection() { return section; }
	public void setSection(Section section) { this.section = section; }
}